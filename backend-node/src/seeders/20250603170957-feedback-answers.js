'use strict';

const dayjs = require('dayjs');
const faker = require('faker');

const di = require('../di');
const { Role } = require('../models');

const userRepository = di.get('repositories.user');
const feedbackQuestionRepository = di.get('repositories.feedbackQuestion');
const feedbackTokenRepository = di.get('repositories.feedbackToken');
const answerHandler = di.get('services.feedback.answer');
const generateTokenCollectionHandler = di.get(
    'services.feedback.generateTokenCollection'
);

module.exports = {
    up: async () => {
        const transaction = await feedbackTokenRepository.getDbTransaction();

        try {
            await generateTokenCollectionHandler.handle(dayjs().format(), {
                transaction
            });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();

            console.error(error);
        }

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

            const answers = {};

            for (const question of questions) {
                answers[question.id] = faker.random.arrayElement(
                    question.answerOptions
                );
            }

            const transaction =
                await feedbackTokenRepository.getDbTransaction();

            try {
                await answerHandler.handle(
                    { token, user, answers },
                    { transaction }
                );

                await transaction.commit();
            } catch (error) {
                await transaction.rollback();

                console.error(error);
            }
        }
    },

    down: () => {}
};
