import mongoose from "mongoose";
import CategorySchema from "#schema/CategorySchema";

const { model } = mongoose;

export default model("Category", CategorySchema);
