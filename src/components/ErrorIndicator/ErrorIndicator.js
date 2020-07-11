import React from "react";
import {Card, CardBody, Col, Container, Row} from "reactstrap";

const ErrorIndicator = (props) => {
    return (
        <React.Fragment>
            {
                props.header ?
                    <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
                        <Container fluid>
                            <div className="header-body">
                                {/* Card stats */}
                                <Row>
                                    <Col xs={12}>
                                        <Card>
                                            <CardBody className="d-flex justify-content-center">
                                                <h2>Похоже у нас проблемы</h2>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        </Container>
                    </div>
                    : null
            }
            {
                props.header ?
                    (
                        <Container className="mt--7" fluid>
                            <Row>
                                <Col xs={12}>
                                    <Card>
                                        <CardBody className="d-flex flex-column align-items-center">
                                            <i className="ni ni-4x ni-support-16"></i>
                                            <h1>Упс...</h1>
                                            <p>Не предвиденная ошибка, попробуйте перезагрузить страницу</p>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </Container>
                    )
                    : (
                        <Row>
                            <Col xs={12}>
                                <Card>
                                    <CardBody className="d-flex flex-column align-items-center">
                                        <i className="ni ni-4x ni-support-16"></i>
                                        <h1>Упс...</h1>
                                        <p>Не предвиденная ошибка, попробуйте перезагрузить страницу</p>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    )
            }

        </React.Fragment>
    )
};

export default ErrorIndicator;