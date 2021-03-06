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
    Container,
    Row,
    Col, Spinner, Alert
} from "reactstrap";
// core components
import UserHeader from "../components/Headers/UserHeader";
import {ErrorMessage, Formik} from "formik";
import * as Yup from "yup";
import {connect} from "react-redux";
import {withDataService} from "../components/hoc";
import {setProfile} from "../actions";
import Helmet from "react-helmet";

const Profile = (props) => {
    const {profile} = props;

    const [oldPasswordError, setOldPasswordError] = useState();

    const onSubmit = (data, actions) => {
        const { updateProfile, setProfile, profile } = props;

        if (data.email === profile.email) {
            delete data.email
        }

        updateProfile(profile.id, data)
            .then( ({message}) => {
                setProfile({
                    ...profile,
                    ...data,
                    email: profile.email
                });
                actions.setStatus(message);
                actions.setValues({
                    name: profile.name || '',
                    surname: profile.surname || '',
                    email: profile.email || '',
                    ...data,
                    change_password: false,
                    old_password: '',
                    password: '',
                    password_confirmation: ''
                });
                actions.setSubmitting(false);
            })
            .catch((err) => {
                const errors = err.response.data.errors;
                setOldPasswordError(errors.old_password[0]);
                actions.setValues({
                    ...profile,
                    old_password: '',
                    password: data.password,
                    password_confirmation: data.password_confirmation,
                });
                actions.setErrors(errors);
                actions.setSubmitting(false);
            })
    };

    if (profile.request) {
        return (
            <React.Fragment>
                <Helmet>
                    <title>?????????????? ???????????? | Breeders Zone</title>
                </Helmet>
                <UserHeader />
                {/* Page content */}
                <Container className="mt--7" fluid>
                    <Row className="justify-content-center">
                        <Col className="order-xl-1" xl="12">
                            <Card className="bg-secondary shadow">
                                <CardHeader className="bg-white border-0">
                                    <Row className="align-items-center">
                                        <Col xs="8">
                                            <h3 className="mb-0">?????? ??????????????</h3>
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <CardBody className="d-flex justify-content-center p--7">
                                    <Spinner/>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            <UserHeader/>
            {/* Page content */}
            <Container className="mt--7" fluid>
                <Row className="justify-content-center">
                    <Col className="order-xl-1" xl="12">
                        <Card className="bg-secondary shadow">
                            <CardHeader className="bg-white border-0">
                                <Row className="align-items-center">
                                    <Col xs="8">
                                        <h3 className="mb-0">?????? ??????????????</h3>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <Formik
                                    initialValues={{
                                        name: profile.name || '',
                                        surname: profile.surname || '',
                                        email: profile.email || '',
                                        old_password: '',
                                        password: '',
                                        password_confirmation: ''
                                    }}
                                    onSubmit={onSubmit}
                                    validationSchema={Yup.object().shape({
                                        name: Yup.string()
                                            .trim()
                                            .required('???????????????????? ?????????????? ???????? ??????'),
                                        surname: Yup.string()
                                            .trim()
                                            .required('???????????????????? ?????????????? ???????? ????????????'),
                                        email: Yup.string()
                                            .trim()
                                            .email('???????????????????? ?????????????? ???????????????????? ?????????? ??????????????????')
                                            .required('???????????????????? ?????????????? ?????????????????????? ??????????'),
                                        change_password: Yup.boolean(),
                                        password: Yup.string()
                                            .when(
                                                'change_password',
                                                {
                                                    is: true,
                                                    then: Yup.string().trim()
                                                        .min(8, '???????????? ???????????? ?????????????????? ?????????????? 8 ????????????????')
                                                        .test('match', '???????????? ???? ??????????????????', function (password) {
                                                            return password === this.parent.password_confirmation
                                                        })
                                                        .required('???????????????????? ?????????????? ????????????')
                                                }),
                                        password_confirmation: Yup.string()
                                            .when(
                                                'change_password',
                                                {
                                                    is: true,
                                                    then: Yup.string().trim().required('???????????????????? ?????????????????????? ????????????')
                                                }),
                                        old_password: Yup.string()
                                            .when(
                                                'change_password',
                                                {
                                                    is: true,
                                                    then: Yup.string().trim().required('???????????????????? ?????????????? ???????????? ????????????')
                                                }),

                                    })}
                                >
                                    {
                                        ({
                                             values,
                                             errors,
                                             touched,
                                             hasChanged,
                                             hasErrors,
                                             handleChange,
                                             handleBlur,
                                             handleSubmit,
                                             isSubmitting,
                                             status
                                         }) => {
                                            if (isSubmitting)
                                                return (
                                                    <div className="d-flex justify-content-center">
                                                        <Spinner/>
                                                    </div>
                                                );

                                            return (
                                                <Form onSubmit={handleSubmit} autoComplete="off">
                                                    {
                                                        status ?
                                                            <Alert color="success">
                                                                {status}
                                                            </Alert>
                                                            : null
                                                    }
                                                    {
                                                        oldPasswordError ?
                                                            <Alert color="danger">
                                                                {oldPasswordError}
                                                            </Alert>
                                                            : null
                                                    }
                                                    <h6 className="heading-small text-muted mb-4">
                                                        ???????? ????????????
                                                    </h6>
                                                    <div className="pl-lg-4">
                                                        <Row>
                                                            <Col lg="6">
                                                                <FormGroup>
                                                                    <label
                                                                        className="form-control-label"
                                                                        htmlFor="input-first-name"
                                                                    >
                                                                        ??????
                                                                    </label>
                                                                    <Input
                                                                        className="form-control-alternative"
                                                                        id="input-first-name"
                                                                        placeholder="??????"
                                                                        type="text"
                                                                        name="name"
                                                                        value={values.name}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                    />
                                                                    <ErrorMessage name="name">
                                                                        {
                                                                            msg => <div className="text-danger">{msg}</div>
                                                                        }
                                                                    </ErrorMessage>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col lg="6">
                                                                <FormGroup>
                                                                    <label
                                                                        className="form-control-label"
                                                                        htmlFor="input-last-name"
                                                                    >
                                                                        ??????????????
                                                                    </label>
                                                                    <Input
                                                                        className="form-control-alternative"
                                                                        id="input-last-name"
                                                                        placeholder="??????????????"
                                                                        type="text"
                                                                        name="surname"
                                                                        value={values.surname}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                    />
                                                                    <ErrorMessage name="surname">
                                                                        {
                                                                            msg => <div className="text-danger">{msg}</div>
                                                                        }
                                                                    </ErrorMessage>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        <Row className="justify-content-center">
                                                            <Col lg="6">
                                                                <FormGroup>
                                                                    <label
                                                                        className="form-control-label"
                                                                        htmlFor="input-email"
                                                                    >
                                                                        ?????????????????????? ??????????
                                                                    </label>
                                                                    <Input
                                                                        className="form-control-alternative"
                                                                        id="input-email"
                                                                        placeholder="admin@admin.com"
                                                                        type="email"
                                                                        name="email"
                                                                        value={values.email}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        autoComplete="off"
                                                                    />
                                                                    <ErrorMessage name="email">
                                                                        {
                                                                            msg => <div className="text-danger">{msg}</div>
                                                                        }
                                                                    </ErrorMessage>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col lg="6">
                                                                <Card className="form-group" style={{marginTop:28.8}}>
                                                                    <CardBody style={{padding: 12}}>
                                                                        <div className="d-flex justify-content-between align-items-center w-100">
                                                                            <p className="form-control-label m-0">????????????</p>
                                                                            <label className="form-control-label m-0" htmlFor="change_password">{!values.change_password ? '????????????????' : '????????????????'}</label>
                                                                            <Input
                                                                                style={{
                                                                                    opacity: 0
                                                                                }}
                                                                                id="change_password"
                                                                                type="checkbox"
                                                                                name="change_password"
                                                                                value={values.change_password}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                            />
                                                                        </div>
                                                                        {
                                                                            values.change_password ?
                                                                                (
                                                                                    <React.Fragment>
                                                                                        <FormGroup className="mt-2">
                                                                                            <label
                                                                                                className="form-control-label"
                                                                                                htmlFor="old_password"
                                                                                            >
                                                                                                ???????????? ????????????
                                                                                            </label>
                                                                                            <Input
                                                                                                className="form-control-alternative"
                                                                                                id="old_password"
                                                                                                placeholder="???????????? ????????????"
                                                                                                type="password"
                                                                                                name="old_password"
                                                                                                value={values.old_password}
                                                                                                onChange={handleChange}
                                                                                                onBlur={handleBlur}
                                                                                            />
                                                                                            <ErrorMessage name="old_password">
                                                                                                {
                                                                                                    msg => <div className="text-danger">{msg}</div>
                                                                                                }
                                                                                            </ErrorMessage>
                                                                                        </FormGroup>
                                                                                        <FormGroup>
                                                                                            <label
                                                                                                className="form-control-label"
                                                                                                htmlFor="password"
                                                                                            >
                                                                                                ?????????? ????????????
                                                                                            </label>
                                                                                            <Input
                                                                                                className="form-control-alternative"
                                                                                                id="password"
                                                                                                placeholder="?????????? ????????????"
                                                                                                type="password"
                                                                                                name="password"
                                                                                                value={values.password}
                                                                                                onChange={handleChange}
                                                                                                onBlur={handleBlur}
                                                                                            />
                                                                                            <ErrorMessage name="password">
                                                                                                {
                                                                                                    msg => <div className="text-danger">{msg}</div>
                                                                                                }
                                                                                            </ErrorMessage>
                                                                                        </FormGroup>
                                                                                        <FormGroup>
                                                                                            <label
                                                                                                className="form-control-label"
                                                                                                htmlFor="password_confirmation"
                                                                                            >
                                                                                                ?????????????????????? ????????????
                                                                                            </label>
                                                                                            <Input
                                                                                                className="form-control-alternative"
                                                                                                id="password_confirmation"
                                                                                                placeholder="?????????????????????? ????????????"
                                                                                                type="password"
                                                                                                name="password_confirmation"
                                                                                                value={values.password_confirmation}
                                                                                                onChange={handleChange}
                                                                                                onBlur={handleBlur}
                                                                                            />
                                                                                            <ErrorMessage name="password_confirmation">
                                                                                                {
                                                                                                    msg => <div className="text-danger">{msg}</div>
                                                                                                }
                                                                                            </ErrorMessage>
                                                                                        </FormGroup>
                                                                                    </React.Fragment>
                                                                                )
                                                                                : null
                                                                        }
                                                                    </CardBody>
                                                                </Card>
                                                            </Col>
                                                        </Row>
                                                        <Row className="justify-content-center">
                                                            <Col xs={4} className="text-center">
                                                                <Button
                                                                    className={"my-2" + (Object.keys(errors).length !== 0 ? ' disabled' : '')}
                                                                    color="primary"
                                                                    type="submit"
                                                                    disabled={Object.keys(errors).length !== 0}
                                                                >
                                                                    ??????????????????
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </Form>
                                            )
                                        }
                                    }
                                </Formik>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    );
};

const mapMethodsToProps = ({updateProfile}) => ({
    updateProfile
});

const mapStateToProps = ({profile}) => ({
    profile
});

export default connect(mapStateToProps, {setProfile})(withDataService(Profile, mapMethodsToProps));
