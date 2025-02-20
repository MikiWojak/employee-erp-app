import axios from 'axios';
import { createStore } from 'vuex';

import auth from '@/store/modules/auth';
import users from '@/store/modules/users';
import contracts from '@/store/modules/contracts';
import vacations from '@/store/modules/vacations';

// @TODO Fix
const apiURL = '';

axios.defaults.baseURL = apiURL;
axios.defaults.withCredentials = true;

export const store = createStore({
    modules: {
        auth,
        users,
        contracts,
        vacations
    }
});
