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
                    :error-messages="firstNameError"
                    @blur="onBlur('firstName')"
                />

                <v-text-field
                    v-model="formData.lastName"
                    label="Last name"
                    :error-messages="lastNameError"
                    @blur="onBlur('lastName')"
                />

                <date-picker
                    v-model="formData.dateOfBirth"
                    label="Date of birth"
                    :max="maxDate"
                    :error-messages="dateOfBirthError"
                    @blur="onBlur('dateOfBirth')"
                />

                <v-text-field
                    v-model="formData.email"
                    type="email"
                    label="Email"
                    :error-messages="emailError"
                    @blur="onBlur('email')"
                />

                <v-text-field
                    v-if="!editedItem"
                    v-model="formData.password"
                    type="password"
                    label="Password"
                    :error-messages="passwordError"
                    hint="At least 8 letters"
                    @blur="onBlur('password')"
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
import dayjs from 'dayjs';
import { mapActions } from 'pinia';
import { defineAsyncComponent } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, requiredIf, email, minLength } from '@vuelidate/validators';

import { useUserStore } from '@/stores/user';
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
        },

        firstNameError() {
            return this.handleError('firstName');
        },

        lastNameError() {
            return this.handleError('lastName');
        },

        dateOfBirthError() {
            return this.handleError('dateOfBirth');
        },

        emailError() {
            return this.handleError('email');
        },

        passwordError() {
            return this.handleError('password');
        }
    },

    methods: {
        ...mapActions(useUserStore, {
            createUser: 'store',
            updateUser: 'update'
        }),

        async save() {
            this.serverErrors = [];

            this.v$.formData.$touch();

            if (this.v$.formData.$invalid) {
                return;
            }

            try {
                if (this.editedItem) {
                    await this.updateUser(this.formData);

                    this.$toast.success('User has been modified');

                    this.close();
                } else {
                    await this.createUser(this.formData);

                    this.$toast.success('User has been added');

                    this.close();
                }
            } catch (error) {
                console.error(error);

                if (error?.response?.data?.errors) {
                    this.serverErrors = error.response.data.errors;
                }

                const errorText = this.editedItem
                    ? 'Error while modifying the user!'
                    : 'Error while adding the user!';

                this.$toast.error(errorText);
            }
        }
    }
};
</script>
