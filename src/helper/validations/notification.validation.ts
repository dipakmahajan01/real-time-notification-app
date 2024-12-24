
 import Joi from 'joi'
export const sendNotificationSchemaValidation = Joi.object({
    user_id: Joi.string().required(),
    event_type: Joi.string().required(),
    data : Joi.object({
        message:Joi.string().required(),
        timestamp:Joi.string().required(),
    })


})