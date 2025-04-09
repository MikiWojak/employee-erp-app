<template>
    <v-row>
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
                    />
                </div>

                <div class="my-4">
                    <v-btn type="submit" width="100%">
                        <span>Set password</span>
                    </v-btn>
                </div>

                <v-alert v-if="setPasswordError" type="error" class="my-4">
                    {{ setPasswordError }}
                </v-alert>
            </v-form>
        </v-col>
    </v-row>
</template>

<script>
import { mapActions } from 'pinia';
import { useVuelidate } from '@vuelidate/core';
import { StatusCodes as HTTP } from 'http-status-codes';
import { required, minLength, sameAs } from '@vuelidate/validators';

import { useAuthStore } from '@/stores/auth';
import BaseForm from '@/components/common/BaseForm';

export default {
    name: 'SetPasswordPage',

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
            setPasswordError: ''
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

    methods: {
        ...mapActions(useAuthStore, ['setPassword']),

        onBlur(param) {
            this.clearServerError(param);
            this.v$.formData[param].$touch();
            this.setPasswordError = '';
        },

        async handleSetPassword() {
            this.setPasswordError = '';
            this.serverErrors = [];

            this.v$.formData.$touch();

            if (this.v$.formData.$invalid) {
                return;
            }

            this.v$.formData.$reset();

            try {
                await this.setPassword({
                    token: this.$route.query.token,
                    ...this.formData
                });

                this.$router.push({ name: 'login' });

                this.$toast.success('Password changed successfully.');
            } catch (error) {
                const { response } = error;

                if (!response) {
                    console.error(error);

                    this.setPasswordError = 'Something went wrong...';

                    return;
                }

                if (
                    response.status === HTTP.BAD_REQUEST &&
                    response?.data?.errors
                ) {
                    this.setPasswordError = 'Recheck your form.';
                    this.serverErrors = error.response.data.errors;

                    return;
                }

                if (response.status === HTTP.FORBIDDEN) {
                    this.setPasswordError = 'Invalid token.';

                    return;
                }

                console.error(error);

                this.setPasswordError = 'Error unknown.';
            }
        }
    }
};
</script>
