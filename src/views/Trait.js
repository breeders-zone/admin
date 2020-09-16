import React, {Component} from "react";
import Header from "../components/Headers/Header";
import Error404 from "./Error404";
import {Alert, Card, CardBody, CardHeader, Col, Container, Form, Input, Row, Spinner} from "reactstrap";
import {Formik} from "formik";
import {connect} from "react-redux";
import {withDataService} from "../components/hoc";
import {clearTrait, setTrait, setTraitRequest} from "../actions";
import Helmet from "react-helmet";
import {setTraitsGroups} from "../actions";

class Trait extends Component {
    state = {
        isEdit: false,
        is404: false
    };

    componentDidMount() {
        const {
            getTrait,
            setTrait,
            setTraitRequest,
            getTraitsGroups,
            setTraitsGroups,
            traitsGroups = [],
            match: {params, path}
        } = this.props;

        if (path === '/admin/traits/add') {
            this.setState({isEdit: true});
            if (traitsGroups.length === 0) {
                getTraitsGroups()
                    .then((data) => {
                        setTraitsGroups(data);
                        setTraitRequest(false)
                    });
                return;
            }
            setTraitRequest(false);
            return;
        }

        setTraitRequest(true);
        getTrait(params.id)
            .then( async (data) => {
                if (traitsGroups.length === 0) {
                    const traitsGroupsData = await getTraitsGroups();
                    setTraitsGroups(traitsGroupsData);
                }
                setTrait(data);
                setTraitRequest(false);
            })
            .catch( (error) => {
                if (error.response.status === 404) {
                    this.setState({is404: true});
                }
            })
    }

    componentWillUnmount() {
        const {clearTrait} = this.props;
        clearTrait();
    }

    onSubmit = (data, actions) => {
        const {
            traits,
            setTrait,
            setTraitData,
            updateTrait,
            getTrait,
            match: {params, path}
        } = this.props;

        if (path === '/admin/traits/add') {
            setTraitData(data)
                .then( ({message}) => {
                    actions.setStatus(message);
                    actions.setValues({
                        ...traits
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

        updateTrait(params.id, data)
            .then( async ({message}) => {
                this.setState({isEdit: false});
                const data = await getTrait(params.id);
                setTrait(data);
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
            trait,
            traitsGroups,
            match: {path},
            location
        } = this.props;
        const {isEdit, is404} = this.state;

        const trait_group = trait.trait_group_id ? trait.trait_group_id : 'null';

        if (trait.request)
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
                    path === '/admin/subcategories/:id' ?
                        <Helmet>
                            <title>{!trait.request ?  trait.title : 'Загрузка'} | Breeders Zone</title>
                        </Helmet>
                        : null
                }
                {
                    path === '/admin/subcategories/add' ?
                        <Helmet>
                            <title>Добавить вид гена | Breeders Zone</title>
                        </Helmet>
                        : null
                }
                <Header/>
                <Container className="mt--7" fluid>
                    <Formik
                        initialValues={{
                            ...trait,
                            trait_group_id: location.state && location.state.trait_group ? location.state.trait_group : trait_group
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
                                                            path !== "/admin/traits/add" ?
                                                                (
                                                                    <React.Fragment>
                                                                        <h3 className="m-0">{trait.title}</h3>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-primary"
                                                                            onClick={() => {
                                                                                if (isEdit) {
                                                                                    setValues(trait);
                                                                                }
                                                                                this.setState({isEdit: !isEdit})
                                                                            }}
                                                                        >
                                                                            { !isEdit ? 'Редактировать' : 'Отмена'}
                                                                        </button>
                                                                    </React.Fragment>
                                                                )
                                                                :  <h3 className="m-0">Добавить вид гена</h3>
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
                                                                            : <p>{trait.title}</p>
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
                                                                            : <p>{trait.type}</p>
                                                                    }
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <Row className="mb-3 justify-content-end">
                                                            <Col xs={12} md={6}>
                                                                <div className="d-flex">
                                                                    <h3 className="mr-3">Раздел:</h3>
                                                                    {
                                                                        isEdit ?
                                                                            <Input
                                                                                className="form-control-alternative"
                                                                                name="trait_group_id"
                                                                                type="select"
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                value={values.trait_group_id}
                                                                            >
                                                                                <option value="null">Нет раздела</option>
                                                                                {
                                                                                    traitsGroups.map((item) => <option value={item.id}>{item.title} ({item.type})</option>)
                                                                                }
                                                                            </Input>
                                                                            : <p>{trait.trait_group ? trait.trait_group.title : 'Нет'}</p>
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

const mapMethodsToProps = ({getTrait, updateTrait, setTrait: setTraitData, getTraitsGroups}) => ({
    getTrait,
    updateTrait,
    setTraitData,
    getTraitsGroups
});

const mapStateToProps = ({trait, traits: {traitsGroups}}) => ({
    trait,
    traitsGroups
});

export default connect(mapStateToProps, {setTrait, setTraitRequest, clearTrait, setTraitsGroups})(
    withDataService(Trait, mapMethodsToProps)
)
