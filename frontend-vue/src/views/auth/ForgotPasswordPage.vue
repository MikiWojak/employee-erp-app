<template>
    <div v-if="formSent" class="d-flex flex-column align-center">
        <h1>Reset password link sent!</h1>

        <p>
            If your account exists in the system you will get an email with the
            reset password link.
        </p>

        <back-home-button class="my-4" />
    </div>

    <v-row v-else>
        <v-col md="8" lg="6" class="mx-auto">
            <h1>Forgot password?</h1>

            <v-form @submit.prevent="handleSendResetPasswordLink">
                <div class="my-4">
                    <v-text-field
                        v-model="formData.email"
                        label="Email"
                        outlined
                        :error-messages="handleError('email')"
                        @blur="onBlur('email')"
                    />
                </div>

                <div class="my-4">
                    <v-btn type="submit" width="100%">
                        <span>Send reset password link</span>
                    </v-btn>
                </div>

                <v-alert v-if="formErrorMessage" type="error" class="my-4">
                    {{ formErrorMessage }}
                </v-alert>

                <div class="d-flex justify-center my-4">
                    <v-btn
                        :to="{ name: 'login' }"
                        text="Login page"
                        variant="plain"
                    />
                </div>
            </v-form>
        </v-col>
    </v-row>
</template>

<script>
import { mapActions } from 'pinia';
import { useVuelidate } from '@vuelidate/core';
import { StatusCodes as HTTP } from 'http-status-codes';
import { required, email } from '@vuelidate/validators';

import { useAuthStore } from '@/stores/auth';
import BaseForm from '@/components/common/BaseForm';
import BackHomeButton from '@/components/common/BackHomeButton.vue';

export default {
    name: 'ForgotPasswordPage',
    components: { BackHomeButton },

    extends: BaseForm,

    setup() {
        return { v$: useVuelidate() };
    },

    data() {
        return {
            formData: {
                email: ''
            },
            formSent: false,
            formErrorMessage: ''
        };
    },

    validations() {
        return {
            formData: {
                email: {
                    required,
                    email
                }
            }
        };
    },

    methods: {
        ...mapActions(useAuthStore, ['sendResetPasswordLink']),

        onBlur(param) {
            this.clearServerError(param);
            this.v$.formData[param].$touch();
            this.formErrorMessage = '';
        },

        async handleSendResetPasswordLink() {
            this.formErrorMessage = '';
            this.serverErrors = [];

            this.v$.formData.$touch();

            if (this.v$.formData.$invalid) {
                return;
            }

            this.v$.formData.$reset();

            try {
                const { email } = this.formData;

                await this.sendResetPasswordLink({ email });

                this.formSent = true;
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
            }
        }
    }
};
</script>
