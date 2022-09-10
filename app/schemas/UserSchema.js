import mongoose from "mongoose";

const { Schema } = mongoose;

const TokenSchema = new Schema({ token: { type: String } });

const UserSChema = new Schema(
	{
		fullname: { type: String, required: true },
		username: { type: String, unique: true, sparse: true },
		email: { type: String, required: true, unique: true },
		phone: { type: String, sparse: true },
		isAdmin: { type: Boolean, default: false, select: false },
		password: { type: String, required: true, select: false },
		address: { type: String },
		refreshToken: { type: [TokenSchema], select: false },
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

export default UserSChema;
