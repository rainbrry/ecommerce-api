import mongoose from "mongoose";
import OrderSchema from "#schema/OrderSchema";

const { model } = mongoose;

export default model("Order", OrderSchema);
