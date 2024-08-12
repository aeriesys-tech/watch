import axios from 'axios';

const authWrapper = async (endpoint, data, rawResponse = false) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        const response = await axios.post(
            `${process.env.REACT_APP_BASE_API_URL}/api${endpoint}`,
            data,
            { headers }
        );

        if (rawResponse) {
            return response;
        }

        return response.data; // Automatically parse JSON response

    } catch (error) {
        const errorMessage = error.response?.data || 'Something went wrong';
        console.error('Axios error:', errorMessage);
        error.message = errorMessage;
        throw error;
    }
};

export default authWrapper;
