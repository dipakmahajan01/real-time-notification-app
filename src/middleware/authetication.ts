import { verifyJwt } from "../helper/validations/jwt.helper";

export const socketAuthenticateUser = async (socket) => {
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
      console.log("error",error)
      return false
    }
  };
  