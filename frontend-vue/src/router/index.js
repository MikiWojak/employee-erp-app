import { createWebHistory, createRouter } from 'vue-router';

import { useAuthStore } from '@/stores/auth';

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
            path: '/contracts',
            name: 'contracts',
            component: () => import('@/views/contracts/ContractsPage'),
            meta: { auth: true }
        },
        {
            path: '/vacations',
            name: 'vacations',
            component: () => import('@/views/vacations/VacationsPage'),
            meta: { auth: true }
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/auth/LoginPage'),
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
