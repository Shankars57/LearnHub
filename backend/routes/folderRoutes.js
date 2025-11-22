import express from "express";
import {
  createFolder,
  deleteFolder,
  deleteMaterial,
  getFolders,
  saveMaterial,
} from "../controller/Folder.js";
import { verify } from "../middleware/auth.js";
const folderRouter = express.Router();

folderRouter.post("/create", verify, createFolder);
folderRouter.get("/folders", getFolders);
folderRouter.delete("/delete/:id", deleteFolder);
folderRouter.post("/save/:id", saveMaterial);
folderRouter.delete("/delete/:folderId/:materialId", deleteMaterial);
export default folderRouter;
