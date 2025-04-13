import { createWebHistory, createRouter } from 'vue-router';

import routes from './routes';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach(async (to, from, next) => {
    const { auth, guest } = to.meta || {};

    if (!auth && !guest) {
        return next();
    }

    const authStore = useAuthStore();

    if (auth) {
        await authStore.me();

        if (!authStore.loggedIn) {
            return next({ name: 'login' });
        }

        if (
            Array.isArray(auth) &&
            !auth.some(role => authStore.rolesInfo.includes(role))
        ) {
            return next({ name: 'dashboard' });
        }

        return next();
    }

    if (guest) {
        if (authStore.loggedIn) {
            return next({ name: 'dashboard' });
        }

        return next();
    }

    return next();
});

export default router;
