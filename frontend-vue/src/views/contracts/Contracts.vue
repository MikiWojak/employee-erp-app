<template>
    <v-container fluid>
        <contracts-table />
    </v-container>
</template>

<script>
import { defineAsyncComponent } from 'vue';

export default {
    name: 'Contracts',

    components: {
        ContractsTable: defineAsyncComponent(
            () => import('@/components/contracts/Table')
        )
    }
};
</script>
