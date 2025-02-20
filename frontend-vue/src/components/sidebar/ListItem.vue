<template>
    <v-list-item link @click="$emit('click')">
        <template #prepend>
            <v-icon>
                {{ icon }}
            </v-icon>
        </template>

        <v-list-item-title>
            {{ text }}
        </v-list-item-title>
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
