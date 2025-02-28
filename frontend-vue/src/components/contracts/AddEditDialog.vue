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
                    v-model="formData.userId"
                    :items="users"
                    :item-title="getFullNameTitle"
                    item-value="id"
                    label="User"
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

import { useUserStore } from '@/stores/user';
import { useContractStore } from '@/stores/contract';
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
            position: '',
            startDate: '',
            endDate: '',
            vacationDaysPerYear: 20
        };

        return {
            users: [],
            defaultForm,
            formData: { ...defaultForm },
            vacationDaysPerYearItems: [
                { text: 20, value: 20 },
                { text: 26, value: 26 }
            ],
            getFullNameTitle
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

    async created() {
        await this.doGetUsers();
    },

    methods: {
        ...mapActions(useUserStore, { getUsers: 'index' }),

        ...mapActions(useContractStore, {
            createItem: 'store',
            updateItem: 'update'
        }),

        async doGetUsers() {
            try {
                const { rows } = await this.getUsers();

                this.users = rows;
            } catch (error) {
                console.error(error);

                this.$toast.error('Cannot get a list of users!');
            }
        }
    }
};
</script>
