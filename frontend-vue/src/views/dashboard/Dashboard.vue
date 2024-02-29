<template>
    <v-container fluid>
        <admin v-if="isAdmin" />
        <employee v-else />
    </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'Dashboard',

    components: {
        Admin: () => import('@/views/dashboard/Admin'),
        Employee: () => import('@/views/dashboard/Employee')
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

                this.$notify({
                    type: 'error',
                    text: "Cannot get logged user's data!"
                });
            }
        }
    }
};
</script>
