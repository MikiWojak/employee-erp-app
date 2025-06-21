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
                <v-select
                    v-model="formData.status"
                    :items="statusOptions"
                    hide-no-data
                    label="Status"
                    prepend-icon="mdi-clipboard-check"
                    :error-messages="handleError('status')"
                    @blur="onBlur('status')"
                    @update:model-value="clearServerError('status')"
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
import { required, helpers } from '@vuelidate/validators';

import { useSuggestionStore } from '@/stores/suggestion';
import { SuggestionStatuses } from '@/enums/SuggestionStatuses';
import BaseAddEditDialog from '@/components/common/BaseAddEditDialog';

export default {
    name: 'StatusDialog',

    extends: BaseAddEditDialog,

    setup() {
        return { v$: useVuelidate() };
    },

    data() {
        const defaultForm = {
            status: null
        };

        return {
            defaultForm,
            formData: { ...defaultForm }
        };
    },

    validations() {
        return {
            formData: {
                status: {
                    required,
                    isIn: helpers.withMessage(
                        'Invalid value. Please select other value.',
                        value => this.statusOptions.includes(value)
                    )
                }
            }
        };
    },

    computed: {
        formTitle() {
            return 'Edit Suggestion status';
        },

        statusOptions() {
            return Object.values(SuggestionStatuses);
        }
    },

    methods: {
        ...mapActions(useSuggestionStore, {
            updateItem: 'status'
        }),

        clearInputs() {
            this.formData = { ...this.defaultForm };
            this.selectedDepartment = null;
        }
    }
};
</script>
