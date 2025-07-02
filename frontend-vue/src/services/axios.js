import axios from 'axios';
import { StatusCodes as HTTP } from 'http-status-codes';

import config from '@/config';
import router from '@/router';

const axiosInstance = axios.create({
    baseURL: config.apiUrl,
    withCredentials: true
});

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error?.response?.status === HTTP.NOT_FOUND) {
            router.replace('/not-found');
        }

        throw error;
    }
);

export default axiosInstance;
