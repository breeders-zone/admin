import React, {Component} from "react";
import Header from "../components/Headers/Header";
import {Alert, Card, CardBody, CardHeader, Col, Container, Form, Input, Row, Spinner, Table} from "reactstrap";
import {Formik} from "formik";
import Error404 from "./Error404";
import {connect} from "react-redux";
import {withDataService} from "../components/hoc";
import {clearSubcategory, setSubcategories, setSubcategory, setSubcategoryRequest} from "../actions";
import subcategory from "../reducers/subcategory";

class Subcategory extends Component {
    state = {
        isEdit: false,
        is404: false
    };

    componentDidMount() {
        const {
            getSubcategory,
            setSubcategory,
            setSubcategoryRequest,
            match: {params, path}
        } = this.props;

        if (path === '/admin/subcategories/add') {
            setSubcategoryRequest(false);
            return this.setState({isEdit: true});
        }

        setSubcategoryRequest(true);
        getSubcategory(params.id)
            .then( (data) => {
                setSubcategory(data);
                setSubcategoryRequest(false);
            })
            .catch( (error) => {
                if (error.response.status === 404) {
                    this.setState({is404: true})
                }
            })
    }

    componentWillUnmount() {
        const {clearSubcategory} = this.props;
        clearSubcategory();
    }

    onSubmit = (data, actions) => {
        const {
            subcategory,
            updateSubcategory,
            getSubcategory,
            getSubcategories,
            setSubcategories,
            setSubcategory,
            setSubcategoryData,
            match: {params, path}
        } = this.props;

        if (path === '/admin/subcategories/add') {
            setSubcategoryData(data)
                .then( ({message}) => {
                    actions.setValues({
                        ...subcategory
                    });
                    actions.setStatus(message);
                    actions.setSubmitting(false);
                })
                .then(() => {
                    getSubcategories()
                        .then( (data) => setSubcategories(data));
                })
                .catch( (error) => {
                    const errors = error.response.data.errors;
                    if (error.response.status === 422) {
                        actions.setErrors({
                            title: errors.title ? errors.title[0] : '',
                            kind_id: errors.kind_id ? errors.kind_id[0] : '',
                            localities: errors.localities ? errors.localities[0] : '',
                        });
                    }
                    actions.setSubmitting(false);
                });
            return;
        }

        updateSubcategory(params.id, data)
            .then( async ({message}) => {
                const data = await getSubcategory(params.id);
                setSubcategory(data);
                this.setState({isEdit: false});
                actions.setStatus(message);
                actions.setSubmitting(false);
                actions.setSubmitting(false);
            })
            .then(() => {
                getSubcategories()
                    .then( (data) => setSubcategories(data));
            })
            .catch( (error) => {
                if (error.response.status === 422) {
                    const errors = error.response.data.errors;
                    actions.setErrors({
                        title: errors.title ? errors.title[0] : '',
                        kind_id: errors.kind_id ? errors.kind_id[0] : '',
                        localities: errors.localities ? errors.localities[0] : '',
                    });
                }
                actions.setSubmitting(false);
            })
    };

    render() {
        const {
            subcategory,
            allKinds,
            localities,
            match: {path}
        } = this.props;
        const {isEdit, is404} = this.state;

        if (subcategory.request)
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
                    <Formik
                        initialValues={{
                            ...subcategory
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
                                        <Row className="justify-content-center">
                                            <Col xs={12} className="mb-3">
                                                <Card>
                                                    <CardHeader className="d-flex justify-content-between align-items-center">
                                                        {
                                                            path !== "/admin/subcategories/add" ?
                                                                (
                                                                    <React.Fragment>
                                                                        <h3 className="m-0">{subcategory.title}</h3>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-primary"
                                                                            onClick={() => {
                                                                                if (isEdit) {
                                                                                    setValues(subcategory);
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
                                                        <Row className="mb-3">
                                                            <Col xs={6}>
                                                                <div className="d-flex">
                                                                    <h3 className="text-nowrap mr-3">Название:</h3>
                                                                    {
                                                                        isEdit ?
                                                                            <Input
                                                                                className="form-control-alternative"
                                                                                name="title"
                                                                                value={values.title}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                            />
                                                                            : <p>{subcategory.title}</p>
                                                                    }
                                                                </div>
                                                            </Col>
                                                        </Row>
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
                                            <Col xs={12}  md={6} lg={4}>
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
                                                                        setFieldValue('kinds', kindsValues);
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
                                                                subcategory.kinds.map( (item) => <tr key={"kinds-" + item.id}><td>{item.title_rus}</td></tr>)
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
                                                        <h1>Локалитеты</h1>
                                                        {
                                                            isEdit && localities.length > 0 ?
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-primary"
                                                                    onClick={() => {
                                                                        const localitiesValues = values.localities;
                                                                        localitiesValues.push(localities[0]);
                                                                        setFieldValue('localities', localitiesValues);
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
                                                                subcategory.localities.map( (item) => <tr key={"localities-" + item.id}><td>{item.title}</td></tr>)
                                                                : values.localities.map( (item, idx) => (
                                                                    <tr key={"localities-" + idx}>
                                                                        <td className="w-100">
                                                                            <Input
                                                                                className="form-control-alternative"
                                                                                name={"locality-" + idx}
                                                                                value={item.id}
                                                                                type="select"
                                                                                onChange={(e) => {
                                                                                    const localitiesValues = values.localities;
                                                                                    localitiesValues[idx] = localities.find((item) => item.id === Number(e.target.value));
                                                                                    setFieldValue('localities', localitiesValues);
                                                                                }}
                                                                            >
                                                                                {
                                                                                    localities.map( (item) => <option key={"localities-" + idx + item.id} value={item.id}>{item.title}</option>)
                                                                                }
                                                                            </Input>
                                                                        </td>
                                                                        <td onClick={() => {
                                                                            const localities = values.localities;
                                                                            localities.splice(idx, 1);
                                                                            setFieldValue('localities', localities);
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

const mapMethodsToProps = ({getSubcategory, getSubcategories, updateSubcategory, setSubcategory: setSubcategoryData }) => ({
    getSubcategory,
    updateSubcategory,
    setSubcategoryData,
    getSubcategories
});

const mapStateToProps = ({kinds: {all: allKinds}, subcategory, localities: {all: localities}}) => ({
    allKinds,
    subcategory,
    localities
});

export default connect(mapStateToProps, {setSubcategory, setSubcategoryRequest, setSubcategories, clearSubcategory})(
    withDataService(Subcategory, mapMethodsToProps)
)