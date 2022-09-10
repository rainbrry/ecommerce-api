import mongoose from "mongoose";
import CategorySchema from "#schema/CategorySchema";

const { Schema } = mongoose;

const ProductSchema = new Schema(
	{
		name: { type: String, required: true, unique: true },
		category: { CategorySchema },
		price: { type: Number, required: true },
		stock: { type: Number, required: true },
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

export default ProductSchema;
