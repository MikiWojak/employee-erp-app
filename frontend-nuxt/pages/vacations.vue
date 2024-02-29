<template>
    <v-container fluid>
        <vacations-table />
    </v-container>
</template>

<script>
export default {
    components: {
        VacationsTable: () => import('@/components/vacations/Table')
    },

    middleware: 'auth',

    async asyncData({ store, error }) {
        try {
            await store.dispatch('vacations/index');
        } catch (e) {
            error({
                statusCode: e.response.status,
                message: 'Cannot get a list of vacations!'
            });
        }
    }
};
</script>
