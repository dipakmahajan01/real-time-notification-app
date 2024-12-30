// eslint-disable no-console
import bodyParser from 'body-parser';
import cors from 'cors';
import { StatusCodes } from 'http-status-codes';
import { responseValidation } from './lib';
import express, { Request, Response } from 'express'; // NextFunction,
import { createServer } from 'http';
import helmet from 'helmet';
import logger from './lib/logger';
import dotenv from 'dotenv';
import { sendNotificationPubSub, socketConnection } from './socket';
import { Server } from 'socket.io';
import notificationRoutes from './routes/notification';
import userRoutes from './routes/users';
dotenv.config();
const app = express();
const server: any = createServer(app);
const io = new Server(server, {
  cookie: true,
  cors: {
    origin: ['http://127.0.0.1:5501'],
    allowedHeaders: ['Authorization'],
    credentials: true,
  },
});
// add database connection

app.set('io', io);
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  try {
    // set header for swagger.
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self';",
    );
    // end
    const xForwardedFor = ((req.headers['x-forwarded-for'] || '') as string).replace(/:\d+$/, '');
    const ip = xForwardedFor || req.connection.remoteAddress?.split(':').pop();
    logger.info(
      `------------ API Info ------------
      IMP - API called path: ${req.path},
      method: ${req.method},
      query: ${JSON.stringify(req.query)}, 
      remote address (main/proxy ip):${ip},
      reference: ${req.headers.referer} , 
      user-agent: ${req.headers['user-agent']}
      ------------ End ------------  `,
    );
  } catch (error) {
    logger.error(`error while printing caller info path: ${req.path}`);
  }
  next();
});
sendNotificationPubSub()
const health = (req: Request, res: Response) => {
  res.json({
    message: 'real time notification application server is working',
    env: process.env.NODE_ENV,
    headers: req.headers,
  });
};

app.get('/', health);
// Swagger for health API
/**
 * @swagger
 * definitions:
 *   health:
 *     example:
 *       data:
 *         message: string
 *         env: string
 *         headers: object
 */

/**
 * @swagger
 *  tags:
 *    name: Default
 *    description: Health Document
 */

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health
 *     tags: [Default]
 *     security: {}
 *     responses:
 *       200:
 *         description: Health.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/health'
 *       500:
 *         description: Something went wrong, please try again later.
 */
app.use('/api/notification', notificationRoutes);
app.use('/api/user', userRoutes);
app.get('/api/health', health);
app.use((req: Request, res: Response) => {
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send(responseValidation(StatusCodes.INTERNAL_SERVER_ERROR, 'No route found'));
});

  socketConnection(io);

process.on('unhandledRejection', function (reason, promise) {
  logger.error('Unhandled rejection', { reason, promise });
});

export default server;
