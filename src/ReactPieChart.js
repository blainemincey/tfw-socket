import React, {Component} from "react";
import {Doughnut} from "react-chartjs-2";

class ReactPieChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            route1Total: this.props.route1Total,
            route2Total: this.props.route2Total,
            route3Total: this.props.route3Total
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if ((nextProps.route1Total !== prevState.route1Total) ||
            (nextProps.route2Total !== prevState.route2Total) ||
             nextProps.route3Total !== prevState.route3Total) {
            return {
                route1Total: nextProps.route1Total,
                route2Total: nextProps.route2Total,
                route3Total: nextProps.route3Total
            }
        } else {
            return null;
        }
    }

    render() {
        const {route1Total, route2Total, route3Total} = this.state;

        const data = {
            labels: [
                'Kafka',
                'Kafka-HTTP',
                'MongoDB-Stitch'
            ],
            datasets: [{
                data: [route1Total, route2Total, route3Total],
                backgroundColor: [
                    'rgba(255,99,132,0.2)',
                    'rgba(47,255,37,0.2)',
                    'rgba(253,255,31,0.2)'
                ],
                hoverBackgroundColor: [
                    'rgba(255,99,132,0.4)',
                    'rgba(47,255,37,0.4)',
                    'rgba(253,255,31,0.4)'
                ],
                hoverBorderColor: [
                    'rgba(255,99,132,0.4)',
                    'rgba(47,255,37,0.4)',
                    'rgba(253,255,31,0.4)'
                ],
                borderColor: [
                    'rgba(255,99,132,0.4)',
                    'rgba(47,255,37,0.4)',
                    'rgba(253,255,31,0.4)'
                ]
            }]
        };

        const options = {
            responsive: true,
            plugins: {
                datalabels: {
                    color: 'white',
                    font: {
                        size: '16'
                    },
                    formatter: function(value, context) {
                        let total = Number(route1Total) + Number(route2Total) + Number(route3Total);
                        let rawAmt = value / total;
                        let percentage = rawAmt * 100;

                        return Math.round(percentage) + '%';
                    }
                }
            },
            legend: {
                labels: {
                    fontColor: 'white'
                }
            },
            elements: {
                arc: {
                    borderWidth: 3
                }
            },
        };

        return (
            <div style={{position: 'relative'}}>
                <Doughnut data={data} options={options}/>
            </div>
        );
    }
}

export default ReactPieChart;