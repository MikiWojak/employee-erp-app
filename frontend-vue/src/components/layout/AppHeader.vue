<template>
    <v-app-bar color="light-blue">
        <v-app-bar-nav-icon
            v-if="isToggleSidebarEnabled"
            variant="text"
            @click.stop="$emit('toggle-sidebar')"
        />

        <v-app-bar-title class="font-weight-bold">
            <router-link
                :to="{ name: loggedIn ? 'dashboard' : 'login' }"
                class="text-decoration-none text-white"
            >
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
        isToggleSidebarEnabled: {
            type: Boolean,
            default: false
        }
    },

    emits: ['toggle-sidebar'],

    computed: {
        ...mapState(useAuthStore, ['loggedIn'])
    }
};
</script>
