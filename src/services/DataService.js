import Axios from "axios";
import {toFormData} from "../utils";

class DataService {

    login = (data) => {
        return Axios.post(process.env.REACT_APP_API_DOMAIN + '/api/auth/login',
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

        return Axios.post(process.env.REACT_APP_API_DOMAIN + '/api/auth/logout',
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

        return Axios.post(process.env.REACT_APP_API_DOMAIN + '/api/auth/me',
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

    updateProfile = (adminId, data) => {
        const token = localStorage.getItem('token');

        return Axios.put(process.env.REACT_APP_API_DOMAIN + '/api/admin/' + adminId,
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

        return Axios.get(process.env.REACT_APP_API_DOMAIN + '/api/new-users',
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

        return Axios.get(process.env.REACT_APP_API_DOMAIN + '/api/new-products',
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
        return Axios.get(process.env.REACT_APP_API_DOMAIN + '/api/kinds',
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }
        )
            .then( (res) => res.data);
    };

    getKind = (kindId) => {
        return Axios.get(
            `${process.env.REACT_APP_API_DOMAIN}/api/kinds/${kindId}`,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                }
            }
        )
            .then((res) => res.data);
    };

    setKind = (data) => {
        const token = localStorage.getItem('token');
        const formData = toFormData(data);

        return Axios.post(
            `${process.env.REACT_APP_API_DOMAIN}/api/kinds`,
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

    updateKind = (kindId, data) => {
        const token = localStorage.getItem('token');
        const formData = toFormData(data);
        formData.append('_method', 'PUT');

        return Axios.post(
            `${process.env.REACT_APP_API_DOMAIN}/api/kinds/${kindId}`,
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

    deleteKind = (kindId) => {
        const token = localStorage.getItem('token');

        return Axios.delete(
            `${process.env.REACT_APP_API_DOMAIN}/api/kinds/${kindId}`,
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
        return Axios.get(process.env.REACT_APP_API_DOMAIN + '/api/subcategories',
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }
        )
            .then( (res) => res.data);
    };

    getSubcategory = (subcategoryId) => {
        return Axios.get(
            `${process.env.REACT_APP_API_DOMAIN}/api/subcategories/${subcategoryId}`,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                }
            }
        )
            .then((res) => res.data);
    };

    setSubcategory = (data) => {
        const token = localStorage.getItem('token');

        return Axios.post(
            `${process.env.REACT_APP_API_DOMAIN}/api/subcategories`,
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

    updateSubcategory = (subcategoryId, data) => {
        const token = localStorage.getItem('token');

        return Axios.put(
            `${process.env.REACT_APP_API_DOMAIN}/api/subcategories/${subcategoryId}`,
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

    deleteSubcategory = (subcategoryId) => {
        const token = localStorage.getItem('token');

        return Axios.delete(
            `${process.env.REACT_APP_API_DOMAIN}/api/subcategories/${subcategoryId}`,
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
        return Axios.get(process.env.REACT_APP_API_DOMAIN + '/api/localities',
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }
        )
            .then( (res) => res.data);
    };

    getLocality = (localityId) => {
        return Axios.get(
            `${process.env.REACT_APP_API_DOMAIN}/api/localities/${localityId}`,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                }
            }
        )
            .then((res) => res.data);
    };

    setLocality = (data) => {
        const token = localStorage.getItem('token');

        return Axios.post(
            `${process.env.REACT_APP_API_DOMAIN}/api/localities`,
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

    updateLocality = (localityId, data) => {
        const token = localStorage.getItem('token');

        return Axios.put(
            `${process.env.REACT_APP_API_DOMAIN}/api/localities/${localityId}`,
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

    deleteLocality = (localityId) => {
        const token = localStorage.getItem('token');

        return Axios.delete(
            `${process.env.REACT_APP_API_DOMAIN}/api/localities/${localityId}`,
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
        return Axios.get(process.env.REACT_APP_API_DOMAIN + '/api/genes?' + query, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then( (res) => res.data);
    };

    getGene = (geneId) => {
        return Axios.get(
            `${process.env.REACT_APP_API_DOMAIN}/api/genes/${geneId}`,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                }
            }
        )
            .then((res) => res.data);
    };

    setGene = (data) => {
        const token = localStorage.getItem('token');

        return Axios.post(
            `${process.env.REACT_APP_API_DOMAIN}/api/genes`,
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

    updateGene = (geneId, data) => {
        const token = localStorage.getItem('token');

        return Axios.put(
            `${process.env.REACT_APP_API_DOMAIN}/api/genes/${geneId}`,
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

    deleteGene = (geneId) => {
        const token = localStorage.getItem('token');

        return Axios.delete(
            `${process.env.REACT_APP_API_DOMAIN}/api/genes/${geneId}`,
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
        return Axios.get(process.env.REACT_APP_API_DOMAIN + '/api/traits?' + query, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then( (res) => res.data);
    };

    getTrait = (traitId) => {
        return Axios.get(
            `${process.env.REACT_APP_API_DOMAIN}/api/traits/${traitId}`,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                }
            }
        )
            .then((res) => res.data);
    };

    setTrait = (data) => {
        const token = localStorage.getItem('token');

        return Axios.post(
            `${process.env.REACT_APP_API_DOMAIN}/api/traits`,
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

    updateTrait = (traitId, data) => {
        const token = localStorage.getItem('token');

        return Axios.put(
            `${process.env.REACT_APP_API_DOMAIN}/api/traits/${traitId}`,
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

    deleteTrait = (traitId) => {
        const token = localStorage.getItem('token');

        return Axios.delete(
            `${process.env.REACT_APP_API_DOMAIN}/api/traits/${traitId}`,
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

    getProducts = (options) => {
        const query = window.qs.stringify(options);
        const token = localStorage.getItem('token');

        return Axios.get(process.env.REACT_APP_API_DOMAIN + '/api/products?' + query, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then( (res) => res.data);
    };

    getProduct = (productId) => {
        const token = localStorage.getItem('token');
        return Axios.get(process.env.REACT_APP_API_DOMAIN + '/api/products/' + productId,
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

    updateProduct = (productId, data) => {
        const token = localStorage.getItem('token');
        const formData = toFormData(data);
        formData.append('_method', 'PUT');

        return Axios.post(
            `${process.env.REACT_APP_API_DOMAIN}/api/products/${productId}`,
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

    deleteProduct = (productId) => {
        const token = localStorage.getItem('token');

        return Axios.delete(
            `${process.env.REACT_APP_API_DOMAIN}/api/products/${productId}`,
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
            process.env.REACT_APP_API_DOMAIN + '/api/search/morphs',
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

    getDivorces = (options) => {
        const query = window.qs.stringify(options);

        return Axios.get(process.env.REACT_APP_API_DOMAIN + '/api/divorces?' + query, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then( (res) => res.data);
    };

    getDivorce = (divorceId) => {
        return Axios.get(process.env.REACT_APP_API_DOMAIN + '/api/divorces/' + divorceId, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then( (res) => res.data)
    };

    updateDivorce = (divorceId, data) => {
        const token = localStorage.getItem('token');
        const formData = toFormData(data);
        formData.append('_method', 'PUT');

        return Axios.post(
            `${process.env.REACT_APP_API_DOMAIN}/api/divorces/${divorceId}`,
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

    deleteDivorce = (divorceId) => {
        const token = localStorage.getItem('token');

        return Axios.delete(
            `${process.env.REACT_APP_API_DOMAIN}/api/divorces/${divorceId}`,
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

    getUsers = (options) => {
        const query = window.qs.stringify(options);

        return Axios.get(process.env.REACT_APP_API_DOMAIN + '/api/users?' + query, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
            .then((res) => res.data);
    };

    getUser = (userId) => {
        return Axios.get(process.env.REACT_APP_API_DOMAIN + '/api/users/' + userId, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
            .then((res) => res.data);
    };

    updateUser = (userId, data) => {
        const token = localStorage.getItem('token');
        const formData = toFormData(data);
        formData.append('_method', 'PUT');

        return Axios.post(
            process.env.REACT_APP_API_DOMAIN + '/api/users/' + userId,
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

    deleteUser = (userId) => {
        const token = localStorage.getItem('token');

        return Axios.delete(process.env.REACT_APP_API_DOMAIN + '/api/users/' + userId, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => res.data);
    };

    getShop = (shopName) => {
        return Axios.get(process.env.REACT_APP_API_DOMAIN + '/api/shops/' + shopName, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
            .then((res) => res.data);
    };

    updateShop = (shopName, data) => {
        const token = localStorage.getItem('token');
        const formData = toFormData(data);
        formData.append('_method', 'PUT');

        return Axios.post(
            process.env.REACT_APP_API_DOMAIN + '/api/shops/' + shopName,
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

    deleteShop = (shopName) => {
        const token = localStorage.getItem('token');

        return Axios.delete(process.env.REACT_APP_API_DOMAIN + '/api/shops/' + shopName, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => res.data);
    };

    getReports = (options) => {
        const query = window.qs.stringify(options);
        return Axios.get(process.env.REACT_APP_API_DOMAIN + '/api/reports?' +  query, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
            .then((res) => res.data);
    };

    getReport = (reportId) => {
        return Axios.get(process.env.REACT_APP_API_DOMAIN + '/api/reports/' +  reportId, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
            .then((res) => res.data);
    };

    deleteReport = (reportId) => {
        const token = localStorage.getItem('token');
        return Axios.delete(process.env.REACT_APP_API_DOMAIN + '/api/reports/' +  reportId, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => res.data);
    };

    getGuardLevels = (options) => {
        const query = window.qs.stringify(options);
        return Axios.get(process.env.REACT_APP_API_DOMAIN + '/api/guard-levels?' +  query, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
            .then((res) => res.data);
    };

    getGuardLevel = (level) => {
        return Axios.get(process.env.REACT_APP_API_DOMAIN + '/api/guard-levels/' +  level, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
            .then((res) => res.data);
    };

    setGuardLevel = (data) => {
        const token = localStorage.getItem('token');
        const formData = toFormData(data);

        return Axios.post(
            process.env.REACT_APP_API_DOMAIN + '/api/guard-levels',
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

    updateGuardLevel = (level, data) => {
        const token = localStorage.getItem('token');
        const formData = toFormData(data);
        formData.append('_method', 'PUT');

        return Axios.post(
            process.env.REACT_APP_API_DOMAIN + '/api/guard-levels/' + level,
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

    deleteGuardLevel = (level) => {
        const token = localStorage.getItem('token');
        return Axios.delete(process.env.REACT_APP_API_DOMAIN + '/api/guard-levels/' +  level, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => res.data);
    };

    getBreederLevels = (options) => {
        const query = window.qs.stringify(options);
        return Axios.get(process.env.REACT_APP_API_DOMAIN + '/api/breeder-levels?' +  query, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
            .then((res) => res.data);
    };

    getBreederLevel = (level) => {
        return Axios.get(process.env.REACT_APP_API_DOMAIN + '/api/breeder-levels/' +  level, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
            .then((res) => res.data);
    };

    setBreederLevel = (data) => {
        const token = localStorage.getItem('token');
        const formData = toFormData(data);

        return Axios.post(
            process.env.REACT_APP_API_DOMAIN + '/api/breeder-levels',
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

    updateBreederLevel = (level, data) => {
        const token = localStorage.getItem('token');
        const formData = toFormData(data);
        formData.append('_method', 'PUT');

        return Axios.post(
            process.env.REACT_APP_API_DOMAIN + '/api/breeder-levels/' + level,
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

    deleteBreederLevel = (level) => {
        const token = localStorage.getItem('token');
        return Axios.delete(process.env.REACT_APP_API_DOMAIN + '/api/breeder-levels/' +  level, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => res.data);
    };
}

export default DataService