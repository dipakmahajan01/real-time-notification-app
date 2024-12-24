import * as dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

export function responseGenerators(
  responseData?: object,
  responseStatusCode?: number,
  responseStatusMsg?: string,
  responseErrors?: boolean,
  token?: string,
  refreshToken?: string,
) {
  const responseJson: any = {};
  responseJson.data = responseData;
  responseJson.status_code = responseStatusCode;
  responseJson.status_message = responseStatusMsg;
  // errors
  if (responseErrors === undefined) {
    responseJson.response_error = [];
  } else {
    responseJson.response_error = responseErrors;
  }
  // token
  if (token !== undefined && refreshToken !== undefined) {
    responseJson.token = token;
    responseJson.refreshToken = refreshToken;
  }
  return responseJson;
}

export function responseValidation(responseStatusCode?: number, responseStatusMsg?: string, responseErrors?: boolean) {
  const responseValidationJson: any = {};
  responseValidationJson.status_code = responseStatusCode;
  responseValidationJson.status_message = responseStatusMsg;
  // errors
  if (responseErrors === undefined) {
    responseValidationJson.response_error = [];
  } else {
    responseValidationJson.response_error = responseErrors;
  }
  return responseValidationJson;
}


export const logsErrorAndUrl = (req: { url: any }, error: any) => {
  const errorMessage = typeof error === 'object' ? error.message : error;
  const errorStack = typeof error === 'object' ? error.stack : null;
  logger.error(`${errorMessage}, time: ${new Date().toISOString()}, path: ${req.url}`, errorStack);
};

export const logsError = (error: any) => {
  const errorMessage = typeof error === 'object' ? error.message : error;
  const errorStack = typeof error === 'object' ? error.stack : null;
  logger.error(`${errorMessage}, time: ${new Date().toISOString()}`, errorStack);
};
