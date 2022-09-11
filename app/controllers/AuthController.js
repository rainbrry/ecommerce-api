import User from "#model/User";
import { encryptPassword, verifyPassword } from "#helper/EncryptPassword";
import {
	generateAccessToken,
	generateRefreshToken,
} from "#helper/GenerateToken";

// Controller for user authentication
const AuthController = {
	// Login user
	login: async (req, res) => {
		const { email, password } = req.body;

		// Check if email and password is provided
		if (!email || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}

		// Check if user exists
		const user = await User.findOne({ email }).select([
			"+password",
			"+refreshToken",
		]);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Check if password is correct
		const validPassword = verifyPassword(user.password);
		if (validPassword !== password) {
			return res.status(400).json({ message: "Wrong password" });
		}

		// Generate access token
		const accessToken = generateAccessToken({ id: user._id });

		// Generate refresh token
		const authRefreshToken = generateRefreshToken({ id: user._id });

		// Add refresh token to user (push to array)
		user.refreshToken.push({ token: authRefreshToken });

		// delete cookies if exist
		if (req.cookies[`${user._id}`]) req.cookies[`${user._id}`] = "";

		// Save user
		await user
			.save()
			.then((user) => {
				// Set cookie
				res.cookie(String(user._id), accessToken, {
					httpOnly: true, // Prevents client side javascript from reading the cookie
					sameSite: "lax", // CSRF
					path: "/", // Allow cookie to be sent to all routes
				});

				// destructuring user object, except password, isAdmin and refreshToken
				const { password, isAdmin, refreshToken, ...auth } = user._doc;

				// Send response
				return res.status(200).json({ ...auth, authRefreshToken });
			})
			// Catch error
			.catch((err) => {
				return res.status(500).json({ message: err.message });
			});
	},

	// Register user
	register: async (req, res) => {
		const { fullname, email, password } = req.body;

		// Check if email and password is provided
		if (!fullname || !email || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}

		// Check if user exists
		const user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({ message: "User already exists" });
		}

		// Create user
		const newUser = new User({
			fullname,
			email,
			password: encryptPassword(password),
		});

		// Save user
		await newUser
			.save()
			.then((user) => {
				const { password, ...users } = user._doc;

				// Send response
				res.status(201).json({ message: "Registration successful", ...users });
			})
			// Catch error
			.catch((err) => {
				return res.status(500).json({ message: err.message });
			});
	},

	// Logout user
	logout: async (req, res) => {
		// Clear refresh token from database
		await User.findByIdAndUpdate(
			{ _id: req.user.id },
			{
				refreshToken: "",
			}
		)
			.then(() => {
				// Clear refresh token from cookie
				res.clearCookie("refreshToken", { path: "/" });

				// Send response
				return res.status(200).json({ message: "Logged out" });
			})
			// Catch error
			.catch((err) => {
				return res.status(500).json({ message: err.message });
			});
	},

	refreshToken: async (req, res) => {
		// Get refresh token from cookie
		const accessToken = await generateAccessToken({ id: req.userId });

		// delete cookie if exist
		res.clearCookie(`${req.userId}`, { path: "/" });
		req.cookies[`${req.userId}`] = "";

		res.cookie(String(req.userId), accessToken, {
			httpOnly: true, // Prevents client side javascript from reading the cookie
			sameSite: "lax", // CSRF
			path: "/", // Allow cookie to be sent to all routes
		});

		res.status(200).json({ message: "Token refreshed" });
	},
};

export default AuthController;
