<template>
    <users-table />
</template>

<script>
export default {
    name: 'Admin',

    components: {
        UsersTable: () => import('@/components/users/Table')
    }
};
</script>
