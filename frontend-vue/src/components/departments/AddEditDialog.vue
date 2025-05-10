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
                    v-model="formData.name"
                    label="Name"
                    :error-messages="handleError('name')"
                    @blur="onBlur('name')"
                    @input="clearServerError('name')"
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

import { useDepartmentStore } from '@/stores/department';
import BaseAddEditDialog from '@/components/common/BaseAddEditDialog';

export default {
    name: 'AddEditDialog',

    extends: BaseAddEditDialog,

    setup() {
        return { v$: useVuelidate() };
    },

    data() {
        const defaultForm = {
            name: ''
        };

        return {
            defaultForm,
            formData: { ...defaultForm }
        };
    },

    validations() {
        return {
            formData: {
                name: {
                    required
                }
            }
        };
    },

    computed: {
        formTitle() {
            return this.editedItem ? 'Edit department' : 'New department';
        }
    },

    methods: {
        ...mapActions(useDepartmentStore, {
            createItem: 'store',
            updateItem: 'update'
        }),

        clearInputs() {
            this.formData = { ...this.defaultForm };
            this.selectedUser = null;
        }
    }
};
</script>
