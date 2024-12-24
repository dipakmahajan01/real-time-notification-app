/* eslint-disable no-console */
import * as redis from 'redis';

export const subscribeChannel = async () => {
  const redisUrl = `redis://${process.env.REDIS_URL}:${process.env.REDIS_PORT}`;
  const client = redis.createClient({ url: redisUrl });
  const subscriber = client.duplicate();
  await subscriber.connect();
  return subscriber;
};


// export const refreshMatchListPubSub = async () => {
//   try {
//     const subscriber = await subscribeChannel();
//     await subscriber.subscribe(USER_PUB_SUB_CHANNEL.REFRESH_UNMATCHED_LIST, async (data: any) => {
//       // console.log('refreshMatchListPubSub', data);
//       if (data) {
//         const MatchData = JSON.parse(data);
//         if (MatchData && MatchData.userId) {
//           refreshMatchList({ userId: MatchData.userId });
//         }
//       }
//     });
//   } catch (error: any) {
//     addCronLogs({
//       name: 'refreshMatchListPubSub has an error.',
//       detail: error,
//     });
//   }
// };
