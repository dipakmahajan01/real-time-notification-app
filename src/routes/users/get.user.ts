import { StatusCodes } from "http-status-codes";
import { createJwtToken } from "../../helper/validations/jwt.helper";
import { responseGenerators } from "../../lib";
import { Request, Response } from "express";

const createToken = (req: Request, res: Response) => {
    const jwtToken = createJwtToken({
      user_id: '1',
    } as any);
    return res.status(StatusCodes.OK).send(responseGenerators(jwtToken, StatusCodes.OK, 'create token', false));
  });