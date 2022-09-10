import mongoose from "mongoose";
import UserSchema from "#schema/UserSchema";

const { model } = mongoose;

export default model("User", UserSchema);
