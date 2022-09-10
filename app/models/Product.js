import mongoose from "mongoose";
import ProductSchema from "#schema/ProductSchema";

const { model } = mongoose;

export default model("Product", ProductSchema);
