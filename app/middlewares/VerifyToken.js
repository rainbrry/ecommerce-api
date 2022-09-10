import jwt from "jsonwebtoken";
import { accessTokenKey, refreshTokenKey } from "#config/env";
import User from "#model/User";

const verifyToken = (req, res, next) => {
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
	const token = req.cookies.refreshToken;
	if (!token) {
		return res.status(403).send({ message: "No token provided!" });
	}

	jwt.verify(token, refreshTokenKey, async (err, decoded) => {
		if (err) {
			return res.status(401).send({ message: err.message });
		}

		const user = await User.findById(decoded.id).select("+refreshToken");

		const refreshTokens = user.refreshToken;

		const usertoken = refreshTokens.find((user) => user.token === token);

		if (!usertoken) {
			return res.status(401).send({ message: "Invalid token!" });
		}

		req.user = {
			id: user._id,
		};

		next();
	});
};

export { verifyToken, verifyRefreshToken };
