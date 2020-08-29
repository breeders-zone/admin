import {Button, Card, CardHeader, Row, Table} from "reactstrap";
import React, {useContext, useEffect} from "react";
import {connect} from "react-redux";
import { Scrollbars } from 'react-custom-scrollbars';
import {IPageVisitsTableProps, IStateProps, IMapStateProps, IYMData} from "./types";
import {setVisitsStats} from "../../../actions";
import DataService from "../../../services/DataService";
import DataServiceContext from "../../../context/DataServiceContext";

const PageVisitsTable = (props: IPageVisitsTableProps) => {
    const {visits, setVisitsStats} = props;
    const {getPageViewsStats}: DataService = useContext(DataServiceContext);

    useEffect(() => {
        getPageViewsStats(5)
            .then((ymData: IYMData) => {
                setVisitsStats(ymData.data)
            })
    }, []);
    return (
        <Card className="shadow">
            <CardHeader className="border-0">
                <Row className="align-items-center">
                    <div className="col">
                        <h3 className="mb-0">Просмотры страниц</h3>
                    </div>
                    <div className="col text-right">
                        <Button
                            color="primary"
                            href="#pablo"
                            onClick={e => e.preventDefault()}
                            size="sm"
                        >
                            See all
                        </Button>
                    </div>
                </Row>
            </CardHeader>
            <div className="table-responsive">
                <Scrollbars style={{minHeight: 300}}>
                    <Table className="align-items-center table-flush">
                        <thead className="thead-light">
                        <tr>
                            <th scope="col">Адрес страницы</th>
                            <th scope="col">Посещений</th>
                            <th scope="col">Уникальные посещения</th>
                            <th scope="col">Bounce rate</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            visits.map((item) => (
                                <tr>
                                    <th scope="row">{item.dimensions[0].name}</th>
                                    <td>{item.metrics[0]}</td>
                                    <td>{item.metrics[1]}</td>
                                    <td>
                                        <i className="fas fa-arrow-up text-success mr-3" />{" "}
                                        46,53%
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </Table>
                </Scrollbars>
            </div>
        </Card>
    )
};

const mapStateToProps = ({stats: {visits}}: IMapStateProps): IStateProps => ({
    visits
});

export default connect(mapStateToProps, {setVisitsStats})(PageVisitsTable);

