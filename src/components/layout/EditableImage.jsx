import React from "react";
import { FiUpload } from "react-icons/fi";
import Image from "next/image";
import toast from "react-hot-toast";

const EditableImage = ({ link, setLink }) => {
  const handleFileChange = async (e) => {
    const files = e.target.files;

    if (files?.length === 1) {
      const data = new FormData();
      data.set("file", files[0]);
      data.set("folder", "food-ordering-app");

      const uploadPromise = new Promise(async (resolve, reject) => {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: data,
        });

        if (response.ok) {
          const { link } = await response.json(); 
          setLink(link); 
          resolve();
        } else {
          reject();
        }
      });

      await toast.promise(uploadPromise, {
        loading: "Uploading...",
        success: "Upload complete",
        error: "Error in uploading",
      });
    }
  };

  return (
    <div className="relative w-full h-full">
      {link ? (
        <Image
          className="object-cover rounded-full"
          src={link || "/default-image.jpg"}
          layout="fill"
          alt="Profile Image"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500 rounded-full">
          <span>No image</span>
        </div>
      )}
      <label
        htmlFor="file-input"
        className="absolute bottom-2 right-2 bg-gray-100 p-2 rounded-full shadow-md cursor-pointer opacity-0 transition-opacity duration-300 hover:opacity-100"
      >
        <FiUpload className="text-xl text-gray-600" />
      </label>
      <input
        id="file-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default EditableImage;
