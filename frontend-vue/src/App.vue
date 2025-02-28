<template>
    <v-app>
        <app-header />

        <app-sidebar v-if="loggedIn" />

        <v-main>
            <router-view />
        </v-main>

        <app-footer />
    </v-app>
</template>

<script>
import { mapState } from 'pinia';
import { defineAsyncComponent } from 'vue';

import { useAuthStore } from '@/stores/auth';

export default {
    name: 'App',

    components: {
        AppFooter: defineAsyncComponent(
            () => import('@/components/layout/AppFooter')
        ),
        AppHeader: defineAsyncComponent(
            () => import('@/components/layout/AppHeader')
        ),
        AppSidebar: defineAsyncComponent(
            () => import('@/components/layout/AppSidebar')
        )
    },

    computed: {
        ...mapState(useAuthStore, ['loggedIn'])
    }
};
</script>
