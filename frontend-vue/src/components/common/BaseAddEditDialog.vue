<script>
export default {
    name: 'BaseAddEditDialog',

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

    emits: ['close', 'refetch-items'],

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
            this.v$.formData[param].$touch();
        },

        close() {
            this.$emit('close');
            this.v$.formData.$reset();
            this.serverErrors = [];
            this.clearInputs();
        },

        clearInputs() {
            this.formData = { ...this.defaultForm };
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

        onSuccess() {
            this.$emit('refetch-items');

            this.close();
        }
    }
};
</script>
