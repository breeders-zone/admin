import Axios from "axios";
import {toFormData} from "../utils";

class DataService {
    getKinds = () => {
        return Axios.get(process.env.REACT_APP_API_DOMAIN + '/api/kinds', {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then( (res) => res.data);
    };

    getProducts = (options) => {
        const query = window.qs.stringify(options);

        return Axios.get(process.env.REACT_APP_API_DOMAIN + '/api/products?' + query, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then( (res) => res.data);
    };

    getProduct = (productId) => {
        return Axios.get(process.env.REACT_APP_API_DOMAIN + '/api/products/' + productId, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then( (res) => res.data)
    };

    updateProduct = (productId, data) => {
        const token = localStorage.get('token');
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
            .then((resp) => resp.data);
    };

    deleteProduct = (productId) => {
        const token = localStorage.get('token');

        return Axios.delete(
            `${process.env.REACT_APP_API_DOMAIN}/api/products/${productId}`,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((resp) => resp.data);
    }
}

export default DataService