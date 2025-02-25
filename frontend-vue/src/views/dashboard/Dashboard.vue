<template>
    <v-container fluid>
        <admin v-if="isAdmin" />
        <employee v-else />
    </v-container>
</template>

<script>
import { defineAsyncComponent } from 'vue';
import { mapState, mapActions } from 'pinia';

import { useAuthStore } from '@/stores/auth';

export default {
    name: 'Dashboard',

    components: {
        Admin: defineAsyncComponent(() => import('@/views/dashboard/Admin')),
        Employee: defineAsyncComponent(
            () => import('@/views/dashboard/Employee')
        )
    },

    computed: {
        ...mapState(useAuthStore, ['isAdmin'])
    },

    async created() {
        await this.handleGetMe();
    },

    methods: {
        ...mapActions(useAuthStore, { getMe: 'me' }),

        async handleGetMe() {
            try {
                await this.getMe();
            } catch (error) {
                console.error(error);

                this.$toast.error("Cannot get logged user's data!");
            }
        }
    }
};
</script>
