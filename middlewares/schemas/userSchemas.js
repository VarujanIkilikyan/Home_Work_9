import joi from 'joi';

export default {
    login: joi.object({
        email: joi.string().required(),
        password: joi.string().min(4).max(32).required(),

    }),
    registration: joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        age: joi.number().required(),
    })
}