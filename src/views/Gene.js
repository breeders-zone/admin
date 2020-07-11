import React, {Component} from "react";
import Header from "../components/Headers/Header";
import Error404 from "./Error404";
import {Alert, Card, CardBody, CardHeader, Col, Container, Form, Input, Row, Spinner, Table} from "reactstrap";
import {Formik} from "formik";
import {connect} from "react-redux";
import {withDataService} from "../components/hoc";
import {clearGene, setGene, setGeneRequest} from "../actions";

class Gene extends Component {
    state = {
        isEdit: false,
        is404: false
    };

    componentDidMount() {
        const {
            getGene,
            setGene,
            setGeneRequest,
            match: {params, path}
        } = this.props;

        if (path === '/admin/genes/add') {
            this.setState({isEdit: true});
            return setGeneRequest(false);
        }

        setGeneRequest(true);
        getGene(params.id)
            .then( (data) => {
                setGene(data);
                setGeneRequest(false);
            })
            .catch( (error) => {
                if (error.response.status === 404) {
                    this.setState({is404: true});
                }
            })
    }

    componentWillUnmount() {
        const {clearGene} = this.props;
        clearGene();
    }

    onSubmit = (data, actions) => {
        const {
            gene,
            setGene,
            setGeneData,
            updateGene,
            getGene,
            match: {params, path}
        } = this.props;

        if (path === '/admin/genes/add') {
            setGeneData(data)
                .then( ({message}) => {
                    actions.setStatus(message);
                    actions.setValues({
                        ...gene
                    });
                    actions.setSubmitting(false)
                })
                .catch( (error) => {
                    if (error.response.status === 422) {
                        const errors = error.response.data.errors;

                        actions.setErrors({
                            title: errors.title ? errors.title[0] : '',
                            type: errors.type ? errors.type[0] : '',
                            kinds: errors.kinds ? errors.kinds[0] : ''
                        });
                    }

                    actions.setSubmitting(false);
                });

            return;
        }

        updateGene(params.id, data)
            .then( async ({message}) => {
                this.setState({isEdit: false});
                const data = await getGene(params.id);
                setGene(data);
                actions.setStatus(message);
                actions.setValues(data);
                actions.setSubmitting(false)
            })
            .catch( (error) => {
                if (error.response.status === 422) {
                    const errors = error.response.data.errors;

                    actions.setErrors({
                        title: errors.title ? errors.title[0] : '',
                        type: errors.type ? errors.type[0] : '',
                        kinds: errors.kinds ? errors.kinds[0] : ''
                    });
                }
            });
    };

    render() {
        const {
            gene,
            allKinds,
            match: {path}
        } = this.props;
        const {isEdit, is404} = this.state;

        if (gene.request)
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
                            ...gene
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
                                                            path !== "/admin/genes/add" ?
                                                                (
                                                                    <React.Fragment>
                                                                        <h3 className="m-0">{gene.title}</h3>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-primary"
                                                                            onClick={() => {
                                                                                if (isEdit) {
                                                                                    setValues(gene);
                                                                                }
                                                                                this.setState({isEdit: !isEdit})
                                                                            }}
                                                                        >
                                                                            { !isEdit ? 'Редактировать' : 'Отмена'}
                                                                        </button>
                                                                    </React.Fragment>
                                                                )
                                                                :  <h3 className="m-0">Добавить ген</h3>
                                                        }
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row className="mb-3">
                                                            <Col xs={12} md={6}>
                                                                <div className="d-flex">
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
                                                                            : <p>{gene.title}</p>
                                                                    }
                                                                </div>
                                                            </Col>
                                                            <Col xs={12} md={6}>
                                                                <div className="d-flex">
                                                                    <h3 className="mr-3">Тип:</h3>
                                                                    {
                                                                        isEdit ?
                                                                            <Input
                                                                                className="form-control-alternative"
                                                                                name="type"
                                                                                type="select"
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                value={values.type}
                                                                            >
                                                                                <option value="recessive">Recessive</option>
                                                                                <option value="dominant">Dominant</option>
                                                                                <option value="other">Other</option>
                                                                            </Input>
                                                                            : <p>{gene.type}</p>
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
                                                                gene.kinds.map( (item, idx) => <tr key={"kinds-" + idx}><td>{item.title_rus}</td></tr>)
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
                                                                                    allKinds.map( (item) => <option key={"kind-" + idx} value={item.id}>{item.title_rus}</option>)
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

const mapMethodsToProps = ({getGene, updateGene, setGene: setGeneData}) => ({
    getGene,
    updateGene,
    setGeneData
});

const mapStateToProps = ({kinds: {all: allKinds}, gene}) => ({
    allKinds,
    gene
});

export default connect(mapStateToProps, {setGene, setGeneRequest, clearGene})(
    withDataService(Gene, mapMethodsToProps)
)