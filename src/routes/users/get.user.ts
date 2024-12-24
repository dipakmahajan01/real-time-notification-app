import { StatusCodes } from "http-status-codes";
import { createJwtToken } from "../../helper/validations/jwt.helper";
import { responseGenerators } from "../../lib";
import { Request, Response } from "express";
import { ERROR } from "../../common/global-constants";

export const createToken = (req: Request, res: Response) => {
    try {
        const jwtToken = createJwtToken({
            user_id: '1',
          } as any);
          return res.status(StatusCodes.OK).send(responseGenerators(jwtToken, StatusCodes.OK, 'create token', false));
    } catch (error) {
        return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(responseGenerators({}, StatusCodes.INTERNAL_SERVER_ERROR, ERROR.INTERNAL_SERVER_ERROR, true));
    }
    
  };