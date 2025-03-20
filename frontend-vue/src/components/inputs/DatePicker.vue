<template>
    <v-date-input
        v-model="date"
        :allowed-dates="allowedDates"
        :label="label"
        :error-messages="errorMessages"
        :min="min"
        :max="max"
        @blur="$emit('blur')"
        @update:model-value="handleInput"
    />
</template>

<script>
import dayjs from 'dayjs';

export default {
    name: 'DatePicker',

    props: {
        label: {
            type: String,
            default: ''
        },

        modelValue: {
            type: String,
            default: ''
        },

        allowedDates: {
            type: Function,
            default: null
        },

        min: {
            type: String,
            default: ''
        },

        max: {
            type: String,
            default: ''
        },

        errorMessages: {
            type: String,
            default: ''
        }
    },

    emits: ['blur', 'update:model-value'],

    data() {
        return {
            date: null
        };
    },

    watch: {
        modelValue: {
            handler(newVal) {
                this.date = newVal ? new Date(newVal) : null;
            },
            immediate: true
        }
    },

    methods: {
        handleInput() {
            this.$emit(
                'update:model-value',
                dayjs(this.date).format('YYYY-MM-DD')
            );
        }
    }
};
</script>
