<template>
    <v-app>
        <app-header />

        <app-sidebar />

        <v-main>
            <v-container fluid>
                <router-view />
            </v-container>
        </v-main>

        <app-footer />
    </v-app>
</template>

<script>
import { defineAsyncComponent } from 'vue';

export default {
    name: 'DefaultLayout',

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
    }
};
</script>
