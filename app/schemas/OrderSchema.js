import mongoose from "mongoose";
import ProductSchema from "#schema/ProductSchema";

const { Schema } = mongoose;

const OrderSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		products: [
			{
				ProductSchema,
				quantity: { type: Number, required: true },
				total: { type: Number, required: true },
			},
		],
		grandTotal: { type: Number, required: true },
		status: { type: String, required: true },
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

export default OrderSchema;
