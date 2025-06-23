<template>
    <component :is="layoutComponent">
        <router-view :key="$route.fullPath" />
    </component>
</template>

<script>
import { defineAsyncComponent } from 'vue';

import { Layouts } from '@/enums/Layouts';

export default {
    name: 'App',

    components: {
        AppLayout: defineAsyncComponent(() => import('@/layouts/AppLayout')),
        BaseLayout: defineAsyncComponent(() => import('@/layouts/BaseLayout'))
    },

    computed: {
        layoutComponent() {
            return this.$route.meta.layout || Layouts.APP;
        }
    }
};
</script>
