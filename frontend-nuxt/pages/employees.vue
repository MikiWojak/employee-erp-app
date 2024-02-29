<template>
    <v-container fluid>
        <users-table />
    </v-container>
</template>

<script>
export default {
    components: {
        UsersTable: () => import('@/components/users/Table')
    },

    middleware: 'auth',

    async asyncData({ store, error }) {
        try {
            await store.dispatch('users/index');
        } catch (e) {
            error({
                statusCode: e.response.status,
                message: 'Cannot get a list of users!'
            });
        }
    }
};
</script>
