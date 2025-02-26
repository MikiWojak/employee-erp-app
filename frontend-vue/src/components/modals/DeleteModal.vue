<template>
    <v-dialog
        v-model="isDialogOpened"
        max-width="500px"
        @click:outside="close"
        @keydown.esc="close"
    >
        <v-card>
            <v-card-title>
                {{ title }}
            </v-card-title>

            <v-card-actions>
                <v-spacer />

                <v-btn text="No" @click="close" />

                <v-btn text="Yes" @click="doDelete" />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'DeleteModal',

    props: {
        title: {
            type: String,
            default: 'Do you really want to delete this item?'
        },

        isOpened: {
            type: Boolean,
            default: false
        },

        itemId: {
            type: String,
            default: null
        }
    },

    emits: ['close', 'delete'],

    data() {
        return {
            isDialogOpened: false
        };
    },

    watch: {
        isOpened() {
            this.isDialogOpened = this.isOpened;
        }
    },

    methods: {
        doDelete() {
            this.$emit('delete', this.itemId);
        },

        close() {
            this.$emit('close');
        }
    }
};
</script>
