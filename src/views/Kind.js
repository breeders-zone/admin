import React, {Component} from "react";
import {withDataService} from "../components/hoc";
import {connect} from "react-redux";
import {clearKind, setKind, setKindRequest, setKinds} from "../actions";
import Header from "../components/Headers/Header";
import {Alert, Card, CardBody, CardHeader, Col, Container, Form, Input, Row, Spinner, Table} from "reactstrap";
import Error404 from "./Error404";
import {ErrorMessage, Formik} from "formik";
import Dropzone from "react-dropzone";
import Helmet from "react-helmet";
import * as Yup from "yup";

class Kind extends Component {
    state = {
        isEdit: false,
        is404: false
    };

    componentDidMount() {
        const {
            getKind,
            match: {params, path},
            setKind,
            setKindRequest
        } = this.props;
        if (path === '/admin/kinds/add') {
            setKindRequest(false);
            return this.setState({isEdit: true});
        }

        setKindRequest(true);
        getKind(params.id)
            .then((data) => {
                setKind(data);
                setKindRequest(false)
            })
            .catch((error) => {
                this.setState({is404: true});
                setKindRequest(false);
            });
    }

    onSubmit = (data, actions) => {
        const {
            kind,
            updateKind,
            match: {params, path},
            setKind,
            getKind,
            setKindData,
            getKinds,
            setKinds
        } = this.props;

        if (path === '/admin/kinds/add') {
            setKindData({
                title_eng: data.title_eng,
                title_rus: data.title_rus,
                sort: data.sort,
                group: data.group,
                has_subcategories: data.has_subcategories,
                logo_square: data.acceptedFileSquare,
                logo_header: data.acceptedFileHeader,
                subcategories: data.subcategories,
                localities: data.localities
            })
                .then( ({message}) => {
                    actions.setValues({
                        ...kind,
                        acceptedFileHeader: null,
                        acceptedFileSquare: null,
                        previewsHeader: [],
                        previewsSquare: []
                    });
                    actions.setStatus(message);
                    actions.setSubmitting(false);
                    actions.setSubmitting(false);
                })
                .then(() => {
                    getKinds()
                        .then( (data) => setKinds(data));
                })
                .catch( (error) => {
                    const errors = error.response.data.errors;
                    actions.setErrors({
                        title_rus: errors.title_rus ? errors.title_rus[0] : '',
                        title_eng: errors.title_eng ? errors.title_eng[0] : '',
                        subcategories: errors.subcategories ? errors.subcategories[0] : '',
                        localities: errors.localities ? errors.localities[0] : '',
                        logo_square: errors.logo_square ? errors.logo_square[0] : '',
                        logo_header: errors.logo_header ? errors.logo_header[0] : '',
                        group: errors.group ? errors.group[0] : '',
                    });
                    actions.setSubmitting(false);
                });
            return;
        }

        updateKind(params.id, {
            title_eng: data.title_eng,
            title_rus: data.title_rus,
            sort: data.sort,
            group: data.group,
            has_subcategories: data.has_subcategories,
            logo_square: data.acceptedFileSquare,
            logo_header: data.acceptedFileHeader,
            subcategories: data.subcategories,
            localities: data.localities
        })
            .then( async ({message}) => {
                const data = await getKind(params.id);
                setKind(data);
                actions.setValues({
                    ...data,
                    acceptedFileHeader: null,
                    acceptedFileSquare: null,
                    previewsHeader: [],
                    previewsSquare: []
                });
                this.setState({isEdit: false});
                actions.setStatus(message);
                actions.setSubmitting(false);
                actions.setSubmitting(false);
            })
            .then(() => {
                getKinds()
                    .then( (data) => setKinds(data));
            })
            .catch( (error) => {
                if (error.response.status === 422) {
                    const errors = error.response.data.errors;
                    actions.setErrors({
                        title_rus: errors.title_rus ? errors.title_rus[0] : '',
                        title_eng: errors.title_eng ? errors.title_eng[0] : '',
                        subcategories: errors.subcategories ? errors.subcategories[0] : '',
                        localities: errors.localities ? errors.localities[0] : '',
                        logo_square: errors.logo_square ? errors.logo_square[0] : '',
                        logo_header: errors.logo_header ? errors.logo_header[0] : '',
                        group: errors.group ? errors.group[0] : '',
                    });
                }
                actions.setSubmitting(false);
            })
    };

    componentWillUnmount() {
        const {clearKind} = this.props;
        clearKind();
    }

    render() {
        const {kind, subcategories, localities, match: {path}} = this.props;
        const {is404, isEdit} = this.state;

        if (kind.request)
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
                    path === '/admin/kinds/:id' ?
                        <Helmet>
                            <title>{!kind.request ?  kind.title_rus : 'Загрузка'} | Breeders Zone</title>
                        </Helmet>
                        : null
                }
                {
                    path === '/admin/kinds/add' ?
                        <Helmet>
                            <title>Добавить категорию | Breeders Zone</title>
                        </Helmet>
                        : null
                }
                <Header/>
                <Container className="mt--7" fluid>
                    <Formik
                        initialValues={{
                            ...kind,
                            has_subcategories: kind.has_subcategories ? '1' : '0',
                            acceptedFileHeader: null,
                            acceptedFileSquare: null,
                            previewsHeader: [],
                            previewsSquare: []
                        }}
                        onSubmit={this.onSubmit}
                        validationSchema={Yup.object().shape({
                            title_rus: Yup.string()
                                .required('Русское название должно быть указано'),
                            title_eng: Yup.string()
                                .required('Латинское название должно быть указано'),
                            group: Yup.string()
                                .lowercase('Группа должна быть указана в нижнем регистре')
                                .required('Латинское название должно быть указано'),
                        })}
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
                                        <Row className="justify-content-center  mb-4">
                                            <Col xs={8} className="d-flex">
                                                <Card className="w-100">
                                                    <CardHeader className="d-flex justify-content-between align-items-center">
                                                        {
                                                            path !== "/admin/kinds/add" ?
                                                                (
                                                                    <React.Fragment>
                                                                        <h3 className="m-0">{kind.title_rus} ({kind.title_eng})</h3>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-primary"
                                                                            onClick={() => {
                                                                                if (isEdit) {
                                                                                    setValues({
                                                                                        ...kind,
                                                                                        has_subcategories: kind.has_subcategories ? '1' : '0',
                                                                                        acceptedFileHeader: null,
                                                                                        acceptedFileSquare: null,
                                                                                        previewsHeader: [],
                                                                                        previewsSquare: []
                                                                                    });
                                                                                }
                                                                                this.setState({isEdit: !isEdit})
                                                                            }}
                                                                        >
                                                                            { !isEdit ? 'Редактировать' : 'Отмена'}
                                                                        </button>
                                                                    </React.Fragment>
                                                                )
                                                                :  <h3 className="m-0">Добавить категорию</h3>
                                                        }

                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row className="mb-3">
                                                            <Col xs={12} md={6}>
                                                                <div className="d-flex">
                                                                    <h3 className="mr-3 text-nowrap">Русское название:</h3>
                                                                    {
                                                                        isEdit ?
                                                                            <Input
                                                                                className="form-control-alternative"
                                                                                name="title_rus"
                                                                                value={values.title_rus}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                            />
                                                                            : <p>{kind.title_rus}</p>
                                                                    }
                                                                    <ErrorMessage name="title_rus">
                                                                        {
                                                                            msg => <div className="text-danger">{msg}</div>
                                                                        }
                                                                    </ErrorMessage>
                                                                </div>
                                                            </Col>
                                                            <Col xs={12} md={6}>
                                                                <div className="d-flex">
                                                                    <h3 className="mr-3 text-nowrap">Латинское название:</h3>
                                                                    {
                                                                        isEdit ?
                                                                            <Input
                                                                                className="form-control-alternative"
                                                                                name="title_eng"
                                                                                value={values.title_eng}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                            />
                                                                            : <p>{kind.title_eng}</p>
                                                                    }
                                                                    <ErrorMessage name="title_eng">
                                                                        {
                                                                            msg => <div className="text-danger">{msg}</div>
                                                                        }
                                                                    </ErrorMessage>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <Row className="mb-3">
                                                            <Col xs={12} md={6}>
                                                                <div className="d-flex">
                                                                    <h3 className="mr-3 text-nowrap">Группа:</h3>
                                                                    {
                                                                        isEdit ?
                                                                            <Input
                                                                                className="form-control-alternative"
                                                                                name="group"
                                                                                value={values.group}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                            />
                                                                            : <p>{kind.group}</p>
                                                                    }
                                                                    <ErrorMessage name="group">
                                                                        {
                                                                            msg => <div className="text-danger">{msg}</div>
                                                                        }
                                                                    </ErrorMessage>
                                                                </div>
                                                            </Col>
                                                            <Col xs={12} md={6}>
                                                                <div className="d-flex">
                                                                    <h3 className="mr-3 text-nowrap">Есть подкатегории:</h3>
                                                                    {
                                                                        isEdit ?
                                                                            (
                                                                                <div>
                                                                                    <Input
                                                                                        id="has_subcategories_true"
                                                                                        className="form-control-alternative"
                                                                                        name="has_subcategories"
                                                                                        type="radio"
                                                                                        value={1}
                                                                                        onChange={(e) => {
                                                                                            setFieldValue('has_subcategories', e.target.value);
                                                                                            setFieldValue('subcategories', kind.subcategories);
                                                                                        }}
                                                                                        onBlur={handleBlur}
                                                                                        style={{
                                                                                            opacity: 0
                                                                                        }}
                                                                                    />
                                                                                    <Input
                                                                                        id="has_subcategories_false"
                                                                                        className="form-control-alternative"
                                                                                        name="has_subcategories"
                                                                                        type="radio"
                                                                                        value={0}
                                                                                        onChange={(e) => {
                                                                                            setFieldValue('has_subcategories', e.target.value);
                                                                                            setFieldValue('subcategories', []);
                                                                                        }}
                                                                                        onBlur={handleBlur}
                                                                                        style={{
                                                                                            opacity: 0
                                                                                        }}
                                                                                    />

                                                                                    <label htmlFor="has_subcategories_true" className={'mr-3' + (values.has_subcategories === 1 || values.has_subcategories === '1' ? ' font-weight-bold' : '')}>Есть</label>
                                                                                    <label htmlFor="has_subcategories_false" className={values.has_subcategories === 0 || values.has_subcategories === '0' ? 'font-weight-bold' : ''}>Нет</label>

                                                                                </div>
                                                                            )
                                                                            : <p>{kind.has_subcategories ? 'Есть' : 'Нет'}</p>
                                                                    }
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <Row className="mb-3">
                                                            <Col xs={12} md={6}>
                                                                <div className="d-flex">
                                                                    <h3 className="mr-3 text-nowrap">Сортировка:</h3>
                                                                    {
                                                                        isEdit ?
                                                                            <Input
                                                                                type="number"
                                                                                className="form-control-alternative"
                                                                                name="sort"
                                                                                value={values.sort}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                            />
                                                                            : <p>{kind.sort ? kind.sort : 'Не задана'}</p>
                                                                    }
                                                                    <ErrorMessage name="sort">
                                                                        {
                                                                            msg => <div className="text-danger">{msg}</div>
                                                                        }
                                                                    </ErrorMessage>
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
                                            <Col xs={4}>
                                                <Card>
                                                    <CardBody>
                                                       <Row>
                                                           <Col xs={12} className="mb-3">
                                                               <h2>Основное фото:</h2>
                                                               {
                                                                   kind.logo_square ?
                                                                       <div className="mb-2">
                                                                           <img src={kind.logo_square} alt={kind.title_rus} className="img-fluid rounded"/>
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
                                                                               setFieldValue('previewsSquare', [...previews, ...values.previewsSquare]);
                                                                               setFieldValue('acceptedFileSquare', acceptedFiles[0]);
                                                                   }}
                                                                       >
                                                                           {
                                                                               ({getRootProps, getInputProps}) => (
                                                                                   <div {...getRootProps()}  className="p-3 row m-0 mb-2 rounded shadow w-100">
                                                                                       <input {...getInputProps()} name="dropzone"/>
                                                                                       {
                                                                                           values.previewsSquare.length > 0 ?
                                                                                               values.previewsSquare.map( (item, idx) => (
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
                                                                                                               const previewsSquare = values.previewsSquare;
                                                                                                               previewsSquare.splice(idx, 1);

                                                                                                               setFieldValue('acceptedFileSquare', null);
                                                                                                               setFieldValue('previewsSquare', previewsSquare)
                                                                                                           }}
                                                                                                       >
                                                                                                    <i className="ni ni-2x ni-fat-remove text-danger"></i>
                                                                                                </span>
                                                                                                   </Col>
                                                                                               ))
                                                                                               : <p className="text-center font-weight-bold m-auto">Перетащите файлы сюда или кликните, чтобы выбрать файл, рекомендуемое соотношение 4:3 или квадратное изображение</p>
                                                                                       }
                                                                                   </div>
                                                                               )
                                                                           }
                                                                       </Dropzone>
                                                                       : null
                                                               }
                                                               <ErrorMessage name="logo_square">
                                                                   {
                                                                       msg => <div className="text-danger">{msg}</div>
                                                                   }
                                                               </ErrorMessage>
                                                           </Col>
                                                           <Col xs={12} className="mb-3">
                                                               <h2>Фото для шапки:</h2>
                                                               {
                                                                   kind.logo_header ?
                                                                       <div className="mb-2">
                                                                           <img src={kind.logo_header} alt={kind.title_rus} className="img-fluid rounded"/>
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
                                                                               setFieldValue('previewsHeader', [...previews, ...values.previewsHeader]);
                                                                               setFieldValue('acceptedFileHeader', acceptedFiles[0]);
                                                                           }}
                                                                       >
                                                                           {
                                                                               ({getRootProps, getInputProps}) => (
                                                                                   <div {...getRootProps()}  className="p-3 row m-0 mb-2 rounded shadow w-100">
                                                                                       <input {...getInputProps()} name="dropzone"/>
                                                                                       {
                                                                                           values.previewsHeader.length > 0 ?
                                                                                               values.previewsHeader.map( (item, idx) => (
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
                                                                                                               const previewsHeader = values.previewsHeader;
                                                                                                               previewsHeader.splice(idx, 1);

                                                                                                               setFieldValue('acceptedFileHeader', null);
                                                                                                               setFieldValue('previewsHeader', previewsHeader)
                                                                                                           }}
                                                                                                       >
                                                                                                    <i className="ni ni-2x ni-fat-remove text-danger"></i>
                                                                                                </span>
                                                                                                   </Col>
                                                                                               ))
                                                                                               : <p className="text-center font-weight-bold m-auto">Перетащите файлы сюда или кликните, чтобы выбрать файл, рекомендуемое размер изображения 1920X320</p>
                                                                                       }
                                                                                   </div>
                                                                               )
                                                                           }
                                                                       </Dropzone>
                                                                       : null
                                                               }
                                                               <ErrorMessage name="logo_header">
                                                                   {
                                                                       msg => <div className="text-danger">{msg}</div>
                                                                   }
                                                               </ErrorMessage>
                                                           </Col>
                                                       </Row>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <Row className="justify-content-center">
                                            <Col xs={12} md={6} lg={4}>
                                                <Card>
                                                    <CardHeader className="d-flex justify-content-between">
                                                        <h1>Подкатегории</h1>
                                                        {
                                                            isEdit && (values.has_subcategories === 1 || values.has_subcategories === '1') && subcategories.length > 0 ?
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-primary"
                                                                    onClick={() => {
                                                                        const subcategoriesValue = values.subcategories;
                                                                        subcategoriesValue.push(subcategories[0]);
                                                                        setFieldValue('subcategories', subcategoriesValue)
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
                                                                kind.subcategories.map( (item) => <tr key={'subcategory-' + item.id}><td>{item.title}</td></tr>)
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
                                                                kind.localities.map( (item) => <tr key={"subcategory-" + item.id}><td>{item.title}</td></tr>)
                                                                : values.localities.map( (item, idx) => (
                                                                    <tr key={"locality-" + idx}>
                                                                        <td className="w-100">
                                                                            <Input
                                                                                className="form-control-alternative"
                                                                                name={"locality-" + idx}
                                                                                value={item.id}
                                                                                type="select"
                                                                                onChange={(e) => {
                                                                                    e.preventDefault();
                                                                                    const localitiesValues = values.localities;
                                                                                    console.log(localitiesValues);
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
                                );
                            }
                        }
                    </Formik>
                </Container>
            </React.Fragment>
        )
    }
}

const mapMethodsToProps = ({getKind, getKinds, updateKind, setKind: setKindData}) => ({
    getKind,
    getKinds,
    setKindData,
    updateKind
});

const mapStateToProps = ({kind, subcategories: {all: subcategories}, localities: {all: localities}}) => ({
    kind,
    subcategories,
    localities
});

export default connect(mapStateToProps, {setKind, setKindRequest, setKinds, clearKind})(withDataService(Kind, mapMethodsToProps));
