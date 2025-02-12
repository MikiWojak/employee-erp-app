<template>
    <v-app>
        <app-header />

        <sidebar v-if="loggedIn" />

        <v-main>
            <router-view />
        </v-main>

        <app-footer />
    </v-app>
</template>

<script>
import { mapGetters } from 'vuex';
import { defineAsyncComponent } from 'vue';

export default {
    name: 'App',

    components: {
        AppHeader: defineAsyncComponent(
            () => import('@/components/common/AppHeader')
        ),
        Sidebar: defineAsyncComponent(() => import('@/views/layout/Sidebar')),
        AppFooter: defineAsyncComponent(
            () => import('@/components/common/AppFooter')
        )
    },

    computed: {
        ...mapGetters({
            loggedIn: 'auth/loggedIn'
        })
    }
};
</script>
