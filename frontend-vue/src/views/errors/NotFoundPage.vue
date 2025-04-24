<template>
    <div class="d-flex flex-column align-center">
        <h1>Page not found!</h1>

        <back-home-button />
    </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';

export default {
    name: 'NotFoundPage',

    components: {
        BackHomeButton: defineAsyncComponent(
            () => import('@/components/common/BackHomeButton')
        )
    }
};
</script>
