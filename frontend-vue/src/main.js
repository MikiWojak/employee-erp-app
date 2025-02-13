import 'vuetify/styles';
import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import '@mdi/font/css/materialdesignicons.css';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { VDateInput } from 'vuetify/labs/VDateInput';

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

createApp(App).use(router).use(store).use(vuetify).mount('#app');
