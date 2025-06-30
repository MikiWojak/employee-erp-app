<template>
    <v-dialog
        v-model="isDialogOpened"
        max-width="500px"
        @click:outside="close"
        @keydown.esc="close"
    >
        <v-card>
            <v-card-title class="text-h6">
                {{ formTitle }}
            </v-card-title>

            <v-card-text>
                <v-textarea
                    v-model="formData.content"
                    label="Content"
                    prepend-icon="mdi-text-box"
                    :error-messages="handleError('content')"
                    @blur="onBlur('content')"
                    @input="clearServerError('content')"
                />
            </v-card-text>

            <v-card-actions>
                <v-spacer />

                <v-btn text="Cancel" :disabled="loading" @click="close" />

                <v-btn text="Save" :disabled="loading" @click="save" />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import {
    required,
    maxLength,
    minLength,
    requiredIf
} from '@vuelidate/validators';
import { mapActions } from 'pinia';
import { useVuelidate } from '@vuelidate/core';

import { useSuggestionStore } from '@/stores/suggestion';
import BaseAddEditDialog from '@/components/common/BaseAddEditDialog';
import { useSuggestionCommentStore } from '@/stores/suggestionComment';

export default {
    name: 'AddEditDialog',

    extends: BaseAddEditDialog,

    props: {
        suggestion: {
            type: Object,
            required: true
        }
    },

    setup() {
        return { v$: useVuelidate() };
    },

    data() {
        const defaultForm = {
            suggestionId: this.suggestion.id,
            content: ''
        };

        return {
            defaultForm,
            formData: { ...defaultForm }
        };
    },

    validations() {
        return {
            formData: {
                suggestionId: {},
                content: {
                    required,
                    minLengthValue: minLength(2),
                    maxLengthValue: maxLength(5000)
                }
            }
        };
    },

    computed: {
        formTitle() {
            return this.editedItem ? 'Edit comment' : 'New comment';
        }
    },

    watch: {
        suggestion: {
            handler(val) {
                this.defaultForm.suggestionId = val.id;
                this.formData.suggestionId = val.id;
            },
            immediate: true
        },
        editedItem: {
            handler(val) {
                this.formData = val ? { ...val } : { ...this.defaultForm };
            },
            immediate: true
        }
    },

    methods: {
        ...mapActions(useSuggestionStore, {
            createItem: 'storeComment'
        }),
        ...mapActions(useSuggestionCommentStore, {
            updateItem: 'update'
        })
    }
};
</script>
