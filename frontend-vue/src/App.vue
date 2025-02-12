<template>
    <!--    <v-app>-->
    <!--        <app-header />-->

    <!--        <sidebar v-if="loggedIn" />-->

    <!--        <v-main>-->
    <!--            <router-view />-->
    <!--        </v-main>-->

    <!--        <app-footer />-->
    <!--    </v-app>-->

    <div>
        <nav>
            <router-link :to="{ name: 'dashboard' }"> Dashboard </router-link>
            <router-link :to="{ name: 'login' }"> Login </router-link>
        </nav>
        <main>
            <router-view />
        </main>
    </div>
</template>

<script>
// import { mapGetters } from 'vuex';
//
// export default {
//     name: 'App',
//
//     components: {
//         AppHeader: () => import('@/components/common/AppHeader'),
//         Sidebar: () => import('@/views/layout/Sidebar'),
//         AppFooter: () => import('@/components/common/AppFooter')
//     },
//
//     computed: {
//         ...mapGetters({
//             loggedIn: 'auth/loggedIn'
//         })
//     }
// };
</script>
