import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    roll: { type: String, required: true },
    college: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    year: { type: String, required: true },
    bio: {
      type: String,
      default: "Hey! Welcome to LearnHub, Please updated your bio in settings.",
    },
    userName: { type: String },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
