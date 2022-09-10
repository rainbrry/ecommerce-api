import mongoose from "mongoose";
import TokenSchema from "#schema/TokenSchema";

const { model } = mongoose;

export default model("Token", TokenSchema);
