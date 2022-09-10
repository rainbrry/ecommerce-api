import { config } from "dotenv";

config();

const port = process.env.PORT || 5000;
const dbUri = process.env.DB_URI || "mongodb://localhost:27017/ecommerce";
const dbName = process.env.DB_NAME;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const accessTokenKey = process.env.ACCESS_TOKEN_KEY;
const refreshTokenKey = process.env.REFRESH_TOKEN_KEY;
const passwordKey = process.env.PASSWORD_KEY;

export {
	port,
	dbUri,
	dbName,
	dbUsername,
	dbPassword,
	dbHost,
	accessTokenKey,
	refreshTokenKey,
	passwordKey,
};
