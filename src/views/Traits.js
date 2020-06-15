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
import {deleteTrait, setTraits, setTraitsRequest} from "../actions";
import Pagination from "../components/Pagination/Pagination";

class Traits extends Component {
    componentDidMount() {
        this.updateTraits();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.location.search !== this.props.location.search) {
            this.updateTraits();
        }
    }

    updateTraits = () => {
        const {getTraits, setTraits, router, setTraitsRequest} = this.props;

        setTraitsRequest(true);
        getTraits(router.location.query)
            .then( (data) => {
                setTraits(data);
                setTraitsRequest(false);
            });
    };

    render() {
        const { traits, deleteTrait } = this.props;

        return (
            <React.Fragment>
                <Header/>
                <Container className="mt--7" fluid>
                    <Row>
                        <Col xs={12}>
                            <Card>
                                <CardHeader className="d-flex justify-content-between align-items-center">
                                    <h1>Типы генов</h1>
                                    <Link to="/admin/traits/add" className="btn btn-primary">
                                        Добавить
                                    </Link>
                                </CardHeader>
                                <Table className="align-items-center table-flush" responsive>
                                    <thead className="thead-light">
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Название</th>
                                        <th scope="col">Тип</th>
                                        <th scope="col" />
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        traits.request ?
                                            <tr>
                                                <td></td>
                                                <td colSpan="3" className="d-flex justify-content-center">
                                                    <Spinner/>
                                                </td>
                                            </tr>
                                            : traits.data.map( (item) => (
                                                <tr>
                                                    <th scope="row">
                                                        <Link to={`/admin/traits/${item.id}`}>
                                                            <Media className="align-items-center text-dark">
                                                                {item.id}
                                                            </Media>
                                                        </Link>
                                                    </th>
                                                    <td>
                                                        <Link to={`/admin/traits/${item.id}`}>
                                                            <Media className="align-items-center text-dark">
                                                                {item.title}
                                                            </Media>
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        <Link to={`/admin/genes/${item.id}`}>
                                                            <Media className="align-items-center text-dark">
                                                                {item.type}
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

                                                                <Link to={`/admin/traits/${item.id}`}>
                                                                    <DropdownItem>
                                                                        Подробнее
                                                                    </DropdownItem>
                                                                </Link>
                                                                <Link to={`/admin/traits/${item.id}`}>
                                                                    <DropdownItem>
                                                                        Редактировать
                                                                    </DropdownItem>
                                                                </Link>
                                                                <DropdownItem
                                                                    href="#"
                                                                    onClick={e => {
                                                                        e.preventDefault();
                                                                        deleteTrait(item.id)
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
        );
    }
}

const mapMethodsToProps = ({getTraits}) => ({
    getTraits
});

const mapStateToProps = ({traits, router}) => ({
    traits,
    router
});

export default connect(mapStateToProps, {setTraits, deleteTrait, setTraitsRequest})(
    withDataService(Traits, mapMethodsToProps)
)
