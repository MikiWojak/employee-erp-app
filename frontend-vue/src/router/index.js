import { createWebHistory, createRouter } from 'vue-router';

import LoginView from '@/views/auth/Login';
import DashboardView from '@/views/dashboard/Dashboard';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'dashboard',
            component: DashboardView
            // meta: { auth: true }
        },
        // {
        //     path: '/contracts',
        //     name: 'contracts',
        //     component: () => import('@/views/contracts/Contracts'),
        //     meta: { auth: true }
        // },
        // {
        //     path: '/vacations',
        //     name: 'vacations',
        //     component: () => import('@/views/vacations/Vacations'),
        //     meta: { auth: true }
        // },
        {
            path: '/login',
            name: 'login',
            component: LoginView
            // meta: { guest: true }
        }
    ]
});

// @TODO Restore
// router.beforeEach((to, from, next) => {
//     const loggedIn = store.getters['auth/loggedIn'];
//
//     if (to.matched.some(record => record.meta.auth)) {
//         // Is NOT logged in?
//         if (!loggedIn) {
//             return next({
//                 name: 'login'
//             });
//         }
//
//         return next();
//     }
//
//     if (to.matched.some(record => record.meta.guest)) {
//         // Is logged in?
//         if (loggedIn) {
//             return next({
//                 name: 'dashboard'
//             });
//         }
//
//         return next();
//     }
//
//     return next(); // make sure to always call next()!
// });

export default router;
