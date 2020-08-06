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
import {deleteSubcategory} from "../actions";
import Helmet from "react-helmet";
import {toUrl} from "../utils";

const Subcategories = (props) => {
    const {subcategories, deleteSubcategory, kinds, router} = props;
    const selectedKind = kinds.all.find((item) => toUrl(item.title_eng) === router.location.query.kind);
    const filteredSubcategories = subcategories.all.filter((item) => {
        if (item.kinds) {
            const kinds = item.kinds.filter((item) => toUrl(item.title_eng) === router.location.query.kind);
            return kinds.length > 0;
        }

        return false;
    });

    return (
        <React.Fragment>
            <Helmet>
                <title>Подкатегории | Breeders Zone</title>
            </Helmet>
            <Header/>
            <Container className="mt--7" fluid>
                <Row>
                    <Col xs={12}>
                        <Card className="shadow">
                            <CardHeader className="d-flex justify-content-between align-items-center">
                                <h1>Подкатегории</h1>
                                <div className="d-flex align-items-center">
                                    <UncontrolledDropdown>
                                        <DropdownToggle
                                            className="d-flex align-items-center"
                                            href="#"
                                            size="sm"
                                            color=""
                                            onClick={(e) => e.preventDefault()}
                                        >
                                            <span>{router.location.query.kind && selectedKind ? selectedKind.title_rus : 'Все категории'}</span><i className="ni ni-bold-down"></i>
                                        </DropdownToggle>
                                        <DropdownMenu className="dropdown-menu-arrow" right>
                                            {
                                                kinds.all.map( (item) => (
                                                    <DropdownItem
                                                        to={`/admin/subcategories?kind=${toUrl(item.title_eng)}`}
                                                        tag={Link}
                                                        key={item.title_rus}
                                                    >
                                                        {item.title_rus}
                                                    </DropdownItem>
                                                ))
                                            }
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                    {
                                        router.location.query.kind ?
                                            <Link
                                                to={{
                                                    pathname: "/admin/subcategories/add",
                                                    state: {kind: selectedKind }
                                                }}
                                                className="btn btn-primary"
                                            >
                                                Добавить
                                            </Link>
                                            : null
                                    }
                                </div>
                            </CardHeader>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                <tr>
                                    <th scope="col">
                                        {
                                            router.location.query.kind
                                            || router.location.query.q ?
                                                'ID'
                                                : ''
                                        }
                                    </th>
                                    <th
                                        scope="col"
                                        className={(!subcategories.request && subcategories.all.length === 0) || subcategories.request ? 'w-100' : '' }
                                    >
                                        {
                                            router.location.query.kind
                                            || router.location.query.q ?
                                                'Название'
                                                : 'Категория'
                                        }
                                    </th>
                                    <th scope="col" />
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    router.location.query.kind && !subcategories.request && filteredSubcategories.length === 0 ?
                                        <tr>
                                            <td></td>
                                            <td className="d-flex justify-content-center"><p className="m-0">Подкатегорий нет</p></td>
                                            <td></td>
                                        </tr>
                                        : null
                                }
                                {
                                    (router.location.query.kind && subcategories.request) || kinds.request ?
                                        <tr>
                                            <td></td>
                                            <td className="d-flex justify-content-center"><Spinner/></td>
                                            <td></td>
                                        </tr>
                                        : null
                                }
                                {
                                    router.location.query.kind ?
                                        filteredSubcategories.map((item) => (
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
                                        : kinds.all.map( (item) => (
                                            <tr key={item.id}>
                                                <th scope="row">
                                                    <Link to={`/admin/subcategories?kind=${toUrl(item.title_eng)}`}>
                                                        <Media className="align-items-center text-dark">
                                                            <i className="ni ni-lg ni-folder-17 text-yellow"></i>
                                                        </Media>
                                                    </Link>
                                                </th>
                                                <td>
                                                    <Link to={`/admin/subcategories?kind=${toUrl(item.title_eng)}`}>
                                                        <Media className="align-items-center text-dark">
                                                            {item.title_rus} ({item.title_eng})
                                                        </Media>
                                                    </Link>
                                                </td>
                                                <td className="text-right"></td>
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

const mapStateToProps = ({subcategories, kinds, router}) => ({
    subcategories,
    kinds,
    router
});

export default connect(mapStateToProps, {deleteSubcategory})(Subcategories);
