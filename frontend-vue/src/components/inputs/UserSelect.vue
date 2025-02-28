<template>
    <v-autocomplete
        v-model="userId"
        :items="users"
        :item-title="getFullNameTitle"
        item-value="id"
        label="User"
        :error-messages="errorMessage"
        @blur="$emit('blur')"
        @update:model-value="handleInput"
    />
</template>

<script>
import { mapActions } from 'pinia';

import { useUserStore } from '@/stores/user';

export default {
    name: 'UserSelect',

    props: {
        modelValue: {
            type: String,
            default: ''
        },

        errorMessage: {
            type: String,
            default: ''
        }
    },

    emits: ['blur', 'update:model-value'],

    data() {
        return {
            users: [],
            userId: null
        };
    },

    watch: {
        modelValue: {
            handler(newVal) {
                this.userId = newVal;
            },
            immediate: true
        }
    },

    async created() {
        await this.doGetUsers();
    },

    methods: {
        ...mapActions(useUserStore, { getUsers: 'index' }),

        getFullNameTitle(user) {
            return user ? `${user.firstName} ${user.lastName}` : '';
        },

        handleInput(value) {
            this.$emit('update:model-value', value);
        },

        async doGetUsers() {
            try {
                const { rows } = await this.getUsers();

                this.users = rows;
            } catch (error) {
                console.error(error);

                this.$toast.error('Cannot get a list of users!');
            }
        }
    }
};
</script>
