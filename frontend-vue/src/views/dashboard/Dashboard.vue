<template>
    <v-container fluid>
        <admin v-if="isAdmin" />
        <employee v-else />
    </v-container>
</template>
<script>
import { defineAsyncComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'Dashboard',

    components: {
        Admin: defineAsyncComponent(() => import('@/views/dashboard/Admin')),
        Employee: defineAsyncComponent(
            () => import('@/views/dashboard/Employee')
        )
    },

    computed: {
        ...mapGetters({
            isAdmin: 'auth/isAdmin'
        })
    },

    async created() {
        await this.handleGetMe();
    },

    methods: {
        ...mapActions({
            getMe: 'auth/me'
        }),

        async handleGetMe() {
            try {
                await this.getMe();
            } catch (error) {
                console.error(error);
            }
        }
    }
};
</script>
