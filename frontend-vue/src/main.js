import Vue from 'vue';

import App from '@/App';
import store from '@/store';
import router from '@/router';
import vuetify from '@/plugins/vuetify';
import vuelidate from '@/plugins/vuelidate';
import notifications from '@/plugins/notifications';

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    vuetify,
    vuelidate,
    notifications,
    render: h => h(App)
}).$mount('#app');
