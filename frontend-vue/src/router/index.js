import { createWebHistory, createRouter } from 'vue-router';

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

// @TODO Restore route guard!!!

export default router;
