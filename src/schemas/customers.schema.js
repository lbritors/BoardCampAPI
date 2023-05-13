import joi from "joi";


export const customersSchema = joi.object({
    name: joi.string().min(3).required(),
    phone: joi.string().min(10).max(11).required(),
    cpf: joi.string().length(11).required(),
    birthday: joi.date().required()


});

export const customersSchemaUpdate = joi.object({
    name: joi.string().min(3).allow(),
    phone: joi.string().min(10).max(11).allow(),
    cpf: joi.string().length(11).allow(),
    birthday: joi.date().allow()
});