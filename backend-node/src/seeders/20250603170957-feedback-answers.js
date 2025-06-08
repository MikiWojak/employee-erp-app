'use strict';

const dayjs = require('dayjs');
const faker = require('faker');

const di = require('../di');
const { Role } = require('../models');

const userRepository = di.get('repositories.user');
const feedbackAnswerRepository = di.get('repositories.feedbackAnswer');
const feedbackQuestionRepository = di.get('repositories.feedbackQuestion');
const feedbackTokenRepository = di.get('repositories.feedbackToken');
const generateTokenCollectionHandler = di.get(
    'services.feedbackTokensCollections.generateTokenCollection'
);

module.exports = {
    up: async () => {
        await generateTokenCollectionHandler.handle(dayjs().format());

        const [questions, users] = await Promise.all([
            feedbackQuestionRepository.findAll(),
            userRepository.findAll({
                include: [
                    {
                        association: 'role',
                        required: true,
                        where: { name: [Role.EMPLOYEE, Role.MANAGER] }
                    }
                ]
            })
        ]);

        for (const user of users) {
            const token = await feedbackTokenRepository.validate(user.id);

            if (!token) {
                continue;
            }

            for (const question of questions) {
                await feedbackAnswerRepository.create({
                    feedbackTokensCollectionId:
                        token.feedbackTokensCollectionId,
                    roleId: user.roleId,
                    departmentId: user.departmentId,
                    questionId: question.id,
                    answer: faker.random.arrayElement(question.answerOptions)
                });
            }

            await token.update({ filled: true });
        }
    },

    down: () => {}
};
