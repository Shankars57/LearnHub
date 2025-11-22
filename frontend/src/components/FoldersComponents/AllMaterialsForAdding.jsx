import React, { useContext, useState, useMemo } from "react";
import { LearnContext } from "../../../context/LearnContextProvider";
import { X, Search, FileText, FileImage, FileType } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const AllMaterialsForAdding = ({ setOpen, folderId, onUpdated }) => {
  const [input, setInput] = useState("");
  const { materialsData } = useContext(LearnContext);

  const filtered = useMemo(() => {
    if (!materialsData) return [];
    return materialsData.filter((item) => {
      const q = input.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.subject?.toLowerCase().includes(q) ||
        item.fileType?.toLowerCase().includes(q)
      );
    });
  }, [materialsData, input]);

  const addMaterialToFolder = async (folderId, title, link) => {
    try {
      const { data } = await axios.post(`/api/folder/save/${folderId}`, {
        title,
        link,
      });
      if (data.success) {
        toast.success(data.message || "Saved to folder");
        if (onUpdated) onUpdated();
        setOpen(false);
      } else {
        toast.error(data.message || "Failed to save material");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const getIcon = (type) => {
    const t = type?.toLowerCase();
    if (t === "pdf" || t === "docx" || t === "txt") return FileText;
    if (t === "jpg" || t === "jpeg" || t === "png") return FileImage;
    return FileType;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-[95%] max-w-2xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-700 bg-gradient-to-r from-slate-900 to-slate-800">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-white">
              Add Material to Folder
            </h1>
            <p className="text-xs sm:text-sm text-gray-300">
              Choose from your existing materials to add.
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-full hover:bg-red-600/80 bg-red-600 text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 sm:px-6 py-3 border-b border-gray-800 flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-500"
              placeholder="Search by title, subject or type..."
            />
          </div>
          <div className="text-xs sm:text-sm text-gray-300 text-right sm:text-left">
            <span className="px-2 py-1 rounded-full bg-gray-800 border border-gray-700">
              Total: {materialsData?.length || 0} | Showing: {filtered.length}
            </span>
          </div>
        </div>

        <div className="max-h-80 sm:max-h-96 overflow-y-auto custom-scrollbar bg-gray-900">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-sm text-gray-400">
                No materials found. Try a different search.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-800">
              {filtered.map((item) => {
                const Icon = getIcon(item.fileType);
                return (
                  <li
                    key={item._id || item.title}
                    className="px-4 sm:px-6 py-3 hover:bg-gray-800/70 transition flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-500/40">
                          <Icon className="w-5 h-5 text-blue-300" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <h2 className="text-sm sm:text-base font-semibold text-white line-clamp-1">
                          {item.title}
                        </h2>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-300">
                          {item.subject && (
                            <span className="px-2 py-0.5 rounded-full bg-gray-800 border border-gray-700">
                              {item.subject}
                            </span>
                          )}
                          {item.fileType && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-900/40 border border-blue-700 text-blue-200">
                              {item.fileType.toUpperCase()}
                            </span>
                          )}
                        </div>
                        {item.desc && (
                          <p className="text-xs text-gray-400 line-clamp-2 max-w-md">
                            {item.desc}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 justify-end sm:justify-start">
                      <button
                        className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
                        onClick={() =>
                          addMaterialToFolder(folderId, item.title, item.url)
                        }
                      >
                        Add
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="px-4 sm:px-6 py-2.5 border-t border-gray-800 bg-gray-900 flex items-center justify-end">
          <button
            onClick={() => setOpen(false)}
            className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllMaterialsForAdding;
