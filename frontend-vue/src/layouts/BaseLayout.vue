<template>
    <v-app>
        <app-header />

        <v-main>
            <v-container>
                <router-view />
            </v-container>
        </v-main>

        <app-footer />
    </v-app>
</template>

<script>
import { defineAsyncComponent } from 'vue';

export default {
    name: 'BaseLayout',

    components: {
        AppFooter: defineAsyncComponent(
            () => import('@/components/layout/AppFooter')
        ),
        AppHeader: defineAsyncComponent(
            () => import('@/components/layout/AppHeader')
        )
    }
};
</script>
