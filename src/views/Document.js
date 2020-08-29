import React, {Component} from "react";
import Header from "../components/Headers/Header";
import Error404 from "./Error404";
import {Alert, Card, CardBody, CardHeader, Col, Container, Form, Input, Row, Spinner} from "reactstrap";
import {Formik} from "formik";
import {connect} from "react-redux";
import {EditorState, ContentState, convertToRaw } from "draft-js";
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import {withDataService} from "../components/hoc";
import {clearDocument, setDocument, setDocumentRequest} from "../actions";
import Editor from "../components/Editor";
import Helmet from "react-helmet";

class Document extends Component {
    state = {
        isEdit: false,
        is404: false
    };

    componentDidMount() {
        const {
            getDocument,
            setDocument,
            setDocumentRequest,
            match: {params, path}
        } = this.props;

        if (path === '/admin/documents/add') {
            this.setState({isEdit: true});
            return setDocumentRequest(false);
        }

        setDocumentRequest(true);
        getDocument(params.label)
            .then( (data) => {
                setDocument(data);
                setDocumentRequest(false);
            })
            .catch( (error) => {
                if (error.response.status === 404) {
                    this.setState({is404: true});
                }
            })
    }

    componentWillUnmount() {
        const {clearDocument} = this.props;
        clearDocument();
    }

    onSubmit = (data, actions) => {
        const {
            document,
            setDocument,
            setDocumentData,
            updateDocument,
            getDocument,
            match: {params, path}
        } = this.props;

        const rawContentState = convertToRaw(data.description.getCurrentContent());
        const description = draftToHtml(rawContentState);

        if (document.label === data.label) {
            delete  data.label;
        }

        if (path === '/admin/documents/add') {
            setDocumentData({
                ...data,
                description
            })
                .then( ({message}) => {
                    actions.setStatus(message);
                    actions.setValues({
                        ...document,
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

        updateDocument(params.label, {
            ...data,
            description
        })
            .then( async ({message}) => {
                this.setState({isEdit: false});
                const data = await getDocument(params.label);
                setDocument(data);
                actions.setStatus(message);
                const blocksFromHtml = htmlToDraft(data.description ? data.description : '');
                const { contentBlocks, entityMap } = blocksFromHtml;
                const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
                const editorState = EditorState.createWithContent(contentState);
                actions.setValues({
                    ...data,
                    description: editorState
                });
                actions.setSubmitting(false)
            })
            .catch( (error) => {
                if (error.response.status === 422) {
                    const errors = error.response.data.errors;

                    actions.setErrors({
                        label: errors.label ? errors.label[0] : '',
                        title: errors.title ? errors.title[0] : '',
                        description: errors.description ? errors.description[0] : '',
                        user_agree: errors.user_agree ? errors.user_agree[0] : ''
                    });
                }
            });
    };

    render() {
        const {
            document,
            match: {path}
        } = this.props;
        const {isEdit, is404} = this.state;

        const blocksFromHtml = htmlToDraft(document.description ? document.description : '');
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        const editorState = EditorState.createWithContent(contentState);

        if (document.request)
            return (
                <React.Fragment>
                    {
                        path === '/admin/documents/:id' ?
                            <Helmet>
                                <title>{!document.request ?  document.title : 'Загрузка'} | Breeders Zone</title>
                            </Helmet>
                            : null
                    }
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
                    path === '/admin/documents/:label' ?
                        <Helmet>
                            <title>{!document.request ?  document.title : 'Загрузка'} | Breeders Zone</title>
                        </Helmet>
                        : null
                }
                {
                    path === '/admin/documents/add' ?
                        <Helmet>
                            <title>Добавить документ | Breeders Zone</title>
                        </Helmet>
                        : null
                }
                <Header/>
                <Container className="mt--7" fluid>
                    <Formik
                        initialValues={{
                            ...document,
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
                                                            path !== "/admin/documents/add" ?
                                                                (
                                                                    <React.Fragment>
                                                                        <h3 className="m-0">{document.title}</h3>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-primary"
                                                                            onClick={() => {
                                                                                if (isEdit) {
                                                                                    setValues(document);
                                                                                }
                                                                                this.setState({isEdit: !isEdit})
                                                                            }}
                                                                        >
                                                                            { !isEdit ? 'Редактировать' : 'Отмена'}
                                                                        </button>
                                                                    </React.Fragment>
                                                                )
                                                                :  <h3 className="m-0">Добавить документ</h3>
                                                        }
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row className="mb-3">
                                                            <Col xs={12} md={4}>
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
                                                                            : <p>{document.title}</p>
                                                                    }
                                                                </div>
                                                            </Col>
                                                            <Col xs={12} md={4}>
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
                                                                            : <p>{document.label}</p>
                                                                    }
                                                                </div>
                                                            </Col>
                                                            <Col xs={12} md={4}>
                                                                <div className="d-flex">
                                                                    <h3 className="mr-3">Соглашение при регистрации:</h3>
                                                                    {
                                                                        isEdit ?
                                                                            <React.Fragment>
                                                                                <Input
                                                                                    id="user_agree_true"
                                                                                    className="form-control-alternative position-absolute"
                                                                                    name="user_agree"
                                                                                    type="radio"
                                                                                    onChange={() => setFieldValue('user_agree', true)}
                                                                                    onBlur={handleBlur}
                                                                                    style={{
                                                                                        opacity: 0
                                                                                    }}
                                                                                />
                                                                                <Input
                                                                                    id="user_agree_false"
                                                                                    className="form-control-alternative position-absolute"
                                                                                    name="user_agree"
                                                                                    type="radio"
                                                                                    onChange={() => setFieldValue('user_agree', false)}
                                                                                    onBlur={handleBlur}
                                                                                    style={{
                                                                                        opacity: 0
                                                                                    }}
                                                                                />
                                                                                <label htmlFor="user_agree_true" className={values.user_agree ? 'mr-2 font-weight-bold' : 'mr-2'}>Да</label>
                                                                                <label htmlFor="user_agree_false" className={!values.user_agree ? 'font-weight-bold' : ''}>Нет</label>
                                                                            </React.Fragment>
                                                                            : <p>{document.user_agree ? 'Да' : 'Нет'}</p>
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
                                                                                    <CardBody>
                                                                                        <div dangerouslySetInnerHTML={ { __html: document.description } }></div>
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

const mapMethodsToProps = ({getDocument, updateDocument, setDocument: setDocumentData}) => ({
    getDocument,
    updateDocument,
    setDocumentData
});

const mapStateToProps = ({document}) => ({
    document
});

export default connect(mapStateToProps, {setDocument, setDocumentRequest, clearDocument})(
    withDataService(Document, mapMethodsToProps)
)
