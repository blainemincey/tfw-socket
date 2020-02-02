import React, {Component} from "react";
import socketIOClient from "socket.io-client";
import "./App.css";
import {Container, Row, Col, Table} from 'reactstrap';
import ReactPieChart from "./ReactPieChart";
import ReactBarChart from "./ReactBarChart";
import {css} from '@emotion/core';
import {RingLoader} from "react-spinners";

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

class App extends Component {
    constructor() {
        super();
        this.state = {
            // Route Totals
            routeTotalsData: '',
            routeTotalsIsLoading: true,
            routeTotalsEndpoint: process.env.REACT_APP_ROUTE_TOTALS_SOCKET,

            // Avg Claim
            avgClaimData: '',
            avgClaimIsLoading: true,
            avgClaimEndpoint: process.env.REACT_APP_AVG_CLAIM_SOCKET
        };
    }

    componentDidMount() {
        // Route Totals
        const {routeTotalsEndpoint} = this.state;
        const rtSocket = socketIOClient(routeTotalsEndpoint);
        rtSocket.on("FromRouteTotalsAPI", routeTotalsResult => this.setState({
            routeTotalsData: routeTotalsResult,
            routeTotalsIsLoading: false
        }));

        // Avg Claim
        const {avgClaimEndpoint} = this.state;
        const acSocket = socketIOClient(avgClaimEndpoint);
        acSocket.on("FromAvgClaimAPI", avgClaimResult => this.setState({
            avgClaimData: avgClaimResult,
            avgClaimIsLoading: false
        }));
    }

    render() {
        // Route Totals
        const {routeTotalsData, routeTotalsIsLoading} = this.state;

        let routeNotEmpty = false;
        try {
            let emptyRoute = JSON.parse(routeTotalsData);
            if(emptyRoute.result === 'empty') {
                console.log("empty route data");
                routeNotEmpty = false;
            } else {
                routeNotEmpty = true;
            }
        } catch (e) {
            console.log("error on route empty test.  must be valid value.");
            routeNotEmpty = true;
        }

        let displayRouteTotalsResults;
        let renderPageRouteTotals;

        // display results if completed loading
        if (!routeTotalsIsLoading && routeNotEmpty) {
            displayRouteTotalsResults = JSON.parse(routeTotalsData);

            let total = Number(displayRouteTotalsResults.route1Total) + // kafka
                Number(displayRouteTotalsResults.route2Total) + // kafka-http
                Number(displayRouteTotalsResults.route3Total); // mongodb-stitch
            renderPageRouteTotals =
                <Container>
                    <Row>
                        <Col lg="6">
                            <Table bordered hover>
                                <thead>
                                <tr style={{color: "white"}}>
                                    <th scope="col" style={{textAlign: 'center'}}>Route Rule</th>
                                    <th scope="col" style={{textAlign: 'center'}}>Route</th>
                                    <th scope="col" style={{textAlign: 'center'}}>Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr style={{color: "white", background: "rgba(255,99,132,0.2)"}}>
                                    <td style={{textAlign: 'center'}}>Below $30K</td>
                                    <td style={{textAlign: 'center'}}>{displayRouteTotalsResults.route1}</td>
                                    <td style={{textAlign: 'right'}}>{displayRouteTotalsResults.route1Total}</td>
                                </tr>
                                <tr style={{color: "white", background: "rgba(47,255,37,0.2)"}}>
                                    <td style={{textAlign: 'center'}}>$75K and higher</td>
                                    <td style={{textAlign: 'center'}}>{displayRouteTotalsResults.route2}</td>
                                    <td style={{textAlign: 'right'}}>{displayRouteTotalsResults.route2Total}</td>
                                </tr>
                                <tr style={{color: "white", background: "rgba(253,255,31,0.2)"}}>
                                    <td style={{textAlign: 'center'}}>Between $30k and $75k</td>
                                    <td style={{textAlign: 'center'}}>{displayRouteTotalsResults.route3}</td>
                                    <td style={{textAlign: 'right'}}>{displayRouteTotalsResults.route3Total}</td>
                                </tr>
                                <tr style={{color: "white", fontWeight: 'bold'}}>
                                    <td style={{textAlign: 'center'}}> </td>
                                    <td style={{textAlign: 'right'}}>Total Claims</td>
                                    <td style={{textAlign: 'right'}}>{total}</td>
                                </tr>
                                </tbody>
                            </Table>
                        </Col>
                        <Col lg="6">
                            <ReactPieChart route1Total={displayRouteTotalsResults.route1Total}
                                           route2Total={displayRouteTotalsResults.route2Total}
                                           route3Total={displayRouteTotalsResults.route3Total}/>
                        </Col>
                    </Row>
                </Container>


        } else {
            renderPageRouteTotals =
                <div className="justify-content-center">
                    <RingLoader size={150} color={"red"} css={override}/>
                    <h5 className="display-5" style={{textAlign: "center"}}>Waiting for data to become available...</h5>
                </div>
        }

        // Average Claims
        const {avgClaimData, avgClaimIsLoading} = this.state;

        let displayAvgClaimResults;
        let renderAvgClaimTotals;

        let claimNotEmpty = false;
        try {
            let emptyClaim = JSON.parse(avgClaimData);
            if(emptyClaim.result === 'empty') {
                console.log("empty route data");
                claimNotEmpty = false;
            } else {
                claimNotEmpty = true;
            }
        } catch (e) {
            console.log("error on claim amt empty test.  must be valid value.");
            claimNotEmpty = true;
        }

        // display results if completed loading
        if (!avgClaimIsLoading && claimNotEmpty && routeNotEmpty ) {
            displayAvgClaimResults = JSON.parse(avgClaimData);
            console.log(displayAvgClaimResults);
            let dataArray = [];
            let indx = 0;
            for (const claim of displayAvgClaimResults) {
                dataArray[indx] = claim.avgClaim.$numberDecimal;
                indx++;
            }

            // Add second data set for total number of claims by claim type
            let totalClaimsDataArray = [];
            let tcIdx = 0;
            for (const totalClaim of displayAvgClaimResults) {
                totalClaimsDataArray[tcIdx] = totalClaim.total.$numberLong;
                tcIdx++;
            }

            renderAvgClaimTotals =
                <Container>
                    <hr className="style13"/>
                    <Row>
                        <Col>
                            <ReactBarChart barChartData={dataArray} totalClaims={totalClaimsDataArray}/>
                        </Col>
                    </Row>
                </Container>

        } else {
            renderAvgClaimTotals =
                <div>
                </div>
        }

        return (
            <div id="appRouteTotals" className="App-header">
                <Container className="flex-grow-1 mt-3">
                    <Row xs={1}>
                        <Col>
                            <h3 className="display-5" style={{textAlign: "center"}}>MongoDB Data Pipeline Results</h3>
                        </Col>
                    </Row>
                    <hr className="style15"/>
                    {renderPageRouteTotals}
                    {renderAvgClaimTotals}
                </Container>
            </div>
        );
    }
}

export default App;
