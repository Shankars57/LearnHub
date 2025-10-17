import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "application/msword", 
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpg",
      "image/png",
    ];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only PDF , Doc/Docx and image files are allowed"));
  },
});
