<template>
    <v-select
        v-model="role"
        :items="roleOptions"
        hide-no-data
        label="Role"
        prepend-icon="mdi-folder-lock"
        :error-messages="errorMessages"
        :clearable="clearable"
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

        clearable: {
            type: Boolean,
            default: false
        },

        allRoles: {
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
            role: null
        };
    },

    computed: {
        roleOptions() {
            if (this.allRoles) {
                return Object.values(Roles);
            }

            return [Roles.MANAGER, Roles.EMPLOYEE];
        }
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
