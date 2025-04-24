<template>
    <v-dialog
        v-model="isDialogOpened"
        max-width="500px"
        @click:outside="doDiscard"
        @keydown.esc="doDiscard"
    >
        <v-card>
            <v-card-title>
                {{ title }}
            </v-card-title>

            <v-card-actions>
                <v-spacer />

                <v-btn text="No" :disabled="loading" @click="doDiscard" />

                <v-btn text="Yes" :disabled="loading" @click="doConfirm" />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'ConfirmationModal',

    props: {
        isOpened: {
            type: Boolean,
            default: false
        },

        title: {
            type: String,
            default: 'Are you sure you want to continue?'
        },

        loading: {
            type: Boolean,
            default: false
        }
    },

    emits: ['confirm', 'discard'],

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
        doConfirm() {
            this.$emit('confirm');
        },

        doDiscard() {
            this.$emit('discard');
        }
    }
};
</script>
