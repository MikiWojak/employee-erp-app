// https://medium.com/@sakensaten1409/vue-3-layout-system-smart-layouts-for-vuejs-80ae700e48a6 (07.03.2025)

import { Layouts } from '@/enums/Layouts';
import { useAuthStore } from '@/stores/auth';

export const loadLayoutMiddleware = async route => {
    try {
        const authStore = useAuthStore();
        const { loggedIn } = authStore;

        const defaultLayout = loggedIn ? Layouts.APP : Layouts.BASE;
        const layout = route.meta.layout || defaultLayout;
        const layoutComponent = await import(`@/layouts/${layout}.vue`);

        route.meta.layoutComponent = layoutComponent.default;
    } catch (e) {
        console.error('Error occurred in processing of layouts: ', e);
    }
};
