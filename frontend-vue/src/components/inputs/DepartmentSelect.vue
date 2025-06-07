<template>
    <v-autocomplete
        v-model="department"
        :items="departments"
        :loading="loading"
        hide-no-data
        item-title="name"
        item-value="id"
        label="Department"
        prepend-icon="mdi-office-building"
        placeholder="Start typing to Search"
        :error-messages="errorMessages"
        return-object
        :clearable="clearable"
        @blur="$emit('blur')"
        @update:model-value="handleInput"
        @update:search="doSearch"
    />
</template>

<script>
import { mapActions } from 'pinia';

import { useDepartmentStore } from '@/stores/department';

export default {
    name: 'DepartmentSelect',

    props: {
        modelValue: {
            type: Object,
            default: null
        },

        clearable: {
            type: Boolean,
            default: false
        },

        errorMessages: {
            type: String,
            default: ''
        }
    },

    emits: ['blur', 'update:model-value'],

    data() {
        return {
            departments: [],
            department: null,
            timer: null,
            loading: false
        };
    },

    watch: {
        modelValue: {
            handler(newVal) {
                this.department = newVal;
            },
            immediate: true
        }
    },

    methods: {
        ...mapActions(useDepartmentStore, { getDepartments: 'index' }),

        handleInput(value) {
            this.$emit('update:model-value', value);
        },

        async doGetDepartments(search = '') {
            try {
                const { rows } = await this.getDepartments({
                    search,
                    perPage: 10
                });

                this.departments = rows;
            } catch (error) {
                console.error(error);

                this.$toast.error('Cannot get a list of departments!');
            }
        },

        async doSearch(search) {
            if (!search) {
                return;
            }

            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }

            this.loading = true;

            this.timer = setTimeout(async () => {
                await this.doGetDepartments(search);

                this.loading = false;
            }, 1000);
        }
    }
};
</script>
