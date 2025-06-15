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
                <v-text-field
                    v-model="formData.title"
                    label="Title"
                    prepend-icon="mdi-lightbulb-on"
                    :error-messages="handleError('title')"
                    @blur="onBlur('title')"
                    @input="clearServerError('title')"
                />

                <v-textarea
                    v-model="formData.description"
                    label="Description"
                    prepend-icon="mdi-text-box"
                    :error-messages="handleError('description')"
                    @blur="onBlur('description')"
                    @input="clearServerError('description')"
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
import { mapActions } from 'pinia';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';

import { useSuggestionStore } from '@/stores/suggestion';
import BaseAddEditDialog from '@/components/common/BaseAddEditDialog';
import { BelongingTabs } from '@/enums/BelongingTabs';

export default {
    name: 'AddEditDialog',

    extends: BaseAddEditDialog,

    setup() {
        return { v$: useVuelidate() };
    },

    data() {
        const defaultForm = {
            title: '',
            description: ''
        };

        return {
            selectedDepartment: null,
            defaultForm,
            formData: { ...defaultForm }
        };
    },

    validations() {
        return {
            formData: {
                title: {
                    required
                },
                description: {
                    required
                }
            }
        };
    },

    computed: {
        formTitle() {
            return this.editedItem ? 'Edit suggestion' : 'New suggestion';
        }
    },

    methods: {
        ...mapActions(useSuggestionStore, {
            createItem: 'store',
            updateItem: 'update'
        })
    }
};
</script>
