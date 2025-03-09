import { createWebHistory, createRouter } from 'vue-router';

import routes from './routes';
import { useAuthStore } from '@/stores/auth';
import { loadLayoutMiddleware } from './middleware/loadLayoutMiddleware';

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach(async (to, from, next) => {
    await loadLayoutMiddleware(to);

    const { auth, guest } = to.meta || {};
    const authStore = useAuthStore();

    if (!auth && !guest) {
        return next();
    }

    await authStore.me();

    const { loggedIn, loggedUser } = authStore;

    if (auth) {
        if (!loggedIn) {
            return next({ name: 'login' });
        }

        if (Array.isArray(auth) && !auth.includes(loggedUser.role.name)) {
            return next({ name: 'dashboard' });
        }

        return next();
    }

    if (guest) {
        if (loggedIn) {
            return next({ name: 'dashboard' });
        }

        return next();
    }

    return next();
});

export default router;
