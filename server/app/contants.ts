import * as dotenv from 'dotenv';

dotenv.config();

// Database infos
export const DATABASE_URL: string = process.env.DATABASE_URL as string;
export const DATABASE_NAME: string = process.env.DATABASE_NAME as string;
export const DATABASE_COLLECTION: string = process.env.DATABASE_COLLECTION as string;

// HTTP status
export const HTTP_STATUS_OK = 200;
export const HTTP_STATUS_CREATED = 201;
export const HTTP_STATUS_BAD_REQUEST = 400;
