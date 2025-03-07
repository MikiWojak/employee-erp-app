<template>
    <v-app>
        <app-header is-toggle-sidebar-icon @toggle-sidebar="toggleSidebar" />

        <app-sidebar :is-sidebar-open="isSidebarOpen" />

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
    name: 'AppLayout',

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

    data() {
        return {
            isSidebarOpen: true
        };
    },

    methods: {
        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen;
        }
    }
};
</script>
