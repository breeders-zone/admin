import Axios from "axios";
import {toFormData} from "../utils";
import {IAdminData, ILoginData, ISetDocumentData, ISetFaqData, IUpdateDocumentData, IUpdateFaqData} from "./types";
import {ITraitGroup} from "../reducers/traits/types";

class DataService {
    YMApiUrl = 'https://api-metrika.yandex.net/stat/v1/data';
    YMByTime = `${this.YMApiUrl}/bytime`;

    login = (data: ILoginData) => {
        return Axios.post(process.env.REACT_APP_API_DOMAIN_URL + '/api/auth/login',
            {
                ...data,
                isAdmin: true
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }
        )
            .then( (res) => res.data)
            .then( ({access_token}) => localStorage.setItem('token', access_token))
    };

    logout = () => {
        const token = localStorage.getItem('token');

        return Axios.post(process.env.REACT_APP_API_DOMAIN_URL + '/api/auth/logout',
            {
                isAdmin: true
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + token
                }
            }
        )
            .then( (res) => res.data);
    };

    getProfile = () => {
        const token = localStorage.getItem('token');

        return Axios.post(process.env.REACT_APP_API_DOMAIN_URL + '/api/auth/me',
            {
                isAdmin: true
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + token
                }
            }
        )
            .then(res => res.data)
    };

    updateProfile = (adminId: string|number, data: IAdminData) => {
        const token = localStorage.getItem('token');

        return Axios.put(process.env.REACT_APP_API_DOMAIN_URL + '/api/admin/' + adminId,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + token
                }
            }
        )
            .then((res) => res.data);
    };

    getNewUsers = () => {
        const token = localStorage.getItem('token');

        return Axios.get(process.env.REACT_APP_API_DOMAIN_URL + '/api/new-users',
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + token
                }
            }
        )
            .then(res => res.data)
    };

    getNewProducts = () => {
        const token = localStorage.getItem('token');

        return Axios.get(process.env.REACT_APP_API_DOMAIN_URL + '/api/new-products',
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + token
                }
            }
        )
            .then(res => res.data)
    };

    getKinds = () => {
        return Axios.get(process.env.REACT_APP_API_DOMAIN_URL + '/api/kinds',
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }
        )
            .then( (res) => res.data);
    };

    getKind = (kindId: string|number) => {
        return Axios.get(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/kinds/${kindId}`,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                }
            }
        )
            .then((res) => res.data);
    };

    setKind = (data: any /*TODO create kind data*/) => {
        const token = localStorage.getItem('token');
        const formData = toFormData(data);

        return Axios.post(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/kinds`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                    boundary: Math.random().toString().substr(2),
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((res) => res.data);
    };

    updateKind = (kindId: string|number, data: any /*TODO create kind data*/) => {
        const token = localStorage.getItem('token');
        const formData = toFormData(data);
        formData.append('_method', 'PUT');

        return Axios.post(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/kinds/${kindId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                    boundary: Math.random().toString().substr(2),
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((res) => res.data);
    };

    deleteKind = (kindId: string|number) => {
        const token = localStorage.getItem('token');

        return Axios.delete(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/kinds/${kindId}`,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((res) => res.data);
    };

    getSubcategories = () => {
        return Axios.get(process.env.REACT_APP_API_DOMAIN_URL + '/api/subcategories',
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }
        )
            .then( (res) => res.data);
    };

    getSubcategory = (subcategoryId: string|number) => {
        return Axios.get(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/subcategories/${subcategoryId}`,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                }
            }
        )
            .then((res) => res.data);
    };

    setSubcategory = (data: any /*TODO create subcategory data*/) => {
        const token = localStorage.getItem('token');

        return Axios.post(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/subcategories`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((res) => res.data);
    };

    updateSubcategory = (subcategoryId: string|number, data: any /*TODO create subcategory data*/) => {
        const token = localStorage.getItem('token');

        return Axios.put(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/subcategories/${subcategoryId}`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((res) => res.data);
    };

    deleteSubcategory = (subcategoryId: string|number) => {
        const token = localStorage.getItem('token');

        return Axios.delete(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/subcategories/${subcategoryId}`,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((res) => res.data);
    };

    getLocalities = () => {
        return Axios.get(process.env.REACT_APP_API_DOMAIN_URL + '/api/localities',
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }
        )
            .then( (res) => res.data);
    };

    getLocality = (localityId: string|number) => {
        return Axios.get(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/localities/${localityId}`,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                }
            }
        )
            .then((res) => res.data);
    };

    setLocality = (data: any /*TODO create locality data*/) => {
        const token = localStorage.getItem('token');

        return Axios.post(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/localities`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((res) => res.data);
    };

    updateLocality = (localityId: string|number, data: any /*TODO create locality data*/) => {
        const token = localStorage.getItem('token');

        return Axios.put(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/localities/${localityId}`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((res) => res.data);
    };

    deleteLocality = (localityId: string|number) => {
        const token = localStorage.getItem('token');

        return Axios.delete(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/localities/${localityId}`,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((res) => res.data);
    };

    getGenes = (options = {}) => {
        const query = window.qs.stringify(options);
        return Axios.get(process.env.REACT_APP_API_DOMAIN_URL + '/api/genes?' + query, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then( (res) => res.data);
    };

    getGene = (geneId: string|number) => {
        return Axios.get(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/genes/${geneId}`,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                }
            }
        )
            .then((res) => res.data);
    };

    setGene = (data: any /*TODO create gene data*/) => {
        const token = localStorage.getItem('token');

        return Axios.post(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/genes`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((res) => res.data);
    };

    updateGene = (geneId: string|number, data: any /*TODO create gene data*/) => {
        const token = localStorage.getItem('token');

        return Axios.put(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/genes/${geneId}`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((res) => res.data);
    };

    deleteGene = (geneId: string|number) => {
        const token = localStorage.getItem('token');

        return Axios.delete(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/genes/${geneId}`,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((res) => res.data);
    };

    getTraitsGroups = (options = {}) => {
        const query = window.qs.stringify(options);
        return Axios.get(process.env.REACT_APP_API_DOMAIN_URL + '/api/traits-groups?' + query, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then( (res) => res.data);
    };

    getTraitGroup = (traitId: string|number): Promise<ITraitGroup> => {
        return Axios.get(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/traits-groups/${traitId}`,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                }
            }
        )
            .then((res) => res.data);
    };

    setTraitGroup = (data: any /*TODO create trait data*/): Promise<{
        message: string,
        data: ITraitGroup
    }> => {
        const token = localStorage.getItem('token');

        return Axios.post(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/traits-groups`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((res) => res.data);
    };

    updateTraitGroup = (traitId: string|number, data: any /*TODO create trait data*/) => {
        const token = localStorage.getItem('token');

        return Axios.put(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/traits-groups/${traitId}`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((res) => res.data);
    };

    deleteTraitGroup = (traitId: string|number) => {
        const token = localStorage.getItem('token');

        return Axios.delete(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/traits-groups/${traitId}`,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((res) => res.data);
    };


    getTraits = (options = {}) => {
        const query = window.qs.stringify(options);
        return Axios.get(process.env.REACT_APP_API_DOMAIN_URL + '/api/traits?' + query, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then( (res) => res.data);
    };

    getTrait = (traitId: string|number) => {
        return Axios.get(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/traits/${traitId}`,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                }
            }
        )
            .then((res) => res.data);
    };

    setTrait = (data: any /*TODO create trait data*/) => {
        const token = localStorage.getItem('token');

        return Axios.post(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/traits`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((res) => res.data);
    };

    updateTrait = (traitId: string|number, data: any /*TODO create trait data*/) => {
        const token = localStorage.getItem('token');

        return Axios.put(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/traits/${traitId}`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((res) => res.data);
    };

    deleteTrait = (traitId: string|number) => {
        const token = localStorage.getItem('token');

        return Axios.delete(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/traits/${traitId}`,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((res) => res.data);
    };

    getProducts = (options: any) => {
        const query = window.qs.stringify(options);
        const token = localStorage.getItem('token');

        return Axios.get(process.env.REACT_APP_API_DOMAIN_URL + '/api/products?' + query, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then( (res) => res.data);
    };

    getProduct = (productId: string|number) => {
        const token = localStorage.getItem('token');
        return Axios.get(process.env.REACT_APP_API_DOMAIN_URL + '/api/products/' + productId,
            {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
            }
        )
            .then( (res) => res.data)
    };

    updateProduct = (productId: string|number, data: any /*TODO create product data*/) => {
        const token = localStorage.getItem('token');
        const formData = toFormData(data);
        formData.append('_method', 'PUT');

        return Axios.post(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/products/${productId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                    boundary: Math.random().toString().substr(2),
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((res) => res.data);
    };

    deleteProduct = (productId: string|number) => {
        const token = localStorage.getItem('token');

        return Axios.delete(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/products/${productId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((res) => res.data);
    };

    searchMorphs = (data = {q: '', options: []}) => {
        return Axios.post(
            process.env.REACT_APP_API_DOMAIN_URL + '/api/search/morphs',
            {
                q: data.q,
                options: data.options
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                }
            }
        )
            .then((res) => res.data)
    };

    getDivorces = (options: any) => {
        const query = window.qs.stringify(options);

        return Axios.get(process.env.REACT_APP_API_DOMAIN_URL + '/api/divorces?' + query, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then( (res) => res.data);
    };

    getDivorce = (divorceId: string|number) => {
        return Axios.get(process.env.REACT_APP_API_DOMAIN_URL + '/api/divorces/' + divorceId, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then( (res) => res.data)
    };

    updateDivorce = (divorceId: string|number, data: any /*TODO create divorce data*/) => {
        const token = localStorage.getItem('token');
        const formData = toFormData(data);
        formData.append('_method', 'PUT');

        return Axios.post(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/divorces/${divorceId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                    boundary: Math.random().toString().substr(2),
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((res) => res.data);
    };

    deleteDivorce = (divorceId: string|number) => {
        const token = localStorage.getItem('token');

        return Axios.delete(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/divorces/${divorceId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((res) => res.data);
    };

    getUsers = (options: any) => {
        const query = window.qs.stringify(options);

        return Axios.get(process.env.REACT_APP_API_DOMAIN_URL + '/api/users?' + query, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
            .then((res) => res.data);
    };

    getUser = (userId: string|number) => {
        return Axios.get(process.env.REACT_APP_API_DOMAIN_URL + '/api/users/' + userId, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
            .then((res) => res.data);
    };

    updateUser = (userId: string|number, data: any /*TODO create user data*/) => {
        const token = localStorage.getItem('token');
        const formData = toFormData(data);
        formData.append('_method', 'PUT');

        return Axios.post(
            process.env.REACT_APP_API_DOMAIN_URL + '/api/users/' + userId,
            formData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
        })
            .then((res) => res.data);
    };

    deleteUser = (userId: string|number) => {
        const token = localStorage.getItem('token');

        return Axios.delete(process.env.REACT_APP_API_DOMAIN_URL + '/api/users/' + userId, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => res.data);
    };

    getShop = (shopName: string) => {
        return Axios.get(process.env.REACT_APP_API_DOMAIN_URL + '/api/shops/' + shopName, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
            .then((res) => res.data);
    };

    updateShop = (shopName: string, data: any /*TODO create shop data*/, isFormData = false) => {
        const token = localStorage.getItem('token');
        if (isFormData) {
            const formData = toFormData(data);
            formData.append('_method', 'PUT');
            data = formData
        }


        return Axios[isFormData ? 'post' : 'put'](
            process.env.REACT_APP_API_DOMAIN_URL + '/api/shops/' + shopName,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then((res) => res.data);
    };

    deleteShop = (shopName: string) => {
        const token = localStorage.getItem('token');

        return Axios.delete(process.env.REACT_APP_API_DOMAIN_URL + '/api/shops/' + shopName, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => res.data);
    };

    getReports = (options: any) => {
        const query = window.qs.stringify(options);
        return Axios.get(process.env.REACT_APP_API_DOMAIN_URL + '/api/reports?' +  query, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
            .then((res) => res.data);
    };

    getReport = (reportId: string|number) => {
        return Axios.get(process.env.REACT_APP_API_DOMAIN_URL + '/api/reports/' +  reportId, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
            .then((res) => res.data);
    };

    deleteReport = (reportId: string|number) => {
        const token = localStorage.getItem('token');
        return Axios.delete(process.env.REACT_APP_API_DOMAIN_URL + '/api/reports/' +  reportId, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => res.data);
    };

    getGuardLevels = (options: any) => {
        const query = window.qs.stringify(options);
        return Axios.get(process.env.REACT_APP_API_DOMAIN_URL + '/api/guard-levels?' +  query, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
            .then((res) => res.data);
    };

    getGuardLevel = (level: string|number) => {
        return Axios.get(process.env.REACT_APP_API_DOMAIN_URL + '/api/guard-levels/' +  level, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
            .then((res) => res.data);
    };

    setGuardLevel = (data: any /*TODO create level data*/) => {
        const token = localStorage.getItem('token');
        const formData = toFormData(data);

        return Axios.post(
            process.env.REACT_APP_API_DOMAIN_URL + '/api/guard-levels',
            formData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then((res) => res.data);
    };

    updateGuardLevel = (level: string|number, data: any /*TODO create level data*/) => {
        const token = localStorage.getItem('token');
        const formData = toFormData(data);
        formData.append('_method', 'PUT');

        return Axios.post(
            process.env.REACT_APP_API_DOMAIN_URL + '/api/guard-levels/' + level,
            formData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then((res) => res.data);
    };

    deleteGuardLevel = (level: string|number) => {
        const token = localStorage.getItem('token');
        return Axios.delete(process.env.REACT_APP_API_DOMAIN_URL + '/api/guard-levels/' +  level, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => res.data);
    };

    getBreederLevels = (options: any) => {
        const query = window.qs.stringify(options);
        return Axios.get(process.env.REACT_APP_API_DOMAIN_URL + '/api/breeder-levels?' +  query, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
            .then((res) => res.data);
    };

    getBreederLevel = (level: string|number) => {
        return Axios.get(process.env.REACT_APP_API_DOMAIN_URL + '/api/breeder-levels/' +  level, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
            .then((res) => res.data);
    };

    setBreederLevel = (data: any /*TODO create level data*/) => {
        const token = localStorage.getItem('token');
        const formData = toFormData(data);

        return Axios.post(
            process.env.REACT_APP_API_DOMAIN_URL + '/api/breeder-levels',
            formData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then((res) => res.data);
    };

    updateBreederLevel = (level: number|string, data: any /*TODO create level data*/) => {
        const token = localStorage.getItem('token');
        const formData = toFormData(data);
        formData.append('_method', 'PUT');

        return Axios.post(
            process.env.REACT_APP_API_DOMAIN_URL + '/api/breeder-levels/' + level,
            formData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then((res) => res.data);
    };

    deleteBreederLevel = (level: number|string) => {
        const token = localStorage.getItem('token');
        return Axios.delete(process.env.REACT_APP_API_DOMAIN_URL + '/api/breeder-levels/' +  level, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => res.data);
    };


    getFaqs = (options: any) => {
        const query = window.qs.stringify(options);
        return Axios.get(process.env.REACT_APP_API_DOMAIN_URL + '/api/faq?' +  query, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
            .then((res) => res.data);
    };

    getFaq = (label: string) => {
        const token = localStorage.getItem('token');
        return Axios.get(process.env.REACT_APP_API_DOMAIN_URL + '/api/faq/' + label,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then( (res) => res.data)
    };

    setFaq = (data: ISetFaqData) => {
        const token = localStorage.getItem('token');
        return Axios.post(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/faq`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    boundary: Math.random().toString().substr(2),
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((res) => res.data);
    };


    updateFaq = (label: string, data: IUpdateFaqData) => {
        const token = localStorage.getItem('token');
        return Axios.put(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/faq/${label}`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    boundary: Math.random().toString().substr(2),
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((res) => res.data);
    };

    deleteFaq = (label: string) => {
        const token = localStorage.getItem('token');

        return Axios.delete(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/faq/${label}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((res) => res.data);
    };

    getDocuments = (options: any) => {
        const query = window.qs.stringify(options);
        return Axios.get(process.env.REACT_APP_API_DOMAIN_URL + '/api/documents?' +  query, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
            .then((res) => res.data);
    };

    getDocument = (label: string) => {
        const token = localStorage.getItem('token');
        return Axios.get(process.env.REACT_APP_API_DOMAIN_URL + '/api/documents/' + label,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then( (res) => res.data)
    };

    setDocument = (data: ISetDocumentData) => {
        const token = localStorage.getItem('token');
        return Axios.post(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/documents`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    boundary: Math.random().toString().substr(2),
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((res) => res.data);
    };


    updateDocument = (label:string, data: IUpdateDocumentData) => {
        const token = localStorage.getItem('token');
        return Axios.put(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/documents/${label}`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    boundary: Math.random().toString().substr(2),
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((res) => res.data);
    };

    deleteDocument = (label: string) => {
        const token = localStorage.getItem('token');

        return Axios.delete(
            `${process.env.REACT_APP_API_DOMAIN_URL}/api/documents/${label}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((res) => res.data);
    };

    //STATS
    getViewsStats = () => {
        return Axios.get(`${this.YMByTime}?metrics=ym:s:hits&date1=30daysAgo&date2=today&group=day&id=${process.env.REACT_APP_YM_ACCOUNT}`)
            .then((res) => res.data);
    };

    getPageViewsStats = (limit: number = 0) => {
        return Axios.get(`${this.YMApiUrl}?metrics=ym:pv:pageviews,ym:pv:users&dimensions=ym:pv:URL${limit ? `&limit=${limit}` : ''}&id=${process.env.REACT_APP_YM_ACCOUNT}`)
            .then((res) => res.data);
    };
}

export default DataService
