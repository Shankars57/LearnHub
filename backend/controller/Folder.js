import folderModel from "../models/folders.js";
import mongoose from "mongoose";
import userModel from "../models/user.js";

export const createFolder = async (req, res) => {
  try {
    const userDetails = await userModel
      .findOne({ email: req.user.email })
      .select("-password");
    const { name, type } = req.body;
    if (!name || !type) {
      return res.json({
        success: false,
        message: "Please fill all required fields",
      });
    }
    const folder = await folderModel.create({
      name,
      type,
      user: userDetails._id,
    });
    return res.json({
      success: true,
      folder,
      message: `${name} folder successfully created`,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getFolders = async (req, res) => {
  try {
    const folder = await folderModel
      .find()
      .populate("user", "_id roll email userName");
    return res.json({ success: true, folder });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const getFoldersById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user id" });
    }

    const folders = await folderModel
      .find({ user: id })
      .sort({ createdAt: -1 })
      .lean();

    if (!folders || folders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No folders found for this user" });
    }

    return res.status(200).json({
      success: true,
      count: folders.length,
      data: folders,
    });
  } catch (error) {
    console.error("Error in getFoldersById:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching folders",
      error: error.message,
    });
  }
};

export const deleteFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const folder = await folderModel.findByIdAndDelete(id);
    if (!folder) {
      res.json({ success: false, message: "No folder found" });
    }
    res.json({ success: true, message: "Folder deleted" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const saveMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, link } = req.body;

    const folder = await folderModel.findById(id);

    if (!folder) {
      return res.json({ success: false, message: "Folder not found" });
    }

    folder.materials.push({ title, link });
    await folder.save();

    return res.json({
      success: true,
      message: `${title} successfully saved to ${folder.name}`,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteMaterial = async (req, res) => {
  try {
    const { folderId, materialId } = req.params;

    const folder = await folderModel.findById(folderId);

    if (!folder) {
      return res.json({ success: false, message: "Folder not found" });
    }

    folder.materials = folder.materials.filter(
      (m) => m._id.toString() !== materialId
    );

    await folder.save();

    return res.json({
      success: true,
      message: "Material deleted successfully",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
