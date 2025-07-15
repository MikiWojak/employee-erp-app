import { createApp } from 'vue';
import { createPinia } from 'pinia';

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import '@mdi/font/css/materialdesignicons.css';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { VDateInput } from 'vuetify/labs/VDateInput';

import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

import App from '@/App';
import router from '@/router';

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js';

const pinia = createPinia();
const vuetify = createVuetify({
    components: {
        ...components,
        VDateInput
    },
    directives
});

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(vuetify);
app.use(ToastPlugin, {
    position: 'bottom'
});

app.mount('#app');
