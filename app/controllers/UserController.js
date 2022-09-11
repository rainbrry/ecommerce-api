import User from "#model/User";

// Controller for user
const UserController = {
	// Get all users
	index: async (req, res) => {
		await User.find()
			.select("+role")
			.then((users) => {
				res.status(200).json(users);
			})
			.catch((err) => res.status(405).json({ message: err.message }));
	},

	// Get a user by id
	show: async (req, res) => {
		await User.findById(req.params.id)
			.then((user) => {
				res.status(200).json(user);
			})
			.catch((err) => res.status(405).json({ message: err.message }));
	},

	// Create a user
	store: async (req, res) => {
		const request = new User({
			fullname: req.body.fullname,
			email: req.body.email,
			password: req.body.password,
			role: req.body.role,
		});

		const user = await User.create(request);
		res.status(201).json({ message: "User created successfully", user });
	},

	// Update a user
	update: async (req, res) => {
		const request = {
			username: req.body.username,
		};

		await User.findByIdAndUpdate(req.params.id, request, {
			new: true,
		})
			.then((user) => {
				res.status(200).json({ message: "User updated successfully", user });
			})
			.catch((err) => res.status(405).json({ message: err.message }));
	},

	// Delete a user
	destroy: async (req, res) => {
		await User.findByIdAndDelete(req.params.id)
			.then(() => {
				res.status(200).json({ message: "User deleted successfully" });
			})
			.catch((err) => res.status(405).json({ message: err.message }));
	},

	// Update user profile
	changeProfile: async (req, res) => {
		const request = {
			fullname: req.body.fullname,
			phone: req.body.phone,
			address: req.body.address,
		};

		await User.findByIdAndUpdate(req.params.id, request, {
			new: true,
		})
			.then((user) => {
				res.status(200).json({ message: "Profile updated successfully", user });
			})
			.catch((err) => res.status(405).json({ message: err.message }));
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
