import React from "react";
import Header from "../components/Headers/Header";
import {Card, CardBody, Container} from "reactstrap";

const Error404 = () => (
    <React.Fragment>
        <Header/>
        <Container className="mt--7" fluid>
            <Card>
                <CardBody>
                    <div className="d-flex justify-content-center align-items-center p-4">
                        <h1>Упс... похоже такой страницы не найденно</h1>
                    </div>
                </CardBody>
            </Card>
        </Container>
    </React.Fragment>
);

export default Error404;