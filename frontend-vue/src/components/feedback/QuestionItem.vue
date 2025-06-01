<template>
    <p>
        <b>
            {{ question.title }}
        </b>
    </p>

    <v-radio-group>
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
        question: {
            type: Object,
            required: true
        }
    }
};
</script>
