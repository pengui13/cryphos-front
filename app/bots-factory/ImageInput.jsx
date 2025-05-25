import { useState, useRef } from "react";
const ImageInput = ({ coverImage, setCoverImage }) => {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(coverImage || null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setCoverImage(file);

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="border-2 border-dashed border-gr rounded-xl h-60 flex items-center justify-center cursor-pointer overflow-hidden relative"
      onClick={handleUploadClick}
    >
      {previewUrl ? (
        <div className="w-full h-full relative">
          <img
            src={previewUrl}
            alt="Bot cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <span className="text-white font-medium">{t("changeImage")}</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p>{"upload"}</p>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageInput;
