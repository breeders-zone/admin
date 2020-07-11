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
import {deleteKind} from "../actions";

const Kinds = (props) => {
    const {allKinds, deleteKind, kindsRequest} = props;
    return (
        <React.Fragment>
            <Header/>
            <Container className="mt--7" fluid>
                <Row>
                    <Col xs={12}>
                        <Card className="shadow">
                            <CardHeader className="d-flex justify-content-between align-items-center">
                                <h1>Категории</h1>
                                <Link to="/admin/kinds/add" className="btn btn-primary">
                                    Добавить
                                </Link>
                            </CardHeader>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                <tr>
                                    <th scope="col">Русское название</th>
                                    <th scope="col">Латинское название</th>
                                    <th scope="col">Есть подкатегории</th>
                                    <th scope="col">Группа</th>
                                    <th scope="col" />
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    kindsRequest  ?
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td className="d-flex justify-content-center w-100"><Spinner/></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        : null
                                }
                                {
                                    !kindsRequest && allKinds.length === 0  ?
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td colSpan={2} className="d-flex justify-content-center w-100"><p>Похоже нет добавленных категорий</p></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        : null
                                }
                                {
                                    allKinds.map((item) => (
                                        <tr key={item.id}>
                                            <th scope="row">
                                                <Link to={`/admin/kinds/${item.id}`}>
                                                    <Media className="align-items-center text-dark">
                                                        {item.title_rus}
                                                    </Media>
                                                </Link>
                                            </th>
                                            <td>
                                                <Badge color="" className="badge-dot mr-4">
                                                    {item.title_eng}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Badge color="" className="badge-dot mr-4">
                                                    {item.has_subcategories ? 'Есть' : 'Нет'}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Badge color="" className="badge-dot mr-4">
                                                    {item.group}
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

                                                        <Link to={`/admin/kinds/${item.id}`}>
                                                            <DropdownItem>
                                                                Подробнее
                                                            </DropdownItem>
                                                        </Link>
                                                        <Link to={`/admin/kinds/${item.id}`}>
                                                            <DropdownItem>
                                                                Редактировать
                                                            </DropdownItem>
                                                        </Link>
                                                        <DropdownItem
                                                            href="#"
                                                            onClick={e => {
                                                                e.preventDefault();
                                                                deleteKind(item.id);
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

const mapStateToProps = ({kinds: { all: allKinds, request: kindsRequest }}) => ({
    allKinds,
    kindsRequest
});

export default connect(mapStateToProps, {deleteKind})(Kinds);