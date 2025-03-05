<template>
    <v-autocomplete
        v-model="user"
        :items="users"
        :loading="loading"
        hide-no-data
        item-title="fullName"
        item-value="id"
        label="User"
        prepend-icon="mdi-account"
        placeholder="Start typing to Search"
        :error-messages="errorMessages"
        return-object
        @blur="$emit('blur')"
        @update:model-value="handleInput"
        @update:search="doSearch"
    />
</template>

<script>
import { mapActions } from 'pinia';

import { useUserStore } from '@/stores/user';

export default {
    name: 'UserSelect',

    props: {
        modelValue: {
            type: Object,
            default: null
        },

        errorMessages: {
            type: String,
            default: ''
        }
    },

    emits: ['blur', 'update:model-value'],

    data() {
        return {
            users: [],
            user: null,
            timer: null,
            loading: false
        };
    },

    watch: {
        modelValue: {
            handler(newVal) {
                this.user = newVal;
            },
            immediate: true
        }
    },

    methods: {
        ...mapActions(useUserStore, { getUsers: 'index' }),

        handleInput(value) {
            this.$emit('update:model-value', value);
        },

        async doGetUsers(search = '') {
            try {
                const { rows } = await this.getUsers({ search, perPage: 10 });

                this.users = rows;
            } catch (error) {
                console.error(error);

                this.$toast.error('Cannot get a list of users!');
            }
        },

        async doSearch(search) {
            console.log(search, this.timer);

            if (!search) {
                return;
            }

            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }

            this.loading = true;

            this.timer = setTimeout(async () => {
                await this.doGetUsers(search);

                this.loading = false;
            }, 1000);
        }
    }
};
</script>
