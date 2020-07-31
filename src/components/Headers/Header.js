/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// reactstrap components
import {Card, CardBody, CardTitle, Container, Row, Col, Spinner} from "reactstrap";
import {withDataService} from "../hoc";
import {
    setHeaderNewProducts,
    setHeaderNewProductsRequest,
    setHeaderNewUsers,
    setHeaderNewUsersRequest
} from "../../actions";
import {connect} from "react-redux";

class Header extends React.Component {
    componentDidMount() {
        this.getNewUsersPooling();
        this.getNewProductsPooling();
    }

    getNewUsersPooling = () => {
        const {getNewUsers, setHeaderNewUsers, setHeaderNewUsersRequest, header: {newUsers}} = this.props;
        if(!newUsers.total) {
            setHeaderNewUsersRequest(true);
            getNewUsers()
                .then((data) => {
                    setHeaderNewUsers(data);
                    setHeaderNewUsersRequest(false);
                })
                .catch(() => setTimeout(() => this.getNewUsersPooling(), 3000));
        }
    };

    getNewProductsPooling = () => {
        const {getNewProducts, setHeaderNewProducts, setHeaderNewProductsRequest, header: {newProducts}} = this.props;
        if(!newProducts.total) {
            setHeaderNewProductsRequest(true);
            getNewProducts()
                .then((data) => {
                    setHeaderNewProducts(data);
                    setHeaderNewProductsRequest(false);
                })
                .catch(() => setTimeout(() => this.getNewProductsPooling(), 3000));
        }
    };

    render() {
        const {header} = this.props;
        const {
            newUsers,
            newProducts
        } = header;
        return (
            <>
                <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
                    <Container fluid>
                        <div className="header-body">
                            {/* Card stats */}
                            <Row>
                                <Col lg="6" xl="3">
                                    <Card className="card-stats mb-4 mb-xl-0">
                                        <CardBody>
                                            <Row>
                                                <div className="col">
                                                    <CardTitle
                                                        tag="h5"
                                                        className="text-uppercase text-muted mb-0"
                                                    >
                                                        Traffic
                                                    </CardTitle>
                                                    <span className="h2 font-weight-bold mb-0">
                            350,897
                          </span>
                                                </div>
                                                <Col className="col-auto">
                                                    <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                                                        <i className="fas fa-chart-bar" />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <p className="mt-3 mb-0 text-muted text-sm">
                        <span className="text-success mr-2">
                          <i className="fa fa-arrow-up" /> 3.48%
                        </span>{" "}
                                                <span className="text-nowrap">Since last month</span>
                                            </p>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col lg="6" xl="3">
                                    <Card className="card-stats mb-4 mb-xl-0">
                                        <CardBody>
                                            <Row>
                                                <div className="col">
                                                    <CardTitle
                                                        tag="h5"
                                                        className="text-uppercase text-muted mb-0"
                                                    >
                                                        Пользователи
                                                    </CardTitle>
                                                    <span className="h2 font-weight-bold mb-0">
                                                        {
                                                            newUsers.request ?
                                                                <Spinner className="text-muted my-2"/>
                                                                : newUsers.total
                                                        }
                                                    </span>
                                                </div>
                                                <Col className="col-auto">
                                                    <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                                                        <i className="fas fa-users" />
                                                    </div>
                                                </Col>
                                            </Row>

                                            {
                                                newUsers.request ?
                                                    (
                                                        <div className="mt-3 mb-0 text-muted text-sm">
                                                            <div className="mr-2">
                                                                <Spinner size="sm"/>
                                                            </div>
                                                        </div>
                                                    )
                                                    : (
                                                        <p className="mt-3 mb-0 text-muted text-sm">
                                                            <span className={"mr-2" + (((100 * newUsers.mount) / newUsers.total).toFixed(2) ? ' text-success' : '')}>
                                                              <i className={((100 * newUsers.mount) / newUsers.total).toFixed(2) ? 'fas fa-arrow-up' : 'fas fa-minus'} /> {((100 * newUsers.mount) / newUsers.total).toFixed(2)}%
                                                            </span>
                                                            <span className="text-nowrap">За последний месяц</span>
                                                        </p>
                                                    )
                                            }
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col lg="6" xl="3">
                                    <Card className="card-stats mb-4 mb-xl-0">
                                        <CardBody>
                                            <Row>
                                                <div className="col">
                                                    <CardTitle
                                                        tag="h5"
                                                        className="text-uppercase text-muted mb-0"
                                                    >
                                                        Животные
                                                    </CardTitle>
                                                    <span className="h2 font-weight-bold mb-0">
                                                        {
                                                            newProducts.request ?
                                                                <Spinner className="text-muted my-2"/>
                                                                : newProducts.total
                                                        }
                                                    </span>
                                                </div>
                                                <Col className="col-auto">
                                                    <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                                                        <i className="fas fa-chart-pie" />
                                                    </div>
                                                </Col>
                                            </Row>
                                            {
                                                newProducts.request ?
                                                    (
                                                        <div className="mt-3 mb-0 text-muted text-sm">
                                                            <div className="mr-2">
                                                                <Spinner size="sm"/>
                                                            </div>
                                                        </div>
                                                    )
                                                    : (
                                                        <p className="mt-3 mb-0 text-muted text-sm">
                                                            <span
                                                                className={"mr-2" + (((100 * newProducts.mount) / newProducts.total).toFixed(2) ? ' text-success' : '')}>
                                                                <i className={((100 * newProducts.mount) / newProducts.total).toFixed(2) ? 'fas fa-arrow-up' : 'fas fa-minus'}/> {((100 * newProducts.mount) / newProducts.total).toFixed(2)}%
                                                            </span>
                                                            <span className="text-nowrap">За последний месяц</span>
                                                        </p>
                                                    )
                                            }
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col lg="6" xl="3">
                                    <Card className="card-stats mb-4 mb-xl-0">
                                        <CardBody>
                                            <Row>
                                                <div className="col">
                                                    <CardTitle
                                                        tag="h5"
                                                        className="text-uppercase text-muted mb-0"
                                                    >
                                                        Performance
                                                    </CardTitle>
                                                    <span className="h2 font-weight-bold mb-0">
                            49,65%
                          </span>
                                                </div>
                                                <Col className="col-auto">
                                                    <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                                                        <i className="fas fa-percent" />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <p className="mt-3 mb-0 text-muted text-sm">
                        <span className="text-success mr-2">
                          <i className="fas fa-arrow-up" /> 12%
                        </span>{" "}
                                                <span className="text-nowrap">Since last month</span>
                                            </p>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </Container>
                </div>
            </>
        );
    }
}

const mapMethodsToProps = ({getNewUsers, getNewProducts}) => ({
    getNewUsers,
    getNewProducts
});

const mapStateToProps = ({header}) => ({
    header
});

export default connect(mapStateToProps, {
    setHeaderNewUsers,
    setHeaderNewUsersRequest,
    setHeaderNewProducts,
    setHeaderNewProductsRequest
})(
    withDataService(Header, mapMethodsToProps)
);
