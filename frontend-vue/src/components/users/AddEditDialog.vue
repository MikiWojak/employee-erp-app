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
                    v-model="formData.firstName"
                    label="First name"
                    :error-messages="handleError('firstName')"
                    @blur="onBlur('firstName')"
                    @input="clearServerError('firstName')"
                />

                <v-text-field
                    v-model="formData.lastName"
                    label="Last name"
                    :error-messages="handleError('lastName')"
                    @blur="onBlur('lastName')"
                    @input="clearServerError('lastName')"
                />

                <date-picker
                    v-model="formData.dateOfBirth"
                    label="Date of birth"
                    :max="maxDate"
                    :error-messages="handleError('dateOfBirth')"
                    @blur="onBlur('dateOfBirth')"
                    @update:model-value="clearServerError('dateOfBirth')"
                />

                <v-text-field
                    v-model="formData.email"
                    type="email"
                    label="Email"
                    :error-messages="handleError('email')"
                    @blur="onBlur('email')"
                    @input="clearServerError('email')"
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
import dayjs from 'dayjs';
import { mapActions } from 'pinia';
import { defineAsyncComponent } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';

import { useUserStore } from '@/stores/user';
import BaseAddEditDialog from '@/components/common/BaseAddEditDialog';

export default {
    name: 'AddEditDialog',

    components: {
        DatePicker: defineAsyncComponent(
            () => import('@/components/inputs/DatePicker')
        )
    },

    extends: BaseAddEditDialog,

    setup() {
        return { v$: useVuelidate() };
    },

    data() {
        const defaultForm = {
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            email: ''
        };

        return {
            defaultForm,
            formData: { ...defaultForm },
            maxDate: dayjs().format('YYYY-MM-DD')
        };
    },

    validations() {
        return {
            formData: {
                firstName: {
                    required
                },
                lastName: {
                    required
                },
                dateOfBirth: {
                    required
                },
                email: {
                    required,
                    email
                }
            }
        };
    },

    computed: {
        formTitle() {
            return this.editedItem ? 'Edit employee' : 'New employee';
        }
    },

    methods: {
        ...mapActions(useUserStore, {
            createItem: 'store',
            updateItem: 'update'
        })
    }
};
</script>
