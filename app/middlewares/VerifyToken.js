import jwt from "jsonwebtoken";
import { accessTokenKey, refreshTokenKey } from "#config/env";
import User from "#model/User";

const verifyAccessToken = (req, res, next) => {
	const token = req.headers.cookie.split("=")[1];

	if (!token) {
		return res.status(403).send({ message: "No token provided!" });
	}

	jwt.verify(token, accessTokenKey, (err, decoded) => {
		if (err) {
			return res.status(401).send({ message: err.message });
		}
		req.userId = decoded.id;
		next();
	});
};

const verifyRefreshToken = (req, res, next) => {
	const token = req.headers.authorization.split(" ")[1];

	if (!token) {
		return res.status(403).send({ message: "No token provided!" });
	}

	jwt.verify(token, refreshTokenKey, async (err, decoded) => {
		// if token error (expired / malformed / invalid signature)
		if (err) {
			return res.status(401).send({ message: err.message });
		}

		// get user
		const user = await User.findById(decoded.id).select("+refreshToken");

		// if user not exist
		if (!user) {
			return res.status(401).send({ message: "User not found!" });
		}

		// check if refresh token is already in database
		const userToken = user.refreshToken.find((user) => user.token === token);

		// if token not found
		if (!userToken) {
			return res.status(401).send({ message: "Invalid token!" });
		}

		req.userId = user._id;
		next();
	});
};

export { verifyAccessToken, verifyRefreshToken };
