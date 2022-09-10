import mongoose from "mongoose";
import CartSchema from "#schema/CartSchema";

const { model } = mongoose;

export default model("Cart", CartSchema);
