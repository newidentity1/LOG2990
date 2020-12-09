import * as dotenv from 'dotenv';

dotenv.config();

// Database infos
export const DATABASE_URL: string = process.env.DATABASE_URL as string;
export const DATABASE_NAME: string = process.env.DATABASE_NAME as string;
export const DATABASE_COLLECTION: string = process.env.DATABASE_COLLECTION as string;

// Email api infos
export const EMAIL_API_URL: string = process.env.EMAIL_API_URL as string;
export const EMAIL_API_KEY: string = process.env.EMAIL_API_KEY as string;

// HTTP status
export const HTTP_STATUS_OK = 200;
export const HTTP_STATUS_CREATED = 201;
export const HTTP_STATUS_ACCEPTED = 202;
export const HTTP_STATUS_NO_CONTENT = 204;
export const HTTP_STATUS_BAD_REQUEST = 400;
export const HTTP_STATUS_FORBIDDEN = 403;
export const HTTP_STATUS_NOT_FOUND = 404;
export const HTTP_STATUS_UNPROCESSABLE_ENTITY = 422;
export const HTTP_STATUS_TOO_MANY_REQUESTS = 429;
export const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;
