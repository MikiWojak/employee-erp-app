<script>
import { useVuelidate } from '@vuelidate/core';

export default {
    name: 'BaseForm',

    setup() {
        return { v$: useVuelidate() };
    },

    data() {
        return {
            formData: {},
            serverErrors: []
        };
    },

    validations() {
        return {};
    },

    methods: {
        onBlur(param) {
            this.clearServerError(param);
            this.v$.formData[param].$touch();
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
        }
    }
};
</script>
