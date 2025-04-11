<template>
    <v-btn :to="{ name: loggedIn ? 'dashboard' : 'login' }" color="light-blue">
        {{ btnTitle }}
    </v-btn>
</template>

<script>
import { mapState } from 'pinia';

import { useAuthStore } from '@/stores/auth';

export default {
    name: 'ReturnHomeButton',

    computed: {
        ...mapState(useAuthStore, ['loggedIn']),

        btnTitle() {
            const page = this.loggedIn ? 'Dashboard' : 'Login';

            return `Go to ${page} Page`;
        }
    }
};
</script>
