import React, {Component} from "react";
import Header from "../components/Headers/Header";
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
import {withDataService} from "../components/hoc";
import {deleteFaq, setFaqs, setFaqsRequest} from "../actions";

class Faqs extends Component {
    componentDidMount() {
        this.updateFaqs();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.location.search !== this.props.location.search) {
            this.updateFaqs();
        }
    }

    updateFaqs = () => {
        const {getFaqs, setFaqs, router, setFaqsRequest} = this.props;

        setFaqsRequest(true);
        getFaqs(router.location.query)
            .then( (data) => {
                setFaqs(data);
                setFaqsRequest(false);
            });
    };

    render() {
        const { faqs, deleteFaq } = this.props;

        return (
            <React.Fragment>
                <Header/>
                <Container className="mt--7" fluid>
                    <Row>
                        <Col xs={12}>
                            <Card>
                                <CardHeader className="d-flex justify-content-between align-items-center">
                                    <h1>FAQ</h1>
                                    <Link to="/admin/faq/add" className="btn btn-primary">
                                        Добавить
                                    </Link>
                                </CardHeader>
                                <Table className="align-items-center table-flush" responsive>
                                    <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Адрес</th>
                                        <th scope="col">Название</th>
                                        <th scope="col">Есть на главной</th>
                                        <th scope="col" />
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        faqs.request ?
                                            <tr>
                                                <td></td>
                                                <td colSpan="3" className="d-flex justify-content-center">
                                                    <Spinner/>
                                                </td>
                                            </tr>
                                            : faqs.data.map( (item) => (
                                                <tr key={item.label}>
                                                    <th scope="row">
                                                        <Link to={`/admin/faq/${item.label}`}>
                                                            <Media className="align-items-center text-dark">
                                                                {item.label}
                                                            </Media>
                                                        </Link>
                                                    </th>
                                                    <td>
                                                        <Link to={`/admin/faq/${item.label}`}>
                                                            <Media className="align-items-center text-dark">
                                                                {item.title}
                                                            </Media>
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        <Link to={`/admin/genes/${item.label}`}>
                                                            <Media className="align-items-center text-dark">
                                                                {item.is_index ? 'Да' : 'Нет'}
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

                                                                <Link to={`/admin/faq/${item.label}`}>
                                                                    <DropdownItem>
                                                                        Подробнее
                                                                    </DropdownItem>
                                                                </Link>
                                                                <Link to={`/admin/faq/${item.label}`}>
                                                                    <DropdownItem>
                                                                        Редактировать
                                                                    </DropdownItem>
                                                                </Link>
                                                                <DropdownItem
                                                                    href="#"
                                                                    onClick={e => {
                                                                        e.preventDefault();
                                                                        deleteFaq(item.label)
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

const mapMethodsToProps = ({getFaqs}) => ({
    getFaqs
});

const mapStateToProps = ({faqs, router}) => ({
    faqs,
    router
});

export default connect(mapStateToProps, {setFaqs, deleteFaq, setFaqsRequest})(
    withDataService(Faqs, mapMethodsToProps)
)
