import {Card, CardBody, CardHeader, Row, Spinner} from "reactstrap";
import {Line} from "react-chartjs-2";
import React, {useContext, useEffect} from "react";
import {chartLine} from "../../../variables/charts";
import {setViewsStats} from "../../../actions";
import { connect } from "react-redux";
import DataServiceContext from "../../../context/DataServiceContext";
import {IStateProps, IYMData, IMapStateProps, ViewsChartPropsType} from "./types";
import {DataService} from "../../../services";
import {getDates} from "../../../utils";
import {ChartData} from "chart.js";

const ViewsChart = (props: ViewsChartPropsType) => {
    const {views, setViewsStats} = props;
    const dataService: DataService = useContext(DataServiceContext);

    useEffect(() => {
        dataService.getViewsStats()
            .then((data: IYMData) => {
                const dates = getDates(data.query.date1, data.query.date2);
                const chartData: ChartData = {
                    labels: dates,
                    datasets: [
                        {
                            label: "Посетители",
                            data: data.data[0].metrics[0]
                        }
                    ]
                };
                setViewsStats(chartData);
            })
    }, []);

    return (
        <Card className="bg-gradient-default shadow">
            <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                    <div className="col">
                        <h6 className="text-uppercase text-light ls-1 mb-1">
                            Просмотры
                        </h6>
                        <h2 className="text-white mb-0">Кол-во просмотров за 30 дней</h2>
                    </div>
                </Row>
            </CardHeader>
            <CardBody>
                {/* Chart */}
                <div className="chart d-flex">

                    {
                        views.labels && views.labels.length > 0 ?
                            <Line
                                data={views}
                                options={chartLine.options}
                            />
                            : <Spinner className="m-auto"/>
                    }
                </div>
            </CardBody>
        </Card>
    )
};

const mapStateToProps = ({stats: {views}}: IMapStateProps): IStateProps => ({
    views
});

export default connect(mapStateToProps, {setViewsStats})(ViewsChart);
