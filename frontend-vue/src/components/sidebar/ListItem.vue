<template>
    <v-list-item link @click="$emit('click')">
        <span>
            <v-icon class="mr-2">{{ icon }}</v-icon>
        </span>

        <v-list-item-content>
            <v-list-item-title>{{ text }}</v-list-item-title>
        </v-list-item-content>
    </v-list-item>
</template>

<script>
export default {
    name: 'ListItem',

    props: {
        icon: {
            type: String,
            required: true
        },

        text: {
            type: String,
            required: true
        }
    }
};
</script>
