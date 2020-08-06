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
import Pagination from "../components/Pagination/Pagination";
import Helmet from "react-helmet";
import {toUrl} from "../utils";
import {initialState} from "../reducers";

class Genes extends Component {
    componentDidMount() {
        const {setGenesRequest} = this.props;
        setGenesRequest(false);
        this.updateGenes();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.location.search !== this.props.location.search) {
            this.updateGenes();
        }
    }

    updateGenes = () => {
        const {getGenes, setGenes, router, setGenesRequest} = this.props;

        if (router.location.query.kind || router.location.query.q) {
            setGenes(initialState.genes);
            setGenesRequest(true);
            getGenes(router.location.query)
                .then( (data) => {
                    setGenes(data);
                    setGenesRequest(false)
                });
        }
    };

    search = (e) => {
        e.preventDefault();
        const {router, history, genes: {options}} = this.props;
        const query = router.location.query;
        query.q = options.q;

        history.push('?' + window.qs.stringify(query));
    };

    render() {
        const { kinds, genes, router, deleteGene, setGenesOptionSearch } = this.props;
        const selectedKind = kinds.all.find((item) => toUrl(item.title_eng) === router.location.query.kind);

        return (
            <React.Fragment>
                <Helmet>
                    <title>Гены | Breeders Zone</title>
                </Helmet>
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
                                                            to={`/admin/genes?kind=${toUrl(item.title_eng)}`}
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
                                            router.location.query.kind
                                            || router.location.query.q ?
                                                <Link
                                                    to={{
                                                        pathname: "/admin/genes/add",
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
                                        <th scope="col" className={(!genes.request && genes.data.length === 0 ) || genes.request ? 'w-100' : ''}>
                                            {
                                                router.location.query.kind
                                                || router.location.query.q ?
                                                    'Название'
                                                    : 'Категория'
                                            }
                                        </th>
                                        <th scope="col">Тип</th>
                                        <th scope="col" />
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        (router.location.query.kind || router.location.query.q)
                                        && !genes.request
                                        && genes.data.length === 0 ?
                                            <tr>
                                                <td></td>
                                                <td colSpan="3" className="d-flex justify-content-center">
                                                    <p className="m-0">Генов нет</p>
                                                </td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                            : null
                                    }
                                    {
                                        genes.request || kinds.request ?
                                            <tr>
                                                <td></td>
                                                <td colSpan="3" className="d-flex justify-content-center">
                                                    <Spinner/>
                                                </td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                            : null
                                    }
                                    {
                                        (router.location.query.kind || router.location.query.q) ?
                                            genes.data.map( (item) => (
                                                <tr key={item.id}>
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
                                            : kinds.all.map( (item) => (
                                                <tr key={item.id}>
                                                    <th scope="row">
                                                        <Link to={`/admin/genes?kind=${toUrl(item.title_eng)}`}>
                                                            <Media className="align-items-center text-dark">
                                                                <i className="ni ni-lg ni-folder-17 text-yellow"></i>
                                                            </Media>
                                                        </Link>
                                                    </th>
                                                    <td>
                                                        <Link to={`/admin/genes?kind=${toUrl(item.title_eng)}`}>
                                                            <Media className="align-items-center text-dark">
                                                                {item.title_rus} ({item.title_eng})
                                                            </Media>
                                                        </Link>
                                                    </td>
                                                    <td></td>
                                                    <td className="text-right"></td>
                                                </tr>
                                            ))
                                    }
                                    </tbody>
                                </Table>
                                <CardFooter className="py-4">
                                    {
                                        genes.last_page && (router.location.query.kind || router.location.query.q) ?
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

const mapStateToProps = ({kinds, genes, router}) => ({
    kinds,
    genes,
    router
});

export default connect(mapStateToProps, {setGenes, deleteGene, setGenesRequest, setGenesOptionSearch})(
    withDataService(Genes, mapMethodsToProps)
)
