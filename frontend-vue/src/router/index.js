import { createWebHistory, createRouter } from 'vue-router';

import { useAuthStore } from '@/stores/auth';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'dashboard',
            component: () => import('@/views/pages/dashboard/DashboardPage'),
            meta: { auth: true }
        },
        // @TODO For Admin only!!!
        {
            path: '/users',
            name: 'users',
            component: () => import('@/views/pages/users/TablePage'),
            meta: { auth: true }
        },
        {
            path: '/contracts',
            name: 'contracts',
            component: () => import('@/views/pages/contracts/TablePage'),
            meta: { auth: true }
        },
        {
            path: '/vacations',
            name: 'vacations',
            component: () => import('@/views/pages/vacations/TablePage'),
            meta: { auth: true }
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/pages/auth/LoginPage'),
            meta: { guest: true }
        }
    ]
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const { loggedIn } = authStore;

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
