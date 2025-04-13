import { Roles } from '@/enums/Roles';
import { Layouts } from '@/enums/Layouts';
import { useAuthStore } from '@/stores/auth';

const layoutOnErrorEncountered = to => {
    const authStore = useAuthStore();

    to.meta.layout = authStore.loggedIn ? Layouts.APP : Layouts.BASE;
};

export default [
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
        path: '/set-password',
        name: 'set-password',
        component: () => import('@/views/auth/SetPasswordPage'),
        meta: { guest: true, layout: Layouts.BASE }
    },
    {
        path: '/forgot-password',
        name: 'forgot-password',
        component: () => import('@/views/auth/ForgotPasswordPage'),
        meta: { guest: true, layout: Layouts.BASE }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@/views/errors/NotFoundPage'),
        beforeEnter: layoutOnErrorEncountered
    }
];
