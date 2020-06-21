import React, {Component} from "react";
import Header from "../components/Headers/Header";
import {
    Card, CardFooter,
    CardHeader,
    Col,
    Container, DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Media,
    Row, Spinner,
    Table,
    UncontrolledDropdown
} from "reactstrap";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {withDataService} from "../components/hoc";
import {deleteReport, setReports, setReportsRequest} from "../actions";
import {times} from "../utils";
import Pagination from "../components/Pagination/Pagination";

class Genes extends Component {
    componentDidMount() {
        this.updateReports();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.location.search !== this.props.location.search) {
            this.updateReports();
        }
    }

    updateReports = () => {
        const {getReports, setReports, router, setReportsRequest} = this.props;

        setReportsRequest(true);
        getReports(router.location.query)
            .then( (data) => {
                setReports(data);
                setReportsRequest(false)
            });
    };

    render() {
        const { reports, deleteReport } = this.props;

        return (
            <React.Fragment>
                <Header/>
                <Container className="mt--7" fluid>
                    <Row>
                        <Col xs={12}>
                            <Card>
                                <CardHeader className="d-flex justify-content-between align-items-center">
                                    <h1>Жалобы</h1>
                                </CardHeader>
                                <Table className="align-items-center table-flush" responsive>
                                    <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Причина</th>
                                        <th scope="col">Подробнее</th>
                                        <th scope="col">ID магазина</th>
                                        <th scope="col">ID хранителя</th>
                                        <th scope="col" />
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        reports.request ?
                                            <tr>
                                                <td></td>
                                                <td colSpan="3" className="d-flex justify-content-center">
                                                    <Spinner/>
                                                </td>
                                            </tr>
                                            : reports.data.map( (item) => (
                                                <tr>
                                                    <th scope="row">
                                                        <Link to={`/admin/reports/${item.id}`}>
                                                            <Media className="align-items-center text-dark">
                                                                {item.title}
                                                            </Media>
                                                        </Link>
                                                    </th>
                                                    <td>
                                                        <Link to={`/admin/reports/${item.id}`}>
                                                            <Media className="align-items-center text-dark">
                                                                {item.description}
                                                            </Media>
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        <Link to={`/admin/users/${item.user_id}`}>
                                                            <Media className="align-items-center text-dark">
                                                                {item.user_id}
                                                            </Media>
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        <Link to={`/admin/users/${item.user_guard_id}`}>
                                                            <Media className="align-items-center text-dark">
                                                                {item.user_guard_id}
                                                            </Media>
                                                        </Link>
                                                    </td>
                                                    <td className="text-right">
                                                        <UncontrolledDropdown>
                                                            <DropdownToggle
                                                                className="btn-icon-only text-light"
                                                                href="#"
                                                                role="button"
                                                                size="sm"
                                                                color=""
                                                                onClick={e => e.preventDefault()}
                                                            >
                                                                <i className="fas fa-ellipsis-v" />
                                                            </DropdownToggle>
                                                            <DropdownMenu className="dropdown-menu-arrow" right>

                                                                <Link to={`/admin/reports/${item.id}`}>
                                                                    <DropdownItem>
                                                                        Подробнее
                                                                    </DropdownItem>
                                                                </Link>
                                                                <DropdownItem
                                                                    href="#"
                                                                    onClick={e => {
                                                                        e.preventDefault();
                                                                        deleteReport(item.id)
                                                                    }}
                                                                >
                                                                    <span className="text-danger">Удалить</span>
                                                                </DropdownItem>
                                                            </DropdownMenu>
                                                        </UncontrolledDropdown>
                                                    </td>
                                                </tr>
                                            ))
                                    }
                                    </tbody>
                                </Table>
                                <CardFooter className="py-4">
                                    {
                                        reports.last_page ?
                                            <Pagination totalItems={reports.last_page} pageSize={1} defaultActivePage={reports.current_page}/>
                                            : null
                                    }
                                </CardFooter>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        );
    }
}

const mapMethodsToProps = ({getReports}) => ({
    getReports
});

const mapStateToProps = ({reports, router}) => ({
    reports,
    router
});

export default connect(mapStateToProps, {setReports, deleteReport, setReportsRequest})(
    withDataService(Genes, mapMethodsToProps)
)
