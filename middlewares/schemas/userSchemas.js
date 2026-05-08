import joi from 'joi';

export default {
    login: joi.object({
        email: joi.string().required().messages({
            'string.empty': 'Email обязателен',
            'string.email': 'Email должен быть корректным',
        }),
        password: joi.string().min(4).max(32).required().messages({
            'string.empty': 'Пароль обязателен',
        }),

    }),
    registration: joi.object({
        name: joi.string().required().messages({
            'string.empty': 'Имя обязательно'
        }),
        email: joi.string().email().required().messages({
            'string.empty': 'Email обязателен',
            'string.email': 'Email должен быть корректным',
        }),
        password: joi.string().required().messages({
            'string.empty': 'Пароль обязателен',
        }),
        age: joi.number().required().messages({
            'number.base': 'Возраст обязателен',
        }),
    })
}