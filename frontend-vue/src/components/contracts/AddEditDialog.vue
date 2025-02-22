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
                    :error-messages="userIdError"
                    @blur="onBlur('userId')"
                />

                <v-text-field
                    v-model="formData.position"
                    label="Position"
                    :error-messages="positionError"
                    @blur="onBlur('position')"
                />

                <date-picker
                    v-model="formData.startDate"
                    label="Start date"
                    :max="formData.endDate"
                    :error-messages="startDateError"
                    @blur="onBlur('startDate')"
                />

                <date-picker
                    v-model="formData.endDate"
                    label="End date"
                    :min="formData.startDate"
                    :error-messages="endDateError"
                    @blur="onBlur('endDate')"
                />

                <v-select
                    v-model="formData.vacationDaysPerYear"
                    label="Days off/year"
                    :items="vacationDaysPerYearItems"
                    item-title="text"
                    item-value="value"
                    :error-messages="vacationDaysPerYearError"
                    @blur="onBlur('vacationDaysPerYear')"
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
import { required, integer } from '@vuelidate/validators';

import { useUserStore } from '@/stores/user';
import { useContractStore } from '@/stores/contract';
import getFullNameTitle from '@/helpers/getFullName';
import addEditDialogMixin from '@/mixins/addEditDialogMixin';

export default {
    name: 'AddEditDialog',

    components: {
        DatePicker: defineAsyncComponent(
            () => import('@/components/common/DatePicker')
        )
    },

    mixins: [addEditDialogMixin],

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
        ...mapState(useUserStore, { users: 'items' }),

        formTitle() {
            return this.editedItem ? 'Edit contract' : 'New contract';
        },

        userIdError() {
            return this.handleError('userId');
        },

        positionError() {
            return this.handleError('position');
        },

        startDateError() {
            return this.handleError('startDate');
        },

        endDateError() {
            return this.handleError('endDate');
        },

        vacationDaysPerYearError() {
            return this.handleError('vacationDaysPerYear');
        }
    },

    async created() {
        await this.handleGetUsers();
    },

    methods: {
        ...mapActions(useUserStore, { getUsers: 'index' }),
        ...mapActions(useContractStore, {
            createContract: 'store',
            updateContract: 'update'
        }),

        async handleGetUsers() {
            try {
                await this.getUsers();
            } catch (error) {
                console.error(error);

                this.$toast.error('Cannot get a list of users!');
            }
        },

        async save() {
            this.serverErrors = [];

            this.v$.formData.$touch();

            if (this.v$.formData.$invalid) {
                return;
            }

            try {
                if (this.editedItem) {
                    await this.updateContract(this.formData);

                    this.$toast.success('Contract has been modified');

                    this.close();
                } else {
                    await this.createContract(this.formData);

                    this.$toast.success('Contract has been added');

                    this.close();
                }
            } catch (error) {
                console.error(error);

                if (error?.response?.data?.errors) {
                    this.serverErrors = error.response.data.errors;
                }

                const errorText = this.editedItem
                    ? 'Error while modifying the contract!'
                    : 'Error while adding the contract!';

                this.$toast.error(errorText);
            }
        }
    }
};
</script>
