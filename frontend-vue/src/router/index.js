import { createWebHistory, createRouter } from 'vue-router';

import { Roles } from '@/enums/Roles';
import { Layouts } from '@/enums/Layouts';
import { useAuthStore } from '@/stores/auth';
import { loadLayoutMiddleware } from '@/router/middleware/loadLayout';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'dashboard',
            component: () => import('@/views/dashboard/DashboardPage'),
            meta: { auth: true }
        },
        {
            path: '/users',
            name: 'users',
            component: () => import('@/views/users/TablePage'),
            meta: { auth: [Roles.ADMIN] }
        },
        {
            path: '/contracts',
            name: 'contracts',
            component: () => import('@/views/contracts/TablePage'),
            meta: { auth: true }
        },
        {
            path: '/vacations',
            name: 'vacations',
            component: () => import('@/views/vacations/TablePage'),
            meta: { auth: true }
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/auth/LoginPage'),
            meta: { guest: true, layout: Layouts.BASE }
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () => import('@/views/errors/NotFoundPage')
        }
    ]
});

router.beforeEach(async (to, from, next) => {
    await loadLayoutMiddleware(to);

    const authStore = useAuthStore();
    const { loggedIn, loggedUser } = authStore;

    if (to.meta.auth) {
        if (!loggedIn) {
            return next({ name: 'login' });
        }

        if (
            Array.isArray(to.meta.auth) &&
            !to.meta.auth.includes(loggedUser.role.name)
        ) {
            return next({ name: 'dashboard' });
        }

        return next();
    }

    if (to.meta.guest) {
        if (loggedIn) {
            return next({ name: 'dashboard' });
        }

        return next();
    }

    return next();
});

export default router;
