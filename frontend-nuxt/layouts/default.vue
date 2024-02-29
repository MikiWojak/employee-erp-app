<template>
    <v-app>
        <app-header />

        <side-bar v-if="$auth.loggedIn" />

        <v-main>
            <nuxt />
        </v-main>

        <notifications position="bottom center" />

        <app-footer />
    </v-app>
</template>

<script>
export default {
    components: {
        AppHeader: () => import('@/components/common/Header'),
        SideBar: () => import('@/components/common/SideBar'),
        AppFooter: () => import('@/components/common/Footer')
    }
};
</script>
