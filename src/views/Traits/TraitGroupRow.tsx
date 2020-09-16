import {Link} from "react-router-dom";
import {
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Form,
    Input,
    Media,
    Spinner,
    UncontrolledDropdown
} from "reactstrap";
import React, {useContext} from "react";
import {ITraitGroup} from "../../reducers/traits/types";
import {deleteTraitGroup, editTraitGroup, setTraitGroup} from "../../actions/traits/traits";
import {useDispatch} from "react-redux";
import {ErrorMessage, Formik, FormikHelpers} from "formik";
import DataService from "../../services/DataService";
import DataServiceContext from "../../context/DataServiceContext";

type TraitGroupRowProps =  ITraitGroup & {idx?: number};

const TraitGroupRow = (props: TraitGroupRowProps) => {
    const dispatch = useDispatch();

    const dataService: DataService = useContext(DataServiceContext);

    const onSubmit = (data: TraitGroupRowProps, actions: FormikHelpers<TraitGroupRowProps>) => {
        if (props.id) {
            dataService.updateTraitGroup(props.id, data)
                .then(async () => {
                    const traitGroup: ITraitGroup = await dataService.getTraitGroup(props.id);
                    actions.setValues({
                        ...traitGroup
                    });

                    dispatch(setTraitGroup({
                        ...traitGroup,
                        edit: false
                    }));
                    actions.setSubmitting(false);
                })
                .catch( (error) => {
                    if (error.response.status === 422) {
                        const errors = error.response.data.errors;

                        actions.setErrors({
                            title: errors.title ? errors.title[0] : '',
                            type: errors.type ? errors.type[0] : '',
                            label: errors.label ? errors.label[0] : ''
                        });
                    }
                });

            return;
        }

        dataService.setTraitGroup(data)
            .then(async ({data}) => {
                actions.setValues({
                    ...data
                });

                dispatch(setTraitGroup({
                    idx: props.idx,
                    ...data,
                    edit: false
                }));
                actions.setSubmitting(false);
            })
            .catch( (error) => {
                if (error.response.status === 422) {
                    const errors = error.response.data.errors;

                    actions.setErrors({
                        title: errors.title ? errors.title[0] : '',
                        type: errors.type ? errors.type[0] : '',
                        label: errors.label ? errors.label[0] : ''
                    });
                }
            });
    };

    return (
        <tr>
            <Formik
                initialValues={{
                    ...props
                }}
                onSubmit={onSubmit}
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
                        if (isSubmitting) {
                            return (
                                <React.Fragment>
                                    <th scope="row">
                                        <Media className="align-propss-center text-dark">
                                            <i className="ni ni-folder-17 text-yellow"></i>
                                        </Media>
                                    </th>
                                    <th scope="row">
                                        <Spinner size="sm"/>
                                    </th>
                                    <th scope="row">
                                        <Spinner size="sm"/>
                                    </th>
                                    <th scope="row">
                                        <Spinner size="sm"/>
                                    </th>
                                    <th scope="row" className="text-right mr-3">
                                        <Spinner size="sm"/>
                                    </th>
                                </React.Fragment>
                            )
                        }

                        return (
                            <React.Fragment>
                                <th scope="row">
                                    <Link to={`/admin/traits?trait_group=${props.id}`}>
                                         <Media className="align-propss-center text-dark">
                                             <i className="ni ni-folder-17 text-yellow"></i>
                                         </Media>
                                    </Link>
                                </th>
                                <td>
                                 {
                                     props.edit ?
                                         <Form onSubmit={handleSubmit}>
                                             <Input
                                                 className="form-control-alternative"
                                                 name="title"
                                                 onChange={handleChange}
                                                 onBlur={handleBlur}
                                                 value={values.title}
                                             />
                                             <ErrorMessage name="title">
                                                 {
                                                     msg => <div className="text-danger">{msg}</div>
                                                 }
                                             </ErrorMessage>
                                         </Form>
                                         : <Link to={`/admin/traits?trait_group=${props.id}`}>
                                             <Media className="align-propss-center text-dark">
                                                 {props.title}
                                             </Media>
                                         </Link>
                                 }
                                </td>
                                <td>
                                 {
                                     props.edit ?
                                         <Form onSubmit={handleSubmit}>
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
                                             <ErrorMessage name="type">
                                                 {
                                                     msg => <div className="text-danger">{msg}</div>
                                                 }
                                             </ErrorMessage>
                                         </Form>
                                         : <Link to={`/admin/traits?trait_group=${props.id}`}>
                                             <Media className="align-propss-center text-dark">
                                                 {props.type}
                                             </Media>
                                         </Link>
                                 }
                                </td>
                                <td>
                                 {
                                     props.edit ?
                                         <Form onSubmit={handleSubmit}>
                                             <Input
                                                 className="form-control-alternative"
                                                 name="label"
                                                 onChange={handleChange}
                                                 onBlur={handleBlur}
                                                 value={values.label}
                                             />
                                             <ErrorMessage name="label">
                                                 {
                                                     msg => <div className="text-danger">{msg}</div>
                                                 }
                                             </ErrorMessage>
                                         </Form>
                                         : <Link to={`/admin/traits?trait_group=${props.id}`}>
                                             <Media className="align-propss-center text-dark">
                                                 {props.label}
                                             </Media>
                                         </Link>
                                 }
                                </td>
                                <td className="text-right">
                                 <UncontrolledDropdown>
                                     <DropdownToggle
                                         className="btn-icon-only text-light"
                                         href="#"
                                         role="button"
                                         size="sm"
                                         color=""
                                         onClick={e => e.preventDefault()}
                                     >
                                         <i className="fas fa-ellipsis-v" />
                                     </DropdownToggle>
                                     <DropdownMenu className="dropdown-menu-arrow" right>
                                         <DropdownItem
                                             href="#"
                                             onClick={e => {
                                                 e.preventDefault();
                                                 dispatch(editTraitGroup(props.id))
                                             }}
                                         >
                                             Редактировать
                                         </DropdownItem>
                                         <DropdownItem
                                             href="#"
                                             onClick={e => {
                                                 e.preventDefault();
                                                 dispatch(deleteTraitGroup(props.id))
                                             }}
                                         >
                                             <span className="text-danger">Удалить</span>
                                         </DropdownItem>
                                     </DropdownMenu>
                                 </UncontrolledDropdown>
                                </td>
                            </React.Fragment>
                        );
                    }
                }
            </Formik>
        </tr>
    )
};

export default TraitGroupRow;
