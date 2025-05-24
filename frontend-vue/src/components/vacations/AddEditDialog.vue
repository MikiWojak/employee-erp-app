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
                <v-switch
                    v-if="isManager && !editedItem"
                    v-model="isMyRequest"
                    label="Add for myself"
                />

                <user-select
                    v-if="fullFormMode"
                    v-model="selectedUser"
                    :error-messages="handleError('userId')"
                    @blur="onBlur('userId')"
                    @update:model-value="clearServerError('userId')"
                />

                <date-picker
                    v-model="formData.startDate"
                    label="Start date"
                    :allowed-dates="allowBusinessDays"
                    :max="formData.endDate"
                    :error-messages="handleError('startDate')"
                    @blur="onBlur('startDate')"
                    @update:model-value="clearServerError('startDate')"
                />

                <date-picker
                    v-model="formData.endDate"
                    label="End date"
                    :allowed-dates="allowBusinessDays"
                    :min="formData.startDate"
                    :error-messages="handleError('endDate')"
                    @blur="onBlur('endDate')"
                    @update:model-value="clearServerError('endDate')"
                />

                <v-checkbox
                    v-if="fullFormMode"
                    v-model="formData.approved"
                    label="Approved"
                    :error-messages="handleError('approved')"
                    @update:model-value="clearServerError('approved')"
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
import { defineAsyncComponent } from 'vue';
import { mapState, mapActions } from 'pinia';
import { useVuelidate } from '@vuelidate/core';
import { required, requiredIf } from '@vuelidate/validators';

import { useAuthStore } from '@/stores/auth';
import { useVacationStore } from '@/stores/vacation';
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
            startDate: '',
            endDate: '',
            approved: false
        };

        return {
            users: [],
            selectedUser: null,
            defaultForm,
            formData: { ...defaultForm },
            isMyRequest: false
        };
    },

    validations() {
        return {
            formData: {
                userId: {
                    required: requiredIf(function () {
                        return this.isAdmin || this.isManager;
                    })
                },
                startDate: {
                    required
                },
                endDate: {
                    required
                },
                approved: {
                    required: requiredIf(function () {
                        return this.fullFormMode;
                    })
                }
            }
        };
    },

    computed: {
        ...mapState(useAuthStore, ['loggedUser', 'isAdmin', 'isManager']),

        formTitle() {
            return this.editedItem ? 'Edit vacation' : 'New vacation';
        },

        fullFormMode() {
            return this.isAdmin || (this.isManager && !this.isMyRequest);
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
                this.selectedUser = val?.user ? { ...val.user } : null;

                if (val) {
                    this.isMyRequest =
                        this.editedItem.userId === this.loggedUser.id;
                }
            },
            immediate: true
        },

        isMyRequest: {
            handler(val) {
                if (!this.editedItem) {
                    this.selectedUser = val ? this.loggedUser : null;
                }
            }
        }
    },

    methods: {
        ...mapActions(useVacationStore, {
            createItem: 'store',
            updateItem: 'update'
        }),

        allowBusinessDays(value) {
            const day = new Date(value).getDay();
            const isWeekend = [0, 6].includes(day);

            return !isWeekend;
        },

        clearInputs() {
            this.formData = { ...this.defaultForm };
            this.selectedUser = null;
        }
    }
};
</script>
