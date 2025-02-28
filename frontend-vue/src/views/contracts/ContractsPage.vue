<template>
    <v-container fluid>
        <contracts-table />
    </v-container>
</template>

<script>
import { defineAsyncComponent } from 'vue';

export default {
    name: 'ContractsPage',

    components: {
        ContractsTable: defineAsyncComponent(
            () => import('@/components/contracts/Table')
        )
    }
};
</script>
