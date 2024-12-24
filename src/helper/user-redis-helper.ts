import redisService from './redis.service';

export const getUserListFromRedis = async () => {
  try {
    const usersList: any = await redisService.getByKey(`users`);
    const usersListArray = usersList || [];
    return usersListArray;
  } catch (error: any) {
    return [];
  }
};
export const insertUserListOnRedis = async (data: object) => {
  try {
    const userList: any = await getUserListFromRedis();
    userList.push(data);
    await redisService.set(`users`, userList);
  } catch (error: any) {
    return null;
  }
};
export const removeAllUserList = async () => {
  try {
    await redisService.deleteKey(`users`);
  } catch (error: any) {
    return null;
  }
};
