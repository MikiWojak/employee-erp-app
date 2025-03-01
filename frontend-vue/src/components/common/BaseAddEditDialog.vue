<template>
    <div></div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';

import BaseForm from '@/components/common/BaseForm';

export default {
    name: 'BaseAddEditDialog',

    extends: BaseForm,

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
            isDialogOpened: false
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
        close() {
            this.$emit('close');
            this.v$.formData.$reset();
            this.serverErrors = [];
            this.clearInputs();
        },

        clearInputs() {
            this.formData = { ...this.defaultForm };
        },

        onSuccess() {
            this.$emit('success');

            this.close();
        },

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
