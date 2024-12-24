export const ERROR = {
  INTERNAL_SERVER_ERROR: 'something went wrong',
  TOKEN_EXPIRED_ERROR:"Unauthorized access. token expired."
};

export const NOTIFICATION = {
  CREATED: 'Notification created successfully',
};

export const redisKeys = { connectionKeyPrefix: 'user_connection:' };
export interface ITokenData {
  user_id: string;
}
