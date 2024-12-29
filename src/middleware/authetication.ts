import { StatusCodes } from 'http-status-codes';
import { verifyJwt } from '../helper/validations/jwt.helper';
import { Response } from 'express';
import { responseGenerators } from '../lib';
import { ERROR } from '../common/global-constants';

export const socketAuthenticateUser = async (socket, res?: Response) => {
  try {
    const { authorization } = socket.handshake.headers;
    if (!authorization) {
      return false;
    }
    const tokenData = await verifyJwt(authorization);
    if (!tokenData) {
      return false;
    }
    socket.handshake.headers.tokenData = tokenData as any;
    return true;
  } catch (error: any) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send(responseGenerators({}, StatusCodes.UNAUTHORIZED, 'unauthorized', true));
  }
};
