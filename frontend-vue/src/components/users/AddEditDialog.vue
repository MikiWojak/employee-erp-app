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
                />

                <v-text-field
                    v-model="formData.lastName"
                    label="Last name"
                    :error-messages="handleError('lastName')"
                    @blur="onBlur('lastName')"
                />

                <date-picker
                    v-model="formData.dateOfBirth"
                    label="Date of birth"
                    :max="maxDate"
                    :error-messages="handleError('dateOfBirth')"
                    @blur="onBlur('dateOfBirth')"
                />

                <v-text-field
                    v-model="formData.email"
                    type="email"
                    label="Email"
                    :error-messages="handleError('email')"
                    @blur="onBlur('email')"
                />

                <v-text-field
                    v-if="!editedItem"
                    v-model="formData.password"
                    type="password"
                    label="Password"
                    :error-messages="handleError('password')"
                    hint="At least 8 letters"
                    @blur="onBlur('password')"
                />
            </v-card-text>

            <v-card-actions>
                <v-spacer />

                <v-btn text="Cancel" @click="close" />

                <v-btn text="Save" @click="save" />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import dayjs from 'dayjs';
import { mapActions } from 'pinia';
import { defineAsyncComponent } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, requiredIf, email, minLength } from '@vuelidate/validators';

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
            email: '',
            password: ''
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
                },
                password: {
                    required: requiredIf(function () {
                        return !this.editedItem;
                    }),
                    minLength: minLength(8)
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
