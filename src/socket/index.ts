import { StatusCodes } from 'http-status-codes';
import { responseGenerators } from '../lib';
import { socketAuthenticateUser } from '../middleware/authetication';
import { ERROR, ITokenData } from '../common/global-constants';
import { getUserListFromRedis, insertUserListOnRedis } from '../helper/user-redis-helper';
import { subscribeChannel } from '../helper/pub-sub.helper';
let IO;
export const sendNotificationPubSub = async () => {
  try {
    const subscriber = await subscribeChannel();
    await subscriber.subscribe('new_message', async (data: any) => {
      if (data) {
        const messageData = JSON.parse(data);
        const userData = await getUserListFromRedis();
        const socketId =  userData[0].socketId;
        IO.to(socketId).emit(
          'send-message',
          responseGenerators(messageData.data, StatusCodes.OK, 'message successfully send', false),
        );
      }
    });
  } catch (error: any) {
    return null;
  }
};
export const socketConnection = async (io: any) => {
  IO = io.of('/v1/notification');
  IO.on('connection', async (socket: any) => {
    console.log('socket connect' + socket.id);
    const data = await socketAuthenticateUser(socket);

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
      socket.emit('user-joined', responseGenerators({}, StatusCodes.OK, 'user join', false));
    });
    // Listen for a custom event from the client
    socket.on('sendNotification', (data) => {
      console.log('Notification data received:', data);

      // Publish the data to Redis
      // redisPublisher.publish('notifications', JSON.stringify(data));
    });
    // redisSubscriber.subscribe('notifications', (err) => {
    //   if (err) {
    //     console.error('Error subscribing to Redis channel:', err);
    //   }
    // });
    // redisSubscriber.on('message', (channel, message) => {
    //   if (channel === 'notifications') {
    //     const notification = JSON.parse(message);
    //     console.log('New notification:', notification);

    //     // Emit the notification to all connected WebSocket clients
    //     io.emit('newNotification', notification);
    //   }
    // });
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
