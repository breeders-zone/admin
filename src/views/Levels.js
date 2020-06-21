import React, {Component} from "react";
import Header from "../components/Headers/Header";
import {
    Badge, Card, CardFooter, CardHeader,
    Container, DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Media,  Row, Spinner, Table,
    UncontrolledDropdown,
} from "reactstrap";
import withDataService from "../components/hoc/withDataService";
import {
    setLevels,
    setLevelsRequest,
    deleteLevel,
} from "../actions";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import Pagination from "../components/Pagination/Pagination";

class Levels extends Component {

    isGuardLevel = !!this.props.match.path.match(/\/admin\/guard-levels/gi);
    tbody = React.createRef();

    componentDidMount() {
        this.updateLevels();
    }

    updateLevels = () => {
        const {
            getGuardLevels,
            getBreederLevels,
            setLevels,
            setLevelsRequest,
            router: { location: {query} }
        } = this.props;
        setLevelsRequest(true);
        if (this.isGuardLevel) {
            getGuardLevels(query)
                .then( (data) => {
                    setLevels(data);
                    setLevelsRequest(false);
                });
        } else {
            getBreederLevels(query)
                .then( (data) => {
                    setLevels(data);
                    setLevelsRequest(false);
                });
        }

    };



    render() {
        const {levels, deleteLevel} = this.props;
        const {request} = levels;
        return (
            <React.Fragment>
                <Header />
                <Container className="mt--7" fluid>
                    {/* Table */}
                    <Row>
                        <div className="col">
                            <Card className="shadow">
                                <CardHeader className="d-flex justify-content-between align-items-center">
                                    <h1>Уровни {this.isGuardLevel ? 'хранителей' : 'магазинов'}</h1>
                                    <Link to={`/admin/${this.isGuardLevel ? 'guard-levels' : 'breeder-levels'}/add`} className="btn btn-primary">
                                        Добавить
                                    </Link>
                                </CardHeader>
                                <Table className="align-items-center table-flush" responsive>
                                    <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Уровень</th>
                                        <th scope="col">Фото</th>
                                        <th scope="col">Название</th>
                                        <th scope="col" />
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        request ?
                                            <tr>
                                                <td></td>
                                                <td className="d-flex justify-content-center"><Spinner/></td>
                                                <td></td>
                                                <td></td>
                                            </tr> : null

                                    }
                                    {
                                        !request && levels.data.length === 0 ?
                                            <tr>
                                                <td></td>
                                                <td className="text-center">
                                                    <p className="m-0 my-3">Похоже уровней нет.</p>
                                                </td>
                                                <td></td>
                                                <td></td>
                                            </tr> : null
                                    }
                                    {
                                        !request ? levels.data.map( (item) => (
                                            <tr key={item.level}>
                                                <th scope="row">
                                                    <Link to={`/admin/${this.isGuardLevel ? 'guard-levels' : 'breeder-levels'}/${item.level}`}>
                                                        <Media className="align-items-center text-dark">
                                                            {item.level}
                                                        </Media>
                                                    </Link>
                                                </th>
                                                <th scope="row">
                                                    <Link to={`/admin/${this.isGuardLevel ? 'guard-levels' : 'breeder-levels'}/${item.level}`}>
                                                        <Media className="align-items-center text-dark">
                                                            <div
                                                                className="avatar rounded align-items-stretch square mr-3"
                                                                onClick={e => e.preventDefault()}
                                                            >
                                                                <img
                                                                    className="rounded"
                                                                    alt="..."
                                                                    src={item.logo_src}
                                                                />
                                                            </div>
                                                        </Media>
                                                    </Link>
                                                </th>
                                                <td>
                                                    <Badge color="" className="badge-dot mr-4">
                                                        {item.title}<br/>
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

                                                            <Link to={`/admin/${this.isGuardLevel ? 'guard-levels' : 'breeder-levels'}/${item.level}`}>
                                                                <DropdownItem>
                                                                    Подробнее
                                                                </DropdownItem>
                                                            </Link>
                                                            <Link to={`/admin/${this.isGuardLevel ? 'guard-levels' : 'breeder-levels'}/${item.level}`}>
                                                                <DropdownItem>
                                                                    Редактировать
                                                                </DropdownItem>
                                                            </Link>
                                                            <DropdownItem
                                                                href="#"
                                                                onClick={e => {
                                                                    e.preventDefault();
                                                                    deleteLevel({level: item.level, isGuardLevel: this.isGuardLevel});
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
                                        levels.last_page ?
                                            <Pagination totalItems={levels.last_page} pageSize={1} defaultActivePage={levels.current_page}/>
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

const mapMethodsToProps = ({ getBreederLevels, getGuardLevels }) => ({
    getBreederLevels,
    getGuardLevels
});

const mapStateToProps = ({levels, router}) => ({
    levels,
    router
});

export default connect(mapStateToProps, {setLevels, setLevelsRequest, deleteLevel})(withDataService(Levels, mapMethodsToProps));