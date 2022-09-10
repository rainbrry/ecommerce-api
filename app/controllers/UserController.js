import User from "#model/User";

// Controller for user
const UserController = {
	// Get all users
	index: async (req, res) => {
		const users = await User.find();
		res.status(200).json(users);
	},

	// Get a user by id
	show: async (req, res) => {
		const user = await User.findById(req.params.id);
		res.status(200).json(user);
	},

	// Create a user
	store: async (req, res) => {
		const request = new User({
			fullname: req.body.fullname,
			email: req.body.email,
			password: req.body.password,
		});

		const user = await User.create(request);
		res.status(201).json({ message: "User created successfully", user });
	},

	// Update a user
	update: async (req, res) => {
		const request = {
			username: req.body.username,
		};

		const user = await User.findByIdAndUpdate(req.params.id, request, {
			new: true,
		});
		res.status(200).json({ message: "User updated successfully", user });
	},

	// Delete a user
	destroy: async (req, res) => {
		await User.findByIdAndDelete(req.params.id);
		res.status(200).json({ message: "User deleted successfully" });
	},

	// Update user profile
	changeProfile: async (req, res) => {
		const request = {
			fullname: req.body.fullname,
			phone: req.body.phone,
			address: req.body.address,
		};

		const user = await User.findByIdAndUpdate(req.params.id, request, {
			new: true,
		});
		res.status(200).json({ message: "Profile updated successfully", user });
	},

	// Change user email
	changeEmail: async (req, res) => {
		const request = {
			email: req.body.email,
		};

		const user = await User.findByIdAndUpdate(req.params.id, request, {
			new: true,
		});
		res.status(200).json({ message: "Email updated successfully", user });
	},

	// Change user password
	changePassword: async (req, res) => {
		const request = {
			password: req.body.password,
		};

		const user = await User.findByIdAndUpdate(req.params.id, request, {
			new: true,
		});
		res.status(200).json({ message: "Password updated successfully", user });
	},
};

export default UserController;
