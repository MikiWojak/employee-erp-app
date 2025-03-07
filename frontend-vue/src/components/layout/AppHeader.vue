<template>
    <v-app-bar color="light-blue">
        <v-app-bar-nav-icon
            v-if="isToggleSidebarIcon"
            variant="text"
            @click.stop="$emit('toggle-sidebar')"
        />

        <!-- // @TODO Link to Dashboard / Login - style -->
        <v-app-bar-title class="font-weight-bold">
            <router-link :to="{ name: loggedIn ? 'dashboard' : 'login' }">
                Employee ERP App
            </router-link>
        </v-app-bar-title>
    </v-app-bar>
</template>

<script>
import { mapState } from 'pinia';

import { useAuthStore } from '@/stores/auth';

export default {
    name: 'AppHeader',

    props: {
        isToggleSidebarIcon: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        ...mapState(useAuthStore, ['loggedIn'])
    },

    emits: ['toggle-sidebar']
};
</script>
