<template>
    <v-row>
        <v-col md="8" lg="6" class="mx-auto">
            <h1>Login</h1>

            <v-form @submit.prevent="handleLogin">
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
                    <v-text-field
                        v-model="formData.password"
                        type="password"
                        label="Password"
                        outlined
                        :error-messages="handleError('password')"
                        @blur="onBlur('password')"
                    />
                </div>

                <div class="my-4">
                    <v-btn type="submit" width="100%">
                        <span>Login</span>
                    </v-btn>
                </div>

                <v-alert v-if="formErrorMessage" type="error" class="my-4">
                    {{ formErrorMessage }}
                </v-alert>

                <div class="d-flex justify-center my-4">
                    <v-btn
                        :to="{ name: 'forgot-password' }"
                        text="Forgot your password?"
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
import { required, email, minLength } from '@vuelidate/validators';

import { useAuthStore } from '@/stores/auth';
import BaseForm from '@/components/common/BaseForm';

export default {
    name: 'LoginPage',

    extends: BaseForm,

    setup() {
        return { v$: useVuelidate() };
    },

    data() {
        return {
            formData: {
                email: '',
                password: ''
            },
            formErrorMessage: ''
        };
    },

    validations() {
        return {
            formData: {
                email: {
                    required,
                    email
                },
                password: {
                    required,
                    minLength: minLength(8)
                }
            }
        };
    },

    methods: {
        ...mapActions(useAuthStore, ['login']),

        onBlur(param) {
            this.clearServerError(param);
            this.v$.formData[param].$touch();
            this.formErrorMessage = '';
        },

        async handleLogin() {
            this.formErrorMessage = '';
            this.serverErrors = [];

            this.v$.formData.$touch();

            if (this.v$.formData.$invalid) {
                return;
            }

            this.v$.formData.$reset();

            try {
                const { email, password } = this.formData;

                await this.login({
                    email,
                    password
                });

                this.$router.push({ name: 'dashboard' });

                this.$toast.success('Logged in successfully');
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

                if (response?.status === HTTP.UNAUTHORIZED) {
                    this.formErrorMessage = 'Mismatching credentials.';

                    return;
                }

                console.error(error);

                this.formErrorMessage = 'Something went wrong...';
            }
        }
    }
};
</script>
