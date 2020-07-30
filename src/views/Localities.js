import React from "react";
import Header from "../components/Headers/Header";
import {
    Badge,
    Card,
    CardHeader,
    Col,
    Container, DropdownItem, DropdownMenu,
    DropdownToggle,
    Media,
    Row,
    Spinner,
    Table,
    UncontrolledDropdown
} from "reactstrap";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {deleteLocality} from "../actions";
import Helmet from "react-helmet";

const Localities = (props) => {
    const {localities, deleteLocality} = props;
    return (
        <React.Fragment>
            <Helmet>
                <title>Локалитеты | Breeders Zone</title>
            </Helmet>
            <Header/>
            <Container className="mt--7" fluid>
                <Row>
                    <Col xs={12}>
                        <Card className="shadow">
                            <CardHeader className="d-flex justify-content-between align-items-center">
                                <h1>Локалитеты</h1>
                                <Link to="/admin/localities/add" className="btn btn-primary">
                                    Добавить
                                </Link>
                            </CardHeader>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                <tr>
                                    <th scope="col">ID</th>
                                    <th
                                        scope="col"
                                        className={(!localities.request && localities.all.length === 0) || localities.request ? 'w-100' : '' }
                                    >Название</th>
                                    <th scope="col" />
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    !localities.request && localities.all.length === 0 ?
                                        <tr>
                                            <td></td>
                                            <td className="d-flex justify-content-center"><p className="m-0">Локалитетов нет</p></td>
                                            <td></td>
                                        </tr>
                                        : null
                                }
                                {
                                    localities.request ?
                                        <tr>
                                            <td></td>
                                            <td className="d-flex justify-content-center"><Spinner/></td>
                                            <td></td>
                                        </tr>
                                        : null
                                }
                                {
                                    localities.all.map((item) => (
                                        <tr key={item.id}>
                                            <th scope="row">
                                                <Link to={`/admin/localities/${item.id}`}>
                                                    <Media className="align-items-center text-dark">
                                                        {item.id}
                                                    </Media>
                                                </Link>
                                            </th>
                                            <td>
                                                <Badge color="" className="badge-dot mr-4">
                                                    {item.title}
                                                </Badge>
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

                                                        <Link to={`/admin/localities/${item.id}`}>
                                                            <DropdownItem>
                                                                Подробнее
                                                            </DropdownItem>
                                                        </Link>
                                                        <Link to={`/admin/localities/${item.id}`}>
                                                            <DropdownItem>
                                                                Редактировать
                                                            </DropdownItem>
                                                        </Link>
                                                        <DropdownItem
                                                            href="#"
                                                            onClick={e => {
                                                                e.preventDefault();
                                                                deleteLocality(item.id)
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
                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
};

const mapStateToProps = ({localities}) => ({
    localities
});

export default connect(mapStateToProps, {deleteLocality})(Localities);
