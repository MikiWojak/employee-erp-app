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
import { mapState } from 'pinia';
import { defineAsyncComponent } from 'vue';

import { useAuthStore } from '@/stores/auth';

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
        ...mapState(useAuthStore, ['loggedIn'])
    }
};
</script>
