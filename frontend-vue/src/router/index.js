import Vue from 'vue';
import VueRouter from 'vue-router';

import store from '@/store/index';

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',

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

    if (to.matched.some(record => record.meta.auth)) {
        // Is NOT logged in?
        if (!loggedIn) {
            return next({
                name: 'login'
            });
        }

        return next();
    }

    if (to.matched.some(record => record.meta.guest)) {
        // Is logged in?
        if (loggedIn) {
            return next({
                name: 'dashboard'
            });
        }

        return next();
    }

    return next(); // make sure to always call next()!
});

export default router;
