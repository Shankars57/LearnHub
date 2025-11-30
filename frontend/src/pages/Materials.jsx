import React, { useContext, useState, useRef, useEffect } from "react";
import {
  BookUser,
  Download,
  FileChartLine,
  Search,
  Star,
  Eye,
  FileArchive,
  FileChartColumn,
  Calendar,
  Bookmark,
  Folder,
  X,
  RefreshCcw,
  RefreshCcwDot,
} from "lucide-react";
import moment from "moment";
import { motion } from "framer-motion";
import Uploader from "../components/Uploader";
import { LearnContext } from "../../context/LearnContextProvider";
import { TypeAnimation } from "react-type-animation";
import PdfReader from "../components/PdfReader";
import CreateFolder from "../components/FoldersComponents/CreateFolder";
import axios from "axios";
import Folders from "../components/FoldersComponents/Folders";
import { toast } from "react-hot-toast";
import useMaterialStore from "../../store/useMaterialStore";

const bookType = ["all", "notes", "pdf", "docx", "books", "jpg"];

const Materials = () => {
  const [type, setType] = useState("all");
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isOpenFolder, setIsOpenFolder] = useState(false);
  const { materialsData, userData, getAllMaterials, refresh } =
    useContext(LearnContext);
  const moveUpRef = useRef(null);
  const [isFolderUploaded, setIsFolderUploaded] = useState(false);
  const [folders, setFolders] = useState([]);
  const [save, setSave] = useState(false);
  const [index, setIndex] = useState(0);
  const [update, setUpdate] = useState(false);

  const { options, setOptions } = useMaterialStore();

  const getFolders = async () => {
    try {
      const { data } = await axios.get(`/api/folder/folders`);
      if (data.success) setFolders(data.folder);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getFolders();
  }, [isFolderUploaded, update]);

  const addMaterialToFolder = async (folderId, material) => {
    try {
      const { data } = await axios.post(`/api/folder/save/${folderId}`, {
        title: material.title,
        link: material.url,
      });
      if (data.success) {
        toast.success(data.message);
        setSave(false);
        setUpdate((prev) => !prev);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const filteredMaterials = materialsData.filter((item) => {
    const matchesType =
      type === "all" || item.fileType.toLowerCase() === type.toLowerCase();
    const matchesSearch = item.title
      .toLowerCase()
      .includes(input.toLowerCase());
    return matchesType && matchesSearch;
  });

  const filterFolders = folders.filter(
    (item) => item?.user?.email === userData?.email
  );
  return (
    <div className="relative min-h-screen w-full flex flex-col gap-8 bg-gray-900 text-white px-4 py-8">
      {isOpen && <Uploader isOpen={isOpen} setIsOpen={setIsOpen} />}
      {previewUrl && (
        <PdfReader url={previewUrl} onClose={() => setPreviewUrl(null)} />
      )}
      {isOpenFolder && (
        <CreateFolder
          setIsOpenFolder={setIsOpenFolder}
          setIsFolderUploaded={setIsFolderUploaded}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center gap-4"
      >
        <h1 className="flex items-center gap-2 text-3xl sm:text-4xl font-bold text-blue-400">
          <BookUser size={35} className="text-blue-300" />
          Study Materials
        </h1>
        <p className="text-base sm:text-lg text-gray-200 max-w-[600px]">
          Download and access high-quality study materials, notes, and
          resources.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="flex flex-col sm:flex-row justify-between items-center w-full sm:w-[85%] md:w-[75%] mx-auto gap-4 sm:gap-6"
      >
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex items-center bg-gray-800/50 border border-gray-600 rounded-md px-3 py-2 w-full sm:w-[50%]"
        >
          <Search className="w-5 h-5 text-gray-300" />
          <input
            type="text"
            onChange={(e) => setInput(e.target.value)}
            value={input}
            placeholder="Search materials, books or topics..."
            className="bg-transparent text-white outline-none w-full px-2 text-sm sm:text-base placeholder-gray-400"
          />
        </form>

        <div className="flex flex-wrap justify-center gap-3">
          {bookType.map((item, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setType(item)}
              className={`px-3 py-1.5 text-sm sm:text-base rounded-md font-medium transition-all duration-200 ${
                type === item
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-gray-800/60 text-gray-300 hover:bg-blue-500/70"
              }`}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </motion.button>
          ))}

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1.5 text-sm sm:text-base rounded-md bg-blue-700 hover:bg-blue-600 shadow-md shadow-blue-400/20"
            onClick={() => setIsOpen(true)}
          >
            Upload
          </motion.button>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1.5 text-sm sm:text-base rounded-md bg-purple-900 hover:bg-blue-600 shadow-md shadow-purple-400/20"
              onClick={() => setIsOpenFolder(true)}
            >
              Create Folder
            </motion.button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-center"
      >
        <div className="flex gap-5 bg-black/20 px-4 py-2 rounded-lg">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-2 rounded-xl text-sm font-medium transition ${
              options === "mat"
                ? "bg-blue-600/90 text-white shadow-lg shadow-blue-500/30"
                : "text-white/70 hover:text-white"
            }`}
            onClick={() => setOptions("mat")}
          >
            Materials
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-2 rounded-xl text-sm font-medium transition ${
              options !== "mat"
                ? "bg-blue-600/90 text-white shadow-lg shadow-blue-500/30"
                : "text-white/70 hover:text-white"
            }`}
            onClick={() => setOptions("fold")}
          >
            Folders
          </motion.button>
        </div>
      </motion.div>

      <div className="flex p-5 w-[90%] mx-auto">
        <button
          onClick={() => getAllMaterials()}
          className="px-2
         py-1 rounded-lg flex items-center justify-center
         gap-1 bg-green-700"
        >
          Refresh{" "}
          <span className={`w-5 h-5 ${refresh && "animate-spin"}`}>
            <RefreshCcw size={18} />
          </span>
        
        </button>
      </div>
      {options === "mat" ? (
        <div className="w-[90%] mx-auto mt-6 max-h-[450px] overflow-y-auto py-5 px-2 custom-scrollbar pr-1">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {filteredMaterials.map((item, idx) => {
              let FileIcon, iconColor;

              switch (item.fileType.toLowerCase()) {
                case "pdf":
                  FileIcon = FileChartLine;
                  iconColor = "bg-red-600";
                  break;
                case "docx":
                case "txt":
                  FileIcon = FileArchive;
                  iconColor = "bg-green-600";
                  break;
                case "jpg":
                case "png":
                  FileIcon = FileChartColumn;
                  iconColor = "bg-yellow-500";
                  break;
                default:
                  FileIcon = FileChartLine;
                  iconColor = "bg-blue-600";
              }

              const isNew = idx < 2;

              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="relative w-full bg-gray-800/60 border border-gray-700 rounded-xl flex flex-col gap-3 px-4 py-4 text-gray-300 hover:shadow-md hover:shadow-gray-800/40 transition-all"
                >
                  {isNew && (
                    <span className="absolute top-3 right-3 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold shadow-md">
                      New
                    </span>
                  )}

                  <div className="w-full flex items-center justify-between">
                    <p className="flex items-center gap-2 text-sm sm:text-base">
                      <FileIcon
                        size={20}
                        className={`text-white w-8 h-8 rounded-lg p-1 ${iconColor}`}
                      />
                      <span className="bg-white/30 px-2 rounded-md">
                        {item.fileType.toUpperCase()}
                      </span>
                    </p>

                    {item?.featured && (
                      <p className="flex items-center bg-orange-600 px-2 rounded-full text-sm text-white gap-1">
                        <Star size={15} className="text-yellow-100" />
                        <span>Feature</span>
                      </p>
                    )}
                  </div>

                  <div className="absolute right-5 top-10">
                    <div title="save" className="relative">
                      {!save && (
                        <button
                          onClick={() => {
                            setIndex(idx);
                            setSave(true);
                          }}
                        >
                          <Bookmark />
                        </button>
                      )}
                      {save && index === idx && (
                        <button
                          onClick={() => {
                            setSave(false);
                          }}
                        >
                          <X />
                        </button>
                      )}

                      {save && index === idx && (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="flex absolute right-1 flex-col max-h-40 overflow-y-auto custom-scrollbar items-start bg-black/80 gap-2 z-[9999] px-2 py-5"
                        >
                          {filterFolders.map((folderItem, folderIdx) => (
                            <button
                              className="flex items-center gap-1 w-full hover:bg-blue-900 px-2 py-1 rounded-lg"
                              onClick={() =>
                                addMaterialToFolder(folderItem._id, item)
                              }
                              key={folderIdx}
                            >
                              <Folder />
                              {folderItem.name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <h1 className="text-xl capitalize text-white font-semibold hover:text-blue-400 transition">
                      {item.title}
                    </h1>
                    <p className="text-blue-400 text-sm">{item.subject}</p>
                    <p className="text-sm text-gray-300">{item.desc}</p>
                    <p className="flex text-white text-gray-500 text-sm items-center gap-2">
                      <Calendar size={15} />
                      Upload: {moment(item.updatedAt).fromNow()}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-2 gap-2 flex-wrap">
                    <button
                      onClick={() => setPreviewUrl(item.url)}
                      className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-md transition"
                    >
                      <Eye size={16} />
                      Preview
                    </button>

                    <a
                      href={item.url}
                      target="_blank"
                      download={`${item.title}.${item.fileType}`}
                      className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-md transition"
                    >
                      <Download size={16} />
                      Download
                    </a>

                    <p className="text-xs flex items-center gap-1 text-yellow-400 font-semibold">
                      <Star size={14} /> 4.9
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      ) : (
        <Folders filterFolders={filterFolders} />
      )}

      {filteredMaterials.length === 0 && type !== "all" && options === "mat" ? (
        <h1 className="text-2xl text-center text-red-500">
          <TypeAnimation
            sequence={[
              "Not Found :(",
              1500,
              "Please Try other filter options",
              1500,
            ]}
            wrapper="span"
            speed={60}
            repeat={Infinity}
            style={{ display: "inline-block", whiteSpace: "nowrap" }}
          />
        </h1>
      ) : (
        type === "all" &&
        options === "mat" && (
          <h1 className="text-center">
            Please upload new Materials by using the{" "}
            <b className="text-blue-600 hover:underline">Upload button.</b>
          </h1>
        )
      )}
    </div>
  );
};

export default Materials;
