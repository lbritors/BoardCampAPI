import Joi from "joi";

export const rentalsSchema = Joi.object({
    customerId: Joi.integer().required(),
    gameId: Joi.integer().required(),
    daysRented: Joi.integer().required(),
});


