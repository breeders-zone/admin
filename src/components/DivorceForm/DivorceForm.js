import React, {Component} from "react";
import {withDataService, withErrorBoundary} from "../hoc";
import {
    Alert,
    Card,
    CardBody,
    CardHeader,
    Col,
    Form,
    FormGroup,
    Input,
    InputGroup, InputGroupAddon, InputGroupText,
    Row,
    Spinner
} from "reactstrap";
import {ErrorMessage, Formik} from "formik";
import {connect} from "react-redux";
import {
    setDivorce,
    setDivorceRequest,
    setDivorceSearchMorphsFemaleResult,
    setDivorceSearchMorphsMaleResult, setSelectedMorphFemaleIdx, setSelectedMorphMaleIdx
} from "../../actions";
import {Link, withRouter} from "react-router-dom";
import {toUrl} from "../../utils";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import {DataService} from "../../services";
import ReactDatetime from "react-datetime";
import moment from "moment";
import Slider from "react-slick";
import Dropzone from "react-dropzone";
import * as Yup from "yup";
import Helmet from "react-helmet";
const dataService = new DataService();
const debounceSearch = AwesomeDebouncePromise(
    dataService.searchMorphs,
    300
);

class DivorceFrom extends Component {
    state = {
        isEdit: false,
        searchInputMale: '',
        searchInputMaleBlur: false,
        searchInputFemale: '',
        searchInputFemaleBlur: false,
        is404: false
    };

    searchMaleList = React.createRef();
    searchFemaleList = React.createRef();

    componentDidMount() {
        const {getDivorce, setDivorce, setDivorceRequest, id} = this.props;
        setDivorceRequest(true);
        getDivorce(id)
            .then( (data) => {
                setDivorce(data);
                setDivorceRequest(false);
            })
            .catch( (error) => {
                if (error.response.status === 404)
                    this.setState({is404: true});
                setDivorceRequest(false);
            });
    }

    clearSearchInput = (isMale = true) => {
        const {
            setDivorceSearchMorphsMaleResult,
            setDivorceSearchMorphsFemaleResult,
            setSelectedMorphMaleIdx,
            setSelectedMorphFemaleIdx
        } = this.props;

        if (isMale) {
            setDivorceSearchMorphsMaleResult([]);
            setSelectedMorphMaleIdx(0);
            this.setState({searchInputMale: ''});
        } else {
            setDivorceSearchMorphsFemaleResult([]);
            setSelectedMorphFemaleIdx(0);
            this.setState({searchInputFemale: ''});
        }

    };

    onSearch = (e, kind_id, isMale = true) => {
        const {setDivorceSearchMorphsMaleResult, setDivorceSearchMorphsFemaleResult} = this.props;
        if (isMale) {
            this.setState({searchInputMale: e.target.value});
        } else {
            this.setState({searchInputFemale: e.target.value});
        }

        debounceSearch({
            q: e.target.value,
            options: {
                id: Number(kind_id)
            }
        }).then( data => {
            if (isMale) {
                setDivorceSearchMorphsMaleResult(data);
            } else  {
                setDivorceSearchMorphsFemaleResult(data)
            }
        });
    };

    onSelectMorph = (e, isMale = true, {setFieldValue, values}) => {
        const {
            divorce: {
                selectedMorphMaleIdx,
                selectedMorphFemaleIdx,
                searchMorphsMaleResult,
                searchMorphsFemaleResult
            },
            setSelectedMorphMaleIdx,
            setSelectedMorphFemaleIdx,
        } = this.props;

        const node = isMale ? this.searchMaleList.current : this.searchFemaleList.current;
        const selectedMorphIdx = isMale ? selectedMorphMaleIdx : selectedMorphFemaleIdx;
        const searchMorphsResult = isMale ? searchMorphsMaleResult : searchMorphsFemaleResult;

        if (e.key === 'Enter') {
            e.preventDefault();
            if (isMale) {
                setFieldValue('male', [searchMorphsMaleResult[selectedMorphMaleIdx], ...values.male])
            } else {
                setFieldValue('female', [searchMorphsFemaleResult[selectedMorphFemaleIdx], ...values.female])
            }
            return this.clearSearchInput(isMale);
        }
        if (e.keyCode===38 && selectedMorphIdx - 1 >= 0) {
            e.preventDefault();
            const pos = selectedMorphIdx * 37;
            node.scrollTo(0, pos - 37);
            if (isMale) {
                return setSelectedMorphMaleIdx(selectedMorphMaleIdx - 1);
            } else {
                return  setSelectedMorphFemaleIdx(selectedMorphFemaleIdx - 1)
            }
        }

        if (e.keyCode===40 && selectedMorphIdx + 1 < searchMorphsResult.length) {
            e.preventDefault();
            const pos = selectedMorphIdx * 37 + 37;
            if (pos % 4 === 0 && pos > 0) {
                node.scrollTo(0, pos);
            }
            if (isMale) {
                return setSelectedMorphMaleIdx(selectedMorphMaleIdx + 1);
            } else {
                return  setSelectedMorphFemaleIdx(selectedMorphFemaleIdx + 1)
            }
        }
    };

    onSubmit = (data, actions) => {
        const {updateDivorce, getDivorce, setDivorce, id} = this.props;
        updateDivorce(id, data)
            .then( async ({message}) => {
                actions.setStatus(message);
                const data = await getDivorce(id);
                setDivorce(data);
                actions.setValues({
                    ...data,
                    previewsSex: [],
                    previewsMasonry: [],
                    previewsExit: [],
                    acceptedFilesSex: [],
                    acceptedFilesMasonry: [],
                    acceptedFilesExit: [],
                    deletedImagesSex: [],
                    deletedImagesMasonry: [],
                    deletedImagesExit: []
                });
                this.setState({isEdit: false});
                actions.setSubmitting(false);
            })
            // .catch((error) => {
            //     if (error.response.status === 422) {
            //         const errors = error.response.data.errors;
            //         actions.setErrors({
            //             kind_id: errors.kind_id ? errors.kind_id[0] : '',
            //             subcategory_id: errors.subcategory_id ? errors.subcategory_id[0] : '',
            //             cb: errors.cb ? errors.cb[0] : '',
            //             acceptedFilesExit: errors.acceptedFilesExit ? errors.acceptedFilesExit[0] : '',
            //             male: errors.male ? errors.male[0] : '',
            //             female: errors.female ? errors.female[0] : '',
            //         });
            //     }
            //     actions.setSubmitting(false);
            // });
    };

    render() {
        const {divorce, allKinds, match} = this.props;
        const {
            isEdit,
            searchInputMale,
            searchInputMaleBlur,
            searchInputFemale,
            searchInputFemaleBlur,
            is404
        } = this.state;
        const sliderOptions = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 1,
            initialSlide: 0,
        };

        if (divorce.request || allKinds.length === 0) {
            return (
                <Row>
                    {
                        match.path === '/admin/divorces/:id' ?
                            <Helmet>
                                <title>{!divorce.request ?  divorce.title : 'Загрузка'} | Breeders Zone</title>
                            </Helmet>
                            : null
                    }
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
            )
        }

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
            <React.Fragment>
                {
                    match.path === '/admin/divorces/:id' ?
                        <Helmet>
                            <title>{!divorce.request ?  divorce.title : 'Загрузка'} | Breeders Zone</title>
                        </Helmet>
                        : null
                }
                <Formik
                    initialValues={{
                        ...divorce,
                        previewsSex: [],
                        previewsMasonry: [],
                        previewsExit: [],
                        acceptedFilesSex: [],
                        acceptedFilesMasonry: [],
                        acceptedFilesExit: [],
                        deletedImagesSex: [],
                        deletedImagesMasonry: [],
                        deletedImagesExit: []
                    }}
                    onSubmit={this.onSubmit}
                    validationSchema={Yup.object().shape({
                        title: Yup.string()
                            .required('Название должно быть указанно'),
                        kind_id: Yup.string()
                            .required('Категория должна быть указанна'),
                        male: Yup.array(),
                        female: Yup.array(),
                        cb: Yup.date('Дата не правильно введена')
                            .required('Дата рождения должна быть введена')
                    })}
                >
                    {
                        ({
                             handleSubmit,
                             handleChange,
                             handleBlur,
                             setFieldValue,
                             setValues,
                             values,
                             isSubmitting,
                             status,
                         }) => {
                            const selectedKind = allKinds.find((item) => item.id === Number(values.kind_id));

                            if (isSubmitting) {
                                return (
                                    <Row>
                                        <Col xs={12} md={8}>
                                            <Card>
                                                <CardBody>
                                                    <div className="d-flex">
                                                        <Spinner className="m-auto"/>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                        <Col xs={12} md={4}>
                                            <Card>
                                                <CardBody>
                                                    <div className="d-flex">
                                                        <Spinner className="m-auto"/>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                );
                            }

                            return (
                                <Form onSubmit={handleSubmit}>
                                    {
                                        status ?
                                            <Alert color="success" className="mb-3">
                                                {status}
                                            </Alert>
                                            : null
                                    }
                                    <Row>
                                        <Col xs={12} md={8}>
                                            <Card>
                                                <CardHeader className="d-flex justify-content-between align-items-center">
                                                    <h3 className="m-0">{divorce.title}</h3>
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={() => {
                                                            if (isEdit) {
                                                                setValues({
                                                                    ...divorce,
                                                                    acceptedFilesSex: [],
                                                                    acceptedFilesMasonry: [],
                                                                    acceptedFilesExit: []
                                                                });
                                                            }
                                                            this.setState({isEdit: !isEdit})
                                                        }}
                                                    >
                                                        { !isEdit ? 'Редактировать' : 'Отмена'}
                                                    </button>
                                                </CardHeader>
                                                <CardBody>
                                                    <Row className={"align-items-center" + (isEdit ? ' mb-4' : '')}>
                                                        <Col xs={12} md={6}>
                                                            <div className="d-flex">
                                                                <h3 className="mr-3">Название:</h3>
                                                                {
                                                                    isEdit ?
                                                                        <Input
                                                                            className="form-control-alternative"
                                                                            name="title"
                                                                            value={values.title}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                        />
                                                                        : <p>{divorce.title}</p>
                                                                }
                                                            </div>
                                                            <ErrorMessage name="title">
                                                                {
                                                                    msg => <div className="text-danger">{msg}</div>
                                                                }
                                                            </ErrorMessage>
                                                        </Col>
                                                        <Col xs={12} md={6}>
                                                            <div className="d-flex align-items-center">
                                                                <h3 className="mr-3">Производитель:</h3>
                                                                <Link to={`/admin/users/${divorce.user.id}`} className="d-flex align-items-center">
                                                                    <div className="d-flex flex-column rounded-circle overflow-hidden shadow mr-2" style={{
                                                                        width: 35,
                                                                        height: 35
                                                                    }}>
                                                                        <img className="img-fluid m-auto" src={divorce.user.logo_img_url} alt={divorce.title}/>
                                                                    </div>
                                                                    <span>{divorce.user.company_name}</span>
                                                                </Link>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row className="mb-3">
                                                        <Col xs={12} md={6}>
                                                            <div className="d-flex">
                                                                <h3 className="mr-3">Категория:</h3>
                                                                {
                                                                    isEdit ?
                                                                        (
                                                                            <Input
                                                                                className="form-control-alternative"
                                                                                name="kind_id"
                                                                                type="select"
                                                                                value={values.kind_id}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                            >
                                                                                {
                                                                                    allKinds.map( (item) => <option key={item.id} value={item.id}>{item.title_rus}</option> )
                                                                                }
                                                                            </Input>
                                                                        )
                                                                        : (
                                                                            <p>
                                                                                {divorce.kind.title_rus}<br/>
                                                                                ({divorce.kind.title_eng})
                                                                            </p>
                                                                        )
                                                                }
                                                            </div>
                                                            <ErrorMessage name="kind_id">
                                                                {
                                                                    msg => <div className="text-danger">{msg}</div>
                                                                }
                                                            </ErrorMessage>
                                                        </Col>
                                                        {
                                                            selectedKind.subcategories.length > 0 ?
                                                                (
                                                                    <Col xs={12} md={6}>
                                                                        <div className="d-flex">
                                                                            <h3 className="mr-3">Подкатегория:</h3>
                                                                            {
                                                                                isEdit ?
                                                                                    (
                                                                                        <Input
                                                                                            className="form-control-alternative"
                                                                                            name="kind_id"
                                                                                            type="select"
                                                                                            value={values.subcategory_id}
                                                                                            onChange={handleChange}
                                                                                            onBlur={handleBlur}
                                                                                        >
                                                                                            {
                                                                                                selectedKind
                                                                                                    .subcategories
                                                                                                    .map( (item) => <option key={item.id} value={item.id}>{item.title}</option> )
                                                                                            }
                                                                                        </Input>
                                                                                    )
                                                                                    : <p>{divorce.subcategory.title}</p>
                                                                            }
                                                                        </div>
                                                                        <ErrorMessage name="subcategory_id">
                                                                            {
                                                                                msg => <div className="text-danger">{msg}</div>
                                                                            }
                                                                        </ErrorMessage>
                                                                    </Col>
                                                                )
                                                                : null
                                                        }
                                                    </Row>
                                                    <Row>
                                                        <Col xs={12}>
                                                            <div className={"d-flex w-100 mb-3" + (!isEdit ? ' align-items-center' : '')}>
                                                                <h3 className="text-nowrap mr-3">Морфы самца:</h3>
                                                                <div className="w-100 position-relative">
                                                                    {
                                                                        isEdit ?
                                                                            <Input
                                                                                className="form-control-alternative w-100 mb-2"
                                                                                name="morphs-search"
                                                                                type="text"
                                                                                placeholder="Начние вводить морфу"
                                                                                onFocus={() => this.setState({searchInputMaleBlur: true})}
                                                                                onBlur={() => setTimeout(() => {
                                                                                    this.setState({searchInputMaleBlur: false});
                                                                                }, 200)}
                                                                                onChange={(e) => this.onSearch(e, values.kind_id)}
                                                                                onKeyDown={(e) => this.onSelectMorph(e, true, {setFieldValue, values})}
                                                                                value={searchInputMale}
                                                                            />
                                                                            : null
                                                                    }
                                                                    {
                                                                        divorce.searchMorphsMaleResult.length > 0 && searchInputMaleBlur ?
                                                                            (
                                                                                <ul className="morphs d-inline-flex flex-column list-unstyled search-morphs shadow" ref={this.searchMaleList}>
                                                                                    {
                                                                                        divorce.searchMorphsMaleResult.map( ({gene, trait}, idx) => (
                                                                                            <li
                                                                                                key={`${gene.title}-${trait.title}-${gene.id}`}
                                                                                                className={"search-morphs-item " + (divorce.selectedMorphMaleIdx === idx ? "selected" : "")}
                                                                                                onMouseDown={() => {
                                                                                                    setFieldValue('male', [divorce.searchMorphsMaleResult[idx], ...values.male]);
                                                                                                    this.clearSearchInput();
                                                                                                }}
                                                                                            >
                                                                                                <div className={`morph-indicator morph-${toUrl(`${gene.type}-${trait.trait_group ? trait.trait_group.label : trait.title}`)} d-inline-block`}>
                                                                                                    {trait.title} {gene.title}
                                                                                                </div>
                                                                                            </li>
                                                                                        ))
                                                                                    }
                                                                                </ul>
                                                                            )
                                                                            : null
                                                                    }
                                                                    <div className="morphs flex-wrap">
                                                                        {
                                                                            values.male.map( ({gene: {title: geneTitle, type}, trait: {title: traitTitle, trait_group}}, idx) => (
                                                                                <p className={`morph-indicator morph-${type}-${toUrl(trait_group ? trait_group.label : traitTitle)} mb-2`} key={geneTitle + '-' + traitTitle}>
                                                                                    {traitTitle} {geneTitle}
                                                                                    {
                                                                                        isEdit ?
                                                                                            <i
                                                                                                className="fa fa-times ml-2"
                                                                                                style={{
                                                                                                    position: 'relative',
                                                                                                    top: 1,
                                                                                                    cursor: 'pointer'
                                                                                                }}

                                                                                            ></i>
                                                                                            : null
                                                                                    }
                                                                                </p>
                                                                            ))
                                                                        }
                                                                    </div>
                                                                    <ErrorMessage name="male">
                                                                        {
                                                                            msg => <div className="text-danger">{msg}</div>
                                                                        }
                                                                    </ErrorMessage>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12}>
                                                            <div className={"d-flex w-100 mb-3" + (!isEdit ? ' align-items-center' : '')}>
                                                                <h3 className="text-nowrap mr-3">Морфы самки:</h3>
                                                                <div className="w-100 position-relative">
                                                                    {
                                                                        isEdit ?
                                                                            <Input
                                                                                className="form-control-alternative w-100 mb-2"
                                                                                name="morphs-search"
                                                                                type="text"
                                                                                placeholder="Начние вводить морфу"
                                                                                onFocus={() => this.setState({searchInputFemaleBlur: true})}
                                                                                onBlur={() => setTimeout(() => {
                                                                                    this.setState({searchInputFemaleBlur: false});
                                                                                }, 200)}
                                                                                onChange={(e) => this.onSearch(e, values.kind_id, false)}
                                                                                onKeyDown={(e) => this.onSelectMorph(e, false, {setFieldValue, values})}
                                                                                value={searchInputFemale}
                                                                            />
                                                                            : null
                                                                    }
                                                                    {
                                                                        divorce.searchMorphsFemaleResult.length > 0 && searchInputFemaleBlur ?
                                                                            (
                                                                                <ul className="morphs d-inline-flex flex-column list-unstyled search-morphs shadow" ref={this.searchFemaleList}>
                                                                                    {
                                                                                        divorce.searchMorphsFemaleResult.map( ({gene, trait}, idx) => (
                                                                                            <li
                                                                                                key={`${gene.title}-${trait.title}-${gene.id}`}
                                                                                                className={"search-morphs-item " + (divorce.selectedMorphFemaleIdx === idx ? "selected" : "")}
                                                                                                onMouseDown={() => {
                                                                                                    setFieldValue('female', [divorce.searchMorphsFemaleResult[idx], ...values.female]);
                                                                                                    this.clearSearchInput(false);
                                                                                                }}
                                                                                            >
                                                                                                <div className={`morph-indicator morph-${toUrl(`${gene.type}-${trait.trait_group ? trait.trait_group.label : trait.title}`)} d-inline-block`}>
                                                                                                    {trait.title} {gene.title}
                                                                                                </div>
                                                                                            </li>
                                                                                        ))
                                                                                    }
                                                                                </ul>
                                                                            )
                                                                            : null
                                                                    }
                                                                    <div className="morphs flex-wrap">
                                                                        {
                                                                            values.female.map( ({gene: {title: geneTitle, type}, trait: {title: traitTitle, trait_group}}, idx) => (
                                                                                <p className={`morph-indicator morph-${type}-${toUrl(trait_group ? trait_group.label : traitTitle)} mb-2`} key={geneTitle + '-' + traitTitle}>
                                                                                    {traitTitle} {geneTitle}
                                                                                    {
                                                                                        isEdit ?
                                                                                            <i
                                                                                                className="fa fa-times ml-2"
                                                                                                style={{
                                                                                                    position: 'relative',
                                                                                                    top: 1,
                                                                                                    cursor: 'pointer'
                                                                                                }}
                                                                                            ></i>
                                                                                            : null
                                                                                    }
                                                                                </p>
                                                                            ))
                                                                        }
                                                                    </div>
                                                                    <ErrorMessage name="female">
                                                                        {
                                                                            msg => <div className="text-danger">{msg}</div>
                                                                        }
                                                                    </ErrorMessage>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs={12} md={6}>
                                                            <div className="d-flex w-100">
                                                                <h3 className="mr-3 text-nowrap">Дата рождения:</h3>
                                                                {
                                                                    isEdit ?
                                                                        (
                                                                            <FormGroup className="w-100">
                                                                                <InputGroup className="input-group-alternative">
                                                                                    <InputGroupAddon addonType="prepend">
                                                                                        <InputGroupText>
                                                                                            <i className="ni ni-calendar-grid-58" />
                                                                                        </InputGroupText>
                                                                                    </InputGroupAddon>
                                                                                    <ReactDatetime
                                                                                        inputProps={{
                                                                                            placeholder: "Date Picker Here"
                                                                                        }}
                                                                                        timeFormat={false}
                                                                                        dateFormat="DD/MM/YYYY"
                                                                                        onChange={(value) => {
                                                                                            setFieldValue('cb', value);
                                                                                        }}
                                                                                        defaultValue={new Date(divorce.cb)}
                                                                                    />
                                                                                </InputGroup>
                                                                            </FormGroup>
                                                                        )
                                                                        : <p>{moment(divorce.cb).format('DD/MM/YYYY')}</p>
                                                                }
                                                            </div>
                                                            <ErrorMessage name="cb">
                                                                {
                                                                    msg => <div className="text-danger">{msg}</div>
                                                                }
                                                            </ErrorMessage>
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
                                        <Col xs={12} md={4}>
                                            <Card>
                                                <CardBody>
                                                    <Slider {...sliderOptions}>
                                                        {
                                                            isEdit ?
                                                                values.sex_photos.map( (item, idx) => (
                                                                    <div
                                                                        key={item.img_src}
                                                                        className="slider-item position-relative rounded"
                                                                    >
                                                                        <img src={item.img_src} className="img-fluid rounded" alt="main"/>
                                                                        <span
                                                                            style={{
                                                                                position: 'absolute',
                                                                                top: 3,
                                                                                right: 3,
                                                                                cursor: 'pointer'
                                                                            }}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                const sex_photos = values.sex_photos;
                                                                                sex_photos.splice(idx, 1);

                                                                                setFieldValue('sex_photos', sex_photos);
                                                                                setFieldValue('deletedImagesSex', [item, ...values.deletedImagesSex])
                                                                            }}
                                                                        >
                                                                            <i className="ni ni-2x ni-fat-remove text-danger"></i>
                                                                    </span>
                                                                    </div>
                                                                ))
                                                                : divorce.sex_photos.map( (item) => (
                                                                    <div
                                                                        key={item.img_src}
                                                                        className="slider-item position-relative rounded"
                                                                    >
                                                                        <img src={item.img_src} className="img-fluid rounded" alt="main"/>
                                                                    </div>
                                                                ))
                                                        }
                                                    </Slider>
                                                    {
                                                        isEdit ?
                                                            <Dropzone
                                                                onDrop={acceptedFiles => {
                                                                    const previews = [];
                                                                    for (let item of acceptedFiles){
                                                                        previews.push(URL.createObjectURL(item))
                                                                    }
                                                                    setFieldValue('previewsSex', [...previews, ...values.previewsSex]);
                                                                    setFieldValue('acceptedFilesSex', [...acceptedFiles, ...values.acceptedFilesSex]);
                                                                }}
                                                            >
                                                                {
                                                                    ({getRootProps, getInputProps}) => (
                                                                        <div {...getRootProps()}  className="p-3 row m-0 mb-2 rounded shadow w-100">
                                                                            <input {...getInputProps()} name="dropzoneSex"/>
                                                                            {
                                                                                values.previewsSex.length > 0 ?
                                                                                    values.previewsSex.map( (item, idx) => (
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
                                                                                                    const acceptedFilesSex = values.acceptedFilesSex;
                                                                                                    const previewsSex = values.previewsSex;
                                                                                                    acceptedFilesSex.splice(idx, 1);
                                                                                                    previewsSex.splice(idx, 1);

                                                                                                    setFieldValue('acceptedFilesSex', acceptedFilesSex);
                                                                                                    setFieldValue('previewsSex', previewsSex)
                                                                                                }}
                                                                                            >
                                                                                            <i className="ni ni-2x ni-fat-remove text-danger"></i>
                                                                                        </span>
                                                                                        </Col>
                                                                                    ))
                                                                                    : <p className="text-center font-weight-bold m-auto">Перетащите файлы сюда или кликните, чтобы выбрать файл</p>
                                                                            }
                                                                        </div>
                                                                    )
                                                                }
                                                            </Dropzone>
                                                            : null
                                                    }

                                                    <Slider {...sliderOptions}>
                                                        {
                                                            isEdit ?
                                                                values.masonry_photos.map( (item, idx) => (
                                                                    <div
                                                                        key={item.img_src}
                                                                        className="slider-item position-relative rounded"
                                                                    >
                                                                        <img src={item.img_src} className="img-fluid rounded" alt="main"/>
                                                                        <span
                                                                            style={{
                                                                                position: 'absolute',
                                                                                top: 3,
                                                                                right: 3,
                                                                                cursor: 'pointer'
                                                                            }}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                const masonry_photos = values.masonry_photos;
                                                                                masonry_photos.splice(idx, 1);

                                                                                setFieldValue('masonry_photos', masonry_photos);
                                                                                setFieldValue('deletedImagesMasonry', [item, ...values.deletedImagesMasonry])
                                                                            }}
                                                                        >
                                                                            <i className="ni ni-2x ni-fat-remove text-danger"></i>
                                                                    </span>
                                                                    </div>
                                                                ))
                                                                : divorce.masonry_photos.map( (item) => (
                                                                    <div
                                                                        key={item.img_src}
                                                                        className="slider-item position-relative rounded"
                                                                    >
                                                                        <img src={item.img_src} className="img-fluid rounded" alt="main"/>
                                                                    </div>
                                                                ))
                                                        }
                                                    </Slider>
                                                    {
                                                        isEdit ?
                                                            <Dropzone
                                                                onDrop={acceptedFiles => {
                                                                    const previews = [];
                                                                    for (let item of acceptedFiles){
                                                                        previews.push(URL.createObjectURL(item))
                                                                    }
                                                                    setFieldValue('previewsMasonry', [...previews, ...values.previewsMasonry]);
                                                                    setFieldValue('acceptedFilesMasonry', [...acceptedFiles, ...values.acceptedFilesMasonry]);
                                                                }}
                                                            >
                                                                {
                                                                    ({getRootProps, getInputProps}) => (
                                                                        <div {...getRootProps()}  className="p-3 row m-0 mb-2 rounded shadow w-100">
                                                                            <input {...getInputProps()} name="dropzoneSex"/>
                                                                            {
                                                                                values.previewsMasonry.length > 0 ?
                                                                                    values.previewsMasonry.map( (item, idx) => (
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
                                                                                                    const acceptedFilesMasonry = values.acceptedFilesMasonry;
                                                                                                    const previewsMasonry = values.previewsMasonry;
                                                                                                    acceptedFilesMasonry.splice(idx, 1);
                                                                                                    previewsMasonry.splice(idx, 1);

                                                                                                    setFieldValue('acceptedFilesMasonry', acceptedFilesMasonry);
                                                                                                    setFieldValue('previewsMasonry', previewsMasonry)
                                                                                                }}
                                                                                            >
                                                                                            <i className="ni ni-2x ni-fat-remove text-danger"></i>
                                                                                        </span>
                                                                                        </Col>
                                                                                    ))
                                                                                    : <p className="text-center font-weight-bold m-auto">Перетащите файлы сюда или кликните, чтобы выбрать файл</p>
                                                                            }
                                                                        </div>
                                                                    )
                                                                }
                                                            </Dropzone>
                                                            : null
                                                    }

                                                    <Slider {...sliderOptions}>
                                                        {
                                                            isEdit ?
                                                                values.exit_photos.map( (item, idx) => (
                                                                    <div
                                                                        key={item.img_src}
                                                                        className="slider-item position-relative rounded"
                                                                    >
                                                                        <img src={item.img_src} className="img-fluid rounded" alt="main"/>
                                                                        <span
                                                                            style={{
                                                                                position: 'absolute',
                                                                                top: 3,
                                                                                right: 3,
                                                                                cursor: 'pointer'
                                                                            }}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                const exit_photos = values.exit_photos;
                                                                                exit_photos.splice(idx, 1);

                                                                                setFieldValue('exit_photos', exit_photos);
                                                                                setFieldValue('deletedImagesExit', [item, ...values.deletedImagesExit])
                                                                            }}
                                                                        >
                                                                            <i className="ni ni-2x ni-fat-remove text-danger"></i>
                                                                    </span>
                                                                    </div>
                                                                ))
                                                                : divorce.exit_photos.map( (item) => (
                                                                    <div
                                                                        key={item.img_src}
                                                                        className="slider-item position-relative rounded"
                                                                    >
                                                                        <img src={item.img_src} className="img-fluid rounded" alt="main"/>
                                                                    </div>
                                                                ))
                                                        }
                                                    </Slider>
                                                    {
                                                        isEdit ?
                                                            <Dropzone
                                                                onDrop={acceptedFiles => {
                                                                    const previews = [];
                                                                    for (let item of acceptedFiles){
                                                                        previews.push(URL.createObjectURL(item))
                                                                    }
                                                                    setFieldValue('previewsExit', [...previews, ...values.previewsExit]);
                                                                    setFieldValue('acceptedFilesExit', [...acceptedFiles, ...values.acceptedFilesExit]);
                                                                }}
                                                            >
                                                                {
                                                                    ({getRootProps, getInputProps}) => (
                                                                        <div {...getRootProps()}  className="p-3 row m-0 mb-2 rounded shadow w-100">
                                                                            <input {...getInputProps()} name="dropzoneExit"/>
                                                                            {
                                                                                values.previewsExit.length > 0 ?
                                                                                    values.previewsExit.map( (item, idx) => (
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
                                                                                                    const acceptedFilesExit = values.acceptedFilesExit;
                                                                                                    const previewsExit = values.previewsExit;
                                                                                                    acceptedFilesExit.splice(idx, 1);
                                                                                                    previewsExit.splice(idx, 1);

                                                                                                    setFieldValue('acceptedFilesExit', acceptedFilesExit);
                                                                                                    setFieldValue('previewsExit', previewsExit)
                                                                                                }}
                                                                                            >
                                                                                            <i className="ni ni-2x ni-fat-remove text-danger"></i>
                                                                                        </span>
                                                                                        </Col>
                                                                                    ))
                                                                                    : <p className="text-center font-weight-bold m-auto">Перетащите файлы сюда или кликните, чтобы выбрать файл</p>
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
            </React.Fragment>
        )
    }
}

const mapMethodsToProps = ({getDivorce, updateDivorce}) => ({
    getDivorce,
    updateDivorce
});

const mapStateToProps = ({divorce, kinds: {all: allKinds}}) => ({
    divorce,
    allKinds
});

export default connect(mapStateToProps, {
    setDivorce,
    setDivorceRequest,
    setDivorceSearchMorphsMaleResult,
    setDivorceSearchMorphsFemaleResult,
    setSelectedMorphMaleIdx,
    setSelectedMorphFemaleIdx
})(
    withErrorBoundary(
        withDataService(withRouter(DivorceFrom), mapMethodsToProps)
    )
);
