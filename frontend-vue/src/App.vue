<template>
    <v-app>
        <app-header />

        <sidebar v-if="loggedIn" />

        <v-main>
            <router-view />
        </v-main>

        <notifications position="bottom center" />

        <app-footer />
    </v-app>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'App',

    components: {
        AppHeader: () => import('@/components/common/AppHeader'),
        Sidebar: () => import('@/views/layout/Sidebar'),
        AppFooter: () => import('@/components/common/AppFooter')
    },

    computed: {
        ...mapGetters({
            loggedIn: 'auth/loggedIn'
        })
    }
};
</script>
