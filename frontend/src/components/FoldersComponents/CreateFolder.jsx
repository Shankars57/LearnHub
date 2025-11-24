import React, { useState } from "react";
import { CirclePlus, Pin } from "lucide-react";
import { useContext } from "react";
import axios from "axios";
import { LearnContext } from "../../../context/LearnContextProvider";
import toast from "react-hot-toast";
import { useRef } from "react";
import { useEffect } from "react";
const CreateFolder = ({ setIsOpenFolder, setIsFolderUploaded }) => {
  const { token } = useContext(LearnContext);
  const inputRef = useRef();
  const [disable, setDisable] = useState(false);
  const [folderData, setFolderData] = useState({
    name: "",
    type: "public",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFolderData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setDisable(true);
    try {
      const { data } = await axios.post(
        "/api/folder/create",
        { name: folderData.name, type: folderData.type },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        setIsOpenFolder(false);
        setIsFolderUploaded((prev) => !prev);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDisable(false);
    }
  };

  return (
    <div
      className="absolute
     h-screen inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <form
        className="border 
        flex items-center flex-col gap-2
         px-4 py-2  text-white rounded-lg 
         bg-purple-800/10"
        onSubmit={onSubmit}
      >
        <div className="flex justify-between w-full">
          <h1 className="bg-gradient-to-r from-red-500 via-purple-600 to-white bg-clip-text text-transparent font-medium text-xl ">
            Create a Folder
          </h1>
          <button type="button" onClick={() => setIsOpenFolder(false)}>
            X
          </button>
        </div>
        <div>
          <input
            ref={inputRef}
            name="name"
            value={folderData.name}
            onChange={handleChange}
            type="text"
            placeholder="Enter folder name"
            className="
            border border-gray-500/80
             outline-none
             focus:border-none
            focus:ring-2 focus:ring-cyan-500 px-2 py-1 rounded-lg "
            required
          />
        </div>
        <div>
          <select
            onChange={handleChange}
            name="type"
            className="outline-none px-2 py-1 rounded-lg bg-gray-600"
          >
            <option value="public">public</option>
            <option value="private">private</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={disable}
          className={`flex gap-2 px-2 py-1 bg-blue-800 text-white rounded-lg ${
             disable && "opacity-60"
          }`}
        >
          <CirclePlus /> { !disable ? "create" : "Creating"}
        </button>
      </form>
    </div>
  );
};

export default CreateFolder;
