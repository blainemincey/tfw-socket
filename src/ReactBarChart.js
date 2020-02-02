import React, {Component} from "react";
import {HorizontalBar} from "react-chartjs-2";

class ReactBarChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            barChartData: this.props.barChartData,
            totalClaims: this.props.totalClaims
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if ((nextProps.barChartData !== prevState.barChartData) &&
           (nextProps.totalClaims  !== prevState.totalClaims)) {
            return {barChartData: nextProps.barChartData,
                    totalClaims: nextProps.totalClaims }
        } else {
            return null;
        }
    }

    render() {
        const {barChartData, totalClaims} = this.state;

        const data = {
            labels: [
                'Accident',
                'Dental',
                'Disability',
                'Hospital',
                'Illness',
                'Life',
                'Vision'
            ],
            datasets: [
                {
                    data: barChartData,
                    label: 'Avg Claim Amount',
                    stack: 1,
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    datalabels: {
                        color: 'white',
                        font: {
                            size: '14'
                        },
                        formatter: function (value, context) {
                            return '$' + value;
                        },
                        anchor: 'end',
                        align: 'right'
                    }
                },
                {
                    data: totalClaims,
                    label: 'Total Claims',
                    stack: 2,
                    backgroundColor: 'rgba(47,255,37,0.2)',
                    borderColor: 'rgba(47,255,37,0.4)',
                    hoverBackgroundColor: 'rgba(47,255,37,0.4)',
                    hoverBorderColor: 'rgba(47,255,37,0.4)',
                    datalabels: {
                        color: 'white',
                        font: {
                            size: '14'
                        },
                        anchor: 'end',
                        align: 'right'
                    }
                }]
        };

        const options = {
            elements: {
                rectangle: {
                    borderWidth: 2,
                    borderSkipped: 'left'
                }
            },
            responsive: true,
            title: {
                display: true,
                text: 'Total Claims / Avg Claim by Claim Type',
                fontColor: 'white',
                fontSize: 16
            },
            plugins: {

            },
            layout: {
                padding: {
                    bottom: 0,
                    top: 0
                }
            },
            legend: {
                position: 'top',
                labels: {
                    fontColor: 'white'
                }
            },
            scales : {
                xAxes : [{
                    ticks : {
                        fontColor: 'white',
                        // Include a dollar sign in the ticks
                        callback: function(value, index, values) {
                            return '$' + value;
                        }
                    },
                    scaleLabel : {
                        display: true,
                        labelString: 'Avg Claim Amount',
                        fontColor: 'white'
                    }
                }],
                yAxes : [{
                    ticks : {
                        fontColor: 'white',
                        fontSize: 12
                    }
                }]
            }
        };

        return (
            <div style={{position: 'relative', backgroundColor: 'lt-gray'}}>
                <HorizontalBar data={data} height={200} width={400} options={options}/>
            </div>
        );
    }
}

export default ReactBarChart;