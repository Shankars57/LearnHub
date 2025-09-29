import express from "express";
import { askGemini } from "../utilities/ai.js";

const AIRouter = express.Router();

AIRouter.post("/ai-chat", askGemini);

export default AIRouter;