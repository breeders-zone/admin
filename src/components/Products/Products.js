import React, {Component} from "react";
import Header from "../Headers/Header";
import {
    Badge, Card, CardFooter, CardHeader, Col,
    Container, DropdownItem,
    DropdownMenu,
    DropdownToggle, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label,
    Media, Pagination, PaginationItem, PaginationLink,
    Progress, Row, Spinner, Table,
    UncontrolledDropdown,
    UncontrolledTooltip
} from "reactstrap";
import withDataService from "../hoc/withDataService";
import {
    deleteProduct,
    setProductsOptionsKind,
    setProductsOptionsSearch,
    setProductsRequest,
    setProductsState
} from "../../actions";
import {connect} from "react-redux";
import {times, toUrl} from "../../utils";

class Products extends Component {

    tbody = React.createRef();

    componentDidMount() {
        this.updateProducts()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.location.search !== this.props.location.search) {
            this.updateProducts();
        }
    }

    updateProducts = () => {
        const {getProducts, setProductsState, setProductsRequest, router: { location: {query} } } = this.props;
        setProductsRequest(true);
        getProducts(query)
            .then( (data) => {
                setProductsState(data);
                setProductsRequest(false);
            });
    };

    selectKind = (kind) => {
        const { history, setProductsOptionsKind, router } = this.props;
        const query = router.location.query;

        if (kind === 'all') {
            delete query.kind;
            history.push('?' + window.qs.stringify(query));
            return;
        }
        setProductsOptionsKind(kind.title_rus);
        query.kind = toUrl(kind.title_eng);
        history.push('?' + window.qs.stringify(query));
    };

    search = (e) => {
        e.preventDefault();
        const {router, history, options} = this.props;
        const query = router.location.query;
        query.q = options.q;

        history.push('?' + window.qs.stringify(query));
    };

    render() {
        const {products, options, allKinds, productsRequest, setProductsOptionsSearch, deleteProduct} = this.props;

        return (
            <React.Fragment>
                <Header />
                <Container className="mt--7" fluid>
                    {/* Table */}
                    <Row>
                        <div className="col">
                            <Card className="shadow">
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
                                                <Input placeholder="Search" type="text" className="text-dark" onChange={(e) => setProductsOptionsSearch(e.target.value)} />
                                            </InputGroup>
                                        </FormGroup>
                                    </Form>

                                    <UncontrolledDropdown>
                                        <DropdownToggle
                                            className="d-flex align-items-center"
                                            href="#"
                                            size="sm"
                                            color=""
                                            onClick={(e) => e.preventDefault()}
                                        >
                                            <span>{options.kind ? options.kind : 'Все категории'}</span><i className="ni ni-bold-down"></i>
                                        </DropdownToggle>
                                        <DropdownMenu className="dropdown-menu-arrow" right>
                                            {
                                                options.kind ?
                                                    <DropdownItem
                                                        onClick={() => this.selectKind('all')}
                                                    >
                                                        Все категории
                                                    </DropdownItem>
                                                    : null
                                            }
                                            {
                                                allKinds.map( (item) => (
                                                    <DropdownItem
                                                        onClick={() => this.selectKind(item)}
                                                    >
                                                        {item.title_rus}
                                                    </DropdownItem>
                                                ))
                                            }
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </CardHeader>
                                <Table className="align-items-center table-flush" responsive>
                                    <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Изображение и название</th>
                                        <th scope="col">Цена</th>
                                        <th scope="col">Категория</th>
                                        <th scope="col">Подкатегория</th>
                                        <th scope="col">Магазин</th>
                                        <th scope="col" />
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                            productsRequest ?
                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td className="d-flex justify-content-center"><Spinner/></td>
                                                    <td></td>
                                                    <td></td>
                                                </tr> : null

                                    }
                                    {
                                        !productsRequest && products.data.length === 0 ?
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td className="text-center">
                                                    <p className="m-0 my-3">Похоже продуктов нет.</p>
                                                </td>
                                                <td></td>
                                                <td></td>
                                            </tr> : null
                                    }
                                    {
                                            !productsRequest ? products.data.map( (item) => (
                                                <tr>
                                                    <th scope="row">
                                                        <Media className="align-items-center">
                                                            <a
                                                                className="avatar rounded-circle mr-3"
                                                                href="#pablo"
                                                                onClick={e => e.preventDefault()}
                                                            >
                                                                <img
                                                                    alt="..."
                                                                    src={item.product_images[0].img_src}
                                                                />
                                                            </a>
                                                            <Media>
                                                                <span className="mb-0 text-sm">
                                                                  {item.name}
                                                                </span>
                                                            </Media>
                                                        </Media>
                                                    </th>
                                                    <td>{item.price} RUB</td>
                                                    <td>
                                                        <Badge color="" className="badge-dot mr-4">
                                                            {item.kind.title_rus}<br/>
                                                            ({item.kind.title_eng})
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <Badge color="" className="badge-dot mr-4">
                                                            {item.subcategory.title}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <div className="avatar-group">
                                                            <a
                                                                className="avatar avatar-sm"
                                                                href="#pablo"
                                                                id="tooltip742438047"
                                                                onClick={e => e.preventDefault()}
                                                            >
                                                                <img
                                                                    alt="..."
                                                                    className="rounded-circle"
                                                                    src={item.user.logo_img_url}
                                                                />
                                                            </a>
                                                            <UncontrolledTooltip
                                                                delay={0}
                                                                target="tooltip742438047"
                                                            >
                                                                {item.user.company_name}
                                                            </UncontrolledTooltip>
                                                        </div>
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
                                                                <DropdownItem
                                                                    href="#pablo"
                                                                    onClick={e => e.preventDefault()}
                                                                >
                                                                    Подробнее
                                                                </DropdownItem>
                                                                <DropdownItem
                                                                    href="#pablo"
                                                                    onClick={e => e.preventDefault()}
                                                                >
                                                                    Редактировать
                                                                </DropdownItem>
                                                                <DropdownItem
                                                                    href="#"
                                                                    onClick={e => {
                                                                        e.preventDefault();
                                                                        deleteProduct(item.id);
                                                                    }}
                                                                >
                                                                    <span className="text-danger">Удалить</span>
                                                                </DropdownItem>
                                                            </DropdownMenu>
                                                        </UncontrolledDropdown>
                                                    </td>
                                                </tr>
                                            )) : null
                                        }
                                    </tbody>
                                </Table>
                                <CardFooter className="py-4">
                                    <nav aria-label="...">
                                        <Pagination
                                            className="pagination justify-content-end mb-0"
                                            listClassName="justify-content-end mb-0"
                                        >
                                            <PaginationItem className="disabled">
                                                <PaginationLink
                                                    href="#pablo"
                                                    onClick={e => e.preventDefault()}
                                                    tabIndex="-1"
                                                >
                                                    <i className="fas fa-angle-left" />
                                                    <span className="sr-only">Previous</span>
                                                </PaginationLink>
                                            </PaginationItem>
                                            <PaginationItem className="active" >
                                                <PaginationLink
                                                    href="#"
                                                    onClick={e => e.preventDefault()}
                                                >
                                                    {products.current_page}
                                                </PaginationLink>
                                            </PaginationItem>
                                            {
                                                products.current_page !== null && products.last_page !== null ?
                                                    times(products.current_page + 2)((i) => {
                                                        const page = products.current_page + i;
                                                        if (page <= products.last_page) {
                                                            return (
                                                                <PaginationItem key={page}>
                                                                    <PaginationLink
                                                                        href="#"
                                                                        onClick={e => {
                                                                            e.preventDefault();
                                                                            const {router, history} = this.props;
                                                                            const query = router.location.query;
                                                                            query.page = page
                                                                            history('?' +  window.qs.stringify(query))
                                                                        }}
                                                                    >
                                                                        {page}
                                                                    </PaginationLink>
                                                                </PaginationItem>
                                                            );
                                                        }
                                                    }) : null
                                            }

                                            <PaginationItem>
                                                <PaginationLink
                                                    href="#pablo"
                                                    onClick={e => e.preventDefault()}
                                                >
                                                    <i className="fas fa-angle-right" />
                                                    <span className="sr-only">Next</span>
                                                </PaginationLink>
                                            </PaginationItem>
                                        </Pagination>
                                    </nav>
                                </CardFooter>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </React.Fragment>
        )
    }
}

const mapMethodsToProps = ({ getProducts }) => ({
    getProducts
});

const mapStateToProps = ({products: {products, options, productsRequest}, kinds: {all: allKinds}, router}) => ({
    products,
    options,
    allKinds,
    productsRequest,
    router
});

export default connect(mapStateToProps, {setProductsState, setProductsOptionsKind, setProductsRequest, setProductsOptionsSearch, deleteProduct})(withDataService(Products, mapMethodsToProps));