import imagekit from "../config/ImageKit.js";
import pdfModel from "../models/PdfUploader.js";

export const pdfUpload = async (req, res) => {
  try {
    const { title, desc, fileType, uploadedBy, subject } = req.body;

    if ((!title || !desc || !uploadedBy || !subject, !req.file)) {
      return res.status(400).json({
        success: false,
        message: "All required fields and file must be provided",
      });
    }

    let detectedFileType = fileType;
    if (!fileType) {
      if (req.file.mimetype.includes("pdf")) detectedFileType = "pdf";
      else if (req.file.mimetype.includes("image")) detectedFileType = "jpg";
      else detectedFileType = "notes";
    }

    const base64File = `data:${
      req.file.mimetype
    };base64,${req.file.buffer.toString("base64")}`;

    const uploadResponse = await imagekit.upload({
      file: base64File,
      fileName: req.file.originalname,
      folder: "/materials",
    });

    const pdf = await pdfModel.create({
      title,
      desc,
      fileType: detectedFileType,
      subject,
      uploadedBy,
      url: uploadResponse.url,
      mimeType: uploadResponse.mimetype || req.file.mimetype,
      fileSize: uploadResponse.size,
    });

    res.status(201).json({
      success: true,
      message: "Your material has been successfully added",
      pdf,
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + (error.message || JSON.stringify(error)),
    });
  }
};

export const getAllMaterials = async (req, res) => {
  try {
    const data = await pdfModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "All materials are fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: " + error.message,
    });
  }
};
