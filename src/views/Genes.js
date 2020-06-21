import React, {Component} from "react";
import Header from "../components/Headers/Header";
import {
    Card, CardFooter,
    CardHeader,
    Col,
    Container, DropdownItem,
    DropdownMenu,
    DropdownToggle, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText,
    Media,
    Row, Spinner,
    Table,
    UncontrolledDropdown
} from "reactstrap";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {withDataService} from "../components/hoc";
import {deleteGene, setGenes, setGenesOptionSearch, setGenesRequest} from "../actions";
import {times} from "../utils";
import Pagination from "../components/Pagination/Pagination";

class Genes extends Component {
    componentDidMount() {
        this.updateGenes();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.location.search !== this.props.location.search) {
            this.updateGenes();
        }
    }

    updateGenes = () => {
        const {getGenes, setGenes, router, setGenesRequest} = this.props;

        setGenesRequest(true);
        getGenes(router.location.query)
            .then( (data) => {
                setGenes(data);
                setGenesRequest(false)
            });
    };

    search = (e) => {
        e.preventDefault();
        const {router, history, genes: {options}} = this.props;
        const query = router.location.query;
        query.q = options.q;

        history.push('?' + window.qs.stringify(query));
    };

    render() {
        const { genes, deleteGene, setGenesOptionSearch } = this.props;

        return (
            <React.Fragment>
                <Header/>
                <Container className="mt--7" fluid>
                    <Row>
                        <Col xs={12}>
                            <Card>
                                <CardHeader className="d-flex justify-content-between align-items-center">
                                    <Form onSubmit={this.search} className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex">
                                        <FormGroup className="mb-0 my-auto w-100">
                                            <InputGroup className="input-group-alternative shadow w-100">
                                                <InputGroupAddon
                                                    addonType="prepend"
                                                    onClick={this.search}
                                                >
                                                    <InputGroupText>
                                                        <i className="fas fa-search text-dark" />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input placeholder="Search" type="text" className="text-dark" onChange={(e) => setGenesOptionSearch(e.target.value)} />
                                            </InputGroup>
                                        </FormGroup>
                                    </Form>
                                    <Link to="/admin/genes/add" className="btn btn-primary">
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
                                        genes.request ?
                                            <tr>
                                                <td></td>
                                                <td colSpan="3" className="d-flex justify-content-center">
                                                    <Spinner/>
                                                </td>
                                            </tr>
                                            : genes.data.map( (item) => (
                                                <tr>
                                                    <th scope="row">
                                                        <Link to={`/admin/genes/${item.id}`}>
                                                            <Media className="align-items-center text-dark">
                                                                {item.id}
                                                            </Media>
                                                        </Link>
                                                    </th>
                                                    <td>
                                                        <Link to={`/admin/genes/${item.id}`}>
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

                                                                <Link to={`/admin/genes/${item.id}`}>
                                                                    <DropdownItem>
                                                                        Подробнее
                                                                    </DropdownItem>
                                                                </Link>
                                                                <Link to={`/admin/genes/${item.id}`}>
                                                                    <DropdownItem>
                                                                        Редактировать
                                                                    </DropdownItem>
                                                                </Link>
                                                                <DropdownItem
                                                                    href="#"
                                                                    onClick={e => {
                                                                        e.preventDefault();
                                                                        deleteGene(item.id)
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
                                        genes.last_page ?
                                            <Pagination totalItems={genes.last_page} pageSize={1} defaultActivePage={genes.current_page}/>
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

const mapMethodsToProps = ({getGenes}) => ({
    getGenes
});

const mapStateToProps = ({genes, router}) => ({
    genes,
    router
});

export default connect(mapStateToProps, {setGenes, deleteGene, setGenesRequest, setGenesOptionSearch})(
    withDataService(Genes, mapMethodsToProps)
)
