import React, {Component} from "react";
import Header from "../components/Headers/Header";
import {Alert, Card, CardBody, CardHeader, Col, Container, Form, Input, Row, Spinner, Table, Modal, ModalBody, ModalHeader, ModalFooter} from "reactstrap";
import {Formik} from "formik";
import Dropzone from "react-dropzone";
import {withDataService} from "../components/hoc";
import {connect} from "react-redux";
import {addUserKind, clearUser, deleteUserKind, setUser, setUserKind, setUserRequest} from "../actions";
import Error404 from "./Error404";
import Helmet from "react-helmet";
import ImageCrop from "../components/ImageCrop";

class User extends Component {
    state = {
        profileRequest: false,
        isProfileEdit: false,
        isShopEdit: false,
        is404: false,
        changeLogo: false,
        logoRequest: false
    };

    componentDidMount() {
        const {
            getUser,
            setUser,
            setUserRequest,
            match: {params}
        } = this.props;

        setUserRequest(true);
        getUser(params.id)
            .then( (data) => {
                setUser({
                    ...data,
                    initialGuardiansKinds: [...data.guardians_kinds]
                });
                setUserRequest(false);
            })
            .catch( (error) => {
                if (error.response.status === 404) {
                    this.setState({is404: true});
                    setUserRequest(false);
                }
            });
    }

    updateUser = (data, actions) => {
        const {
            user,
            updateUser,
            getUser,
            setUser,
            match: {params}
        } = this.props;

        const newData = {
            ...data,
            kinds: user.guardians_kinds,
            profile_img: data.acceptedFileProfile
        };

        delete newData.acceptedFileProfile;

        this.setState({profileRequest: true});

        updateUser(params.id, newData)
            .then(async ({success}) => {
                const data = await getUser(params.id);
                setUser(data);
                actions.setValues({
                    ...data,
                    acceptedFileProfile: null,
                    previewsProfile: []
                });
                this.setState({isProfileEdit: false});
                actions.setStatus(success);
                this.setState({profileRequest: false});
                actions.setSubmitting(false);
            });
    };


    updateShop = (data, actions) => {
        const {
            updateShop,
            getUser,
            user,
            setUser,
            match: {params}
        } = this.props;

        updateShop(user.company_name, data)
            .then(async ({success}) => {
                const data = await getUser(params.id);
                setUser(data);
                actions.setValues({
                    ...data,
                    acceptedFileLogo: null,
                    previewsLogo: []
                });
                this.setState({isShopEdit: false});
                actions.setStatus(success);
                actions.setSubmitting(false);
            });
    };

    onCompleteLogoCrop = (crop) => {
        const {
            updateShop,
            getUser,
            user,
            setUser,
            match: {params}
        } = this.props;

        this.setState({logoRequest: true});
        updateShop(user.company_name, {logo: crop}, true)
            .then(async ({success}) => {
                const data = await getUser(params.id);
                setUser(data);
                this.setState({
                    logoRequest: false,
                    changeLogo: false
                });
            });
    };

    render() {
        const {
            user,
            allKinds,
            addUserKind,
            setUserKind,
            deleteUserKind,
            setUser,
            match: {path}
        } = this.props;
        const {isShopEdit, isProfileEdit, is404, profileRequest, changeLogo, logoRequest} = this.state;

        if (user.request || allKinds.length === 0) {
            return (
                <React.Fragment>
                    <Helmet>
                        <title>???????????????? | Breeders Zone</title>
                    </Helmet>
                    <Header/>
                    <Container className="mt--7" fluid>
                        <Row>
                            <Col xs={12} md={8}>
                                <Card>
                                    <CardBody className="d-flex">
                                        <Spinner className="m-auto"/>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col xs={12} md={4}>
                                <Card>
                                    <CardBody className="d-flex">
                                        <Spinner className="m-auto"/>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </React.Fragment>
            )
        }

        if (is404)
            return <Error404/>;

        return (
            <React.Fragment>
                {
                    path === '/admin/users/:id' ?
                        <Helmet>
                            <title>{!user.request ?  `${user.name} ${user.surname} ${user.company_name ? `| ${user.company_name}` : ''}` : '????????????????'} | Breeders Zone</title>
                        </Helmet>
                        : null
                }
                <Header/>
                <Container className="mt--7" fluid>
                    <Formik
                        initialValues={{
                            ...user,
                            about: user.about ? user.about : '',
                            acceptedFileProfile: null,
                            previewsProfile: []
                        }}
                        onSubmit={this.updateUser}
                    >
                        {
                            ({
                                 handleSubmit,
                                 handleChange,
                                 handleBlur,
                                 values,
                                 setFieldValue,
                                 status,
                                 isSubmitting,
                                 setValues
                             }) => {
                                if (isSubmitting) {
                                    return (
                                        <React.Fragment>
                                            <Row className="mb-3">
                                                <Col xs={12} md={8}>
                                                    <Card>
                                                        <CardBody className="d-flex">
                                                            <Spinner className="m-auto"/>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                                <Col xs={12} md={4}>
                                                    <Card>
                                                        <CardBody className="d-flex">
                                                            <Spinner className="m-auto"/>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </React.Fragment>
                                    );
                                }

                                return (
                                    <Form onSubmit={handleSubmit} className="row mb-3">
                                        {
                                            status ?
                                                <Col xs={12}>
                                                    <Alert color="success">
                                                        {status}
                                                    </Alert>
                                                </Col>
                                                : null
                                        }
                                        <Col xs={12} lg={8} className="mb-3">
                                            <Card>
                                                <CardHeader className="d-flex justify-content-between align-items-center">
                                                    <h1 className="m-0">{user.name}</h1>
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={() => {
                                                            if (isProfileEdit) {
                                                                setUser({
                                                                    guardians_kinds: user.initialGuardiansKinds
                                                                });
                                                                setValues({
                                                                    ...user,
                                                                    acceptedFileProfile: null,
                                                                    previewsProfile: []
                                                                });
                                                            }
                                                            this.setState({isProfileEdit: !isProfileEdit});
                                                        }}
                                                    >
                                                        { !isProfileEdit ? '??????????????????????????' : '????????????'}
                                                    </button>
                                                </CardHeader>
                                                <CardBody>
                                                    <Row>
                                                        <Col xs={12} xl={4}  className="mb-3">
                                                            <div className="d-flex">
                                                                <h3 className="mr-3 mb-0">??????:</h3>
                                                                {
                                                                    isProfileEdit ?
                                                                        <Input
                                                                            className="form-control-alternative"
                                                                            name="name"
                                                                            value={values.name}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                        />
                                                                        : <p className="m-0">{user.name}</p>
                                                                }
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} xl={4} className="mb-3">
                                                            <div className="d-flex">
                                                                <h3 className="mr-3 mb-0">??????????????:</h3>
                                                                {
                                                                    isProfileEdit ?
                                                                        <Input
                                                                            className="form-control-alternative"
                                                                            name="surname"
                                                                            value={values.surname}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                        />
                                                                        : <p className="m-0">{user.surname}</p>
                                                                }
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} xl={4} className="mb-3">
                                                            <div className="d-flex">
                                                                <h3 className="mr-3 mb-0">????????????????:</h3>
                                                                {
                                                                    isProfileEdit ?
                                                                        <Input
                                                                            className="form-control-alternative"
                                                                            name="patronymic"
                                                                            value={values.patronymic}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                        />
                                                                        : <p className="m-0">{user.patronymic}</p>
                                                                }
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row className="mb-3">
                                                        <Col xs={12}>
                                                            <div className="d-flex">
                                                                <h3 className="text-nowrap mr-3 mb-0">???????????????????? ??????????:</h3>
                                                                {
                                                                    isProfileEdit ?
                                                                        <Input
                                                                            className="form-control-alternative"
                                                                            name="email"
                                                                            value={values.email}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                        />
                                                                        : <p className="m-0">{user.email}</p>
                                                                }
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row className="mb-3">
                                                        <Col xs={12} md={4}>
                                                            <div className="d-flex">
                                                                <h3 className="mr-3">??????????????:</h3>
                                                                {
                                                                    isProfileEdit ?
                                                                        (
                                                                            <React.Fragment>
                                                                                <Input
                                                                                    id="is_breeder_true"
                                                                                    className="form-control-alternative position-absolute"
                                                                                    name="is_breeder"
                                                                                    type="radio"
                                                                                    value="1"
                                                                                    onChange={handleChange}
                                                                                    onBlur={handleBlur}
                                                                                    style={{
                                                                                        opacity: 0
                                                                                    }}
                                                                                />
                                                                                <Input
                                                                                    id="is_breeder_false"
                                                                                    className="form-control-alternative position-absolute"
                                                                                    name="is_breeder"
                                                                                    type="radio"
                                                                                    value="0"
                                                                                    onChange={handleChange}
                                                                                    onBlur={handleBlur}
                                                                                    style={{
                                                                                        opacity: 0
                                                                                    }}
                                                                                />
                                                                                <label htmlFor="is_breeder_true" className={values.is_breeder || values.is_breeder === '1' ? 'mr-2 font-weight-bold' : 'mr-2'}>????</label>
                                                                                <label htmlFor="is_breeder_false" className={!values.is_breeder || values.is_breeder === '0' ? 'font-weight-bold' : ''}>??????</label>
                                                                            </React.Fragment>
                                                                        )
                                                                        : <p className="m-0">{user.is_breeder ? '????' : '??????'}</p>
                                                                }
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} md={4}>
                                                            <div className="d-flex">
                                                                <h3 className="mr-3">??????????????:</h3>
                                                                {
                                                                    isProfileEdit ?
                                                                        (
                                                                            <React.Fragment>
                                                                                <Input
                                                                                    id="active_true"
                                                                                    className="form-control-alternative position-absolute"
                                                                                    name="active"
                                                                                    type="radio"
                                                                                    value="1"
                                                                                    onChange={handleChange}
                                                                                    onBlur={handleBlur}
                                                                                    style={{
                                                                                        opacity: 0
                                                                                    }}
                                                                                />
                                                                                <Input
                                                                                    id="active_false"
                                                                                    className="form-control-alternative position-absolute"
                                                                                    name="active"
                                                                                    type="radio"
                                                                                    value="0"
                                                                                    onChange={handleChange}
                                                                                    onBlur={handleBlur}
                                                                                    style={{
                                                                                        opacity: 0
                                                                                    }}
                                                                                />
                                                                                <label htmlFor="active_true" className={values.active || values.active === '1' ? 'mr-2 font-weight-bold' : 'mr-2'}>????</label>
                                                                                <label htmlFor="active_false" className={!values.active || values.active === '0' ? 'font-weight-bold' : ''}>??????</label>
                                                                            </React.Fragment>
                                                                        )
                                                                        : <p className="m-0">{user.active ? '????' : '??????'}</p>
                                                                }
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} md={4}>
                                                            <div className="d-flex">
                                                                <h3 className="mr-3">??????????????????:</h3>
                                                                {
                                                                    isProfileEdit ?
                                                                        (
                                                                            <React.Fragment>
                                                                                <Input
                                                                                    id="is_guard_true"
                                                                                    className="form-control-alternative position-absolute"
                                                                                    name="is_guard"
                                                                                    type="radio"
                                                                                    value="1"
                                                                                    onChange={handleChange}
                                                                                    onBlur={handleBlur}
                                                                                    style={{
                                                                                        opacity: 0
                                                                                    }}
                                                                                />
                                                                                <Input
                                                                                    id="is_guard_false"
                                                                                    className="form-control-alternative position-absolute"
                                                                                    name="is_guard"
                                                                                    type="radio"
                                                                                    value="0"
                                                                                    onChange={handleChange}
                                                                                    onBlur={handleBlur}
                                                                                    style={{
                                                                                        opacity: 0
                                                                                    }}
                                                                                />
                                                                                <label htmlFor="is_guard_true" className={values.is_guard || values.is_guard === '1' ? 'mr-2 font-weight-bold' : 'mr-2'}>????</label>
                                                                                <label htmlFor="is_guard_false" className={!values.is_guard || values.is_guard === '0' ? 'font-weight-bold' : ''}>??????</label>
                                                                            </React.Fragment>
                                                                        )
                                                                        : <p className="m-0">{user.is_guard ? '????' : '??????'}</p>
                                                                }
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row className="mb-3">
                                                        <Col xs={12}>
                                                            <div className="d-flex">
                                                                <h3 className="text-nowrap mr-3">?? ????????:</h3>
                                                                {
                                                                    isProfileEdit ?
                                                                        <Input
                                                                            className="form-control-alternative"
                                                                            name="about"
                                                                            type="textarea"
                                                                            value={values.about}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                        />
                                                                        : <p className="m-0">{user.about}</p>
                                                                }
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    {
                                                        isProfileEdit ?
                                                            <Row className="justify-content-center">
                                                                <Col xs={8} md={4} className="d-flex justify-content-center">
                                                                    <button
                                                                        type="submit"
                                                                        className="btn btn-primary"
                                                                    >
                                                                        ??????????????????
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
                                                <CardHeader className="d-flex align-items-center">
                                                    <h2 className="m-0">???????? ??????????????:</h2>
                                                </CardHeader>
                                                <CardBody>
                                                    <Row>
                                                        <Col xs={12}>
                                                            {
                                                                user.profile_img ?
                                                                    <img src={user.profile_img} alt="???????? ??????????????" className="img-fluid mb-2 rounded"/>
                                                                    : <p className="mb-2">???????????????????????? ???????? ???? ?????????????? ???????? ????????</p>
                                                            }
                                                            {
                                                                isProfileEdit ?
                                                                    <Dropzone
                                                                        onDrop={acceptedFiles => {
                                                                            const previews = [];
                                                                            for (let item of acceptedFiles){
                                                                                previews.push(URL.createObjectURL(item))
                                                                            }
                                                                            setFieldValue('previewsProfile', [...previews]);
                                                                            setFieldValue('acceptedFileProfile', acceptedFiles[0]);
                                                                        }}
                                                                    >
                                                                        {
                                                                            ({getRootProps, getInputProps}) => (
                                                                                <div {...getRootProps()}  className="p-3 row m-0 mb-2 rounded shadow w-100">
                                                                                    <input {...getInputProps()} name="dropzone"/>
                                                                                    {
                                                                                        values.previewsProfile.length > 0 ?
                                                                                            values.previewsProfile.map( (item, idx) => (
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

                                                                                                            setFieldValue('acceptedFileProfile', null);
                                                                                                            setFieldValue('previewsProfile', []);
                                                                                                        }}
                                                                                                    >
                                                                                                    <i className="ni ni-2x ni-fat-remove text-danger"></i>
                                                                                                </span>
                                                                                                </Col>
                                                                                            ))
                                                                                            : <p className="text-center font-weight-bold m-auto">???????????????????? ?????????? ???????? ?????? ????????????????, ?????????? ?????????????? ????????</p>
                                                                                    }
                                                                                </div>
                                                                            )
                                                                        }
                                                                    </Dropzone>
                                                                    : null
                                                            }
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Form>
                                )
                            }
                        }
                    </Formik>
                    <Modal
                        isOpen={changeLogo}
                        oggle={() =>  this.setState({changeLogo: false})}
                        centered
                    >
                        <ModalHeader toggle={() =>  this.setState({changeLogo: false})}>???????????????? ?????????? ????????????????????</ModalHeader>
                        <ModalBody>
                            {
                                !logoRequest ?
                                    <ImageCrop onComplete={this.onCompleteLogoCrop} aspect={1}/>
                                    : (
                                        <div className="d-flex w-100 h-100">
                                            <Spinner className="m-auto"/>
                                        </div>
                                    )
                            }
                        </ModalBody>
                        <ModalFooter>
                            <p className="w-100 text-center">???????? ?? ?????? ?????????????????? ???????????????? ?? ??????????????????, ???????????????????? ?????????????? ???????????????????? ???????????????? ??????????????.</p>
                        </ModalFooter>
                    </Modal>
                    {
                        user.is_breeder ?
                            (
                                <Formik
                                    initialValues={{
                                        ...user,
                                        about: user.about ? user.about : '',
                                        description: user.description ? user.description : '',
                                        acceptedFileLogo: null,
                                        previewsLogo: []
                                    }}
                                    onSubmit={this.updateShop}
                                >
                                    {
                                        ({
                                             handleSubmit,
                                             handleChange,
                                             handleBlur,
                                             values,
                                             setFieldValue,
                                             status,
                                             isSubmitting,
                                             setValues
                                         }) => {
                                            if (isSubmitting) {
                                                return (
                                                    <Row>
                                                        <Col xs={12} md={8}>
                                                            <Card>
                                                                <CardBody className="d-flex">
                                                                    <Spinner className="m-auto"/>
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                        <Col xs={12} md={4}>
                                                            <Card>
                                                                <CardBody className="d-flex">
                                                                    <Spinner className="m-auto"/>
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                    </Row>
                                                );
                                            }

                                            return (
                                                <Form onSubmit={handleSubmit} className="row">
                                                    {
                                                        status ?
                                                            <Col xs={12}>
                                                                <Alert color="success">
                                                                    {status}
                                                                </Alert>
                                                            </Col>
                                                            : null
                                                    }
                                                    <Col xs={12} lg={8} className="mb-3">
                                                        <Card>
                                                            <CardHeader className="d-flex justify-content-between align-items-center">
                                                                <h1>{user.company_name}</h1>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-primary"
                                                                    onClick={() => {
                                                                        if (isShopEdit) {
                                                                            setValues({
                                                                                ...user,
                                                                                acceptedFileLogo: null,
                                                                                previewsLogo: []
                                                                            });
                                                                        }
                                                                        this.setState({isShopEdit: !isShopEdit})
                                                                    }}
                                                                >
                                                                    { !isShopEdit ? '??????????????????????????' : '????????????'}
                                                                </button>
                                                            </CardHeader>
                                                            <CardBody>
                                                                <Row className="mb-3">
                                                                    <Col xs={12} lg={6}>
                                                                        <div className="d-flex">
                                                                            <h3 className="text-nowrap mr-3 mb-0">???????????????? ????????????????:</h3>
                                                                            {
                                                                                isShopEdit ?
                                                                                    <Input
                                                                                        className="form-control-alternative"
                                                                                        name="company_name"
                                                                                        value={values.company_name}
                                                                                        onChange={handleChange}
                                                                                        onBlur={handleBlur}
                                                                                    />
                                                                                    : <p className="m-0">{user.company_name}</p>
                                                                            }
                                                                        </div>
                                                                    </Col>
                                                                    <Col xs={12} lg={6}>
                                                                        <div className="d-flex">
                                                                            <h3 className="text-nowrap mr-3 mb-0">????????????????:</h3>
                                                                            {
                                                                                isShopEdit ?
                                                                                    <Input
                                                                                        className="form-control-alternative"
                                                                                        name="owner"
                                                                                        value={values.owner}
                                                                                        onChange={handleChange}
                                                                                        onBlur={handleBlur}
                                                                                    />
                                                                                    : <p className="m-0">{user.owner}</p>
                                                                            }
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                                <Row className="mb-3">
                                                                    <Col xs={12} lg={6}>
                                                                        <div className="d-flex">
                                                                            <h3 className="text-nowrap mr-3 mb-0">??????????????:</h3>
                                                                            {
                                                                                isShopEdit ?
                                                                                    <Input
                                                                                        className="form-control-alternative"
                                                                                        name="phone"
                                                                                        value={values.phone}
                                                                                        onChange={handleChange}
                                                                                        onBlur={handleBlur}
                                                                                    />
                                                                                    : <p className="m-0">{user.phone}</p>
                                                                            }
                                                                        </div>
                                                                    </Col>
                                                                    <Col xs={12} lg={6}>
                                                                        <div className="d-flex">
                                                                            <h3 className="text-nowrap mr-3 mb-0">????????????????:</h3>
                                                                            {
                                                                                isShopEdit ?
                                                                                    (
                                                                                        <React.Fragment>
                                                                                            <Input
                                                                                                id="local_delivery"
                                                                                                className="form-control-alternative"
                                                                                                name="local_delivery"
                                                                                                type="checkbox"
                                                                                                onChange={() => setFieldValue('local_delivery', !values.local_delivery)}
                                                                                                onBlur={handleBlur}
                                                                                                style={{
                                                                                                    opacity: 0
                                                                                                }}
                                                                                            />
                                                                                            <Input
                                                                                                id="regional_delivery"
                                                                                                className="form-control-alternative"
                                                                                                name="regional_delivery"
                                                                                                type="checkbox"
                                                                                                onChange={() => setFieldValue('regional_delivery', !values.regional_delivery)}
                                                                                                onBlur={handleBlur}
                                                                                                style={{
                                                                                                    opacity: 0
                                                                                                }}
                                                                                            />
                                                                                            <Input
                                                                                                id="countrywide_delivery"
                                                                                                className="form-control-alternative"
                                                                                                name="countrywide_delivery"
                                                                                                type="checkbox"
                                                                                                onChange={() => setFieldValue('countrywide_delivery', !values.countrywide_delivery)}
                                                                                                onBlur={handleBlur}
                                                                                                style={{
                                                                                                    opacity: 0
                                                                                                }}
                                                                                            />
                                                                                            <div>
                                                                                                <label htmlFor="local_delivery" className={"d-flex align-items-center" + (values.local_delivery ? '  text-dark' : '')}>
                                                                                                    <i className="fa fa-lg fa-car"></i>
                                                                                                    <h3 className="ml-2 mb-0">??????????????????</h3>
                                                                                                </label>
                                                                                                <label htmlFor="regional_delivery" className={"d-flex align-items-center" + (values.regional_delivery ? '  text-dark' : '')}>
                                                                                                    <i className="fa fa-lg fa-truck"></i>
                                                                                                    <h3 className="ml-2 mb-0">????????????????????????</h3>
                                                                                                </label>
                                                                                                <label htmlFor="countrywide_delivery" className={"d-flex align-items-center" + (values.countrywide_delivery ? '  text-dark' : '')}>
                                                                                                    <i className="fa fa-lg fa-helicopter"></i>
                                                                                                    <h3 className="ml-2 mb-0">???? ???????? ????????????</h3>
                                                                                                </label>
                                                                                            </div>
                                                                                        </React.Fragment>
                                                                                    )
                                                                                    : (
                                                                                        <div>
                                                                                            {
                                                                                                user.local_delivery ?
                                                                                                    (
                                                                                                        <div className="d-flex align-items-center text-dark">
                                                                                                            <i className="fa fa-lg fa-car"></i>
                                                                                                            <h3 className="ml-2 mb-0">??????????????????</h3>
                                                                                                        </div>
                                                                                                    ) : null
                                                                                            }

                                                                                            {
                                                                                                user.regional_delivery ?
                                                                                                    (
                                                                                                        <div className="d-flex align-items-center text-dark">
                                                                                                            <i className="fa fa-lg fa-truck"></i>
                                                                                                            <h3 className="ml-2 mb-0">????????????????????????</h3>
                                                                                                        </div>
                                                                                                    ) : null
                                                                                            }

                                                                                            {
                                                                                                user.countrywide_delivery ?
                                                                                                    (
                                                                                                        <div className="d-flex align-items-center text-dark">
                                                                                                            <i className="fa fa-lg fa-helicopter"></i>
                                                                                                            <h3 className="ml-2 mb-0">???? ???????? ????????????</h3>
                                                                                                        </div>
                                                                                                    ) : null
                                                                                            }
                                                                                        </div>
                                                                                    )
                                                                            }
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                                <Row className="mb-3">
                                                                    <Col xs={12} className="mb-3">
                                                                        <div className="d-flex">
                                                                            <h3 className="text-nowrap mr-3 mb-0">????????????????:</h3>
                                                                            {
                                                                                isShopEdit ?
                                                                                    <Input
                                                                                        className="form-control-alternative"
                                                                                        name="description"
                                                                                        type="textarea"
                                                                                        value={values.description}
                                                                                        onChange={handleChange}
                                                                                        onBlur={handleBlur}
                                                                                    />
                                                                                    : <p className="m-0">{user.description}</p>
                                                                            }
                                                                        </div>
                                                                    </Col>
                                                                    <Col xs={12}>
                                                                        <div className="d-flex">
                                                                            <h3 className="text-nowrap mr-3 mb-0">???????????????? ????????????????:</h3>
                                                                            {
                                                                                isShopEdit ?
                                                                                    <Input
                                                                                        className="form-control-alternative"
                                                                                        name="policity"
                                                                                        type="textarea"
                                                                                        value={values.policity}
                                                                                        onChange={handleChange}
                                                                                        onBlur={handleBlur}
                                                                                    />
                                                                                    : <p className="m-0">{user.policity}</p>
                                                                            }
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                                <Row className="mb-3">
                                                                    <Col xs={12}>
                                                                        <div className="d-flex">
                                                                            <h3 className="text-nowrap mr-3 mb-0">????????:</h3>
                                                                            {
                                                                                isShopEdit ?
                                                                                    <Input
                                                                                        className="form-control-alternative"
                                                                                        name="website"
                                                                                        value={values.website}
                                                                                        onChange={handleChange}
                                                                                        onBlur={handleBlur}
                                                                                    />
                                                                                    : null
                                                                            }
                                                                            {
                                                                                !isShopEdit && user.website ?
                                                                                    <a className="social" href={user.website}>{user.website}</a>
                                                                                    : null
                                                                            }
                                                                            {
                                                                                !isShopEdit && !user.website ? '??????' : null
                                                                            }
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col xs={12} lg={3}>
                                                                        <div className="d-flex">
                                                                            <h3 className="text-nowrap mr-3 mb-0">??????????????????:</h3>
                                                                            {
                                                                                isShopEdit ?
                                                                                    <Input
                                                                                        className="form-control-alternative"
                                                                                        name="vk"
                                                                                        value={values.vk}
                                                                                        onChange={handleChange}
                                                                                        onBlur={handleBlur}
                                                                                    />
                                                                                    : null
                                                                            }
                                                                            {
                                                                                !isShopEdit && user.vk ?
                                                                                    <a className="social" href={user.vk}>{user.vk}</a>
                                                                                    : null
                                                                            }
                                                                            {
                                                                                !isShopEdit && !user.vk ? '??????' : null
                                                                            }
                                                                        </div>
                                                                    </Col>
                                                                    <Col xs={12} lg={3}>
                                                                        <div className="d-flex">
                                                                            <h3 className="text-nowrap mr-3 mb-0">Instagram:</h3>
                                                                            {
                                                                                isShopEdit ?
                                                                                    <Input
                                                                                        className="form-control-alternative"
                                                                                        name="instagram"
                                                                                        value={values.instagram}
                                                                                        onChange={handleChange}
                                                                                        onBlur={handleBlur}
                                                                                    />
                                                                                    : null
                                                                            }
                                                                            {
                                                                                !isShopEdit && user.instagram ?
                                                                                    <a className="social" href={user.instagram}>{user.instagram}</a>
                                                                                    : null
                                                                            }
                                                                            {
                                                                                !isShopEdit && !user.instagram ? '??????' : null
                                                                            }
                                                                        </div>
                                                                    </Col>
                                                                    <Col xs={12} lg={3}>
                                                                        <div className="d-flex">
                                                                            <h3 className="text-nowrap mr-3 mb-0">Facebook:</h3>
                                                                            {
                                                                                isShopEdit ?
                                                                                    <Input
                                                                                        className="form-control-alternative"
                                                                                        name="facebook"
                                                                                        value={values.facebook}
                                                                                        onChange={handleChange}
                                                                                        onBlur={handleBlur}
                                                                                    />
                                                                                    : null
                                                                            }
                                                                            {
                                                                                !isShopEdit && user.facebook ?
                                                                                    <a className="social" href={user.facebook}>{user.facebook}</a>
                                                                                    : null
                                                                            }
                                                                            {
                                                                                !isShopEdit && !user.facebook ? '??????' : null
                                                                            }
                                                                        </div>
                                                                    </Col>
                                                                    <Col xs={12} lg={3}>
                                                                        <div className="d-flex">
                                                                            <h3 className="text-nowrap mr-3 mb-0">Youtube ??????????:</h3>
                                                                            {
                                                                                isShopEdit ?
                                                                                    <Input
                                                                                        className="form-control-alternative"
                                                                                        name="youtube"
                                                                                        value={values.youtube}
                                                                                        onChange={handleChange}
                                                                                        onBlur={handleBlur}
                                                                                    />
                                                                                    : null
                                                                            }
                                                                            {
                                                                                !isShopEdit && user.youtube ?
                                                                                    <a className="social" href={user.youtube}>{user.youtube}</a>
                                                                                    : null
                                                                            }
                                                                            {
                                                                                !isShopEdit && !user.youtube ? '??????' : null
                                                                            }
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                                {
                                                                    isShopEdit ?
                                                                        <Row className="justify-content-center mt-3">
                                                                            <Col xs={8} md={4} className="d-flex justify-content-center">
                                                                                <button
                                                                                    type="submit"
                                                                                    className="btn btn-primary"
                                                                                >
                                                                                    ??????????????????
                                                                                </button>
                                                                            </Col>
                                                                        </Row>
                                                                        : null
                                                                }
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                    <Col xs={12} lg={4} className="mb-3">
                                                        <Card>
                                                            <CardHeader className="d-flex align-items-center">
                                                                <h2 className="m-0">?????????????? ????????????????:</h2>
                                                            </CardHeader>
                                                            <CardBody>
                                                                <Row>
                                                                    <Col xs={12}>
                                                                        <div className="d-inline-block position-relative">
                                                                            {
                                                                                isShopEdit &&
                                                                                <span
                                                                                    className="rounded cursor-pointer"
                                                                                    style={{
                                                                                        position: "absolute",
                                                                                        top: 5,
                                                                                        right: 5,
                                                                                        padding: 3,
                                                                                        background: '#fff'
                                                                                    }}
                                                                                    onClick={() => this.setState({changeLogo: true})}
                                                                                >
                                                                                    <i className="fas fa-pen fa-lg"></i>
                                                                                </span>
                                                                            }
                                                                            {
                                                                                user.logo_img_url ?
                                                                                    <img src={user.logo_img_url} alt="???????? ??????????????" className="img-fluid mb-2 rounded"/>
                                                                                    : <p className="mb-2">???????????????????????? ???????? ???? ?????????????? ???????? ????????</p>
                                                                            }
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                </Form>
                                            )
                                        }
                                    }
                                </Formik>
                            )
                            : null
                    }
                    {
                        user.is_guard ?
                            (
                                <Row>
                                    <Col xs={12}  md={6} lg={4}>
                                        <Card>
                                            {
                                                !profileRequest ?
                                                    (
                                                        <React.Fragment>
                                                            <CardHeader className="d-flex justify-content-between">
                                                                <h1>??????????????????</h1>
                                                                {
                                                                    isProfileEdit && allKinds.length > 0 ?
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-primary"
                                                                            onClick={() => {
                                                                                addUserKind();
                                                                            }}
                                                                        >
                                                                            ????????????????
                                                                        </button>
                                                                        : null
                                                                }
                                                            </CardHeader>
                                                            <Table className="align-items-center table-flush" responsive>
                                                                <thead className="thead-light">
                                                                <tr>
                                                                    <th scope="col">?????????????? ????????????????</th>
                                                                    {
                                                                        isProfileEdit ?
                                                                            <th className="col"></th>
                                                                            : null
                                                                    }
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                {
                                                                    user.guardians_kinds.map( (item, idx) => (
                                                                        <tr key={"kinds-" + idx}>
                                                                            <td className="w-100">
                                                                                {
                                                                                    isProfileEdit ?
                                                                                        <Input
                                                                                            className="form-control-alternative"
                                                                                            name={"kind-" + idx}
                                                                                            value={item.id}
                                                                                            type="select"
                                                                                            onChange={(e) => setUserKind({idx, kindId: Number(e.target.value)})}
                                                                                        >
                                                                                            {
                                                                                                allKinds.map( (item) => <option key={"kind-" + idx + item.id} value={item.id}>{item.title_rus}</option>)
                                                                                            }
                                                                                        </Input>
                                                                                        : item.title_rus
                                                                                }
                                                                            </td>
                                                                            {
                                                                                isProfileEdit ?
                                                                                    <td onClick={() => {
                                                                                        deleteUserKind(idx);
                                                                                    }}>
                                                                                        <i className="ni ni-lg ni-fat-remove"></i>
                                                                                    </td>
                                                                                    : null
                                                                            }
                                                                        </tr>
                                                                    ))
                                                                }
                                                                </tbody>
                                                            </Table>
                                                        </React.Fragment>
                                                    )
                                                    : (
                                                        <CardBody className="d-flex">
                                                            <Spinner className="m-auto"/>
                                                        </CardBody>
                                                    )

                                            }
                                        </Card>
                                    </Col>
                                </Row>
                            )
                            : null
                    }
                </Container>
            </React.Fragment>
        )
    }
}

const mapMethodsToProps = ({getUser, updateUser, updateShop}) => ({
    getUser,
    updateUser,
    updateShop
});

const mapStateToProps = ({user, kinds: {all: allKinds}}) => ({
    user,
    allKinds
});

export default connect(mapStateToProps, {
    setUser,
    setUserRequest,
    clearUser,
    addUserKind,
    setUserKind,
    deleteUserKind
})(
    withDataService(User, mapMethodsToProps)
)
