import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFilePdf, FaUpload, FaChartBar, FaCommentDots, FaGlobe } from "react-icons/fa";
import axios from "axios";

const UploadPage = () => {
  //console.log(fetch("http://localhost:8000/api/upload", {method: "POST"}));
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAnalyze = (fileId) => navigate(`/analyze/${fileId}`);
  const handleQA = (fileId) => navigate(`/qa/${fileId}`);
  const handleTranslate = (fileId) => navigate(`/translate/${fileId}`);

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);

      const response = await axios.post(
        "http://localhost:8000/api/upload",
        formData,
        {
          headers: {
            "accept": "application/json",
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,  // Add this line
          timeout: 3000
        }
      );

      setFiles(prev => [...prev, {
        file_id: response.data.doc_id,
        filename: uploadedFile.name,
        created_at: new Date().toISOString()
      }]);
      
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 
                          err.message || 
                          "Upload failed. Please try again.";
      setError(errorMessage);
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">AI Research Copilot</h1>

        {/* Upload Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-xl">
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              id="fileInput"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <label
              htmlFor="fileInput"
              className={`cursor-pointer flex flex-col items-center justify-center space-y-4 ${
                uploading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"
              }`}
            >
              <FaUpload className="text-4xl text-blue-400" />
              <div>
                <p className="text-lg font-semibold">Click to upload a research paper</p>
                <p className="text-sm text-gray-400">PDF only • Max 10MB</p>
              </div>
            </label>
          </div>

          {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
          {uploading && <p className="text-gray-400 mt-4 text-center">Uploading file...</p>}
        </div>

        {/* Uploaded Papers List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Uploaded Research Papers</h2>

          {files.length === 0 ? (
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <p className="text-gray-400">No research papers uploaded yet</p>
            </div>
          ) : (
            files.map((file) => (
              <div key={file.file_id} className="bg-gray-800 rounded-lg p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <FaFilePdf className="text-red-400 text-2xl" />
                    <div>
                      <h3 className="font-semibold">{file.filename}</h3>
                      <p className="text-sm text-gray-400">
                        Uploaded: {new Date(file.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAnalyze(file.file_id)}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md flex items-center space-x-2"
                    >
                      <FaChartBar />
                      <span>Analyze</span>
                    </button>
                    <button
                      onClick={() => handleQA(file.file_id)}
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md flex items-center space-x-2"
                    >
                      <FaCommentDots />
                      <span>Q/A</span>
                    </button>
                    <button
                      onClick={() => handleTranslate(file.file_id)}
                      className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md flex items-center space-x-2"
                    >
                      <FaGlobe />
                      <span>Translate</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;