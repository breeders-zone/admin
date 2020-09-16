import React, {Component} from "react";
import Header from "../../components/Headers/Header";
import {
    Card,
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
import {withDataService} from "../../components/hoc";
import {deleteTrait, setTraits, setTraitsRequest} from "../../actions";
import Helmet from "react-helmet";
import {IMapMethodsProps, IMapStateProps, IStateProps, TraitsPropsType} from "./types";
import {setTraitGroup, setTraitsGroups} from "../../actions/traits/traits";
import {ITraitGroup, ITraitState} from "../../reducers/traits/types";
import TraitGroupRow from "./TraitGroupRow";

class Traits extends Component<TraitsPropsType, {}> {
    componentDidMount() {
        this.updateTraits();
    }

    componentDidUpdate(prevProps: TraitsPropsType, prevState: {}) {
        if (prevProps.location.search !== this.props.location.search) {
            this.updateTraits();
        }
    }

    updateTraits = () => {
        const {getTraits, setTraitsGroups, traits, getTraitsGroups, setTraits, router, setTraitsRequest} = this.props;

        setTraitsRequest(true);
        getTraits(router.location.query)
            .then( async (data: Array<ITraitState>) => {
                setTraits(data);
                if (traits.traitsGroups.length === 0) {
                    const traitsGroups: Array<ITraitGroup> = await getTraitsGroups();
                    setTraitsGroups(traitsGroups);
                }
                setTraitsRequest(false);
            });
    };

    render() {
        const {
            traits,
            deleteTrait,
            setTraitGroup,
            router: {
                location: {
                    query
                }
            }
        } = this.props;

        const selectedTraitGroupTitle = traits.traitsGroups.find((item) => item.id === Number(query.trait_group));

        return (
            <React.Fragment>
                <Helmet>
                    <title>Виды генов | Breeders Zone</title>
                </Helmet>
                <Header/>
                <Container className="mt--7" fluid>
                    <Row>
                        <Col xs={12}>
                            <Card>
                                <CardHeader className="d-flex justify-content-between align-items-center">
                                    <h1>Типы генов</h1>
                                    <div>
                                        {
                                            !query.trait_group ?
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => {
                                                        setTraitGroup({
                                                            id: 0,
                                                            title: '',
                                                            label: '',
                                                            type: 'recessive',
                                                            edit: true
                                                        })
                                                    }}
                                                >
                                                    Добавить раздел
                                                </button>
                                                : null
                                        }
                                        <Link
                                            to={{
                                                pathname: "/admin/traits/add",
                                                state: {trait_group: query.trait_group || null }
                                            }}
                                            className="btn btn-primary"
                                        >
                                            Добавить ген
                                        </Link>
                                    </div>
                                </CardHeader>
                                <Table className="align-items-center table-flush" responsive>
                                    <thead className="thead-light">
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th
                                            scope="col"
                                            className={(!traits.request && traits.data.length === 0 ) || traits.request ? 'w-100' : ''}
                                        >Название</th>
                                        <th scope="col">Тип</th>
                                        <th scope="col">Адресс</th>
                                        <th scope="col" />
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        query.trait_group ?
                                            <tr className="cursor-pointer">
                                                <th>
                                                    <Link to={`/admin/traits`} className="d-flex align-items-center">
                                                        <Media className="align-propss-center text-dark mr-2">
                                                            <i className="fas fa-lg fa-arrow-left text-blue"></i>
                                                        </Media>
                                                        <Media className="align-propss-center text-dark mr-2">
                                                            <i className="ni ni-folder-17 text-yellow"></i>
                                                        </Media>
                                                        <h4 className="m-0">{selectedTraitGroupTitle ? selectedTraitGroupTitle.title : null}</h4>
                                                    </Link>
                                                </th>
                                            </tr>
                                            : null
                                    }
                                    {
                                        !traits.request && traits.data.length === 0 ?
                                            <tr>
                                                <td></td>
                                                <td colSpan={3} className="d-flex justify-content-center">
                                                    <p className="m-0">Генов нет</p>
                                                </td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                            : null
                                    }
                                    {
                                        traits.request ?
                                            <tr>
                                                <td></td>
                                                <td colSpan={3} className="d-flex justify-content-center">
                                                    <Spinner/>
                                                </td>
                                            </tr>
                                            : (
                                                <React.Fragment>
                                                    {
                                                        !query.trait_group ?
                                                            traits.traitsGroups.map( (item, idx) => <TraitGroupRow key={"trait-group-" + idx + item.id} idx={idx} {...item}/>)
                                                            : null
                                                    }
                                                    {
                                                        traits.data.filter(item => !query.trait_group ? !item.trait_group_id : true).map( (item) => (
                                                            <tr key={'trait-' + item.id}>
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
                                                                    <Link to={`/admin/traits/${item.id}`}>
                                                                        <Media className="align-items-center text-dark">
                                                                            {item.type}
                                                                        </Media>
                                                                    </Link>
                                                                </td>
                                                                <td></td>
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
                                                </React.Fragment>
                                            )
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

const mapMethodsToProps = ({getTraits, getTraitsGroups}: IMapMethodsProps): IMapMethodsProps => ({
    getTraits,
    getTraitsGroups
});

const mapStateToProps = ({traits, router}: IMapStateProps): IStateProps => ({
    traits,
    router
});

export default connect(mapStateToProps, {setTraits, deleteTrait, setTraitsRequest, setTraitsGroups, setTraitGroup})(
    withDataService(Traits, mapMethodsToProps)
)
