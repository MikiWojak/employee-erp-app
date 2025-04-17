<template>
    <v-row>
        <v-col md="8" lg="6" class="mx-auto">
            <h1>Profile page</h1>

            <v-form @submit.prevent="handleUpdateProfile">
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

                <v-file-input v-model="formData.avatar" label="Avatar" />

                <v-btn type="submit" width="100%" :disabled="loading">
                    <span>Login</span>
                </v-btn>
            </v-form>
        </v-col>
    </v-row>
</template>

<script>
import dayjs from 'dayjs';
import { defineAsyncComponent } from 'vue';
import { mapActions, mapState } from 'pinia';
import { useVuelidate } from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';

import { useAuthStore } from '@/stores/auth';
import BaseForm from '@/components/common/BaseForm';
import { StatusCodes as HTTP } from 'http-status-codes/build/cjs/status-codes';

export default {
    name: 'ProfilePage',

    components: {
        DatePicker: defineAsyncComponent(
            () => import('@/components/inputs/DatePicker')
        )
    },

    extends: BaseForm,

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
            formData: { ...defaultForm },
            maxDate: dayjs().format('YYYY-MM-DD'),
            loading: false
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
                avatar: {}
            }
        };
    },

    computed: {
        ...mapState(useAuthStore, ['loggedUser'])
    },

    created() {
        this.formData = { ...this.loggedUser };
    },

    methods: {
        ...mapActions(useAuthStore, ['updateProfile']),

        async handleUpdateProfile() {
            console.log('handleUpdateProfile');

            this.serverErrors = [];

            this.v$.formData.$touch();

            if (this.v$.formData.$invalid) {
                console.log('Invalid form!');

                return;
            }

            this.v$.formData.$reset();

            try {
                this.loading = true;

                const multipartFormData = new FormData();
                multipartFormData.append('firstName', this.formData.firstName);
                multipartFormData.append('lastName', this.formData.lastName);
                multipartFormData.append(
                    'dateOfBirth',
                    this.formData.dateOfBirth
                );
                multipartFormData.append('email', this.formData.email);
                multipartFormData.append('avatar', this.formData.avatar);

                console.log({ formData: this.formData, multipartFormData });

                await this.updateProfile(multipartFormData);

                this.$toast.success('Profile updated');
            } catch (error) {
                this.formData.password = '';

                const { response } = error;

                if (
                    response?.status === HTTP.BAD_REQUEST &&
                    response?.data?.errors
                ) {
                    this.formErrorMessage = 'Invalid credentials.';
                    this.serverErrors = response.data.errors;

                    return;
                }

                console.error(error);

                this.formErrorMessage = 'Something went wrong...';
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>
