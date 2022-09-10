import jwt from "jsonwebtoken";
import { accessTokenKey, refreshTokenKey } from "#config/env";

// Generate access token
const generateAccessToken = (payload) => {
	return jwt.sign(payload, accessTokenKey, {
		expiresIn: "15ms",
	});
};

// generate refresh token
const generateRefreshToken = (payload) => {
	return jwt.sign(payload, refreshTokenKey, {
		expiresIn: "1y",
	});
};

// verify refresh token
const verifyRefreshToken = (token) => {
	return jwt.verify(token, refreshTokenKey);
};

export { generateAccessToken, generateRefreshToken, verifyRefreshToken };
