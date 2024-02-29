<template>
    <v-container fluid>
        <contracts-table />
    </v-container>
</template>

<script>
export default {
    components: {
        ContractsTable: () => import('@/components/contracts/Table')
    },

    middleware: 'auth',

    async asyncData({ store, error }) {
        try {
            await store.dispatch('contracts/index');
        } catch (e) {
            error({
                statusCode: e.response.status,
                message: 'Cannot get a list of contracts!'
            });
        }
    }
};
</script>
