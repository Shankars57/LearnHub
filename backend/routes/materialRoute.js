import express from "express";
import { upload } from "../middleware/multer.js";
import {
  deleteMaterial,
  featured,
  getAllMaterials,
  pdfUpload,
} from "../controller/materials.js";
import { verify } from "../middleware/auth.js";
const pdfRouter = express.Router();

pdfRouter.post("/upload", upload.single("file"), verify, pdfUpload);
pdfRouter.get("/get-materials", getAllMaterials);
pdfRouter.post("/feature/:id", featured);
pdfRouter.delete("/delete/:id", verify, deleteMaterial);
export default pdfRouter;
