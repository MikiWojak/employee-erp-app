<template>
    <v-select
        v-model="role"
        :items="roleOptions"
        hide-no-data
        label="Role"
        prepend-icon="mdi-folder-lock"
        :error-messages="errorMessages"
        @blur="$emit('blur')"
        @update:model-value="handleInput"
    />
</template>

<script>
import { Roles } from '@/enums/Roles';

export default {
    name: 'RoleSelect',

    props: {
        modelValue: {
            type: String,
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
            roleOptions: Object.values(Roles),
            role: null
        };
    },

    watch: {
        modelValue: {
            handler(newVal) {
                this.role = newVal;
            },
            immediate: true
        }
    },

    methods: {
        handleInput(value) {
            this.$emit('update:model-value', value);
        }
    }
};
</script>
