<template>
    <div v-if="isTokenInvalid" class="d-flex flex-column align-center">
        <h1 class="text-red">Invalid token!</h1>

        <back-home-button />
    </div>

    <div v-else-if="isPasswordChanged" class="d-flex flex-column align-center">
        <h1>Password has been changed</h1>

        <back-home-button />
    </div>

    <v-row v-else>
        <v-col md="8" lg="6" class="mx-auto">
            <h1>Set password</h1>

            <v-form @submit.prevent="handleSetPassword">
                <div class="my-4">
                    <v-text-field
                        v-model="formData.password"
                        type="password"
                        label="Password"
                        outlined
                        :error-messages="handleError('password')"
                        @blur="onBlur('password')"
                        @input="clearServerError('password')"
                    />
                </div>

                <div class="my-4">
                    <v-text-field
                        v-model="formData.passwordConfirmation"
                        type="password"
                        label="Password confirmation"
                        outlined
                        :error-messages="handleError('passwordConfirmation')"
                        @blur="onBlur('passwordConfirmation')"
                        @input="clearServerError('passwordConfirmation')"
                    />
                </div>

                <div class="my-4">
                    <v-btn type="submit" width="100%" :disabled="loading">
                        <span>Set password</span>
                    </v-btn>
                </div>

                <v-alert v-if="formErrorMessage" type="error" class="my-4">
                    {{ formErrorMessage }}
                </v-alert>
            </v-form>
        </v-col>
    </v-row>
</template>

<script>
import { mapActions } from 'pinia';
import { defineAsyncComponent } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { StatusCodes as HTTP } from 'http-status-codes';
import { required, minLength, sameAs } from '@vuelidate/validators';

import { useAuthStore } from '@/stores/auth';
import BaseForm from '@/components/common/BaseForm';

export default {
    name: 'SetPasswordPage',

    components: {
        BackHomeButton: defineAsyncComponent(
            () => import('@/components/common/BackHomeButton')
        )
    },

    extends: BaseForm,

    setup() {
        return { v$: useVuelidate() };
    },

    data() {
        return {
            formData: {
                password: '',
                passwordConfirmation: ''
            },
            formErrorMessage: '',
            loading: false,
            formStatus: null
        };
    },

    validations() {
        return {
            formData: {
                password: {
                    required,
                    minLength: minLength(8)
                },
                passwordConfirmation: {
                    required,
                    sameAs: sameAs(this.formData.password)
                }
            }
        };
    },

    computed: {
        isTokenInvalid() {
            return this.formStatus === 'invalid';
        },

        isPasswordChanged() {
            return this.formStatus === 'success';
        }
    },

    async created() {
        try {
            await this.checkSetPasswordToken({
                token: this.$route.query.token
            });
        } catch (error) {
            console.error(error);

            if (error?.response?.status === HTTP.FORBIDDEN) {
                this.formStatus = 'invalid';
            }
        }
    },

    methods: {
        ...mapActions(useAuthStore, ['setPassword', 'checkSetPasswordToken']),

        onBlur(param) {
            this.clearServerError(param);
            this.v$.formData[param].$touch();
            this.formErrorMessage = '';
        },

        async handleSetPassword() {
            this.formErrorMessage = '';
            this.serverErrors = [];

            this.v$.formData.$touch();

            if (this.v$.formData.$invalid) {
                return;
            }

            this.v$.formData.$reset();

            try {
                this.loading = true;

                await this.setPassword({
                    token: this.$route.query.token,
                    ...this.formData
                });

                this.formStatus = 'success';
            } catch (error) {
                const { response } = error;

                if (
                    response?.status === HTTP.BAD_REQUEST &&
                    response?.data?.errors
                ) {
                    this.formErrorMessage = 'Recheck your form.';
                    this.serverErrors = response.data.errors;

                    return;
                }

                if (response?.status === HTTP.FORBIDDEN) {
                    this.formStatus = 'invalid';

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
