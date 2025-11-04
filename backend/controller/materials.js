import imagekit from "../config/ImageKit.js";
import pdfModel from "../models/PdfUploader.js";
import userModel from "../models/user.js";
import { transporter } from "./userController.js";

export const pdfUpload = async (req, res) => {
  try {
    const userDetails = await userModel
      .findOne({ email: req.user.email })
      .select("-password");

    const { title, desc, fileType, subject } = req.body;

    if (!title || !desc || !subject || !req.file) {
      return res.status(400).json({
        success: false,
        message: "All required fields and file must be provided",
      });
    }

    let detectedFileType = fileType;
    if (!fileType) {
      if (req.file.mimetype.includes("pdf")) detectedFileType = "pdf";
      else if (req.file.mimetype.includes("image")) detectedFileType = "image";
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

    const uploadedBy = userDetails.name || userDetails.email;

    const pdf = await pdfModel.create({
      title,
      desc,
      fileType: detectedFileType,
      subject,
      uploadedBy,
      user: userDetails._id,
      url: uploadResponse.url,
      mimeType: uploadResponse.mime || req.file.mimetype,
      fileSize: uploadResponse.size,
    });

    sendMaterialNotification(uploadedBy);
    res.status(201).json({
      success: true,
      message: "Material uploaded successfully",
      pdf,
    });
  } catch (error) {
    console.error("PDF Upload Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + (error.message || JSON.stringify(error)),
    });
  }
};

export const getAllMaterials = async (req, res) => {
  try {
    const data = await pdfModel
      .find()
      .populate("user", "name email _id")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "All materials fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

const sendMaterialNotification = async (uploadedBy) => {
  const users = await userModel.find({}, "email");
  if (!users.length) return console.log("No users to notify.");

  const emailList = users.map((u) => u.email);

  emailList.forEach(async (email) => {
    try {
      await transporter.sendMail({
        from: `"LearnHub" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "New Material Uploaded on LearnHub",
        html: `
         <p>Hello Learner 👋,</p>
         <p>New study material has been uploaded by <b>${uploadedBy}</b>.</p>
         <p>Click here to check it out 👉 
         <a href="https://learn-hub-rho.vercel.app/materials" target="_blank">View Materials</a></p>
         <br/>
         <p>— LearnHub Team</p>
       `,
      });
    } catch (error) {
      console.log(error.message);
    }
  });

  console.log("Material upload notification sent successfully.");
};
