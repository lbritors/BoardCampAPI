import Joi from "joi";


export const gamesSchema = Joi.object({
    name: Joi.string().min(3).required(),
    image: Joi.string().required(),
    stockTotal: Joi.number().positive().min(0).required(),
    pricePerDay: Joi.number().positive().required()

})