"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

interface FileDropzoneProps {
  onFilesDrop: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  id?: string;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFilesDrop,
  accept = "image/*",
  multiple = true,
  label = "Klik untuk upload atau drag & drop",
  id = "file-uploader",
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesDrop(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesDrop(e.target.files);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-green-500 transition-colors ${
        isDragging ? "border-green-500 bg-green-50" : "border-gray-300"
      }`}
    >
      <input
        type="file"
        id={id}
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />
      <label
        htmlFor={id}
        className="cursor-pointer flex flex-col items-center gap-2"
      >
        <Upload size={24} className="text-gray-400" />
        <span className="text-sm text-gray-600">{label}</span>
      </label>
    </div>
  );
};


export default FileDropzone;
