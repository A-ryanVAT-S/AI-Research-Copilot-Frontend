import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSpinner, FaArrowLeft } from "react-icons/fa";

const SummarizedPage = () => {
  const { id: docId } = useParams();
  const navigate = useNavigate();
  const [summary, setSummary] = useState("");
  const [fileInfo, setFileInfo] = useState(null);
  const [loading, setLoading] = useState({ 
    initial: true, 
    summary: false 
  });
  const [error, setError] = useState("");

  // Load initial data
  useEffect(() => {
    const loadFileInfo = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/api/file-info/${docId}`
        );
        setFileInfo({
          name: data.filename,
          uploaded: new Date(data.upload_date).toLocaleDateString()
        });
        setLoading(prev => ({ ...prev, initial: false }));
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load document");
        setLoading(prev => ({ ...prev, initial: false }));
      }
    };
    loadFileInfo();
  }, [docId]);

  const handleSummarize = async () => {
    setError("");
    setLoading(prev => ({ ...prev, summary: true }));
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/analyze/${docId}`
      );
      setSummary(data.summary);
    } catch (err) {
      setError(err.response?.data?.detail || "Analysis failed");
    } finally {
      setLoading(prev => ({ ...prev, summary: false }));
    }
  };

  if (loading.initial) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8">
      <div className="max-w-4xl w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Document Analysis</h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md flex items-center gap-2"
          >
            <FaArrowLeft /> Back to Files
          </button>
        </div>

        {error && (
          <div className="bg-red-800/30 p-4 rounded-lg mb-6 border border-red-400">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {fileInfo && (
          <div className="bg-gray-800 p-4 rounded-lg mb-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Filename</p>
              <p className="truncate">{fileInfo.name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Upload Date</p>
              <p>{fileInfo.uploaded}</p>
            </div>
          </div>
        )}

        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
          <div className="h-96 overflow-y-auto bg-gray-900 p-4 rounded-lg mb-6 relative">
            {loading.summary ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <FaSpinner className="animate-spin text-2xl text-blue-500" />
              </div>
            ) : summary ? (
              <div className="prose prose-invert max-w-none">
                {summary.split('\n').map((line, index) => (
                  <p key={index} className="text-gray-300 mb-4">{line}</p>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500 text-center">
                  Click below to generate analysis
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSummarize}
              disabled={loading.summary}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading.summary ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Generate Full Analysis"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummarizedPage;