import React, {Component} from "react";
import Header from "../components/Headers/Header";
import Error404 from "./Error404";
import {Alert, Card, CardBody, CardHeader, Col, Container, Form, Input, Row, Spinner} from "reactstrap";
import {Formik} from "formik";
import {connect} from "react-redux";
import {EditorState} from "draft-js";
import {withDataService} from "../components/hoc";
import {clearFaq, setFaq, setFaqRequest} from "../actions";
import Editor from "../components/Editor";
import Helmet from "react-helmet";
import {stateFromHTML} from "draft-js-import-html";
import {stateToHTML} from "draft-js-export-html";

class Faq extends Component {
    state = {
        isEdit: false,
        is404: false
    };

    componentDidMount() {
        const {
            getFaq,
            setFaq,
            setFaqRequest,
            match: {params, path}
        } = this.props;

        if (path === '/admin/faq/add') {
            this.setState({isEdit: true});
            return setFaqRequest(false);
        }

        setFaqRequest(true);
        getFaq(params.label)
            .then( (data) => {
                setFaq(data);
                setFaqRequest(false);
            })
            .catch( (error) => {
                if (error.response.status === 404) {
                    this.setState({is404: true});
                }
            })
    }

    componentWillUnmount() {
        const {clearFaq} = this.props;
        clearFaq();
    }

    onSubmit = (data, actions) => {
        const {
            faq,
            setFaq,
            setFaqData,
            updateFaq,
            getFaq,
            history,
            match: {params, path}
        } = this.props;

        const description = stateToHTML(data.description.getCurrentContent());

        if (faq.label === data.label) {
            delete  data.label;
        }

        if (path === '/admin/faq/add') {
            setFaqData({
                ...data,
                description
            })
                .then( ({message}) => {
                    actions.setStatus(message);
                    actions.setValues({
                        ...faq,
                        description: EditorState.createEmpty()
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

        updateFaq(params.label, {
            ...data,
            description
        })
            .then( async ({message}) => {
                this.setState({isEdit: false});
                const faq = await getFaq(data.label ? data.label : params.label);
                setFaq(faq);
                actions.setStatus(message);
                const editorState = EditorState.createWithContent((stateFromHTML(document.description ? document.description : '')));
                actions.setValues({
                    faq,
                    description: editorState
                });
                actions.setSubmitting(false);
                if (data.label) {
                    history.push(`/admin/documents/${data.label}`, {message})
                }
            })
            .catch( (error) => {
                if (error.response.status === 422) {
                    const errors = error.response.data.errors;

                    actions.setErrors({
                        label: errors.label ? errors.label[0] : '',
                        title: errors.title ? errors.title[0] : '',
                        description: errors.description ? errors.description[0] : '',
                        in_index: errors.in_index ? errors.in_index[0] : ''
                    });
                }
            });
    };

    render() {
        const {
            faq,
            location,
            match: {path}
        } = this.props;
        const {isEdit, is404} = this.state;

        const editorState = EditorState.createWithContent((stateFromHTML(document.description ? document.description : '')));

        if (faq.request)
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
                    path === '/admin/faq/:label' ?
                        <Helmet>
                            <title>{!faq.request ?  faq.title : 'Загрузка'} | Breeders Zone</title>
                        </Helmet>
                        : null
                }
                {
                    path === '/admin/faq/add' ?
                        <Helmet>
                            <title>Добавить FAQ | Breeders Zone</title>
                        </Helmet>
                        : null
                }
                <Header/>
                <Container className="mt--7" fluid>
                    <Formik
                        initialValues={{
                            ...faq,
                            sort: faq.sort || '',
                            description: editorState
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
                                            status || (location.state && location.state.message) ?
                                                <Alert color="success" className="mb-3">
                                                    {status ? status : location.state.message}
                                                </Alert>
                                                : null
                                        }
                                        <Row className="mb-3">
                                            <Col xs={12}>
                                                <Card>
                                                    <CardHeader className="d-flex justify-content-between">
                                                        {
                                                            path !== "/admin/faq/add" ?
                                                                (
                                                                    <React.Fragment>
                                                                        <h3 className="m-0">{faq.title}</h3>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-primary"
                                                                            onClick={() => {
                                                                                if (isEdit) {
                                                                                    setValues({
                                                                                        ...faq,
                                                                                        description: editorState
                                                                                    });
                                                                                }
                                                                                this.setState({isEdit: !isEdit})
                                                                            }}
                                                                        >
                                                                            { !isEdit ? 'Редактировать' : 'Отмена'}
                                                                        </button>
                                                                    </React.Fragment>
                                                                )
                                                                :  <h3 className="m-0">Добавить FAQ</h3>
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
                                                                            : <p>{faq.title}</p>
                                                                    }
                                                                </div>
                                                            </Col>
                                                            <Col xs={12} md={6}>
                                                                <div className="d-flex">
                                                                    <h3 className="mr-3">Адрес:</h3>
                                                                    {
                                                                        isEdit ?
                                                                            <Input
                                                                                className="form-control-alternative"
                                                                                name="label"
                                                                                placeholder="how-to или what-is"
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                value={values.label}
                                                                            />
                                                                            : <p>{faq.label}</p>
                                                                    }
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <Row className="mb-3">
                                                            <Col xs={12} md={6}>
                                                                <div className="d-flex">
                                                                    <h3 className="mr-3">Сортировка:</h3>
                                                                    {
                                                                        isEdit ?
                                                                            <Input
                                                                                className="form-control-alternative"
                                                                                name="sort"
                                                                                placeholder="Желательно указывать 100, 200 и тд (не обязательно)"
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                value={values.sort}
                                                                            />
                                                                            : <p>{faq.sort}</p>
                                                                    }
                                                                </div>
                                                            </Col>
                                                            <Col xs={12} md={6}>
                                                                <div className="d-flex">
                                                                    <h3 className="mr-3">Есть на главной:</h3>
                                                                    {
                                                                        isEdit ?
                                                                            <React.Fragment>
                                                                                <Input
                                                                                    id="in_index_true"
                                                                                    className="form-control-alternative position-absolute"
                                                                                    name="in_index"
                                                                                    type="radio"
                                                                                    onChange={() => setFieldValue('in_index', true)}
                                                                                    onBlur={handleBlur}
                                                                                    style={{
                                                                                        opacity: 0
                                                                                    }}
                                                                                />
                                                                                <Input
                                                                                    id="in_index_false"
                                                                                    className="form-control-alternative position-absolute"
                                                                                    name="in_index"
                                                                                    type="radio"
                                                                                    onChange={() => setFieldValue('in_index', false)}
                                                                                    onBlur={handleBlur}
                                                                                    style={{
                                                                                        opacity: 0
                                                                                    }}
                                                                                />
                                                                                <label htmlFor="in_index_true" className={values.in_index ? 'mr-2 font-weight-bold' : 'mr-2'}>Да</label>
                                                                                <label htmlFor="in_index_false" className={!values.in_index ? 'font-weight-bold' : ''}>Нет</label>
                                                                            </React.Fragment>
                                                                            : <p>{faq.in_index ? 'Да' : 'Нет'}</p>
                                                                    }
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <Row className="mb-3">
                                                            <Col xs={12}>
                                                                <div className="d-flex">
                                                                    <h3 className="mr-3">Подробнее:</h3>
                                                                    {
                                                                        isEdit ?
                                                                            <Editor state={values.description} onChange={(state) => setFieldValue('description', state)}/>
                                                                            : (
                                                                                <Card className="w-100">
                                                                                    <CardBody className="document">
                                                                                        <div dangerouslySetInnerHTML={ { __html: faq.description } }></div>
                                                                                    </CardBody>
                                                                                </Card>
                                                                            )
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

const mapMethodsToProps = ({getFaq, updateFaq, setFaq: setFaqData}) => ({
    getFaq,
    updateFaq,
    setFaqData
});

const mapStateToProps = ({faq}) => ({
    faq
});

export default connect(mapStateToProps, {setFaq, setFaqRequest, clearFaq})(
    withDataService(Faq, mapMethodsToProps)
)
