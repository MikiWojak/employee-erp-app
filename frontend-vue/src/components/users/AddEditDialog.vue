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
                    prepend-icon="mdi-account-circle"
                    :error-messages="handleError('firstName')"
                    @blur="onBlur('firstName')"
                    @input="clearServerError('firstName')"
                />

                <v-text-field
                    v-model="formData.lastName"
                    label="Last name"
                    prepend-icon="mdi-account-circle"
                    :error-messages="handleError('lastName')"
                    @blur="onBlur('lastName')"
                    @input="clearServerError('lastName')"
                />

                <role-select
                    v-if="isAdmin"
                    v-model="formData.role"
                    all-roles
                    :error-messages="handleError('role')"
                    @blur="onBlur('role')"
                    @update:model-value="clearServerError('role')"
                />

                <department-select
                    v-if="isAdmin && isRoleForDepartmentSelected"
                    v-model="selectedDepartment"
                    :error-messages="handleError('departmentId')"
                    @blur="onBlur('departmentId')"
                    @update:model-value="clearServerError('departmentId')"
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
                    prepend-icon="mdi-email"
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
import {
    email,
    required,
    maxLength,
    minLength,
    requiredIf
} from '@vuelidate/validators';
import { defineAsyncComponent } from 'vue';
import { mapState, mapActions } from 'pinia';
import { useVuelidate } from '@vuelidate/core';

import { Roles } from '@/enums/Roles';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import BaseAddEditDialog from '@/components/common/BaseAddEditDialog';

export default {
    name: 'AddEditDialog',

    components: {
        DatePicker: defineAsyncComponent(
            () => import('@/components/inputs/DatePicker')
        ),
        RoleSelect: defineAsyncComponent(
            () => import('@/components/inputs/RoleSelect')
        ),
        DepartmentSelect: defineAsyncComponent(
            () => import('@/components/inputs/DepartmentSelect')
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
            role: null,
            departmentId: null,
            dateOfBirth: '',
            email: ''
        };

        return {
            selectedDepartment: null,
            defaultForm,
            formData: { ...defaultForm },
            maxDate: dayjs().format('YYYY-MM-DD')
        };
    },

    validations() {
        return {
            formData: {
                firstName: {
                    required,
                    minLengthValue: minLength(2),
                    maxLengthValue: maxLength(255)
                },
                lastName: {
                    required,
                    minLengthValue: minLength(2),
                    maxLengthValue: maxLength(255)
                },
                role: {
                    required: requiredIf(function () {
                        return this.isAdmin;
                    })
                },
                departmentId: {
                    required: requiredIf(function () {
                        return this.isAdmin && this.isRoleForDepartmentSelected;
                    })
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
        ...mapState(useAuthStore, ['isAdmin']),

        formTitle() {
            return this.editedItem ? 'Edit user' : 'New user';
        },

        isRoleForDepartmentSelected() {
            return [Roles.MANAGER, Roles.EMPLOYEE].includes(this.formData.role);
        }
    },

    watch: {
        selectedDepartment: {
            handler(newVal) {
                this.formData.department = newVal;
                this.formData.departmentId = newVal?.id || '';
            }
        },

        editedItem: {
            handler(val) {
                this.formData = val ? { ...val } : { ...this.defaultForm };
                this.formData.role = val?.role?.name;
                this.selectedDepartment = val?.department
                    ? { ...val.department }
                    : null;
            },
            immediate: true
        }
    },

    methods: {
        ...mapActions(useUserStore, {
            createItem: 'store',
            updateItem: 'update'
        }),

        clearInputs() {
            this.formData = { ...this.defaultForm };
            this.selectedDepartment = null;
        }
    }
};
</script>
