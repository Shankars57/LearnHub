import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String }, 
    subject: { type: String  , required:true},
    url: { type: String, required: true },
    fileType: {
      type: String,
      enum: ["notes", "pdf", "docx", "books", "jpg", "jpeg"],
      required: true,
    },
    mimeType: { type: String },
    fileSize: { type: Number },
    uploadedBy: { type: String, required: true },
  },
  { timestamps: true }
);

const pdfModel = mongoose.model("materials", pdfSchema);

export default pdfModel;
