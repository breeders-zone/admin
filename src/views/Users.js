import React, {Component} from "react";
import {
    Card, CardFooter,
    CardHeader,
    Col,
    Container, DropdownItem, DropdownMenu, DropdownToggle,
    Form,
    FormGroup, Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Row, Spinner, Table, UncontrolledDropdown
} from "reactstrap";
import Header from "../components/Headers/Header";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import { Scrollbars } from 'react-custom-scrollbars';
import {withDataService} from "../components/hoc";
import {
    deleteUser, setUserActive, setUserIsBreeder,
    setUserIsGuard,
    setUsers,
    setUsersOptionsSearch,
    setUsersOptionsSort,
    setUsersRequest
} from "../actions";
import Pagination from "../components/Pagination/Pagination";
import Helmet from "react-helmet";

class Users extends Component {
    componentDidMount() {
        this.updateUsers();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.location.search !== this.props.location.search) {
            this.updateUsers();
        }
    }

    updateUsers = () => {
        const { getUsers, setUsers, setUsersOptionsSort, setUsersRequest, router } = this.props;
        if (router.location.query.sort) {
            setUsersOptionsSort(router.location.query.sort);
        }
        setUsersRequest(true);
        getUsers(router.location.query)
            .then( (data) => {
                setUsers(data);
                setUsersRequest(false);
            });
    };

    selectSort = (sort) => {
        const { history, setUsersOptionsSort, router } = this.props;
        const query = router.location.query;

        if (sort === 'all') {
            delete query.sort;
            setUsersOptionsSort('');
            history.push('?' + window.qs.stringify(query));
            return;
        }
        setUsersOptionsSort(sort);
        query.sort = sort;
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
        const {
            users,
            options,
            setUsersOptionsSearch,
            updateUser,
            deleteUser,
            setUserActive,
            setUserIsBreeder,
            setUserIsGuard
        } = this.props;
        return (
            <React.Fragment>
                <Helmet>
                    <title>?????????????????????? | Breeders Zone</title>
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
                                                <Input placeholder="Search" type="text" className="text-dark" onChange={(e) => setUsersOptionsSearch(e.target.value)} />
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
                                            <span>{users.sortTitle}</span><i className="ni ni-bold-down"></i>
                                        </DropdownToggle>
                                        <DropdownMenu className="dropdown-menu-arrow" right>
                                            {
                                                options.sort ?
                                                    <DropdownItem
                                                        onClick={() => this.selectSort('all')}
                                                    >
                                                        ?????? ????????????????????????
                                                    </DropdownItem>
                                                    : null
                                            }
                                            <DropdownItem
                                                onClick={() => this.selectSort('shops')}
                                            >
                                                ???????????? ????????????????
                                            </DropdownItem>
                                            <DropdownItem
                                                onClick={() => this.selectSort('notactive')}
                                            >
                                                ???????????? ???? ????????????????
                                            </DropdownItem>
                                            <DropdownItem
                                                onClick={() => this.selectSort('guards')}
                                            >
                                                ???????????? ??????????????????
                                            </DropdownItem>
                                            <DropdownItem
                                                onClick={() => this.selectSort('users')}
                                            >
                                                ???????????? ????????????????????????
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </CardHeader>
                                <div className="table-response">
                                    <Scrollbars style={{minHeight: 300}}>
                                        <Table className="align-items-center table-flush">
                                            <thead className="thead-light">
                                            <tr>
                                                <th scope="col">???????? ??????????????</th>
                                                <th scope="col">?????????????? ????????????????</th>
                                                <th scope="col">??????</th>
                                                <th scope="col">??????????????</th>
                                                <th scope="col" className={(!users.request && users.data.length === 0 ) || users.request ? 'w-100' : ''}>????????????????</th>
                                                <th scope="col">??????????????</th>
                                                <th scope="col">??????????????</th>
                                                <th scope="col">??????????????????</th>
                                                <th scope="col">???????????????? ????????????????</th>
                                                <th scope="col">?????????????????????? ??????????</th>
                                                <th scope="col">?????????????????????? ?????????? ????????????????????????</th>
                                                <th scope="col">??????????????</th>
                                                <th scope="col">??????????????</th>
                                                <th scope="col" />
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                !users.request && users.data.length === 0 ?
                                                    <tr>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td className="d-flex"><p className="m-auto font-weight-light">???????????? ?????????????????????????? ??????</p></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                    </tr>
                                                    : null
                                            }
                                            {
                                                users.request ?
                                                    <tr>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td className="d-flex"><Spinner className="m-auto"/></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                    </tr>
                                                    : users.data.map( (item, idx) => (
                                                        <tr key={item.id}>
                                                            <td>
                                                                <Link to={`/admin/users/${item.id}`} className="d-flex align-items-center">
                                                                    {
                                                                        item.profile_img ?
                                                                            <div className="d-flex flex-column rounded-circle overflow-hidden shadow mr-2" style={{
                                                                                width: 50,
                                                                                height: 50
                                                                            }}>
                                                                                <img
                                                                                    className="m-auto"
                                                                                    src={item.profile_img}
                                                                                    style={{
                                                                                        width: 50,
                                                                                        height: 50,
                                                                                        objectFit: 'cover'
                                                                                    }}
                                                                                    alt={item.name}
                                                                                />
                                                                            </div>
                                                                            : null
                                                                    }
                                                                </Link>
                                                            </td>
                                                            <td>
                                                                <Link to={`/admin/users/${item.id}`} className="d-flex align-items-center">
                                                                    {
                                                                        item.logo_img_url ?
                                                                            <div className="d-flex flex-column rounded-circle overflow-hidden shadow mr-2" style={{
                                                                                width: 50,
                                                                                height: 50
                                                                            }}>
                                                                                <img className="img-fluid m-auto" src={item.logo_img_url} alt={item.company_name}/>
                                                                            </div>
                                                                            : null
                                                                    }
                                                                </Link>
                                                            </td>
                                                            <td>
                                                                <Link to={`/admin/users/${item.id}`} className="text-dark font-weight-bold">
                                                                    {item.name}
                                                                </Link>
                                                            </td>
                                                            <td>
                                                                <Link to={`/admin/users/${item.id}`} className="text-dark font-weight-bold">
                                                                    {item.surname}
                                                                </Link>
                                                            </td>
                                                            <td>
                                                                <Link to={`/admin/users/${item.id}`} className="text-dark font-weight-bold">
                                                                    {item.patronymic}
                                                                </Link>
                                                            </td>
                                                            <td>{item.is_breeder ? '????' : '??????'}</td>
                                                            <td>{item.active ? '????' : '??????'}</td>
                                                            <td>{item.is_guard ? '????' : '??????'}</td>
                                                            <td>{item.company_name}</td>
                                                            <td>{item.email}</td>
                                                            <td>{item.email_verified_at !== null ? '????????????????????' : '???? ????????????????????????'}</td>
                                                            <td>{item.phone}</td>
                                                            <td>{item.location}</td>
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
                                                                        {
                                                                            !item.active ?
                                                                                <DropdownItem
                                                                                    onClick={() => {
                                                                                        updateUser(item.id, {active: '1'});
                                                                                        setUserActive({idx, active: true})
                                                                                    }}
                                                                                >
                                                                                    ?????????????? ????????????????
                                                                                </DropdownItem>
                                                                                : <DropdownItem
                                                                                    onClick={() => {
                                                                                        updateUser(item.id, {active: '0'});
                                                                                        setUserActive({idx, active: false});
                                                                                    }}
                                                                                >
                                                                                    ?????????????? ???? ????????????????
                                                                                </DropdownItem>
                                                                        }
                                                                        {
                                                                            !item.is_breeder ?
                                                                                <DropdownItem
                                                                                    onClick={() => {
                                                                                        updateUser(item.id, {is_breeder: '1'});
                                                                                        setUserIsBreeder({idx, isBreeder: true})
                                                                                    }}
                                                                                >
                                                                                    ?????????????? ??????????????????
                                                                                </DropdownItem>
                                                                                : <DropdownItem
                                                                                    onClick={() => {
                                                                                        updateUser(item.id, {is_breeder: '0'});
                                                                                        setUserIsBreeder({idx, isBreeder: false});
                                                                                    }}
                                                                                >
                                                                                    ???????????????? ???? ???????????????? ????????????????????????
                                                                                </DropdownItem>
                                                                        }
                                                                        {
                                                                            !item.is_guard ?
                                                                                <DropdownItem
                                                                                    onClick={() => {
                                                                                        updateUser(item.id, {is_guard: '1'});
                                                                                        setUserIsGuard({idx, isGuard: true});
                                                                                    }}
                                                                                >
                                                                                    ?????????????? ????????????????????
                                                                                </DropdownItem>
                                                                                : <DropdownItem
                                                                                    onClick={() => {
                                                                                        updateUser(item.id, {is_guard: '0'});
                                                                                        setUserIsGuard({idx, isGuard: false});
                                                                                    }}
                                                                                >
                                                                                    ???????????? ???????????? ??????????????????
                                                                                </DropdownItem>
                                                                        }
                                                                        <Link to={`/admin/users/${item.id}`}>
                                                                            <DropdownItem>
                                                                                ??????????????????
                                                                            </DropdownItem>
                                                                        </Link>
                                                                        <DropdownItem
                                                                            href="#"
                                                                            onClick={e => {
                                                                                e.preventDefault();
                                                                                deleteUser(item.id);
                                                                            }}
                                                                        >
                                                                            <span className="text-danger">??????????????</span>
                                                                        </DropdownItem>
                                                                    </DropdownMenu>
                                                                </UncontrolledDropdown>
                                                            </td>
                                                        </tr>
                                                    ))
                                            }
                                            </tbody>
                                        </Table>
                                    </Scrollbars>
                                </div>
                                <CardFooter>
                                    {
                                        users.last_page ?
                                            <Pagination totalItems={users.last_page} pageSize={1} defaultActivePage={users.current_page}/>
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

const mapMethodsToProps = ({getUsers, updateShop, updateUser}) => ({
    getUsers,
    updateShop,
    updateUser
});

const mapStateToProps = ({users, router}) => ({
    users,
    router,
    options: users.options
});

export default connect(mapStateToProps, {
    setUsers,
    setUsersOptionsSort,
    setUsersRequest,
    setUsersOptionsSearch,
    deleteUser,
    setUserActive,
    setUserIsBreeder,
    setUserIsGuard
})(
    withDataService(Users, mapMethodsToProps)
);
