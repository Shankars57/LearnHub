import {
  CircleChevronLeft,
  CircleChevronRight,
  Folder,
  Eye,
  Trash2,
  Trash,
  CirclePlus,
} from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import PdfReader from "../PdfReader";
import axios from "axios";
import toast from "react-hot-toast";
import AllMaterialsForAdding from "./AllMaterialsForAdding";

const Folders = ({ filterFolders }) => {
  const [page, setPage] = useState(1);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [localFolders, setLocalFolders] = useState(filterFolders || []);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setLocalFolders(filterFolders || []);
  }, [filterFolders]);

  const refreshFolders = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/folder/folders");
      if (data.success) {
        setLocalFolders(data.folder);
      }
    } catch (error) {
      toast.error(error.message || "Failed to refresh folders");
    }
  }, []);

  const limit = 4;
  const totalPages =
    localFolders.length === 0 ? 1 : Math.ceil(localFolders.length / limit);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const start = (page - 1) * limit;
  const paged = localFolders.slice(start, start + limit);

  const folderToShow =
    localFolders.find((f) => f._id === selectedFolderId) || paged[0] || null;

  const handleDeleteFolder = async (id) => {
    try {
      const { data } = await axios.delete(`/api/folder/delete/${id}`);
      if (data.success) {
        toast.success(data.message || "Folder deleted");
        setLocalFolders((prev) => prev.filter((f) => f._id !== id));
        if (selectedFolderId === id) setSelectedFolderId(null);
      } else {
        toast.error(data.message || "Failed to delete folder");
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete folder");
    }
  };

  const handleDeleteMaterial = async (folderId, materialId) => {
    try {
      const { data } = await axios.delete(
        `/api/folder/delete/${folderId}/${materialId}`
      );
      if (data.success) {
        toast.success(data.message || "Material deleted");
        setLocalFolders((prev) =>
          prev.map((folder) =>
            folder._id === folderId
              ? {
                  ...folder,
                  materials: folder.materials.filter(
                    (m) => m._id !== materialId
                  ),
                }
              : folder
          )
        );
      } else {
        toast.error(data.message || "Failed to delete material");
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete material");
    }
  };

  return (
    <div className="flex mx-auto justify-center flex-col gap-8 w-[95%] max-w-6xl">
      {previewUrl && (
        <PdfReader url={previewUrl} onClose={() => setPreviewUrl(null)} />
      )}

      <h1 className="text-center text-xl md:text-2xl font-semibold">
        Folders: {localFolders.length}
      </h1>

      <div className="flex flex-col gap-3 bg-black/50 px-3 py-3 rounded-lg">
        <div className="flex items-center justify-between gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`p-1 rounded-full ${
              page === 1
                ? "opacity-40 cursor-not-allowed"
                : "hover:opacity-80 bg-gray-800"
            }`}
          >
            <CircleChevronLeft />
          </button>

          <div className="flex-1 flex flex-wrap justify-center gap-3">
            {paged.map((item) => (
              <div
                key={item._id}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-md text-sm sm:text-base transition-all w-full sm:w-auto sm:min-w-[180px] justify-center cursor-pointer ${
                  folderToShow && folderToShow._id === item._id
                    ? "bg-blue-700 text-white shadow-blue-500/40"
                    : "bg-gray-800 text-white/80 hover:bg-gray-700"
                }`}
                onClick={() => setSelectedFolderId(item._id)}
              >
                <Folder className="w-4 h-4" />
                <span className="truncate max-w-[140px] sm:max-w-[160px]">
                  {item.name}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFolder(item._id);
                  }}
                  className="flex items-center justify-center p-1 rounded-full hover:bg-red-700/60"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            disabled={page === totalPages || localFolders.length === 0}
            onClick={() => setPage(page + 1)}
            className={`p-1 rounded-full ${
              page === totalPages || localFolders.length === 0
                ? "opacity-40 cursor-not-allowed"
                : "hover:opacity-80 bg-gray-800"
            }`}
          >
            <CircleChevronRight />
          </button>
        </div>

        <p className="text-xs text-gray-300 text-center mt-1">
          Page {page} of {totalPages}
        </p>
      </div>

      <div className="bg-black/40 rounded-lg p-4 md:p-6 min-h-[180px]">
        {folderToShow ? (
          <>
            <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Folder className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg md:text-xl font-semibold">
                  {folderToShow.name}
                </h2>
                <div className="relative">
                  <button
                    onClick={() => setOpen(true)}
                    title="Add materials"
                    className="flex items-center px-2"
                  >
                    <CirclePlus />
                  </button>
                  {open && (
                    <AllMaterialsForAdding
                      setOpen={setOpen}
                      folderId={folderToShow._id}
                      onUpdated={refreshFolders}
                    />
                  )}
                </div>
              </div>
              <p className="text-xs md:text-sm text-gray-300">
                Materials: {folderToShow.materials?.length || 0}
              </p>
            </div>

            {folderToShow.materials && folderToShow.materials.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {folderToShow.materials.map((mat) => (
                  <div
                    key={mat._id}
                    className="flex flex-col justify-between bg-gray-800/80 rounded-xl px-3 py-3 md:px-4 md:py-4 shadow-md border border-gray-700/60"
                  >
                    <div className="flex flex-col gap-1 mb-3">
                      <span className="text-sm md:text-base font-medium text-white line-clamp-2">
                        {mat.title}
                      </span>
                      <a
                        target="__blank"
                        href={mat.link}
                        className="text-[11px] md:text-xs text-gray-300 break-all max-h-10 overflow-hidden"
                      >
                        Link
                      </a>
                    </div>

                    <div className="flex items-center justify-between mt-auto gap-2">
                      <button
                        onClick={() => setPreviewUrl(mat.link)}
                        className="flex-1 flex items-center justify-center gap-1 text-[11px] md:text-xs bg-blue-600 px-2 py-1.5 rounded-lg hover:bg-blue-700"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteMaterial(folderToShow._id, mat._id)
                        }
                        className="flex items-center justify-center gap-1 text-[11px] md:text-xs bg-red-600 px-2 py-1.5 rounded-lg hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm md:text-base text-gray-300 text-center py-6">
                No materials saved in this folder yet.
              </p>
            )}
          </>
        ) : (
          <p className="text-sm md:text-base text-gray-300 text-center py-6">
            No folders available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Folders;
