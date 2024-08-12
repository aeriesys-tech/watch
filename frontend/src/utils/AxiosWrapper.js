import axios from 'axios';
import { getToken, clearAllStorage } from './TokenService';

const axiosWrapper = async (endpoint, options = {}, navigate, rawResponse = false) => {
    const token = getToken();
    const headers = {
        ...options.headers,
    };

    console.log(token)
    // Set Content-Type header based on the type of data
    if (options.data instanceof FormData) {
        headers['Content-Type'] = 'multipart/form-data';
    } else {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        console.log(token)
        headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${process.env.REACT_APP_BASE_API_URL}/api${endpoint}`;

    try {
        const response = await axios({
            url,
            method: 'POST', // Ensure the method is always POST
            headers,
            data: options.data,
        });

        if (response.status === 401) {
            clearAllStorage();
            navigate('/auth/login');
            return;
        } else {
            if (response.data.errors) {
                throw response.data;
            }
        }

        if (rawResponse) {
            return response;
        }

        return response.data; // Automatically parse JSON response
    } catch (error) {
        if (error.response && error.response.status === 401) {
            clearAllStorage();
            navigate('/auth/login');
        }

        const errorMessage = error.response?.data || 'Something went wrong';
        console.error('Axios error:', errorMessage);
        error.message = errorMessage;
        throw error;
    }
};

export default axiosWrapper;
