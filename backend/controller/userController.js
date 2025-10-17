import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../models/user.js";
import imagekit from "../config/ImageKit.js";

export const jwtGenerate = (userId, email) => {
  return jwt.sign({ userId, email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const signup = async (req, res) => {
  const { email, password, firstName, lastName, roll, college, year } =
    req.body;
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Email is already in use." });
    }

    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !roll ||
      !college ||
      !year
    ) {
      return res.json({ success: false, message: "Please fill all fields" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password length must be have 8 characters",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      roll,
      year,
      college,
    });
    const userId = user._id;
    const token = jwtGenerate(userId, email);
    const { password: _, ...userData } = user._doc;
    return res.json({
      success: true,
      message: "Thanks for registering!",
      token,
      user: userData,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.json({ success: false, message: "Please fill all fields" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }
    const userId = user._id;
    const token = jwtGenerate(userId, email);
    const { password: _, ...userData } = user._doc;
    return res.json({
      success: true,
      message: "Login successful!",
      token,
      user: userData,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const userUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, bio, userName } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { firstName, lastName, bio, userName },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User profile updated!", updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
