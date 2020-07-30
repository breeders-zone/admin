import React, {Component} from "react";
import Header from "../components/Headers/Header";
import Error404 from "./Error404";
import {Alert, Card, CardBody, CardHeader, Col, Container, Form, Input, Row, Spinner, Table} from "reactstrap";
import {Formik} from "formik";
import {connect} from "react-redux";
import {withDataService} from "../components/hoc";
import {clearLocality, setLocalities, setLocality, setLocalityRequest} from "../actions";
import Helmet from "react-helmet";

class Locality extends Component {
    state = {
        isEdit: false,
        is404: false
    };

    componentDidMount() {
        const {
            getLocality,
            setLocality,
            setLocalityRequest,
            match: {params, path}
        } = this.props;

        if (path === '/admin/localities/add') {
            this.setState({isEdit: true});
            return setLocalityRequest(false);
        }

        setLocalityRequest(true);
        getLocality(params.id)
            .then( (data) => {
                setLocality(data);
                setLocalityRequest(false);
            })
            .catch( (error) => {
                if (error.response.status === 404) {
                    this.setState({is404: true});
                }
            })
    }

    componentWillUnmount() {
        const {clearLocality} = this.props;
        clearLocality();
    }

    onSubmit = (data, actions) => {
        const {
            locality,
            setLocality,
            setLocalities,
            setLocalityData,
            updateLocality,
            getLocality,
            getLocalities,
            match: {params, path}
        } = this.props;

        if (path === '/admin/localities/add') {
            setLocalityData(data)
                .then( ({message}) => {
                    actions.setStatus(message);
                    actions.setValues({
                        ...locality
                    });
                    actions.setSubmitting(false)
                })
                .then( () => {
                    getLocalities()
                        .then( (data) => setLocalities(data))
                })
                .catch( (error) => {
                    if (error.response.status === 422) {
                        const errors = error.response.data.errors;

                        actions.setErrors({
                            title: errors.title ? errors.title[0] : '',
                            kinds: errors.kinds ? errors.kinds[0] : '',
                            subcategories: errors.subcategories ? errors.subcategories[0] : ''
                        });
                    }

                    actions.setSubmitting(false);
                });

            return;
        }

        updateLocality(params.id, data)
            .then( async ({message}) => {
                this.setState({isEdit: false});
                const data = await getLocality(params.id);
                setLocality(data);
                actions.setStatus(message);
                actions.setValues(data);
                actions.setSubmitting(false)
            })
            .then( () => {
                getLocalities()
                    .then( (data) => setLocalities(data))
            })
            .catch( (error) => {
                if (error.response.status === 422) {
                    const errors = error.response.data.errors;

                    actions.setErrors({
                        title: errors.title ? errors.title[0] : '',
                        kinds: errors.kinds ? errors.kinds[0] : '',
                        subcategories: errors.subcategories ? errors.subcategories[0] : ''
                    });
                }
            });
    };

    render() {
        const {
            locality,
            allKinds,
            subcategories,
            match: {path}
        } = this.props;
        const {isEdit, is404} = this.state;

        if (locality.request)
            return (
                <React.Fragment>
                    <Helmet>
                        <title>Загрузка | Breeders Zone</title>
                    </Helmet>
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
                {
                    path === '/admin/localities/:id' ?
                        <Helmet>
                            <title>{!locality.request ?  locality.title : 'Загрузка'} | Breeders Zone</title>
                        </Helmet>
                        : null
                }
                {
                    path === '/admin/localities/add' ?
                        <Helmet>
                            <title>Добавить локалитет | Breeders Zone</title>
                        </Helmet>
                        : null
                }
                <Header/>
                <Container className="mt--7" fluid>
                    <Formik
                        initialValues={{
                            ...locality
                        }}
                        onSubmit={this.onSubmit}
                    >
                        {
                            ({
                                 handleSubmit,
                                 handleChange,
                                 handleBlur,
                                 values,
                                 setValues,
                                 setFieldValue,
                                 isSubmitting,
                                 status
                            }) => {
                                if (isSubmitting)
                                    return (
                                        <Row>
                                            <Col xs={12}>
                                                <Card>
                                                    <CardBody className="d-flex">
                                                        <Spinner className="m-auto"/>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                    );

                                return (
                                    <Form onSubmit={handleSubmit}>
                                        {
                                            status ?
                                                <Alert color="success" className="mb-3">
                                                    {status}
                                                </Alert>
                                                : null
                                        }
                                        <Row className="mb-3">
                                            <Col xs={12}>
                                                <Card>
                                                    <CardHeader className="d-flex justify-content-between">
                                                        {
                                                            path !== "/admin/localities/add" ?
                                                                (
                                                                    <React.Fragment>
                                                                        <h3 className="m-0">{locality.title}</h3>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-primary"
                                                                            onClick={() => {
                                                                                if (isEdit) {
                                                                                    setValues(locality);
                                                                                }
                                                                                this.setState({isEdit: !isEdit})
                                                                            }}
                                                                        >
                                                                            { !isEdit ? 'Редактировать' : 'Отмена'}
                                                                        </button>
                                                                    </React.Fragment>
                                                                )
                                                                :  <h3 className="m-0">Добавить подкатегорию</h3>
                                                        }
                                                    </CardHeader>
                                                    <CardBody>
                                                        <div className="d-flex mb-3">
                                                            <h3 className="mr-3">Название:</h3>
                                                            {
                                                                isEdit ?
                                                                    <Input
                                                                        className="form-control-alternative"
                                                                        name="title"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.title}
                                                                    />
                                                                    : <p>{locality.title}</p>
                                                            }
                                                        </div>
                                                        {
                                                            isEdit ?
                                                                <Row className="justify-content-center">
                                                                    <Col xs={8} md={4} className="d-flex justify-content-center">
                                                                        <button
                                                                            type="submit"
                                                                            className="btn btn-primary"
                                                                        >
                                                                            Сохранить
                                                                        </button>
                                                                    </Col>
                                                                </Row>
                                                                : null
                                                        }
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <Row className="justify-content-center">
                                            <Col xs={12} md={6} lg={4}>
                                                <Card>
                                                    <CardHeader className="d-flex justify-content-between">
                                                        <h1>Категории</h1>
                                                        {
                                                            isEdit && allKinds.length > 0 ?
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-primary"
                                                                    onClick={() => {
                                                                        const kindsValues = values.kinds;
                                                                        kindsValues.push(allKinds[0]);
                                                                        setFieldValue('kinds', kindsValues)
                                                                    }}
                                                                >
                                                                    Добавить
                                                                </button>
                                                                : null
                                                        }
                                                    </CardHeader>
                                                    <Table className="align-items-center table-flush" responsive>
                                                        <thead className="thead-light">
                                                        <tr>
                                                            <th scope="col">Русское название</th>
                                                            {
                                                                isEdit ?
                                                                    <th className="col"></th>
                                                                    : null
                                                            }
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {
                                                            !isEdit ?
                                                                locality.kinds.map( (item) => <tr key={"kinds-" + item.id}><td>{item.title_rus}</td></tr>)
                                                                : values.kinds.map( (item, idx) => (
                                                                    <tr key={"locality-" + idx}>
                                                                        <td className="w-100">
                                                                            <Input
                                                                                className="form-control-alternative"
                                                                                name={"kind-" + idx}
                                                                                value={item.id}
                                                                                type="select"
                                                                                onChange={(e) => {
                                                                                    const kindsValues = values.kinds;
                                                                                    kindsValues[idx] = allKinds.find((item) => item.id === Number(e.target.value));
                                                                                    setFieldValue('kinds', kindsValues);
                                                                                }}
                                                                            >
                                                                                {
                                                                                    allKinds.map( (item) => <option key={"kind-" + idx + item.id} value={item.id}>{item.title_rus}</option>)
                                                                                }
                                                                            </Input>
                                                                        </td>
                                                                        <td onClick={() => {
                                                                            const kindsValue = values.kinds;
                                                                            kindsValue.splice(idx, 1);
                                                                            setFieldValue('kinds', kindsValue);
                                                                        }}>
                                                                            <i className="ni ni-lg ni-fat-remove"></i>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                        }
                                                        </tbody>
                                                    </Table>
                                                </Card>
                                            </Col>
                                            <Col xs={12} md={6} lg={4}>
                                                <Card>
                                                    <CardHeader className="d-flex justify-content-between">
                                                        <h1>Подкатегории</h1>
                                                        {
                                                            isEdit &&  subcategories.length > 0 ?
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-primary"
                                                                    onClick={() => {
                                                                        const subcategoriesValues = values.subcategories;
                                                                        subcategoriesValues.push(subcategories[0]);
                                                                        setFieldValue('subcategories', subcategoriesValues);
                                                                    }}
                                                                >
                                                                    Добавить
                                                                </button>
                                                                : null
                                                        }
                                                    </CardHeader>
                                                    <Table className="align-items-center table-flush" responsive>
                                                        <thead className="thead-light">
                                                        <tr>
                                                            <th scope="col">Название</th>
                                                            {
                                                                isEdit ?
                                                                    <th className="col"></th>
                                                                    : null
                                                            }
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {
                                                            !isEdit ?
                                                                locality.subcategories.map( (item) => <tr key={'subcategory-' + item.id}><td>{item.title}</td></tr>)
                                                                : values.subcategories.map( (item, idx) => (
                                                                    <tr key={"subcategory-" + idx}>
                                                                        <td className="w-100">
                                                                            <Input
                                                                                className="form-control-alternative"
                                                                                name={"subcategory-" + idx}
                                                                                value={item.id}
                                                                                type="select"
                                                                                onChange={(e) => {
                                                                                    const subcategoriesValues = values.subcategories;
                                                                                    subcategoriesValues[idx] = subcategories.find((item) => item.id === Number(e.target.value));
                                                                                    setFieldValue('subcategories', subcategoriesValues);
                                                                                }}
                                                                            >
                                                                                {
                                                                                    subcategories.map( (item) => <option key={"subcategory-" + idx + item.id} value={item.id}>{item.title}</option>)
                                                                                }
                                                                            </Input>
                                                                        </td>
                                                                        <td onClick={() => {
                                                                            const subcategories = values.subcategories;
                                                                            subcategories.splice(idx, 1);
                                                                            setFieldValue('subcategories', subcategories);
                                                                        }}>
                                                                            <i className="ni ni-lg ni-fat-remove"></i>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                        }
                                                        </tbody>
                                                    </Table>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Form>
                                )
                            }
                        }

                    </Formik>
                </Container>
            </React.Fragment>
        )
    }
}

const mapMethodsToProps = ({getLocality, updateLocality, setLocality: setLocalityData, getLocalities}) => ({
    getLocality,
    updateLocality,
    setLocalityData,
    getLocalities
});

const mapStateToProps = ({kinds: {all: allKinds}, subcategories: {all: subcategories}, locality}) => ({
    allKinds,
    subcategories,
    locality
});

export default connect(mapStateToProps, {setLocality, setLocalityRequest, clearLocality, setLocalities})(
    withDataService(Locality, mapMethodsToProps)
)
