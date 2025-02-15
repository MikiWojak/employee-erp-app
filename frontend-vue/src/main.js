import { createApp } from 'vue';

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import '@mdi/font/css/materialdesignicons.css';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { VDateInput } from 'vuetify/labs/VDateInput';

import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

import App from '@/App.vue';
import router from '@/router';
import { store } from '@/store';

const vuetify = createVuetify({
    components: {
        ...components,
        VDateInput
    },
    directives
});

createApp(App)
    .use(store)
    .use(router)
    .use(vuetify)
    .use(ToastPlugin, {
        position: 'bottom'
    })
    .mount('#app');
