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
import {deleteDocument, setDocuments, setDocumentsRequest} from "../actions";
import Helmet from "react-helmet";

class Documents extends Component {
    componentDidMount() {
        this.updateDocuments();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.location.search !== this.props.location.search) {
            this.updateDocuments();
        }
    }

    updateDocuments = () => {
        const {getDocuments, setDocuments, router, setDocumentsRequest} = this.props;

        setDocumentsRequest(true);
        getDocuments(router.location.query)
            .then( (data) => {
                setDocuments(data);
                setDocumentsRequest(false);
            });
    };

    render() {
        const { documents, deleteDocument } = this.props;

        return (
            <React.Fragment>
                <Helmet>
                    <title>Документы | Breeders Zone</title>
                </Helmet>
                <Header/>
                <Container className="mt--7" fluid>
                    <Row>
                        <Col xs={12}>
                            <Card>
                                <CardHeader className="d-flex justify-content-between align-items-center">
                                    <h1>Документы</h1>
                                    <Link to="/admin/documents/add" className="btn btn-primary">
                                        Добавить
                                    </Link>
                                </CardHeader>
                                <Table className="align-items-center table-flush" responsive>
                                    <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Адрес</th>
                                        <th scope="col" className={(!documents.request && documents.data.length === 0) || documents.request  ? 'w-100' : null}>Название</th>
                                        <th scope="col">Соглашение с регистрацией</th>
                                        <th scope="col" />
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        !documents.request && documents.data.length === 0 ?
                                            <tr>
                                                <td></td>
                                                <td className="d-flex justify-content-center">
                                                    <p className="m-0">Документов нет.</p>
                                                </td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                            : null
                                    }
                                    {
                                        documents.request ?
                                            <tr>
                                                <td></td>
                                                <td colSpan="3" className="d-flex justify-content-center">
                                                    <Spinner/>
                                                </td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                            : documents.data.map( (item) => (
                                                <tr key={item.label}>
                                                    <th scope="row">
                                                        <Link to={`/admin/documents/${item.label}`}>
                                                            <Media className="align-items-center text-dark">
                                                                {item.label}
                                                            </Media>
                                                        </Link>
                                                    </th>
                                                    <td>
                                                        <Link to={`/admin/documents/${item.label}`}>
                                                            <Media className="align-items-center text-dark">
                                                                {item.title}
                                                            </Media>
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        <Link to={`/admin/documents/${item.label}`}>
                                                            <Media className="align-items-center text-dark">
                                                                {item.user_agree ? 'Да' : 'Нет'}
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

                                                                <Link to={`/admin/documents/${item.label}`}>
                                                                    <DropdownItem>
                                                                        Подробнее
                                                                    </DropdownItem>
                                                                </Link>
                                                                <Link to={`/admin/documents/${item.label}`}>
                                                                    <DropdownItem>
                                                                        Редактировать
                                                                    </DropdownItem>
                                                                </Link>
                                                                <DropdownItem
                                                                    href="#"
                                                                    onClick={e => {
                                                                        e.preventDefault();
                                                                        deleteDocument(item.label)
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

const mapMethodsToProps = ({getDocuments}) => ({
    getDocuments
});

const mapStateToProps = ({documents, router}) => ({
    documents,
    router
});

export default connect(mapStateToProps, {setDocuments, deleteDocument, setDocumentsRequest})(
    withDataService(Documents, mapMethodsToProps)
)
