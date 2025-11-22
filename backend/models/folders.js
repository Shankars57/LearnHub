import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["public", "private"], default: "public" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    materials: [
      {
        title: String,
        link: String,
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      },
    ],
  },
  { timestamps: true }
);

const folderModel = mongoose.model("Folders", folderSchema);
export default folderModel;
