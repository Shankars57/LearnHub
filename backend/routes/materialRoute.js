import express from "express";
import { upload } from "../middleware/multer.js";
import { getAllMaterials, pdfUpload } from "../controller/materials.js";
import { verify } from "../middleware/auth.js";
const pdfRouter = express.Router();

pdfRouter.post("/upload", upload.single("file"), pdfUpload);
pdfRouter.get("/get-materials", getAllMaterials);
export default pdfRouter;
