import axios from 'axios';
import { createStore } from 'vuex';

import config from '@/config';
import auth from '@/store/modules/auth';
import users from '@/store/modules/users';
import contracts from '@/store/modules/contracts';
import vacations from '@/store/modules/vacations';

axios.defaults.baseURL = config.apiURL;
axios.defaults.withCredentials = true;

export const store = createStore({
    modules: {
        auth,
        users,
        contracts,
        vacations
    }
});
