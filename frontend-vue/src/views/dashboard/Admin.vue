<template>
    <users-table />
</template>

<script>
import { defineAsyncComponent } from 'vue';

export default {
    name: 'Admin',

    components: {
        UsersTable: defineAsyncComponent(
            () => import('@/components/users/Table')
        )
    }
};
</script>
