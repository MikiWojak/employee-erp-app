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
                <user-select
                    v-model="selectedUser"
                    :error-messages="handleError('userId')"
                    @blur="onBlur('userId')"
                />

                <v-text-field
                    v-model="formData.position"
                    label="Position"
                    :error-messages="handleError('position')"
                    @blur="onBlur('position')"
                />

                <date-picker
                    v-model="formData.startDate"
                    label="Start date"
                    :max="formData.endDate"
                    :error-messages="handleError('startDate')"
                    @blur="onBlur('startDate')"
                />

                <date-picker
                    v-model="formData.endDate"
                    label="End date"
                    :min="formData.startDate"
                    :error-messages="handleError('endDate')"
                    @blur="onBlur('endDate')"
                />

                <v-select
                    v-model="formData.vacationDaysPerYear"
                    label="Days off/year"
                    :items="vacationDaysPerYearItems"
                    item-title="text"
                    item-value="value"
                    :error-messages="handleError('vacationDaysPerYear')"
                    @blur="onBlur('vacationDaysPerYear')"
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
import { mapActions } from 'pinia';
import { defineAsyncComponent } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, integer } from '@vuelidate/validators';

import { useContractStore } from '@/stores/contract';
import BaseAddEditDialog from '@/components/common/BaseAddEditDialog';

export default {
    name: 'AddEditDialog',

    components: {
        DatePicker: defineAsyncComponent(
            () => import('@/components/inputs/DatePicker')
        ),
        UserSelect: defineAsyncComponent(
            () => import('@/components/inputs/UserSelect')
        )
    },

    extends: BaseAddEditDialog,

    setup() {
        return { v$: useVuelidate() };
    },

    data() {
        const defaultForm = {
            user: null,
            userId: '',
            position: '',
            startDate: '',
            endDate: '',
            vacationDaysPerYear: 20
        };

        return {
            users: [],
            selectedUser: null,
            defaultForm,
            formData: { ...defaultForm },
            vacationDaysPerYearItems: [
                { text: 20, value: 20 },
                { text: 26, value: 26 }
            ]
        };
    },

    validations() {
        return {
            formData: {
                userId: {
                    required
                },
                position: {
                    required
                },
                startDate: {
                    required
                },
                endDate: {
                    required
                },
                vacationDaysPerYear: {
                    required,
                    integer
                }
            }
        };
    },

    computed: {
        formTitle() {
            return this.editedItem ? 'Edit contract' : 'New contract';
        }
    },

    watch: {
        selectedUser: {
            handler(newVal) {
                this.formData.user = newVal;
                this.formData.userId = newVal?.id || '';
            }
        },

        editedItem: {
            handler(val) {
                this.formData = val ? { ...val } : { ...this.defaultForm };
                this.selectedUser = val ? { ...val.user } : null;
            },
            immediate: true
        }
    },

    methods: {
        ...mapActions(useContractStore, {
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
