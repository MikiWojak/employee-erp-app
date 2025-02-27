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
                <v-autocomplete
                    v-if="isAdmin"
                    v-model="formData.userId"
                    :items="users"
                    :item-title="getFullNameTitle"
                    item-value="id"
                    label="User"
                    :error-messages="handleError('userId')"
                    @blur="onBlur('userId')"
                />

                <v-row>
                    <v-col cols="6">
                        <date-picker
                            v-model="formData.startDate"
                            label="Start date"
                            :allowed-dates="allowBusinessDays"
                            :max="formData.endDate"
                            :error-messages="handleError('startDate')"
                            @blur="onBlur('startDate')"
                        />
                    </v-col>

                    <v-col cols="6">
                        <date-picker
                            v-model="formData.endDate"
                            label="End date"
                            :allowed-dates="allowBusinessDays"
                            :min="formData.startDate"
                            :error-messages="handleError('endDate')"
                            @blur="onBlur('endDate')"
                        />
                    </v-col>
                </v-row>

                <v-checkbox
                    v-if="isAdmin"
                    v-model="formData.approved"
                    label="Approved"
                    :error-messages="handleError('approved')"
                    @blur="onBlur('approved')"
                />
            </v-card-text>

            <v-card-actions>
                <v-spacer />

                <v-btn text @click="close">
                    <span>Cancel</span>
                </v-btn>

                <v-btn text @click="save">
                    <span>Save</span>
                </v-btn>
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
import { useUserStore } from '@/stores/user';
import { useVacationStore } from '@/stores/vacation';
import getFullNameTitle from '@/helpers/getFullName';
import BaseAddEditDialog from '@/components/common/BaseAddEditDialog';

export default {
    name: 'AddEditDialog',

    components: {
        DatePicker: defineAsyncComponent(
            () => import('@/components/common/DatePicker')
        )
    },

    extends: BaseAddEditDialog,

    setup() {
        return { v$: useVuelidate() };
    },

    data() {
        const defaultForm = {
            userId: '',
            startDate: '',
            endDate: '',
            approved: false
        };

        return {
            users: [],
            defaultForm,
            formData: { ...defaultForm },
            getFullNameTitle
        };
    },

    validations() {
        return {
            formData: {
                userId: {
                    required: requiredIf(function () {
                        return this.isAdmin;
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
                        return this.isAdmin;
                    })
                }
            }
        };
    },

    computed: {
        ...mapState(useAuthStore, ['loggedUser', 'isAdmin']),

        formTitle() {
            return this.editedItem ? 'Edit vacation' : 'New vacation';
        }
    },

    async created() {
        if (this.isAdmin) {
            await this.doGetUsers();
        }
    },

    methods: {
        ...mapActions(useUserStore, { getUsers: 'index' }),

        ...mapActions(useVacationStore, {
            createItem: 'store',
            updateItem: 'update'
        }),

        allowBusinessDays(value) {
            const day = new Date(value).getDay();
            const isWeekend = [0, 6].includes(day);

            return !isWeekend;
        },

        async doGetUsers() {
            try {
                const { rows } = await this.getUsers();

                this.users = rows;
            } catch (error) {
                console.error(error);

                this.$toast.error('Cannot get a list of users!');
            }
        },

        // @TODO Prepare it in API!
        prepareFormDataAfterValidation() {
            if (!this.isAdmin) {
                this.formData.userId = this.loggedUser.id;
                this.formData.approved = false;
            }
        }
    }
};
</script>
