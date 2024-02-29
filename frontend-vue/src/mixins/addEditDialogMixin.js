export default {
    props: {
        isOpened: {
            type: Boolean,
            default: false
        },
        editedItem: {
            type: Object,
            default: null
        }
    },

    data() {
        const defaultForm = {};

        return {
            defaultForm,
            formData: { ...defaultForm },
            isDialogOpened: false,
            serverErrors: []
        };
    },

    watch: {
        isOpened() {
            this.isDialogOpened = this.isOpened;
        },

        editedItem: {
            handler(val) {
                this.formData = val ? { ...val } : { ...this.defaultForm };
            },
            immediate: true
        }
    },

    methods: {
        onBlur(param) {
            this.clearServerError(param);
            this.$v.formData[param].$touch();
        },

        close() {
            this.$emit('close');
            this.$v.formData.$reset();
            this.serverErrors = [];
            this.clearInputs();
        },

        clearInputs() {
            this.formData = { ...this.defaultForm };
        },

        handleError(param) {
            const { formData } = this.$v;

            if (!formData[param].$error) {
                return this.getServerError(param);
            }

            if ('required' in formData[param] && !formData[param].required) {
                return 'This field is required.';
            }

            if ('email' in formData[param] && !formData[param].email) {
                return 'Wrong email format.';
            }

            if ('integer' in formData[param] && !formData[param].integer) {
                return 'This field must be an integer.';
            }

            if ('minLength' in formData[param] && !formData[param].minLength) {
                return `This field must have at least ${formData[param].$params.minLength.min} letters.`;
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
