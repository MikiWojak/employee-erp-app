import axios from 'axios';
import { createStore } from 'vuex';

import auth from '@/store/modules/auth';
import users from '@/store/modules/users';
import contracts from '@/store/modules/contracts';
import vacations from '@/store/modules/vacations';
import { apiURL } from '@/config';

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
