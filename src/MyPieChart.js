import ReactMinimalPieChart from "react-minimal-pie-chart";
import React, {Component} from "react";

class MyPieChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            route1Total: this.props.route1Total,
            route2Total: this.props.route2Total
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if ((nextProps.route1Total !== prevState.route1Total) ||
            (nextProps.route2Total !== prevState.route2Total)) {
            return {route1Total : nextProps.route1Total, route2Total: nextProps.route2Total}
        } else {
            return null;
        }
    }

    render() {
        const {route1Total, route2Total} = this.state;

        let total = Number(route1Total) + Number(route2Total);
        let rt1 = Math.round((route1Total / total) * 100);
        let rt2 = Math.round((route2Total / total) * 100);

        let totalPie = rt1 + rt2;

        return (
            <ReactMinimalPieChart
                totalValue={totalPie}
                animate={true}
                animationDuration={500}
                animationEasing="ease-out"
                cx={50}
                cy={50}
                data={[
                    {
                        color: '#EC0F12',
                        title: 'Kafka',
                        value: rt1
                    },
                    {
                        color: '#229954',
                        title: 'MongoDB Stitch',
                        value: rt2
                    },
                ]}
                label={({ data, dataIndex }) =>
                    Math.round(data[dataIndex].percentage) + '%'
                }
                labelPosition={70}
                labelStyle={{
                    fontFamily: 'sans-serif',
                    fontSize: '10px',

                }}
                lengthAngle={360}
                lineWidth={20}
                onClick={undefined}
                onMouseOut={undefined}
                onMouseOver={undefined}
                paddingAngle={18}
                radius={50}
                rounded={true}
                startAngle={0}
                viewBoxSize={[
                    100,
                    100
                ]}
            />

        );
    }
}

export default MyPieChart;