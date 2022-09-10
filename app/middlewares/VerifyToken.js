import jwt from "jsonwebtoken";
import { accessTokenKey } from "#config/env";

const verifyToken = (req, res, next) => {
	const token = req.headers.authorization.split(" ")[1];

	if (!token) {
		return res.status(403).send({ message: "No token provided!" });
	}

	jwt.verify(token, accessTokenKey, (err, decoded) => {
		if (err) {
			return res.status(401).send({ message: "Unauthorized!" });
		}
		req.userId = decoded.id;
		next();
	});
};

export { verifyToken };
