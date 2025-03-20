import { createWebHistory, createRouter } from 'vue-router';

import routes from './routes';
import { useAuthStore } from '@/stores/auth';
import { loadLayoutMiddleware } from './middleware/loadLayoutMiddleware';

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach(async (to, from, next) => {
    const { auth, guest } = to.meta || {};

    if (!auth && !guest) {
        await loadLayoutMiddleware(to);

        return next();
    }

    const authStore = useAuthStore();

    await authStore.me();
    await loadLayoutMiddleware(to);

    const { loggedIn, loggedUser } = authStore;

    if (auth) {
        if (!loggedIn) {
            return next({ name: 'login' });
        }

        if (
            Array.isArray(auth) &&
            !auth.some(permittedRole =>
                loggedUser.roles.some(role => role.name === permittedRole)
            )
        ) {
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
