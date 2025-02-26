<template>
    <v-container fluid>
        <vacations-table />
    </v-container>
</template>

<script>
import { defineAsyncComponent } from 'vue';

export default {
    name: 'VacationsPage',

    components: {
        VacationsTable: defineAsyncComponent(
            () => import('@/components/vacations/Table')
        )
    }
};
</script>
