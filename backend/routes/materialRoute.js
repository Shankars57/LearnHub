import express from "express";
import { upload } from "../middleware/multer.js";
import {
  featured,
  getAllMaterials,
  pdfUpload,
} from "../controller/materials.js";
import { verify } from "../middleware/auth.js";
const pdfRouter = express.Router();

pdfRouter.post("/upload", upload.single("file"), verify, pdfUpload);
pdfRouter.get("/get-materials", getAllMaterials);
pdfRouter.post("/feature/:id", featured);
export default pdfRouter;
