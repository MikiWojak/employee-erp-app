<template>
    <h1>Hello {{ loggedUser?.firstName }}!</h1>

    <days-off-summary v-if="!isAdmin" />
</template>

<script>
import { mapState } from 'pinia';
import { defineAsyncComponent } from 'vue';

import { useAuthStore } from '@/stores/auth';

export default {
    name: 'DashboardPage',

    components: {
        DaysOffSummary: defineAsyncComponent(
            () => import('@/components/dashboard/DaysOffSummary')
        )
    },

    computed: {
        ...mapState(useAuthStore, ['isAdmin', 'loggedUser'])
    }
};
</script>
