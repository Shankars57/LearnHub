import express from "express";
import {
  signup,
  login,
  userUpdate,
  googleLogin,
  sendOtp,      
  verifyOtp,    
} from "../controller/userController.js";
import { verify } from "../middleware/auth.js";
import userModel from "../models/user.js";
import { upload } from "../middleware/multer.js";
const userRouter = express.Router();
userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/google-login", googleLogin);
userRouter.post("/send-otp", sendOtp);     
userRouter.post("/verify-otp", verifyOtp); 
userRouter.put("/update/:id", verify, upload.single("profile_pic"), userUpdate);
userRouter.get("/stats/:id", verify, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel
      .findById(id)
      .select("streak totalWatchTime level xp lastActiveDate");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

userRouter.get("/profile", verify, async (req, res) => {
  try {
    const user = await userModel
      .findOne({ email: req.user.email })
      .select("-password -otp");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default userRouter;
