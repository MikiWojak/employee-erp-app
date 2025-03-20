<template>
    <component :is="$route.meta.layoutComponent">
        <slot />
    </component>
</template>

<script>
export default {
    name: 'App'
};
</script>
