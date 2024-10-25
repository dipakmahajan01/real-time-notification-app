// eslint-disable no-console 
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerJsDoc from 'swagger-jsdoc';
import { StatusCodes } from 'http-status-codes';
import { responseValidation } from './lib';
import express, { Request, Response } from 'express'; // NextFunction,
import http from "http";
import helmet from 'helmet';
import logger from './lib/logger';
import swaggerUi from 'swagger-ui-express'
import basicAuth from 'express-basic-auth';
import dotenv from 'dotenv';
import userRouter from './routes/user';
import axios from 'axios'
dotenv.config()
const app = express();

const server = new http.Server(app);

// add database connection 

app.use(cors());
// const io = new Server(server,{cors: {origin: "*"}});
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
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'letsGetLunch API',
      version: '1.0.0',
      description: 'A simple Express Library API',
      termsOfService: 'http://example.com/terms/',
      contact: {
        name: 'API Support',
        url: 'http://www.exmaple.com/support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'letsGetLunch Documentation',
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
        },
      },
    },
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
  },
  // apis: ["**/*.ts"],
  apis: ['./src/**/*.ts'],
};
const specs = swaggerJsDoc(options);
app.use(
  '/api-docs',
  basicAuth({ users: { LGL: 'Lgl@123' }, challenge: true }),
  swaggerUi.serve,
  swaggerUi.setup(specs),
);


const health = (req: Request, res: Response) => {
 const users =  [
  {
    name:"dipak",
    age:36
  },
  {
    name:"dipak",
    age:18
  }
 ]
 const a = users.filter(user=> user.age > 18)
 console.log("a:=================",a)
  res.json({
    message: 'lets-get-lunch server is working',
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
app.use('/api/user',userRouter)
app.get('/api/health', health);

app.use((req: Request, res: Response) => {
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send(responseValidation(StatusCodes.INTERNAL_SERVER_ERROR, 'No route found'));
});

app.use((error: any, req: Request, res: Response) => {
  // , next: NextFunction
  console.log('app error----------------->', error.message);
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
    responseValidation(
      StatusCodes.INTERNAL_SERVER_ERROR,
      /* If the environment is development, then return the error message, otherwise return an empty
        object. */
      process.env.NODE_ENV === 'development' ? error.message : {},
    ),
  );
});

const apiEndpoint = 'https://seller.flipkart.com/napi/rate-card/fetchRateCardFees';
const queryParams = {
  service_profile: 'FBF',
  date: '2024-02-23',
  fsn: 'KLCGFZYACAN8JCHK',
  partner_context: 'shopsy',
  is_seller_dashboard: true,
  darwin_tier: 'bronze',
  shipping: false,
  sellerId: '3f17602e0bef4b64',
};

axios.get(apiEndpoint, { params: queryParams })
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Server responded with status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received. Check the network and API availability.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up the request:', error.message);
    }
  });

process.on('unhandledRejection', function (reason, promise) {
  logger.error('Unhandled rejection', { reason, promise });
});

export default server;

