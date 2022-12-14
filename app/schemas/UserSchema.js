import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSChema = new Schema(
	{
		fullname: { type: String, required: true },
		username: { type: String, unique: true, sparse: true },
		email: { type: String, required: true, unique: true },
		phone: { type: String, sparse: true },
		role: { type: String, select: false, default: "user" },
		password: { type: String, required: true, select: false },
		address: { type: String },
		refreshToken: { type: Array, select: false },
	},
	{
		versionKey: false,
	}
);

export default UserSChema;
