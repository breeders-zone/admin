import React, {Component} from "react";
import Header from "../Headers/Header";
import {
    Alert,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container, Form, FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Row,
    Spinner
} from "reactstrap";
import {connect} from "react-redux";
import {
    addProductLocality, deleteProductLocality,
    deleteProductMorph,
    setProduct, setProductLocality,
    setProductMorph,
    setProductRequest,
    setProductSearchMorphsResult,
    setSelectedMorphIdx
} from "../../actions";
import {toUrl} from "../../utils";
import moment from "moment";
import {Link, withRouter} from "react-router-dom";
import Slider from "react-slick";
import {ErrorMessage, Formik} from "formik";
import {DataService} from "../../services";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import ReactDatetime from "react-datetime";
import Dropzone from "react-dropzone";
import Error404 from "../../views/Error404";
import * as Yup from "yup";
const dataService = new DataService();
const debounceSearch = AwesomeDebouncePromise(
    dataService.searchMorphs,
    300
);

class ProductForm extends Component{

    state = {
        mainImg: {
            id: null,
            img_src: ''
        },
        searchInput: '',
        searchInputBlur: false,
        isEdit: false,
        is404: false
    };

    searchList = React.createRef();

    componentDidMount() {
        this.getProduct();
    }

    getProduct = (productRequest = true) => {
        const {setProduct, setProductRequest, id} = this.props;

        if (productRequest) {
            setProductRequest(true);
        }
        dataService.getProduct(id)
            .then( (data) => {
                setProduct({
                    ...data,
                    initialMorphs: [...data.morphs],
                });
                if (data.product_images[0])
                    this.setState({mainImg: data.product_images[0]});
                setProductRequest(false);
            })
            .catch((error) => {
                if (error.response.status === 404)
                    this.setState({is404: true});
                setProductRequest(false);
            });
    };

    clearSearchInput = () => {
        const { setSelectedMorphIdx, setProductSearchMorphsResult } = this.props;
        setProductSearchMorphsResult([]);
        setSelectedMorphIdx(0);
        this.setState({ searchInput : '' })
    };

    onSearch = (e) => {
        const {setProductSearchMorphsResult} = this.props;
        this.setState({searchInput: e.target.value});
        debounceSearch({
            q: e.target.value
        }).then( data => setProductSearchMorphsResult(data));
    };

    onSelectMorph = (e) => {
        const {product: {selectedMorphIdx, searchMorphsResult}, setProductMorph, setSelectedMorphIdx} = this.props;

        const node = this.searchList.current;
        if (e.key === 'Enter') {
            e.preventDefault();
            setProductMorph(selectedMorphIdx);
            return this.clearSearchInput();
        }
        if (e.keyCode===38 && selectedMorphIdx - 1 >= 0) {
            e.preventDefault();
            const pos = selectedMorphIdx * 37;
            node.scrollTo(0, pos - 37);
            return setSelectedMorphIdx(selectedMorphIdx - 1);
        }

        if (e.keyCode===40 && selectedMorphIdx + 1 < searchMorphsResult.length) {
            e.preventDefault();
            const pos = selectedMorphIdx * 37 + 37;
            if (pos % 4 === 0 && pos > 0) {
                node.scrollTo(0, pos);
            }
            return setSelectedMorphIdx(selectedMorphIdx + 1);
        }
    };

    onSubmit = (data, actions) => {
        const {product: {morphs}, id, setProduct, setProductRequest} = this.props;

        dataService.updateProduct(id, {
            ...data,
            locality_id: data.locality_id !== 'none' ? data.locality_id : null,
            product_images: data.acceptedFiles,
            morphs,
        })
            .then( async ({success}) => {
                this.setState({isEdit: false});
                actions.setStatus(success);
                const data = await dataService.getProduct(id);
                setProduct({
                    ...data,
                    initialMorphs: [...data.morphs]
                });
                actions.setValues({
                    ...data,
                    acceptedFiles: [],
                    previews: [],
                    deletedImages: [],
                    sex: this.props.product.sex ? '1' : '0',
                    age: this.props.product.age.title
                });
                if (data.product_images[0])
                    this.setState({mainImg: data.product_images[0]});
                setProductRequest(false);

                actions.setSubmitting(false);
            })
            .catch((error) => {
                if (error.response.status === 422) {
                    const errors = error.response.data.errors;
                    actions.setErrors({
                        name: errors.name ? errors.name[0] : '',
                        kind_id: errors.kind_id ? errors.kind_id[0] : '',
                        subcategory_id: errors.subcategory_id ? errors.subcategory_id[0] : '',
                        morphs: errors.morphs ? errors.morphs[0] : '',
                        acceptedFiles: errors.acceptedFiles ? errors.acceptedFiles[0] : '',
                        sex: errors.sex ? errors.sex[0] : '',
                        age: errors.age ? errors.age[0] : '',
                        cb: errors.cb ? errors.cb[0] : '',
                        product_images: errors.product_images ? errors.product_images[0] : '',
                    });
                }
                actions.setSubmitting(false);
            })
    };

    render() {
        const {
            product,
            allKinds,
            setProductMorph,
            deleteProductMorph,
            setProduct
        } = this.props;
        const {mainImg, isEdit, searchInput, searchInputBlur, is404} = this.state;
        const sliderOptions = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 1,
            initialSlide: 0,
        };

        if (product.request || allKinds.length === 0) {
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

        const subcategory_id = typeof allKinds.find((item) => item.id === product.kind_id).subcategories !== 'undefined' ? allKinds.find((item) => item.id === product.kind_id).subcategories[0].id : '';

        return (
            <Formik
                initialValues={{
                    ...product,
                    subcategory_id: product.subcategory_id ?
                        product.subcategory_id
                        : subcategory_id,
                    deletedImages: [],
                    previews: [],
                    acceptedFiles: [],
                    sex: product.sex ? '1' : '0',
                    age: product.age.title
                }}
                validationSchema={Yup.object().shape({
                    name: Yup.string()
                        .required('Название должно быть указанно'),
                    kind_id: Yup.string()
                        .required('Категория должна быть указанна'),
                    subcategory_id: Yup.string()
                        .nullable()
                        .when('kind_id', {
                            is: true,
                            then: Yup.string()
                                .nullable()
                                .test('match', 'Данная подкатегория не пренадлежит выбранной категории', function () {
                                    return allKinds.find( (item) => item.id === this.parent.kind_id).has_subcategories
                                })
                                .required('Подкатегория должна быть указанна')
                        }),
                    sex: Yup.string().required("Укажите пол"),
                    cb: Yup.date('Дата не правильно введена')
                        .required('Дата рождения должна быть введена'),
                    age: Yup.string().required("Укажите возраст")
                })}
                onSubmit={this.onSubmit}
            >
                {
                    ({
                         values,
                         handleChange,
                         handleBlur,
                         setFieldValue,
                         handleSubmit,
                         status,
                         isSubmitting
                     }) => {
                        const selectedKind = allKinds.find((item) => item.id == values.kind_id);

                        if (isSubmitting) {
                            return (
                                <Row>
                                    <Col xs={12} md={8}>
                                        <Card>
                                            <CardBody>
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <Spinner/>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <Card>
                                            <CardBody>
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <Spinner/>
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
                                                <h3 className="m-0">{product.name}</h3>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() => {
                                                        if (isEdit) {
                                                            setProduct({
                                                                morphs: product.initialMorphs,
                                                                localities: product.initialLocalities,
                                                                searchMorphsResult: [],
                                                                selectedMorphIdx: 0,
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
                                                                        name="name"
                                                                        value={values.name}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                    />
                                                                    : <p>{product.name}</p>
                                                            }
                                                        </div>
                                                        <ErrorMessage name="name">
                                                            {
                                                                msg => <div className="text-danger">{msg}</div>
                                                            }
                                                        </ErrorMessage>
                                                    </Col>
                                                    <Col xs={12} md={6}>
                                                        <div className="d-flex align-items-center">
                                                            <h3 className="mr-3">Производитель:</h3>
                                                            <Link to={`/admin/users/${product.user.id}`} className="d-flex align-items-center">
                                                                <div className="d-flex flex-column rounded-circle overflow-hidden shadow mr-2" style={{
                                                                    width: 35,
                                                                    height: 35
                                                                }}>
                                                                    <img className="img-fluid m-auto" src={product.user.logo_img_url}/>
                                                                </div>
                                                                <span>{product.user.company_name}</span>
                                                            </Link>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
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
                                                                            {product.kind.title_rus}<br/>
                                                                            ({product.kind.title_eng})
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
                                                        selectedKind.has_subcategories && selectedKind.subcategories.length > 0 ?
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
                                                                            : <p>{product.subcategory ? product.subcategory.title : null}</p>
                                                                    }
                                                                </div>
                                                                <ErrorMessage name="subcategory_id">
                                                                    {
                                                                        msg => <div className="text-danger">{msg}</div>
                                                                    }
                                                                </ErrorMessage>
                                                            </Col>
                                                            : null
                                                    }
                                                </Row>
                                                <div className="d-flex">
                                                    <h3 className="mr-3">Пол:</h3>
                                                    {
                                                        isEdit ?
                                                            (
                                                                <React.Fragment>
                                                                    <label
                                                                        className="mr-2"
                                                                        htmlFor="sex-male"
                                                                    >
                                                                        <i
                                                                            className="fa fa-lg fa-mars"
                                                                            style={{
                                                                                color: values.sex === '1' ? '#3F81E5' : '#bbb'
                                                                            }}
                                                                        ></i>
                                                                    </label>
                                                                    <Input
                                                                        className="form-control-alternative"
                                                                        id="sex-male"
                                                                        name="sex"
                                                                        type="radio"
                                                                        value="1"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        style={{
                                                                            opacity: 0
                                                                        }}
                                                                    />
                                                                    <label htmlFor="sex-female">
                                                                        <i
                                                                            className="fa fa-lg fa-venus"
                                                                            style={{
                                                                                color: values.sex === '0' ? '#C11F80' : '#bbb'
                                                                            }}
                                                                        ></i>
                                                                    </label>
                                                                    <Input
                                                                        className="form-control-alternative"
                                                                        id="sex-female"
                                                                        name="sex"
                                                                        type="radio"
                                                                        value="0"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        style={{
                                                                            opacity: 0
                                                                        }}
                                                                    />
                                                                </React.Fragment>
                                                            )
                                                            : (
                                                                <p>
                                                                    <i
                                                                        className={"fa fa-lg" + (product.sex ? ' fa-mars' : ' fa-venus')}
                                                                        style={{
                                                                            color: product.sex ? '#3F81E5' : '#C11F80'
                                                                        }}
                                                                    ></i>
                                                                </p>
                                                            )
                                                    }
                                                    <ErrorMessage name="sex">
                                                        {
                                                            msg => <div className="text-danger">{msg}</div>
                                                        }
                                                    </ErrorMessage>
                                                </div>

                                                <div className={"d-flex mb-3" + (!isEdit ? ' align-items-center' : '')}>
                                                    <h3 className="mr-3">Морфы:</h3>
                                                    <div className="w-100 position-relative">
                                                        {
                                                            isEdit ?
                                                                <Input
                                                                    className="form-control-alternative w-100 mb-2"
                                                                    name="morphs-search"
                                                                    type="text"
                                                                    placeholder="Начние вводить морфу"
                                                                    onFocus={() => this.setState({searchInputBlur: true})}
                                                                    onBlur={() => setTimeout(() => {
                                                                        this.setState({searchInputBlur: false});
                                                                    }, 200)}
                                                                    onChange={this.onSearch}
                                                                    onKeyDown={this.onSelectMorph}
                                                                    value={searchInput}
                                                                />
                                                                : null
                                                        }
                                                        {
                                                            product.searchMorphsResult.length > 0 && searchInputBlur ?
                                                                (
                                                                    <ul className="morphs d-inline-flex flex-column list-unstyled search-morphs shadow" ref={this.searchList}>
                                                                        {
                                                                            product.searchMorphsResult.map( ({gene, trait}, idx) => (
                                                                                <li
                                                                                    key={`${gene.title}-${trait.title}-${gene.id}`}
                                                                                    className={"search-morphs-item " + (product.selectedMorphIdx === idx ? "selected" : "")}
                                                                                    onMouseDown={() => {
                                                                                        setProductMorph(idx);
                                                                                        this.clearSearchInput();
                                                                                    }}
                                                                                >
                                                                                    <div className={`morph-indicator morph-${toUrl(`${gene.type}-${trait.title}`)} d-inline-block`}>
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
                                                                product.morphs.map( ({gene: {title: geneTitle, type}, trait: {title: traitTitle}}, idx) => (
                                                                    <a className={`morph-indicator morph-${type}-${toUrl(traitTitle)} mb-2`} key={geneTitle + '-' + traitTitle}>
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
                                                                                    onClick={() => deleteProductMorph(idx)}
                                                                                ></i>
                                                                                : null
                                                                        }
                                                                    </a>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                {
                                                    selectedKind.localities.length > 0 ?
                                                        (
                                                            <div className="d-flex align-items-center mb-3">
                                                                <h3 className="title">Локалитет:</h3>
                                                                {
                                                                    isEdit ?
                                                                        (
                                                                            <div className="d-flex flex-column w-100 ml-2">
                                                                                <Row>
                                                                                    <Col xs={12}>
                                                                                        <Input
                                                                                            className="form-control-alternative"
                                                                                            name="locality_id"
                                                                                            type="select"
                                                                                            onChange={handleChange}
                                                                                            onBlur={handleBlur}
                                                                                            value={values.locality_id}
                                                                                        >
                                                                                            <option value="none">Нет</option>
                                                                                            {
                                                                                                selectedKind.localities.map((item) => <option key={"locality-value-" + item.id} value={item.id}>{item.title}</option> )
                                                                                            }
                                                                                        </Input>
                                                                                    </Col>
                                                                                </Row>
                                                                            </div>
                                                                        )
                                                                        : (
                                                                            <div className="morphs">
                                                                                {
                                                                                    product.locality ?
                                                                                        <a className="morph-indicator morph-other-normal">
                                                                                            {product.locality.title}
                                                                                        </a>
                                                                                        : null
                                                                                }
                                                                            </div>
                                                                        )
                                                                }
                                                            </div>
                                                        )
                                                        : null
                                                }
                                                <Row>
                                                    <Col xs={12} md={6}>
                                                        <div className="d-flex">
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
                                                                                    defaultValue={new Date(product.cb)}
                                                                                />
                                                                            </InputGroup>
                                                                            <ErrorMessage name="cb">
                                                                                {
                                                                                    msg => <div className="text-danger">{msg}</div>
                                                                                }
                                                                            </ErrorMessage>
                                                                        </FormGroup>
                                                                    )
                                                                    : <p>{moment(product.cb).format('DD/MM/YYYY')}</p>
                                                            }
                                                        </div>
                                                    </Col>
                                                    <Col xs={12} md={6}>
                                                        <div className="d-flex">
                                                            <h3 className="mr-3">Возраст:</h3>
                                                            {
                                                                isEdit ?
                                                                    (
                                                                        <Input
                                                                            className="form-control-alternative"
                                                                            name="age"
                                                                            type="select"
                                                                            value={values.age}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                        >
                                                                            <option value="Baby">Baby</option>
                                                                            <option value="Subadult">Subadult</option>
                                                                            <option value="Adult">Adult</option>
                                                                        </Input>
                                                                    )
                                                                    : <p>{product.age.title}</p>
                                                            }
                                                        </div>
                                                        <ErrorMessage name="age">
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
                                                {
                                                    mainImg.id ?
                                                        (
                                                            <div className="img-main-container mb-2 rounded" onClick={() => this.setState({modalImage: true})}>
                                                                <img src={mainImg.img_src} className="img-fluid img-main rounded" alt="main"/>
                                                            </div>
                                                        )
                                                        : null
                                                }
                                                <Slider {...sliderOptions}>
                                                    {
                                                        isEdit ?
                                                            values.product_images.map( (item, idx) => (
                                                                <div
                                                                    key={item.img_src}
                                                                    onClick={() => this.setState({mainImg: item})}
                                                                    className={"slider-item position-relative rounded" + (item.id === mainImg.id ? ' selected' : '')}
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
                                                                            const product_images = values.product_images;
                                                                            product_images.splice(idx, 1);
                                                                            if (item.id === mainImg.id) {
                                                                                this.setState({mainImg: {
                                                                                        id: null,
                                                                                        img_src: ''
                                                                                    }});
                                                                            }

                                                                            setFieldValue('product_images', product_images);
                                                                            setFieldValue('deletedImages', [item, ...values.deletedImages])
                                                                        }}
                                                                    >
                                                                            <i className="ni ni-2x ni-fat-remove text-danger"></i>
                                                                    </span>
                                                                </div>
                                                            ))
                                                            : product.product_images.map( (item) => (
                                                                <div
                                                                    key={item.img_src}
                                                                    onClick={() => this.setState({mainImg: item})}
                                                                    className={"slider-item position-relative rounded" + (item.id === mainImg.id ? ' selected' : '')}
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
                                                                setFieldValue('previews', [...previews, ...values.previews]);
                                                                setFieldValue('acceptedFiles', [...acceptedFiles, ...values.acceptedFiles]);
                                                            }}
                                                        >
                                                            {
                                                                ({getRootProps, getInputProps}) => (
                                                                    <div {...getRootProps()}  className="p-3 row m-0 mb-2 rounded shadow w-100">
                                                                        <input {...getInputProps()} name="dropzone"/>
                                                                        {
                                                                            values.previews.length > 0 ?
                                                                                values.previews.map( (item, idx) => (
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
                                                                                                const acceptedFiles = values.acceptedFiles;
                                                                                                const previews = values.previews;
                                                                                                acceptedFiles.splice(idx, 1);
                                                                                                previews.splice(idx, 1);

                                                                                                setFieldValue('acceptedFiles', acceptedFiles);
                                                                                                setFieldValue('previews', previews)
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
                                                <div className={"d-flex" + (values.product_images.length > 0 ? ' mt-3' : '')}>
                                                    <h3 className="m-0 mr-2">Описание:</h3>
                                                    {
                                                        isEdit ?
                                                            <Input
                                                                className="form-control-alternative"
                                                                name="description"
                                                                type="textarea"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.description}
                                                            />
                                                            : <p className="m-0 font-weight-bold">{product.description}</p>
                                                    }
                                                </div>
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

const mapStateToProps = ({product, router, kinds: { all: allKinds }}) => ({
    product,
    router,
    allKinds
});

export default connect(mapStateToProps, {
    setProduct,
    setProductRequest,
    setProductSearchMorphsResult,
    setProductMorph,
    setSelectedMorphIdx,
    deleteProductMorph,
})(
    withRouter(ProductForm)
);