import { mongooseConnection } from './database/index';
/* eslint-disable no-console */
import server from "./src/index";
import "reflect-metadata";

import { logsError } from "./src/lib/utils";
const port = process.env.PORT || 8081;
(async () => {
  try {
    if (await mongooseConnection()) {
      console.time(
        `⚡️ server started with 👍🏼 database connected http://localhost:${port} in `
      );
      server.listen(port, () => {
        console.timeEnd(
          `⚡️ server started with 👍🏼 database connected http://localhost:${port} in `
        );
      });
    }
  } catch (error) {
    logsError(error);
    console.timeEnd(
      `👎🏻 database or redis connection has some problem : ${JSON.stringify(
        error
      )}`
    );
  }
})();
