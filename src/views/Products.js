import React, {Component} from "react";
import Header from "../components/Headers/Header";
import {
    Badge, Card, CardFooter, CardHeader,
    Container, DropdownItem,
    DropdownMenu,
    DropdownToggle, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText,
    Media,
    Row, Spinner, Table,
    UncontrolledDropdown,
    UncontrolledTooltip
} from "reactstrap";
import withDataService from "../components/hoc/withDataService";
import {
    deleteProduct,
    setProductsOptionsKind,
    setProductsOptionsSearch,
    setProductsRequest,
    setProductsState
} from "../actions";
import {connect} from "react-redux";
import {toUrl} from "../utils";
import {Link} from "react-router-dom";
import Pagination from "../components/Pagination/Pagination";
import Helmet from "react-helmet";
import getSymbolFromCurrency from "currency-symbol-map";

class Products extends Component {

    tbody = React.createRef();

    componentDidMount() {
        const {router: {location: {query}}, allKinds} = this.props;
        this.updateProducts();
        console.log(this.props.router)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.location.search !== this.props.location.search) {
            this.updateProducts();
        }

        if (prevProps.allKinds !== this.props.allKinds) {
            const {router: {location: {query}}, allKinds} = this.props;
            if (query.kind && allKinds.length > 0) {
                const kind = allKinds.find((item) => item?.title_eng.toLowerCase().replace('-', ' ') === query.kind.replace('-', ' ').toLowerCase());
                this.selectKind(kind)
            }
        }
    }

    updateProducts = () => {
        const {getProducts, setProductsState, setProductsRequest, router: { location: {search} } } = this.props;
        setProductsRequest(true);
        getProducts({}, search.replace('?', ''))
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
        query.kind = toUrl(kind.title_eng, true);
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
        const {data, last_page, current_page, options, allKinds, productsRequest, setProductsOptionsSearch, deleteProduct, router, history} = this.props;

        return (
            <React.Fragment>
                <Helmet>
                    <title>Продукты | Breeders Zone</title>
                </Helmet>
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

                                    <div>
                                        <UncontrolledDropdown>
                                            <DropdownToggle
                                                className="d-flex align-items-center"
                                                href="#"
                                                size="sm"
                                                color=""
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                <span>{router.location.query.created && router.location.query.created === 'desc' ? 'Сначала новые' : 'Сначала старые'}</span><i className="ni ni-bold-down"></i>
                                            </DropdownToggle>
                                            <DropdownMenu className="dropdown-menu-arrow" right>
                                                <DropdownItem
                                                    className="cursor-pointer"
                                                    onClick={() => {
                                                        const query = router.location.query;
                                                        query.created = 'desc';

                                                        history.push('?' + window.qs.stringify(query));
                                                    }}
                                                >
                                                    Сначала новые
                                                </DropdownItem>
                                                <DropdownItem
                                                    className="cursor-pointer"
                                                    onClick={() => {
                                                        const query = router.location.query;
                                                        query.created = 'asc';

                                                        history.push('?' + window.qs.stringify(query));
                                                    }}
                                                >
                                                    Сначала старые
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
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
                                                            className="cursor-pointer"
                                                            onClick={() => this.selectKind('all')}
                                                        >
                                                            Все категории
                                                        </DropdownItem>
                                                        : null
                                                }
                                                {
                                                    allKinds.map( (item) => (
                                                        <DropdownItem
                                                            className="cursor-pointer"
                                                            key={item.title_rus}
                                                            onClick={() => this.selectKind(item)}
                                                        >
                                                            {item.title_rus}
                                                        </DropdownItem>
                                                    ))
                                                }
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </CardHeader>
                                <Table className="align-items-center table-flush" responsive>
                                    <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Номер в системе</th>
                                        <th>Уникальный идентификатор</th>
                                        <th scope="col">Изображение и название</th>
                                        <th scope="col">Цена</th>
                                        <th
                                            scope="col"
                                            className={(!productsRequest && data.length === 0 ) || productsRequest ? 'w-100' : ''}
                                        >Категория</th>
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
                                                    <td></td>
                                                    <td className="d-flex justify-content-center"><Spinner/></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                </tr> : null

                                    }
                                    {
                                        !productsRequest && data.length === 0 ?
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td className="text-center">
                                                    <p className="m-0 my-3">Похоже продуктов нет.</p>
                                                </td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr> : null
                                    }
                                    {
                                            !productsRequest ? data.map( (item) => (
                                                <tr key={item.id}>
                                                    <th scope="row">{item.id}</th>
                                                    <th scope="row">{item.article}</th>
                                                    <th scope="row">
                                                       <Link
                                                           to={`/admin/products/${item.id}`}>
                                                           <Media className="align-items-center text-dark">
                                                               {
                                                                   item.product_images.length > 0 ?
                                                                       (
                                                                           <div
                                                                               className="d-flex flex-column rounded-circle overflow-hidden shadow mr-2"
                                                                               style={{
                                                                                   width: 50,
                                                                                   height: 50
                                                                               }}
                                                                           >
                                                                               <img
                                                                                   alt="..."
                                                                                   className="img-fluid m-auto"
                                                                                   src={item.product_images[0].img_src}
                                                                               />
                                                                           </div>
                                                                       )
                                                                       : null
                                                               }
                                                               <Media>
                                                                <span className="mb-0 text-sm">
                                                                  {item.name}
                                                                </span>
                                                               </Media>
                                                           </Media>
                                                       </Link>
                                                    </th>
                                                    <td>{item.price} {getSymbolFromCurrency(item.currency)}</td>
                                                    <td>
                                                        <Badge color="" className="badge-dot mr-4">
                                                            {item.kind.title_rus}<br/>
                                                            ({item.kind.title_eng})
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <Badge color="" className="badge-dot mr-4">
                                                            {item.subcategory ? item.subcategory.title : null}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <div className="avatar-group">
                                                            <Link
                                                                to={`/admin/users/${item.user.id}`}
                                                                className="d-flex flex-column rounded-circle overflow-hidden shadow mr-2"
                                                                style={{
                                                                    width: 50,
                                                                    height: 50
                                                                }}
                                                                id="tooltip742438047"
                                                            >
                                                                <img
                                                                    alt="..."
                                                                    className="img-fluid m-auto"
                                                                    src={item.user.logo_img_url}
                                                                />
                                                            </Link>
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

                                                                <Link to={`/admin/products/${item.id}`}>
                                                                    <DropdownItem>
                                                                        Подробнее
                                                                    </DropdownItem>
                                                                </Link>
                                                                <Link to={`/admin/products/${item.id}`}>
                                                                    <DropdownItem>
                                                                        Редактировать
                                                                    </DropdownItem>
                                                                </Link>
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
                                    {
                                        last_page ?
                                            <Pagination totalItems={last_page} pageSize={1} defaultActivePage={current_page}/>
                                            : null
                                    }
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

const mapStateToProps = ({products: {data, last_page, current_page, options, productsRequest}, kinds: {all: allKinds}, router}) => ({
    data,
    last_page,
    current_page,
    options,
    allKinds,
    productsRequest,
    router
});

export default connect(mapStateToProps, {setProductsState, setProductsOptionsKind, setProductsRequest, setProductsOptionsSearch, deleteProduct})(withDataService(Products, mapMethodsToProps));
