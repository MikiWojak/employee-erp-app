<template>
    <v-container fluid>
        <admin-part v-if="isAdmin" />

        <employee-part v-else />
    </v-container>
</template>

<script>
import { defineAsyncComponent } from 'vue';
import { mapState, mapActions } from 'pinia';

import { useAuthStore } from '@/stores/auth';

export default {
    name: 'DashboardPage',

    components: {
        AdminPart: defineAsyncComponent(
            () => import('@/views/dashboard/AdminPart')
        ),
        EmployeePart: defineAsyncComponent(
            () => import('@/views/dashboard/EmployeePart')
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
