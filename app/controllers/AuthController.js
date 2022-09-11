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
		const user = await User.findOne({ email }).select("+password");
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
		const refreshToken = generateRefreshToken({ id: user._id });

		user.refreshToken.push({ token: refreshToken });
		await user
			.save()
			.then((user) => {
				res.cookie(String(user._id), [accessToken, refreshToken], {
					path: "/",
					httpOnly: true,
					maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
					sameSite: "lax",
				});

				// destructuring user object, excepting password & isAdmin
				const { password, isAdmin, ...auth } = user._doc;

				// Send access token to client
				return res.status(200).json({ ...auth });
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

	// Refresh token
	refreshToken: async (req, res) => {
		// Get refresh token from cookie
		const refreshToken = req.cookies.refreshToken;
		// Check if refresh token is provided
		if (!refreshToken) {
			return res.status(400).json({ message: "Please login or register" });
		}
		// Verify refresh token
		const decoded = await verifyRefreshToken(refreshToken);
		// Check if user exists
		const user = await User.findById(decoded.id).select("+refreshToken");
		if (!user) {
			return res.status(400).json({ message: "Please login or register" });
		}
		// Check if refresh token is valid
		if (refreshToken !== user.refreshToken) {
			return res.status(400).json({ message: "Please login or register" });
		}
		// Generate access token
		const accessToken = generateAccessToken({ id: user._id });

		// Send access token to client
		res.status(200).json({ accessToken });
	},
};

export default AuthController;
