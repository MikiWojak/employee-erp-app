'use strict';

const di = require('../di');

const feedbackQuestionRepository = di.get('repositories.feedbackQuestion');

module.exports = {
    up: async () => {
        await feedbackQuestionRepository.bulkCreate([
            {
                title: 'How are you feeling?',
                answerOptions: [
                    'excited',
                    'content',
                    'confident',
                    'thankful',
                    'amused',
                    'overwhelmed',
                    'stressed',
                    'tired',
                    'sad',
                    'angry'
                ]
            },
            {
                title: 'Are you feeling appreciated?',
                answerOptions: [
                    'yes',
                    'rather yes',
                    'maybe',
                    'not really',
                    'no'
                ]
            },
            {
                title: 'What is your motivation to work?',
                answerOptions: [
                    'very high',
                    'high',
                    'moderate',
                    'low',
                    'very low'
                ]
            }
        ]);
    },

    down: () => {}
};
