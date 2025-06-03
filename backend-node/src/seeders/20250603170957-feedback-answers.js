'use strict';

const faker = require('faker');

const { Role } = require('../models');
const di = require('../di');

const userRepository = di.get('repositories.user');
const feedbackAnswerRepository = di.get('repositories.feedbackAnswer');
const feedbackQuestionRepository = di.get('repositories.feedbackQuestion');

module.exports = {
    up: async () => {
        const [questions, users] = await Promise.all([
            feedbackQuestionRepository.findAll(),
            userRepository.findAll({
                include: [
                    {
                        association: 'role',
                        required: true,
                        where: { name: Role.EMPLOYEE }
                    }
                ]
            })
        ]);

        for (const user of users) {
            for (const question of questions) {
                await feedbackAnswerRepository.create({
                    roleId: user.roleId,
                    departmentId: user.departmentId,
                    questionId: question.id,
                    answer: faker.random.arrayElement(question.answerOptions)
                });
            }
        }
    },

    down: () => {}
};
