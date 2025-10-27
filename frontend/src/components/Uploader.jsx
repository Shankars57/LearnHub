import {
  X,
  UploadCloud,
  FileText,
  FileSpreadsheet,
  FileImage,
} from "lucide-react";
import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LearnContext } from "../../context/LearnContextProvider";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";

const Uploader = ({ isOpen, setIsOpen }) => {
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { axios, setUploadState, token } = useContext(LearnContext);
  const {user} = useAuthStore();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setSelectedFile(file);

    if (file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
      setFileType("image");
    } else if (file.type === "application/pdf") {
      setFileType("pdf");
      setPreview(null);
    } else if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "text/plain"
    ) {
      setFileType("docx");
      setPreview(null);
    } else {
      setFileType("other");
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a file first!");
      return;
    }
    if (!token) {
      toast.error("Please login");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", e.target.title.value);
    formData.append("subject", e.target.subject.value);
    formData.append("desc", e.target.desc.value);
    formData.append("uploadedBy", e.target.uploadedBy.value);
    formData.append("fileType", e.target.fileType.value);

    try {
      const res = await axios.post("/api/material/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,

          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success("Material uploaded successfully!");
        setIsOpen(false);
        setFileName("");
        setSelectedFile(null);
        setPreview(null);
        setUploadState((prev) => !prev);
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload failed!");
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  console.log(token);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-[600px] bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 relative p-8"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white absolute top-5 right-5"
            >
              <X size={22} />
            </button>

            <motion.h2
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-xl font-semibold text-white mb-6 text-center"
            >
              Upload Your Study Material
            </motion.h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex gap-3">
                <input
                  name="title"
                  type="text"
                  placeholder="Enter material title e.g. DSA Notes"
                  className="flex-1 border border-gray-600 bg-gray-900/40 text-gray-200 placeholder-gray-400 placeholder:text-sm rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none"
                  required
                />
                <input
                  name="uploadedBy"
                  type="text"
                  placeholder="Your name e.g. John"
                  className="flex-1 border border-gray-600 bg-gray-900/40 text-gray-200 placeholder-gray-400 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none"
                  required
                />
              </div>

              <input
                name="subject"
                type="text"
                placeholder="Enter subject e.g. Web Development"
                className="w-full border border-gray-600 bg-gray-900/40 text-gray-200 placeholder-gray-400 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none"
                required
              />

              <textarea
                name="desc"
                placeholder="Write a short description about your material..."
                className="w-full border border-gray-600 bg-gray-900/40 text-gray-200 placeholder-gray-400 rounded-lg px-4 py-3 h-32 resize-none focus:ring-2 focus:ring-blue-600 outline-none"
                required
              />

              <div className="flex items-center gap-3">
                <select
                  name="fileType"
                  className="border border-gray-600 bg-gray-900/40 text-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  required
                >
                  <option value="pdf">PDF</option>
                  <option value="notes">Notes</option>
                  <option value="docx">Docx</option>
                  <option value="books">Books</option>
                  <option value="jpg">Image (JPG/PNG)</option>
                </select>

                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex items-center gap-2 border border-blue-600 bg-blue-600/10 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-600/20 transition"
                >
                  <UploadCloud size={18} />
                  {fileName ? "Change File" : "Upload File"}
                </label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.txt,.jpg,.jpeg,.png"
                  className="hidden"
                />
              </div>

              {preview ? (
                <div className="mt-3 flex justify-center">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-48 rounded-lg border border-gray-700 shadow-lg"
                  />
                </div>
              ) : fileName ? (
                <div className="flex justify-center mt-3 text-gray-300 gap-2 items-center">
                  {fileType === "pdf" && <FileText className="text-red-400" />}
                  {fileType === "docx" && (
                    <FileSpreadsheet className="text-green-400" />
                  )}
                  {fileType === "image" && (
                    <FileImage className="text-yellow-400" />
                  )}
                  <span className="text-sm">
                    Selected: <span className="text-blue-400">{fileName}</span>
                  </span>
                </div>
              ) : null}

              <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={loading}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                {loading ? "Uploading..." : "Submit Material"}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Uploader;
