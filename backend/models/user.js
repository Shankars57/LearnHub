import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    roll: { type: String, required: true },
    college: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otp: {
      code: String,
      expiresAt: Date,
    },
    year: { type: String, required: true },
    bio: {
      type: String,
      default: "Hey! Welcome to LearnHub, Please updated your bio in settings.",
    },
    userName: { type: String },
    profile: { type: String },
    bgImage: { type: String },

    streak: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: null },
    totalWatchTime: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
