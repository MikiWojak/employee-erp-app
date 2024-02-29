<template>
    <v-container fluid>
        <vacations-table />
    </v-container>
</template>

<script>
export default {
    name: 'Vacations',

    components: {
        VacationsTable: () => import('@/components/vacations/Table')
    }
};
</script>
