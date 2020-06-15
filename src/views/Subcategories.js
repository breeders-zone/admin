import React, {Component} from "react";
import Header from "../components/Headers/Header";
import {
    Badge,
    Card,
    CardBody, CardHeader,
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
import {deleteKind, deleteSubcategory} from "../actions";

const Subcategories = (props) => {
    const {subcategories, deleteSubcategory} = props;
    return (
        <React.Fragment>
            <Header/>
            <Container className="mt--7" fluid>
                <Row>
                    <Col xs={12}>
                        <Card className="shadow">
                            <CardHeader className="d-flex justify-content-between align-items-center">
                                <h1>Подкатегории</h1>
                                <Link to="/admin/subcategories/add" className="btn btn-primary">
                                    Добавить
                                </Link>
                            </CardHeader>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Название</th>
                                    <th scope="col" />
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    subcategories.request ?
                                        <tr>
                                            <td></td>
                                            <td className="d-flex justify-content-center"><Spinner/></td>
                                            <td></td>
                                        </tr>
                                        : null
                                }
                                {
                                    subcategories.all.map((item) => (
                                        <tr key={item.id}>
                                            <th scope="row">
                                                <Link to={`/admin/subcategories/${item.id}`}>
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

                                                        <Link to={`/admin/subcategories/${item.id}`}>
                                                            <DropdownItem>
                                                                Подробнее
                                                            </DropdownItem>
                                                        </Link>
                                                        <Link to={`/admin/subcategories/${item.id}`}>
                                                            <DropdownItem>
                                                                Редактировать
                                                            </DropdownItem>
                                                        </Link>
                                                        <DropdownItem
                                                            href="#"
                                                            onClick={e => {
                                                                e.preventDefault();
                                                                deleteSubcategory(item.id)
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

const mapStateToProps = ({subcategories}) => ({
    subcategories
});

export default connect(mapStateToProps, {deleteSubcategory})(Subcategories);