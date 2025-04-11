<template>
    <div class="d-flex flex-column align-center">
        <h1>Page not found!</h1>

        <back-home-button />
    </div>
</template>

<script>
import BackHomeButton from '@/components/common/BackHomeButton';

export default {
    name: 'NotFoundPage',

    components: {
        BackHomeButton
    }
};
</script>
