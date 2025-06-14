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
        path: '/departments',
        name: 'departments',
        component: () => import('@/views/departments/TablePage'),
        meta: { auth: [Roles.ADMIN] }
    },
    {
        path: '/users',
        name: 'users',
        component: () => import('@/views/users/TablePage'),
        meta: { auth: [Roles.ADMIN, Roles.MANAGER] }
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
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/profile/ProfilePage'),
        meta: { auth: true }
    },
    {
        path: '/feedback',
        name: 'feedback',
        component: () => import('@/views/feedback/QuestionsPage.vue'),
        meta: { auth: [Roles.EMPLOYEE, Roles.MANAGER] }
    },
    {
        path: '/feedback/statistics',
        name: 'feedback-statistics',
        component: () => import('@/views/feedback/StatsPage.vue'),
        meta: { auth: [Roles.ADMIN, Roles.MANAGER] }
    },
    {
        path: '/feedback/tokens-collections',
        name: 'feedback-tokens-collections',
        component: () => import('@/views/feedback-tokens/TokensPage.vue'),
        meta: { auth: [Roles.ADMIN, Roles.MANAGER] }
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
