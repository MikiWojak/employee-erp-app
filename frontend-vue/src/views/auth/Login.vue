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
import { mapActions } from 'vuex';
// import { required, email, minLength } from 'vuelidate/lib/validators';

export default {
    name: 'Login',

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

    // validations: {
    //     formData: {
    //         email: {
    //             required,
    //             email
    //         },
    //         password: {
    //             required,
    //             minLength: minLength(8)
    //         }
    //     }
    // },

    computed: {
        emailError() {
            return this.handleError('email');
        },

        passwordError() {
            return this.handleError('password');
        }
    },

    methods: {
        ...mapActions({
            login: 'auth/login'
        }),

        onBlur(param) {
            // this.$v.formData[param].$touch();
            this.clearServerError(param);
            this.loginError = '';
        },

        handleError(param) {
            // const { formData } = this.$v;

            // if (!formData[param].$error) {
            //     return this.getServerError(param);
            // }
            //
            // if ('required' in formData[param] && !formData[param].required) {
            //     return 'This field is required.';
            // }
            //
            // if ('email' in formData[param] && !formData[param].email) {
            //     return 'Wrong email format.';
            // }
            //
            // if ('minLength' in formData[param] && !formData[param].minLength) {
            //     return `This field must have at least ${formData[param].$params.minLength.min} letters.`;
            // }

            // return 'Something is wrong there.';

            return this.getServerError(param);
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
            // this.$v.formData.$touch();

            // if (this.$v.formData.$invalid) {
            //     return;
            // }

            try {
                const { email, password } = this.formData;

                await this.login({
                    email,
                    password
                });

                this.$router.push({ name: 'dashboard' });

                // @TODO Restore notification
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
