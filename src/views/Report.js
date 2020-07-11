import React, {Component} from "react";
import Header from "../components/Headers/Header";
import Error404 from "./Error404";
import {Card, CardBody, CardHeader, Col, Container, Row, Spinner} from "reactstrap";
import {connect} from "react-redux";
import {withDataService} from "../components/hoc";
import {clearReport, setReport, setReportRequest} from "../actions";
import ProductForm from "../components/ProductForm";
import DivorceForm from "../components/DivorceForm/DivorceForm";

class report extends Component {
    state = {
        is404: false
    };

    componentDidMount() {
        const {
            getReport,
            setReport,
            setReportRequest,
            match: {params, path}
        } = this.props;

        if (path === '/admin/report/add') {
            this.setState({isEdit: true});
            return setReportRequest(false);
        }

        setReportRequest(true);
        getReport(params.id)
            .then( (data) => {
                setReport(data);
                setReportRequest(false);
            })
            .catch( (error) => {
                if (error.response.status === 404) {
                    this.setState({is404: true});
                    setReportRequest(false);
                }
            })
    }

    componentWillUnmount() {
        const {clearReport} = this.props;
        clearReport();
    }

    render() {
        const {
            report
        } = this.props;
        const {is404} = this.state;

        if (report.request)
            return (
                <React.Fragment>
                    <Header/>
                    <Container className="mt--7" fluid>
                        <Row>
                            <Col xs={12}>
                                <Card>
                                    <CardBody className="d-flex">
                                        <Spinner className="m-auto"/>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </React.Fragment>
            );

        if (is404)
            return <Error404/>;

        return (
            <React.Fragment>
                <Header/>
                <Container className="mt--7" fluid>
                    <Row className="mb-3">
                        <Col xs={12}>
                            <Card>
                                <CardHeader className="d-flex justify-content-between">
                                    <h3 className="m-0">{report.title}</h3>
                                </CardHeader>
                                <CardBody>
                                    <Row className="mb-3">
                                        <Col xs={12} md={6}>
                                            <div className="d-flex">
                                                <h3 className="mr-3">Причина:</h3>
                                                <p>{report.title}</p>
                                            </div>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <div className="d-flex">
                                                <h3 className="mr-3">Подробнее:</h3>
                                                <p>{report.description}</p>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    {
                        report.products.length > 0 ?
                            (
                                <React.Fragment>
                                    <Row>
                                        <Col xs={12} className="mb-3">
                                            <h1>Жалоба на животных:</h1>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        {
                                            report.products.map( (item) => (
                                                <Col xs={12} key={'product-' + item.id}>
                                                    <ProductForm id={item.id}/>
                                                </Col>
                                            ))
                                        }
                                    </Row>
                                </React.Fragment>
                            )
                            : null
                    }
                    {
                        report.divorces.length > 0 ?
                            (
                                <React.Fragment>
                                    <Row>
                                        <Col xs={12} className="mb-3">
                                            <h1>Жалоба на разводы:</h1>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        {
                                            report.divorces.map( (item) => (
                                                <Col xs={12} key={'divorce-' + item.id}>
                                                    <DivorceForm id={item.id}/>
                                                </Col>
                                            ))
                                        }
                                    </Row>
                                </React.Fragment>
                            )
                            : null
                    }
                    <Row className="mb-3">
                        <Col xs={12}>
                            <h1>Магазин:</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} lg={8} className="mb-3">
                            <Card>
                                <CardHeader className="d-flex justify-content-between align-items-center">
                                    <h1>{report.user.company_name}</h1>
                                </CardHeader>
                                <CardBody>
                                    <Row className="mb-3">
                                        <Col xs={12} lg={6}>
                                            <div className="d-flex">
                                                <h3 className="text-nowrap mr-3 mb-0">Название компании:</h3>
                                                <p className="m-0">{report.user.company_name}</p>
                                            </div>
                                        </Col>
                                        <Col xs={12} lg={6}>
                                            <div className="d-flex">
                                                <h3 className="text-nowrap mr-3 mb-0">Владелец:</h3>
                                                <p className="m-0">{report.user.owner}</p>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col xs={12} lg={6}>
                                            <div className="d-flex">
                                                <h3 className="text-nowrap mr-3 mb-0">Телефон:</h3>
                                                <p className="m-0">{report.user.phone}</p>
                                            </div>
                                        </Col>
                                        <Col xs={12} lg={6}>
                                            <div className="d-flex">
                                                <h3 className="text-nowrap mr-3 mb-0">Доставка:</h3>
                                                <div>
                                                    {
                                                        report.user.local_delivery ?
                                                            (
                                                                <div className="d-flex align-items-center text-dark">
                                                                    <i className="fa fa-lg fa-car"></i>
                                                                    <h3 className="ml-2 mb-0">Локальная</h3>
                                                                </div>
                                                            ) : null
                                                    }

                                                    {
                                                        report.user.regional_delivery ?
                                                            (
                                                                <div className="d-flex align-items-center text-dark">
                                                                    <i className="fa fa-lg fa-truck"></i>
                                                                    <h3 className="ml-2 mb-0">Региональная</h3>
                                                                </div>
                                                            ) : null
                                                    }

                                                    {
                                                        report.user.countrywide_delivery ?
                                                            (
                                                                <div className="d-flex align-items-center text-dark">
                                                                    <i className="fa fa-lg fa-helicopter"></i>
                                                                    <h3 className="ml-2 mb-0">По всей стране</h3>
                                                                </div>
                                                            ) : null
                                                    }
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col xs={12} className="mb-3">
                                            <div className="d-flex">
                                                <h3 className="text-nowrap mr-3 mb-0">Описание:</h3>
                                                <p className="m-0">{report.user.description}</p>
                                            </div>
                                        </Col>
                                        <Col xs={12}>
                                            <div className="d-flex">
                                                <h3 className="text-nowrap mr-3 mb-0">Политика магазина:</h3>
                                                <p className="m-0">{report.user.policity}</p>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col xs={12}>
                                            <div className="d-flex">
                                                <h3 className="text-nowrap mr-3 mb-0">Сайт:</h3>
                                                {
                                                    report.user.website ?
                                                        <a href={report.user.website}>{report.user.website}</a>
                                                        : 'Нет'
                                                }
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12} lg={3}>
                                            <div className="d-flex">
                                                <h3 className="text-nowrap mr-3 mb-0">Вконтакте:</h3>
                                                {
                                                    report.user.vk ?
                                                        <a href={report.user.vk}>{report.user.vk}</a>
                                                        : 'Нет'
                                                }
                                            </div>
                                        </Col>
                                        <Col xs={12} lg={3}>
                                            <div className="d-flex">
                                                <h3 className="text-nowrap mr-3 mb-0">Instagram:</h3>
                                                {
                                                    report.user.instagram ?
                                                        <a href={report.user.instagram}>{report.user.instagram}</a>
                                                        : 'Нет'
                                                }
                                            </div>
                                        </Col>
                                        <Col xs={12} lg={3}>
                                            <div className="d-flex">
                                                <h3 className="text-nowrap mr-3 mb-0">Facebook:</h3>
                                                {
                                                    report.user.facebook ?
                                                        <a href={report.user.facebook}>{report.user.facebook}</a>
                                                        : 'Нет'
                                                }
                                            </div>
                                        </Col>
                                        <Col xs={12} lg={3}>
                                            <div className="d-flex">
                                                <h3 className="text-nowrap mr-3 mb-0">Youtube канал:</h3>
                                                {
                                                    report.user.youtube ?
                                                        <a href={report.user.youtube}>{report.user.youtube}</a>
                                                        : 'Нет'
                                                }
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs={12} lg={4} className="mb-3">
                            <Card>
                                <CardHeader className="d-flex align-items-center">
                                    <h2 className="m-0">Логотип магазина:</h2>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col xs={12}>
                                            {
                                                report.user.logo_img_url ?
                                                    <img src={report.logo_img_url} alt="Фото профиля" className="img-fluid mb-2 rounded"/>
                                                    : <p className="mb-2">Пользователь пока не добавил своё фото</p>
                                            }
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={12}>
                            <h1>Хранитель:</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} lg={8} className="mb-3">
                            <Card>
                                <CardHeader className="d-flex justify-content-between align-items-center">
                                    <h1 className="m-0">{report._guard.name}</h1>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col xs={12} xl={4}  className="mb-3">
                                            <div className="d-flex">
                                                <h3 className="mr-3 mb-0">Имя:</h3>
                                                <p className="m-0">{report._guard.name}</p>
                                            </div>
                                        </Col>
                                        <Col xs={12} xl={4} className="mb-3">
                                            <div className="d-flex">
                                                <h3 className="mr-3 mb-0">Фамилия:</h3>
                                                <p className="m-0">{report._guard.surname}</p>
                                            </div>
                                        </Col>
                                        <Col xs={12} xl={4} className="mb-3">
                                            <div className="d-flex">
                                                <h3 className="mr-3 mb-0">Отчество:</h3>
                                                <p className="m-0">{report._guard.patronymic}</p>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col xs={12}>
                                            <div className="d-flex">
                                                <h3 className="text-nowrap mr-3 mb-0">Элетронная почта:</h3>
                                                <p className="m-0">{report._guard.email}</p>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col xs={12} md={4}>
                                            <div className="d-flex">
                                                <h3 className="mr-3">Магазин:</h3>
                                                <p className="m-0">{report._guard.is_breeder ? 'Да' : 'Нет'}</p>
                                            </div>
                                        </Col>
                                        <Col xs={12} md={4}>
                                            <div className="d-flex">
                                                <h3 className="mr-3">Активен:</h3>
                                                <p className="m-0">{report._guard.active ? 'Да' : 'Нет'}</p>
                                            </div>
                                        </Col>
                                        <Col xs={12} md={4}>
                                            <div className="d-flex">
                                                <h3 className="mr-3">Хранитель:</h3>
                                                <p className="m-0">{report._guard.is_guard ? 'Да' : 'Нет'}</p>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col xs={12}>
                                            <div className="d-flex">
                                                <h3 className="text-nowrap mr-3">О себе:</h3>
                                                <p className="m-0">{report._guard.about}</p>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs={12} lg={4}>
                            <Card>
                                <CardHeader className="d-flex align-items-center">
                                    <h2 className="m-0">Фото профиля:</h2>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col xs={12}>
                                            {
                                                report._guard.profile_img ?
                                                    <img src={report._guard.profile_img} alt="Фото профиля" className="img-fluid mb-2 rounded"/>
                                                    : <p className="mb-2">Пользователь пока не добавил своё фото</p>
                                            }
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        )
    }
}

const mapMethodsToProps = ({getReport}) => ({
    getReport
});

const mapStateToProps = ({report}) => ({
    report
});

export default connect(mapStateToProps, {setReport, setReportRequest, clearReport})(
    withDataService(report, mapMethodsToProps)
)