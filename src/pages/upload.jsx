import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaFilePdf, FaUpload, FaChartBar, FaCommentDots, FaSpinner, FaCog, FaRobot, FaTrash, FaSync } from "react-icons/fa";
import axios from "axios";

const UploadPage = () => {  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [processingStep, setProcessingStep] = useState("");
  const [error, setError] = useState("");
  const [deletingFile, setDeletingFile] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  // Load files from localStorage on component mount and validate with backend
  useEffect(() => {
    loadAndValidateFiles();
  }, []);
  // Fetch files from backend and validate with localStorage
  const loadAndValidateFiles = async () => {
    setRefreshing(true);
    try {
      // Get files from backend
      const response = await axios.get("http://localhost:8000/api/files");
      const backendFiles = response.data.files || [];
      
      // Transform backend data to match frontend format
      const validatedFiles = backendFiles.map(file => ({
        file_id: file.doc_id,
        filename: file.filename,
        unique_key: `${file.filename.replace(/\.[^/.]+$/, "")}_${new Date(file.upload_date).getTime()}`,
        created_at: file.upload_date
      }));
      
      setFiles(validatedFiles);
      
      // Update localStorage with validated files
      if (validatedFiles.length > 0) {
        localStorage.setItem('uploadedFiles', JSON.stringify(validatedFiles));
      } else {
        localStorage.removeItem('uploadedFiles');
      }
    } catch (err) {
      console.warn("Could not fetch files from backend:", err);
      // Fallback to localStorage but clear it since backend is not responding
      localStorage.removeItem('uploadedFiles');
      setFiles([]);
    } finally {
      setRefreshing(false);
    }
  };

  // Save files to localStorage whenever files change
  useEffect(() => {
    if (files.length > 0) {
      localStorage.setItem('uploadedFiles', JSON.stringify(files));
    }  }, [files]);

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setUploading(true);
    setError("");
    setProcessingStep("Uploading file...");

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);
      
      // Simulate processing steps for better UX
      setTimeout(() => setProcessingStep("Extracting text..."), 1000);
      setTimeout(() => setProcessingStep("Generating summary..."), 3000);
      setTimeout(() => setProcessingStep("Creating Q&A index..."), 8000);
      setTimeout(() => setProcessingStep("Finalizing..."), 12000);

      const response = await axios.post(
        "http://localhost:8000/api/upload",
        formData,
        {
          headers: {
            "accept": "application/json",
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
          timeout: 300000  // 5 minutes timeout for file processing
        }
      );      const newFile = {
        file_id: response.data.doc_id,
        filename: uploadedFile.name,
        unique_key: `${uploadedFile.name.replace(/\.[^/.]+$/, "")}_${Date.now()}`,
        created_at: new Date().toISOString()
      };      setFiles(prev => [...prev, newFile]);
      setProcessingStep("✅ Processing complete!");
      
      // Refresh the files list to ensure consistency
      setTimeout(() => {
        loadAndValidateFiles();
        setProcessingStep("");
      }, 2000);
      
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
  const handleAnalyze = (fileId) => navigate(`/analyze/${fileId}`);
  const handleQA = (fileId) => navigate(`/qa/${fileId}`);

  const handleDelete = async (fileId, filename) => {
    if (!window.confirm(`Are you sure you want to delete "${filename}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingFile(fileId);
    setError("");

    try {
      await axios.delete(`http://localhost:8000/api/delete/${fileId}`);
      
      // Remove from state
      setFiles(prev => prev.filter(file => file.file_id !== fileId));
      
      // Update localStorage
      const updatedFiles = files.filter(file => file.file_id !== fileId);
      if (updatedFiles.length > 0) {
        localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
      } else {
        localStorage.removeItem('uploadedFiles');
      }
      
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 
                          err.message || 
                          "Failed to delete file. Please try again.";
      setError(errorMessage);
      console.error("Delete error:", err);
    } finally {
      setDeletingFile(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">AI Research Copilot</h1>        {/* Upload Section */}
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
                <p className="text-sm text-gray-400">PDF only • Max 10MB • Processing includes summary & Q&A setup</p>
              </div>
            </label>
          </div>          {error && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-500 rounded-md">
              <p className="text-red-400 text-center">{error}</p>
            </div>
          )}
          
          {uploading && (
            <div className="mt-6 p-4 bg-gray-700 rounded-md">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <FaSpinner className="animate-spin text-blue-400 text-xl" />
                <span className="text-blue-400 font-medium">Processing Document</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  {processingStep.includes("Uploading") ? (
                    <FaSpinner className="animate-spin text-blue-400" />
                  ) : processingStep.includes("✅") ? (
                    <span className="text-green-400">✅</span>
                  ) : (
                    <span className="text-gray-400">⏳</span>
                  )}
                  <span className="text-sm">Uploading file...</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  {processingStep.includes("Extracting") ? (
                    <FaCog className="animate-spin text-yellow-400" />
                  ) : processingStep.includes("✅") ? (
                    <span className="text-green-400">✅</span>
                  ) : (
                    <span className="text-gray-400">⏳</span>
                  )}
                  <span className="text-sm">Extracting text from PDF...</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  {processingStep.includes("Generating") ? (
                    <FaRobot className="animate-pulse text-purple-400" />
                  ) : processingStep.includes("✅") ? (
                    <span className="text-green-400">✅</span>
                  ) : (
                    <span className="text-gray-400">⏳</span>
                  )}
                  <span className="text-sm">Generating AI summary...</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  {processingStep.includes("Creating") ? (
                    <FaSpinner className="animate-spin text-green-400" />
                  ) : processingStep.includes("✅") ? (
                    <span className="text-green-400">✅</span>
                  ) : (
                    <span className="text-gray-400">⏳</span>
                  )}
                  <span className="text-sm">Creating Q&A search index...</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  {processingStep.includes("Finalizing") ? (
                    <FaCog className="animate-spin text-blue-400" />
                  ) : processingStep.includes("✅") ? (
                    <span className="text-green-400">✅</span>
                  ) : (
                    <span className="text-gray-400">⏳</span>
                  )}
                  <span className="text-sm">Finalizing setup...</span>
                </div>
              </div>
              
              {processingStep.includes("✅") && (
                <div className="mt-3 text-center text-green-400 font-medium">
                  Processing Complete! 🎉
                </div>
              )}
            </div>
          )}
        </div>        {/* Uploaded Papers List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Uploaded Research Papers</h2>
            <button
              onClick={loadAndValidateFiles}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md flex items-center space-x-2 transition-colors disabled:opacity-50"
              disabled={refreshing}
            >
              <FaSync className={refreshing ? "animate-spin" : ""} />
              <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
            </button>
          </div>

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
                  </div>                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAnalyze(file.file_id)}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
                      disabled={deletingFile === file.file_id}
                    >
                      <FaChartBar />
                      <span>Analyze & Translate</span>
                    </button>
                    <button
                      onClick={() => handleQA(file.file_id)}
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
                      disabled={deletingFile === file.file_id}
                    >
                      <FaCommentDots />
                      <span>Q/A</span>
                    </button>
                    <button
                      onClick={() => handleDelete(file.file_id, file.filename)}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={deletingFile === file.file_id}
                    >
                      {deletingFile === file.file_id ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaTrash />
                      )}
                      <span>{deletingFile === file.file_id ? "Deleting..." : "Delete"}</span>
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