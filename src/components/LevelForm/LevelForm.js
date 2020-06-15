import React, {Component} from "react";
import Header from "../Headers/Header";
import Error404 from "../../views/Error404";
import {Alert, Card, CardBody, CardHeader, Col, Container, Form, Input, Row, Spinner} from "reactstrap";
import {Formik} from "formik";
import {connect} from "react-redux";
import {withDataService} from "../hoc";
import {clearLevel, setLevel, setLevelRequest} from "../../actions";
import {withRouter} from "react-router-dom";
import Dropzone from "react-dropzone";

class LevelForm extends Component {
    state = {
        isEdit: false,
        is404: false
    };

    isGuardLevel = !!this.props.match.path.match(/\/admin\/guard-levels/gi);
    isAdd = !!this.props.match.path.match(/\/admin\/(guard-levels|breeder-levels)\/add/gi);

    componentDidMount() {
        const {
            getGuardLevel,
            getBreederLevel,
            setLevel,
            setLevelRequest,
            match: {params}
        } = this.props;

        if (this.isAdd) {
            this.setState({isEdit: true});
            return setLevelRequest(false);
        }

        setLevelRequest(true);
        if (this.isGuardLevel) {
            getGuardLevel(params.id)
                .then( (data) => {
                    setLevel(data);
                    setLevelRequest(false);
                })
                .catch( (error) => {
                    if (error.response.status === 404) {
                        this.setState({is404: true});
                    }
                })
        } else {
            getBreederLevel(params.id)
                .then( (data) => {
                    setLevel(data);
                    setLevelRequest(false);
                })
                .catch( (error) => {
                    if (error.response.status === 404) {
                        this.setState({is404: true});
                    }
                })
        }
    }

    componentWillUnmount() {
        const {clearLevel} = this.props;
        clearLevel();
    }

    onSubmit = (data, actions) => {
        const {
            level,
            setLevel,
            setGuardLevel,
            setBreederLevel,
            updateGuardLevel,
            updateBreederLevel,
            getGuardLevel,
            getBreederLevel,
            match: {params}
        } = this.props;

        if (this.isAdd) {
            if (this.isGuardLevel) {
                setGuardLevel(data)
                    .then( ({message}) => {
                        actions.setStatus(message);
                        actions.setValues({
                            ...level,
                            logo: null,
                            preview: []
                        });
                        actions.setSubmitting(false)
                    })
                    .catch( (error) => {
                        if (error.response.status === 422) {
                            const errors = error.response.data.errors;

                            actions.setErrors({
                                level: errors.level ? errors.level[0] : '',
                                title: errors.title ? errors.title[0] : '',
                                logo_src: errors.logo_src ? errors.logo_src[0] : ''
                            });
                        }

                        actions.setSubmitting(false);
                    });

                return;
            } else {
                setBreederLevel(data)
                    .then( ({message}) => {
                        actions.setStatus(message);
                        actions.setValues({
                            ...level,
                            logo: null,
                            preview: []
                        });
                        actions.setSubmitting(false)
                    })
                    .catch( (error) => {
                        if (error.response.status === 422) {
                            const errors = error.response.data.errors;

                            actions.setErrors({
                                level: errors.level ? errors.level[0] : '',
                                title: errors.title ? errors.title[0] : '',
                                logo_src: errors.logo_src ? errors.logo_src[0] : ''
                            });
                        }

                        actions.setSubmitting(false);
                    });

                return;
            }
        }

        if (this.isGuardLevel) {
            updateGuardLevel(params.id, data)
                .then( async ({message}) => {
                    this.setState({isEdit: false});
                    const data = await getGuardLevel(params.id);
                    setLevel(data);
                    actions.setStatus(message);
                    actions.setValues({
                        ...data,
                        logo: null,
                        preview: []
                    });
                    actions.setSubmitting(false)
                })
                .catch( (error) => {
                    if (error.response.status === 422) {
                        const errors = error.response.data.errors;

                        actions.setErrors({
                            level: errors.level ? errors.level[0] : '',
                            title: errors.title ? errors.title[0] : '',
                            logo_src: errors.logo_src ? errors.logo_src[0] : ''
                        });
                    }
                });
        } else {
            updateBreederLevel(params.id, data)
                .then( async ({message}) => {
                    this.setState({isEdit: false});
                    const data = await getBreederLevel(params.id);
                    setLevel(data);
                    actions.setStatus(message);
                    actions.setValues({
                        ...data,
                        logo: null,
                        preview: []
                    });
                    actions.setSubmitting(false)
                })
                .catch( (error) => {
                    if (error.response.status === 422) {
                        const errors = error.response.data.errors;

                        actions.setErrors({
                            level: errors.level ? errors.level[0] : '',
                            title: errors.title ? errors.title[0] : '',
                            logo_src: errors.logo_src ? errors.logo_src[0] : ''
                        });
                    }
                });
        }


    };

    render() {
        const {
            level,
            match: {path}
        } = this.props;
        const {isEdit, is404} = this.state;

        if (level.request)
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

        if (is404)
            return (
                <Card>
                    <CardBody>
                        <div className="d-flex justify-content-center align-items-center p-4">
                            <h1>Упс... похоже такой страницы не найденно</h1>
                        </div>
                    </CardBody>
                </Card>
            );

        return (
            <Formik
                initialValues={{
                    ...level,
                    logo: null,
                    preview: []
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
                                    <Col xs={12} lg={8}>
                                        <Card>
                                            <CardHeader className="d-flex justify-content-between">
                                                {
                                                    !this.isAdd ?
                                                        (
                                                            <React.Fragment>
                                                                <h1 className="m-0">{level.title}</h1>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-primary"
                                                                    onClick={() => {
                                                                        if (isEdit) {
                                                                            setValues(level);
                                                                        }
                                                                        this.setState({isEdit: !isEdit})
                                                                    }}
                                                                >
                                                                    { !isEdit ? 'Редактировать' : 'Отмена'}
                                                                </button>
                                                            </React.Fragment>
                                                        )
                                                        :  <h3 className="m-0">Добавить уровень {this.isGuardLevel ? 'хранителя.' : 'магазина.'}</h3>
                                                }
                                            </CardHeader>
                                            <CardBody>
                                                <Row className="mb-3">
                                                    <Col xs={12} md={6}>
                                                        <div className="d-flex">
                                                            <h3 className="mr-3">Уровень:</h3>
                                                            {
                                                                isEdit ?
                                                                    <Input
                                                                        className="form-control-alternative"
                                                                        name="level"
                                                                        type="number"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.level}
                                                                    />
                                                                    : <p>{level.level}</p>
                                                            }
                                                        </div>
                                                    </Col>
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
                                                                    : <p>{level.title}</p>
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
                                    <Col xs={12} lg={4}>
                                        <Card>
                                            <CardBody>
                                                <h2>Фото:</h2>
                                                {
                                                    level.logo_src ?
                                                        <div className="mb-2">
                                                            <img src={level.logo_src} alt={level.title} className="img-fluid rounded"/>
                                                        </div>
                                                        : <p>К сожалению вы не добавили фото</p>

                                                }
                                                {
                                                    isEdit ?
                                                        <Dropzone
                                                            multiple={false}
                                                            onDrop={acceptedFiles => {
                                                                const previews = [];
                                                                for (let item of acceptedFiles){
                                                                    previews.push(URL.createObjectURL(item))
                                                                }
                                                                setFieldValue('preview', [...previews, ...values.preview]);
                                                                setFieldValue('logo', acceptedFiles[0]);
                                                            }}
                                                        >
                                                            {
                                                                ({getRootProps, getInputProps}) => (
                                                                    <div {...getRootProps()}  className="p-3 row m-0 mb-2 rounded shadow w-100">
                                                                        <input {...getInputProps()} name="dropzone"/>
                                                                        {
                                                                            values.preview.length > 0 ?
                                                                                values.preview.map( (item, idx) => (
                                                                                    <Col
                                                                                        key={item}
                                                                                        xs={6}
                                                                                        className="slider-item position-relative rounded"
                                                                                    >
                                                                                        <img src={item} className="img-fluid rounded" alt="main"/>
                                                                                        <span
                                                                                            style={{
                                                                                                position: 'absolute',
                                                                                                top: 3,
                                                                                                right: 13,
                                                                                                cursor: 'pointer'
                                                                                            }}
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation();
                                                                                                const preview = values.preview;
                                                                                                preview.splice(idx, 1);

                                                                                                setFieldValue('logo', null);
                                                                                                setFieldValue('preview', preview)
                                                                                            }}
                                                                                        >
                                                                                                    <i className="ni ni-2x ni-fat-remove text-danger"></i>
                                                                                                </span>
                                                                                    </Col>
                                                                                ))
                                                                                : <p className="text-center font-weight-bold m-auto">Перетащите файлы сюда или кликните, чтобы выбрать файл.</p>
                                                                        }
                                                                    </div>
                                                                )
                                                            }
                                                        </Dropzone>
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
        )
    }
}

const mapMethodsToProps = ({
   getGuardLevel,
   getBreederLevel,
   updateBreederLevel,
   updateGuardLevel,
   setBreederLevel,
   setGuardLevel
}) => ({
    getGuardLevel,
    getBreederLevel,
    updateBreederLevel,
    updateGuardLevel,
    setBreederLevel,
    setGuardLevel
});

const mapStateToProps = ({level}) => ({
    level
});

export default connect(mapStateToProps, {setLevel, setLevelRequest, clearLevel})(
    withDataService(withRouter(LevelForm), mapMethodsToProps)
)