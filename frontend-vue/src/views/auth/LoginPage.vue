<template>
    <v-container>
        <v-row>
            <v-col md="8" lg="6" class="mx-auto">
                <h1>Login</h1>

                <v-form @submit.prevent="handleLogin">
                    <div class="my-4">
                        <v-text-field
                            v-model="formData.email"
                            label="Email"
                            outlined
                            :error-messages="emailError"
                            @blur="onBlur('email')"
                        />
                    </div>

                    <div class="my-4">
                        <v-text-field
                            v-model="formData.password"
                            type="password"
                            label="Password"
                            outlined
                            :error-messages="passwordError"
                            @blur="onBlur('password')"
                        />
                    </div>

                    <div class="my-4">
                        <v-btn type="submit" width="100%">
                            <span>Login</span>
                        </v-btn>
                    </div>

                    <v-alert v-if="loginError" type="error" class="my-4">
                        {{ loginError }}
                    </v-alert>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapActions } from 'pinia';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength } from '@vuelidate/validators';

import { useAuthStore } from '@/stores/auth';

export default {
    name: 'LoginPage',

    setup() {
        return { v$: useVuelidate() };
    },

    data() {
        return {
            formData: {
                email: '',
                password: ''
            },
            loginError: '',
            serverErrors: []
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

    computed: {
        emailError() {
            return this.handleError('email');
        },

        passwordError() {
            return this.handleError('password');
        }
    },

    methods: {
        ...mapActions(useAuthStore, ['login']),

        onBlur(param) {
            this.v$.formData[param].$touch();
            this.clearServerError(param);
            this.loginError = '';
        },

        handleError(param) {
            const { formData } = this.v$;

            if (!formData[param].$error) {
                return this.getServerError(param);
            }

            const vError = formData.$errors.find(
                error => error.$property === param
            );

            if (vError) {
                return vError.$message;
            }

            return 'Something is wrong there.';
        },

        getServerError(param) {
            if (this.serverErrors.length) {
                const serverError = this.serverErrors.find(
                    error => error.param === param
                );

                if (serverError) {
                    return serverError.message;
                }
            }

            return '';
        },

        clearServerError(param) {
            this.serverErrors = this.serverErrors.filter(
                error => error.param !== param
            );
        },

        async handleLogin() {
            this.loginError = '';
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

                if (!response) {
                    console.error(error);
                    this.loginError = 'Something went wrong...';

                    return;
                }

                if (response.status === 400 && response?.data?.errors) {
                    this.loginError = 'Invalid credentials.';
                    this.serverErrors = error.response.data.errors;

                    return;
                }

                if (response.status === 401) {
                    this.loginError = 'Mismatching credentials.';

                    return;
                }

                console.error(error);

                this.loginError = 'Error unknown.';
            }
        }
    }
};
</script>
