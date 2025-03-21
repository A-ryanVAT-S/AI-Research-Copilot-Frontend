import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSpinner, FaFileDownload, FaArrowLeft } from "react-icons/fa";

const TranslatePage = () => {
  const { id: docId } = useParams();
  const navigate = useNavigate();
  const [toLang, setToLang] = useState("es");
  const [isTranslating, setIsTranslating] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFileInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/file-info/${docId}`);
        setFileName(response.data.filename);
      } catch (err) {
        setError("Failed to load document info");
      }
    };
    fetchFileInfo();
  }, [docId]);

  const handleTranslate = async () => {
    setIsTranslating(true);
    setError("");
  
    try {
      const response = await axios.post(
        `http://localhost:8000/api/translate/${docId}`,
        { target_lang: toLang },
        { 
          responseType: "blob",
          validateStatus: (status) => status < 500 // Handle 400 errors normally
        }
      );
  
      // Handle success case
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `translated_${fileName}_${toLang}.txt`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
    } catch (err) {
      // Handle specific error cases
      if (err.response?.status === 400) {
        setError(`Invalid request: ${err.response.data.detail}`);
      } else if (err.response?.status === 500) {
        setError("Translation service unavailable. Please try again later.");
      } else {
        setError("Translation failed. Please check your connection.");
      }
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
      <div className="max-w-3xl w-full">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaArrowLeft />
            Back
          </button>
          <h1 className="text-2xl font-bold">Document Translation</h1>
          <div className="w-24"></div>
        </div>

        {fileName && (
          <div className="bg-gray-800 p-3 rounded-lg mb-4">
            <h2 className="text-lg font-semibold truncate">
              📄 {fileName}
            </h2>
          </div>
        )}

        {error && (
          <div className="bg-red-800/30 p-3 rounded-lg mb-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg shadow-xl p-6">
          <div className="mb-6">
            <label className="block text-lg mb-3 font-medium">
              Select Target Language:
            </label>
            <select
              value={toLang}
              onChange={(e) => setToLang(e.target.value)}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg w-full"
              disabled={isTranslating}
            >
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="pt">Portuguese</option>
              <option value="zh">Chinese</option>
            </select>
          </div>

          <div className="flex gap-4 justify-end">
            <button
              onClick={handleTranslate}
              disabled={isTranslating}
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              {isTranslating ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  <FaFileDownload />
                  Translate & Download
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslatePage;
