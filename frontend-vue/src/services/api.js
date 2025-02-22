import axios from 'axios';

import config from '@/config';

const axiosInstance = axios.create({
    baseURL: config.apiURL,
    withCredentials: true
});

export default axiosInstance;
