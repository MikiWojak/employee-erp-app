import { createWebHistory, createRouter } from 'vue-router';

import { store } from '@/store';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'dashboard',
            component: () => import('@/views/dashboard/Dashboard'),
            meta: { auth: true }
        },
        {
            path: '/contracts',
            name: 'contracts',
            component: () => import('@/views/contracts/Contracts'),
            meta: { auth: true }
        },
        {
            path: '/vacations',
            name: 'vacations',
            component: () => import('@/views/vacations/Vacations'),
            meta: { auth: true }
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/auth/Login'),
            meta: { guest: true }
        }
    ]
});

router.beforeEach((to, from, next) => {
    const loggedIn = store.getters['auth/loggedIn'];

    if (to.meta.auth) {
        if (!loggedIn) {
            return next({ name: 'login' });
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
