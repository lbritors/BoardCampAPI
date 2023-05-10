import joi, { string } from "joi";


export const gamesSchema = joi.object({
    name: joi.string().min(3).required(),
    image: joi.string().dataUri().required()
})