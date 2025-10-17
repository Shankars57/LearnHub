import express from "express";
import { signup, login, userUpdate } from "../controller/userController.js";
import { verify } from "../middleware/auth.js";
import userModel from "../models/user.js";
const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.put("/update/:id", verify, userUpdate);
userRouter.get("/profile", verify, async (req, res) => {
  try {
    const user = await userModel
      .findOne({ email: req.user.email })
      .select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
export default userRouter;
