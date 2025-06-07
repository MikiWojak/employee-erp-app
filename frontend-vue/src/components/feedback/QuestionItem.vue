<template>
    <p>
        <b> {{ question.title }} </b>
    </p>

    <v-radio-group v-model="selectedValue" @update:model-value="onSelect">
        <v-radio
            v-for="(option, index) in question.answerOptions"
            :key="`question-${question.id}-${index}`"
            :label="option"
            :value="option"
        />
    </v-radio-group>
</template>

<script>
export default {
    name: 'QuestionItem',

    props: {
        modelValue: {
            type: String,
            default: null
        },

        question: {
            type: Object,
            required: true
        }
    },

    emits: ['update:model-value'],

    data() {
        return {
            selectedValue: null
        };
    },

    watch: {
        modelValue: {
            handler(newVal) {
                this.selectedValue = newVal;
            },
            immediate: true
        }
    },

    methods: {
        onSelect() {
            this.$emit('update:model-value', this.selectedValue);
        }
    }
};
</script>
