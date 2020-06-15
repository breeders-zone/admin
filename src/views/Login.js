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
import React, {useState} from "react";

// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Row,
    Col, Spinner, Alert
} from "reactstrap";
import {ErrorMessage, Formik} from "formik";
import * as Yup from "yup";
import {withDataService} from "../components/hoc";
import {isLogin} from "../utils";
import {Redirect} from "react-router-dom";
import {connect} from "react-redux";
import {getUser} from "../actions";

const Login = (props) =>  {

    const [error, setError] = useState(false);
    const onSubmit = (data, actions) => {
        const { login, getUser } = props;
        login(data)
            .then( () => getUser('/admin/index'))
            .catch( () => {
                actions.setSubmitting(false);
                actions.setValues({
                    email: data.email,
                    password: ''
                });
                setError(true);
            });
    };

    return (
        <Col lg="5" md="7">
            <Card className="bg-secondary shadow border-0">
                <CardHeader>
                    <h1 className="text-center">Вход:</h1>
                </CardHeader>
                <CardBody className="px-lg-5 py-lg-5">
                    {
                        error ?
                            <Alert color="danger">
                                <p className="text-center">Неправильно введена электронная почта или пароль</p>
                            </Alert>
                            : null
                    }
                    <Formik
                        initialValues={{
                            email: '',
                            password: ''
                        }}
                        onSubmit={onSubmit}
                        validationSchema={Yup.object().shape({
                            email: Yup.string()
                                .trim()
                                .email('Пожалуйста введите элетронную почту правильно')
                                .required('Пожалуйста введите электронную почту'),
                            password: Yup.string()
                                .trim()
                                .required('Пожалуйста введите пароль')
                        })}
                    >
                        {
                            ({
                                values,
                                errors,
                                touched,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                isSubmitting,
                            }) => {
                                if (isSubmitting)
                                    return (
                                        <div className="d-flex justify-content-center">
                                            <Spinner/>
                                        </div>
                                    );

                                return (
                                    <Form onSubmit={handleSubmit} role="form">
                                        <FormGroup className="mb-3">
                                            <InputGroup className="input-group-alternative">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="ni ni-email-83" />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    placeholder="Электронная почта"
                                                    name="email"
                                                    type="email"
                                                    value={values.email}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                            </InputGroup>
                                            <ErrorMessage name="email">
                                                {
                                                    msg => <div className="text-danger">{msg}</div>
                                                }
                                            </ErrorMessage>
                                        </FormGroup>
                                        <FormGroup>
                                            <InputGroup className="input-group-alternative">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="ni ni-lock-circle-open" />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    placeholder="Пароль"
                                                    name="password"
                                                    type="password"
                                                    value={values.password}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                            </InputGroup>
                                            <ErrorMessage name="password">
                                                {
                                                    msg => <div className="text-danger">{msg}</div>
                                                }
                                            </ErrorMessage>
                                        </FormGroup>
                                        <div className="text-center">
                                            <Button className="my-2" color="primary" type="submit">
                                                Войти
                                            </Button>
                                        </div>
                                    </Form>
                                )
                            }
                        }
                    </Formik>
                </CardBody>
            </Card>
        </Col>
    );
}

const mapMethodsToProps = ({login}) => ({
    login
});

export default connect(null, {getUser})(withDataService(Login, mapMethodsToProps));
