import { StatusCodes } from 'http-status-codes';
import { responseGenerators } from '../lib';
import { socketAuthenticateUser } from '../middleware/authetication';
import { ERROR, ITokenData } from '../common/global-constants';
import { getUserListFromRedis, insertUserListOnRedis } from '../helper/user-redis-helper';
import { subscribeChannel } from '../helper/pub-sub.helper';
let IO;
let socketIds = []
export const sendNotificationPubSub = async () => {
  try {
    const subscriber = await subscribeChannel();
    await subscriber.subscribe('new_message', async (data: any) => {
      if (data) {
        const messageData = JSON.parse(data);
        const userData = await getUserListFromRedis();
        userData.forEach(element => {
          const socketId =  element.socketId;
          IO.to(socketId).emit('send-message',
            responseGenerators({id:socketId,...messageData.data}, StatusCodes.OK, 'message successfully send', false),
          );
        });
      }
    });
  } catch (error: any) {
    return null;
  }
};
export const socketConnection = async (io: any) => {
  try {                   
    IO = io.of('/v1/notification');
    IO.on('connection', async (socket: any) => {
       socketIds.push(socket.id);
      const data = await socketAuthenticateUser(socket);
      console.log('data',data)
      if (!data) {
        return socket.emit(
          'token-verified',
          responseGenerators({}, StatusCodes.UNAUTHORIZED, ERROR.TOKEN_EXPIRED_ERROR, true),
        );
      }
      socket.on('join-room', async () => {
        const tokenData = (socket.handshake.headers as any).tokenData as ITokenData;
        const { user_id: userId } = tokenData;
        await insertUserListOnRedis({
          userId,
          socketId: socket.id,
        });
        socket.join(socket.id);
        socket.emit('user-joined', responseGenerators({id:socket.id}, StatusCodes.OK, 'user join successfully', false));
      });
      // Listen for a custom event from the client
      socket.on('sendNotification', (data) => {
        console.log('Notification data received:', data);
  
      })
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  } catch (error) {
    return error 
  }
};
