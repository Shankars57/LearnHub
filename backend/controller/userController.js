import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../models/user.js";
import imagekit from "../config/ImageKit.js";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_EMAIL,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

transporter.verify((err, success) => {
  if (err) console.log("Mailer error:", err);
  else console.log("Mailer is ready");
});

export const jwtGenerate = (userId, email) => {
  return jwt.sign({ userId, email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const googleLogin = async (req, res) => {
  const { email, firstName, lastName } = req.body;

  try {
    if (!email || !firstName || !lastName) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Google login data" });
    }

    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        email,
        firstName,
        lastName,
        password: "",
      });
    }

    const token = jwtGenerate(user._id, user.email);
    const { password: _, ...userData } = user._doc;

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
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

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#^&*?])[A-Za-z\d@$!#^&*?]{8,}$/;

    const invalidCharsRegex = /[~%"']/;

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    if (invalidCharsRegex.test(password)) {
      return res.json({
        success: false,
        message:
          "Password contains invalid characters (~, %, \", or ' are not allowed)",
      });
    }

    if (!/[A-Z]/.test(password)) {
      return res.json({
        success: false,
        message: "Password must contain at least one uppercase letter",
      });
    }

    if (!/[a-z]/.test(password)) {
      return res.json({
        success: false,
        message: "Password must contain at least one lowercase letter",
      });
    }

    if (!/\d/.test(password)) {
      return res.json({
        success: false,
        message: "Password must contain at least one number",
      });
    }

    if (!/[@$!#^&*?]/.test(password)) {
      return res.json({
        success: false,
        message:
          "Password must contain at least one special character (e.g. @, $, !, #, ^, &, *, ?)",
      });
    }

    if (!strongPasswordRegex.test(password)) {
      return res.json({
        success: false,
        message: "Password does not meet security requirements",
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

    if (user.ban) {
      return res.json({
        success: false,
        message: "User in Ban please contact admin",
      });
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
    const file = req.file;
    const exists = await userModel.findOne({ userName });
    if (exists)
      return res.status(400).json({ message: "Username already taken" });

    let updateData = { firstName, lastName, bio, userName };
    if (file) {
      const uploaded = await imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
        folder: "/profile_pics",
      });
      updateData.profile = uploaded.url;
    }
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User profile updated successfully!",
      updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { watchTime } = req.body;

    const user = await userModel.findById(id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const today = new Date();
    const lastActive = user.lastActiveDate
      ? new Date(user.lastActiveDate)
      : null;

    if (lastActive) {
      const diffDays = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) user.streak += 1;
      else if (diffDays > 1) user.streak = 1;
    } else {
      user.streak = 1;
    }

    if (watchTime) user.totalWatchTime += watchTime;

    const xpEarned = (watchTime / 60) * 100;
    user.xp += xpEarned;

    while (user.xp >= user.level * 1000) {
      user.xp -= user.level * 1000;
      user.level += 1;
    }

    user.lastActiveDate = today;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Activity updated!",
      data: {
        streak: user.streak,
        totalWatchTime: user.totalWatchTime,
        level: user.level,
        xp: user.xp,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });

  try {
    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = { code: otpCode, expiresAt };
    await user.save();

    await transporter.sendMail({
      from: `"LearnHub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code for LearnHub",
      html: `<p>Your OTP code is <b>${otpCode}</b>. It expires in 5 minutes.</p>`,
    });
    console.log("Otp sent successfully");
    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("OTP send error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send OTP" });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res
      .status(400)
      .json({ success: false, message: "Email & OTP required" });

  try {
    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user || !user.otp)
      return res
        .status(400)
        .json({ success: false, message: "OTP not sent or invalid" });

    if (new Date() > user.otp.expiresAt)
      return res.status(400).json({ success: false, message: "OTP expired" });

    if (user.otp.code !== otp)
      return res.status(400).json({ success: false, message: "Incorrect OTP" });

    user.isVerified = true;
    user.otp = null;
    await user.save();

    return res.json({ success: true, message: "Email verified successfully!" });
  } catch (err) {
    console.error("OTP verify error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to verify OTP" });
  }
};

export const banUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findById(id);
    user.ban = !user.ban;
    await user.save();
    if (user.ban) {
      res.json({
        success: true,
        message: user.ban ? "User successfully ban" : "User successfully unban",
      });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
