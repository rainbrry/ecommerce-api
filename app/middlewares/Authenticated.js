import { verifyToken } from "#middleware/VerifyToken";
import User from "#model/User";

// check if user is exist (not deleted)
const checkUser = (req, res, next) => {
	verifyToken(req, res, async () => {
		const user = await User.findById(req.userId).select(["+isAdmin"]);
		if (!user) {
			return res.status(403).json({ message: "Not allowed" });
		}

		req.user = {
			id: user._id,
			isAdmin: user.isAdmin,
		};
		next();
	});
};

// allowing user to access his profile
// compare id in token with params id, allowed if they are the same
const requireAuth = (req, res, next) => {
	checkUser(req, res, () => {
		if (req.user.id !== req.params.id) {
			return res.status(403).json({ message: "Not allowed" });
		}
		next();
	});
};

// only admin
// check user isAdmin, allowed if true
const requireAdmin = (req, res, next) => {
	checkUser(req, res, () => {
		if (!req.user.isAdmin) {
			return res.status(403).json({ message: "Not allowed" });
		}
		next();
	});
};

export { checkUser, requireAuth, requireAdmin };
