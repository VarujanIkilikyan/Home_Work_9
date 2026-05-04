import joi from 'joi';

export default {
    addOrUpdate: joi.object({
        title: joi.string().min(4).max(30).required(),
        content: joi.string().min(4).max(500).required(),

    }).length(2)
}