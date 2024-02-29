<template>
    <v-container fluid>
        <contracts-table />
    </v-container>
</template>

<script>
export default {
    name: 'Contracts',

    components: {
        ContractsTable: () => import('@/components/contracts/Table')
    }
};
</script>
