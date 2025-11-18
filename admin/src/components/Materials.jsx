import React, { useState, useEffect, useContext } from "react";
import {
  Eye,
  Download,
  Trash2,
  Star,
  MoreVertical,
  FileText,
  FileChartLine,
  FileArchive,
  FileChartColumn,
  UploadCloud,
} from "lucide-react";
import moment from "moment";
import { motion } from "framer-motion";
import { useStore } from "../store/useStore";
import { useColors } from "../hooks/useColors";
import { toast } from "react-hot-toast";
import Uploader from "./Uploader";
import axios from "axios";
import { AdminContext } from "../context/AdminProvider";

const Materials = () => {
  const { materials } = useStore();
  const colors = useColors();

  const [localMaterials, setLocalMaterials] = useState(materials);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const { token } = useContext(AdminContext);

  useEffect(() => {
    setLocalMaterials(materials);
  }, [materials]);
  const materialsPerPage = 6;
  const filteredMaterials = localMaterials.filter((item) => {
    const matchesType =
      type === "all" || item.fileType.toLowerCase() === type.toLowerCase();
    const matchesSearch = item.title
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalPages = Math.ceil(filteredMaterials.length / materialsPerPage);
  const startIndex = (page - 1) * materialsPerPage;
  const paginated = filteredMaterials.slice(
    startIndex,
    startIndex + materialsPerPage
  );

  const handleDelete = async (title, id) => {
    const confirm = window.confirm(`Are you sure to delete this material?`);
    if (!confirm) {
      return;
    }
    try {
      const { data } = await axios.delete(`/api/material/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        toast.success(`${title}-${data.message}`);
        const updated = localMaterials.filter((m) => m._id !== id);
        setLocalMaterials(updated);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleFeature = async (title, id) => {
    try {
      const { data } = await axios.post(`/api/material/feature/${id}`);
      if (data.success) {
        toast.success(`${title}-${data.message}`);
        const updated = localMaterials.map((m) =>
          m._id === id ? { ...m, featured: !m.featured } : m
        );
        setLocalMaterials(updated);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const renderFileIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "pdf":
        return <FileChartLine size={18} className="text-red-500" />;
      case "docx":
      case "txt":
        return <FileArchive size={18} className="text-green-400" />;
      case "jpg":
      case "png":
        return <FileChartColumn size={18} className="text-yellow-400" />;
      default:
        return <FileText size={18} className="text-blue-400" />;
    }
  };

  return (
    <div className={`${colors.bg} px-6 py-6 min-h-screen`}>
      {isUploaderOpen && (
        <Uploader isOpen={isUploaderOpen} setIsOpen={setIsUploaderOpen} />
      )}
      <div className="mb-6 flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className={`${colors.text} text-3xl font-bold`}>
            Materials Management
          </h1>
          <p className={`${colors.textMuted} text-lg`}>
            Manage and monitor all uploaded materials
          </p>
          <p className={`${colors.textMuted} text-lg`}>
            Total Materials:{materials.length}
          </p>
        </div>
        <button
          onClick={() => setIsUploaderOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-white font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 shadow-md hover:from-blue-700 hover:to-cyan-600 transition"
        >
          <UploadCloud size={18} />
          Upload
        </button>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className={`w-full md:w-1/3 p-2 rounded-lg border ${colors.border} focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 ${colors.text} ${colors.bg}`}
        />
        <div className="flex flex-wrap gap-2">
          {["all", "pdf", "docx", "jpg"].map((t, i) => (
            <button
              key={i}
              onClick={() => {
                setType(t);
                setPage(1);
              }}
              className={`px-3 py-1.5 text-sm rounded-md border transition-all duration-150 ${
                type === t
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-600/30"
                  : `${colors.card} ${colors.textMuted} ${colors.hover} ${colors.border}`
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      {filteredMaterials.length > 0 && (
        <div className="flex justify-start items-center gap-3 mt-6 mb-3">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className={`px-4 py-2 rounded-lg border ${colors.text} ${
              colors.bg
            } ${colors.shadow} ${
              page === 1 ? "opacity-40 cursor-not-allowed" : "hover:opacity-80"
            }`}
          >
            Prev
          </button>
          <span className={`${colors.text} text-sm`}>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className={`px-4 py-2 rounded-lg border ${colors.text} ${
              colors.bg
            } ${colors.shadow} ${
              page === totalPages
                ? "opacity-40 cursor-not-allowed"
                : "hover:opacity-80"
            }`}
          >
            Next
          </button>
        </div>
      )}
      <div
        className={`overflow-x-auto rounded-xl ${colors.shadow} custom-scroll`}
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`${colors.textMuted} border-b ${colors.border}`}>
              <th className="p-3">File</th>
              <th className="p-3">Title</th>
              <th className="p-3">Type</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Uploaded</th>
              <th className="p-3">UploadedBy</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? (
              paginated.map((file, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`border-b ${colors.border} ${
                    colors.text
                  } hover:bg-black/10 transition ${
                    file.featured ? "bg-yellow-500/10" : ""
                  }`}
                >
                  <td className="p-3 flex items-center gap-2">
                    {renderFileIcon(file.fileType)}
                    <span>{file.fileType.toUpperCase()}</span>
                  </td>
                  <td className="p-3 font-medium">{file.title}</td>
                  <td className="p-3 capitalize">{file.fileType}</td>
                  <td className="p-3">{file.subject || "General"}</td>
                  <td className="p-3 text-sm">
                    {moment(file.updatedAt).format("MMM DD, YYYY")}
                  </td>
                  <td className="p-3 text-sm">{file.uploadedBy}</td>
                  <td className="p-3 relative">
                    <button
                      onClick={() => {
                        setOpen(open && idx === i ? false : true);
                        setIdx(i);
                      }}
                      className={`p-2 rounded-lg ${colors.hover} transition`}
                    >
                      <MoreVertical size={18} />
                    </button>
                    {open && idx === i && (
                      <div
                        className={`absolute right-0 top-11 w-44 z-50 ${colors.card} ${colors.shadow} border ${colors.border} rounded-lg p-2 flex flex-col gap-1`}
                      >
                        <button
                          onClick={() => window.open(file.url, "_blank")}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${colors.text} ${colors.hover}`}
                        >
                          <Eye size={16} /> Preview
                        </button>
                        <a
                          href={file.url}
                          download
                          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${colors.text} ${colors.hover}`}
                        >
                          <Download size={16} /> Download
                        </a>
                        <button
                          onClick={() => handleFeature(file.title, file._id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm text-yellow-400 hover:bg-yellow-500/20`}
                        >
                          <Star size={16} />
                          {file.featured ? "Remove Feature" : "Feature"}
                        </button>
                        <button
                          onClick={() => handleDelete(file.title, file._id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-400 hover:bg-red-600/20`}
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className={`${colors.textMuted} text-center py-6`}
                >
                  No materials found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Materials;
