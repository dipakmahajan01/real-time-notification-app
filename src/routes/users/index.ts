import Router from 'express';
import { createToken } from './get.user';


const userRoutes = Router();
userRoutes.get('/create-token',createToken);

export default userRoutes;
