import { Request, Response } from 'express';
import { responseGenerators } from '../../lib';
import { StatusCodes } from 'http-status-codes';
import { ERROR, NOTIFICATION } from '../../common/global-constants';
import { sendNotificationSchemaValidation } from '../../helper/validations/notification.validation';
import { redisInstance } from '../../lib/redis';

export const sendNotification = async (req: Request, res: Response) => {
  try {
    await sendNotificationSchemaValidation.validateAsync(req.body);
    const { user_id: userId, event_type: eventType, data } = req.body;

    await redisInstance.client.publish(eventType, JSON.stringify({user_id: userId, event_type: eventType, data }));
    return res.status(StatusCodes.OK).send(responseGenerators({}, StatusCodes.OK, NOTIFICATION.CREATED, false));
  } catch (error) {
    console.log("error",error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(responseGenerators({}, StatusCodes.INTERNAL_SERVER_ERROR, ERROR.INTERNAL_SERVER_ERROR, true));
  }
};
