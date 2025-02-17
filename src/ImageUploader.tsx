import { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import "./css/ImageUploader.css";

const ImageUploader: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setImagePreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadedImageUrl(response.data.imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] },
    maxFiles: 1,
  });

  return (
    <div className="container">
      <div {...getRootProps()} className="dropbox">
        <input {...getInputProps()} />
        <p>Drag & drop an image here, or click to upload</p>
        <p className="file-types">Only .png, .jpg, and .jpeg files are allowed</p>
      </div>

      {imagePreview && (
        <div className="image-preview">
          <p className="preview-text">Image Preview:</p>
          <img src={imagePreview} alt="Preview" className="uploaded-image" />
        </div>
      )}

      {uploadedImageUrl && (
        <div className="image-preview">
          <p className="preview-text">Uploaded Image URL:</p>
          <a href={uploadedImageUrl} target="_blank" rel="noopener noreferrer">
            {uploadedImageUrl}
          </a>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
