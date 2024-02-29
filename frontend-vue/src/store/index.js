import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import auth from '@/store/modules/auth';
import users from '@/store/modules/users';
import contracts from '@/store/modules/contracts';
import vacations from '@/store/modules/vacations';
import { apiURL } from '@/config';

Vue.use(Vuex);
axios.defaults.baseURL = apiURL;
axios.defaults.withCredentials = true;

export default new Vuex.Store({
    modules: {
        auth,
        users,
        contracts,
        vacations
    }
});
