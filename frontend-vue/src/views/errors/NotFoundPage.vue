<template>
    <div class="d-flex flex-column align-center">
        <h1>Page not found!</h1>

        <v-btn
            :to="{ name: loggedIn ? 'dashboard' : 'login' }"
            color="light-blue"
        >
            {{ btnTitle }}
        </v-btn>
    </div>
</template>

<script>
import { mapState } from 'pinia';

import { useAuthStore } from '@/stores/auth';

export default {
    name: 'NotFoundPage',

    computed: {
        ...mapState(useAuthStore, ['loggedIn']),

        btnTitle() {
            const page = this.loggedIn ? 'Dashboard' : 'Login';

            return `Go to ${page} Page`;
        }
    }
};
</script>
