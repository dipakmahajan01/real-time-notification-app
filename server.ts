/* eslint-disable no-console */
import server from './src/index';
import 'reflect-metadata';
import { logsError } from './src/lib/utils';
import { redisInstance } from './src/lib/redis';
import { removeAllUserList } from './src/helper/user-redis-helper';
const port = process.env.PORT || 8081;
(async () => {
  try {
    if ((await redisInstance.connect())) {
      removeAllUserList()
      console.time(`⚡️ server started with 👍🏼 redis connected http://localhost:${port} in `);
      server.listen(port, () => {
        console.timeEnd(`⚡️ server started with 👍🏼 redis connected http://localhost:${port} in `);
      });
    }
  } catch (error) {
    logsError(error);
    console.timeEnd(`👎🏻 database or redis connection has some problem : ${JSON.stringify(error)}`);
  }
})();
