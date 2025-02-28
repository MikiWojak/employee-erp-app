<script>
import { useVuelidate } from '@vuelidate/core';

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

    emits: ['close', 'success'],

    setup() {
        return { v$: useVuelidate() };
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

    validations() {
        return {};
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
            this.$emit('success');

            this.close();
        },

        // @TODO Remove after adjustments in API
        prepareFormDataAfterValidation() {},

        async updateItem() {
            return Promise.resolve();
        },

        async createItem() {
            return Promise.resolve();
        },

        async save() {
            this.serverErrors = [];

            this.v$.formData.$touch();

            if (this.v$.formData.$invalid) {
                return;
            }

            this.prepareFormDataAfterValidation();

            try {
                if (this.editedItem) {
                    await this.updateItem(this.formData);
                } else {
                    await this.createItem(this.formData);
                }

                const successMessage = this.editedItem
                    ? 'Item has been modified'
                    : 'Item has been added';

                this.$toast.success(successMessage);

                this.onSuccess();
            } catch (error) {
                console.error(error);

                if (error?.response?.data?.errors) {
                    this.serverErrors = error.response.data.errors;
                }

                const errorMessage = this.editedItem
                    ? 'Error while modifying the contract!'
                    : 'Error while adding the contract!';

                this.$toast.error(errorMessage);
            }
        }
    }
};
</script>
