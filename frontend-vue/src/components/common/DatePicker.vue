<template>
    <div>
        <v-menu
            v-model="isPickerOpened"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
        >
            <template #activator="{ on }">
                <v-text-field
                    v-model="date"
                    :label="label"
                    prepend-icon="mdi-calendar"
                    readonly
                    :error-messages="errorMessages"
                    v-on="on"
                    @blur="$emit('blur')"
                />
            </template>

            <v-date-picker
                v-model="date"
                :allowed-dates="allowedDates"
                :min="min"
                :max="max"
                @input="handleInput"
            />
        </v-menu>
    </div>
</template>
<script>
export default {
    name: 'DatePicker',

    props: {
        label: {
            type: String,
            default: ''
        },

        value: {
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

    data() {
        return {
            isPickerOpened: false,
            date: this.value
        };
    },

    watch: {
        value() {
            this.date = this.value;
        }
    },

    methods: {
        handleInput() {
            this.$emit('input', this.date);
            this.isPickerOpened = false;
        }
    }
};
</script>
