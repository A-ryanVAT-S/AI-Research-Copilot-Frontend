import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSpinner, FaArrowLeft, FaGlobe } from "react-icons/fa";

const SummarizedPage = () => {
  const { id: docId } = useParams();
  const navigate = useNavigate();
  const [summary, setSummary] = useState("");
  const [translatedSummary, setTranslatedSummary] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [fileInfo, setFileInfo] = useState(null);
  const [loading, setLoading] = useState({ 
    initial: true, 
    summary: false,
    translation: false
  });
  const [error, setError] = useState("");
  const languages = [
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "ru", name: "Russian" },
    { code: "ja", name: "Japanese" }
  ];
  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Check if file info exists in localStorage first
        const savedFiles = localStorage.getItem('uploadedFiles');
        if (savedFiles) {
          const files = JSON.parse(savedFiles);
          const currentFile = files.find(f => f.file_id === docId);
          if (currentFile) {
            setFileInfo({
              name: currentFile.filename,
              uploaded: new Date(currentFile.created_at).toLocaleDateString()
            });
          }
        }

        // Load summary immediately since it's processed during upload
        handleSummarize();
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load document");
      } finally {
        setLoading(prev => ({ ...prev, initial: false }));
      }
    };
    loadData();
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

  const handleTranslate = async (targetLang) => {
    if (!targetLang) return;
    
    setError("");
    setLoading(prev => ({ ...prev, translation: true }));
    setSelectedLanguage(targetLang);
    
    try {
      const { data } = await axios.post(
        `http://localhost:8000/api/translate/${docId}`,
        { target_lang: targetLang }
      );
      setTranslatedSummary(data.translated_summary);
    } catch (err) {
      setError(err.response?.data?.detail || "Translation failed");
    } finally {
      setLoading(prev => ({ ...prev, translation: false }));
    }
  };

  const resetTranslation = () => {
    setTranslatedSummary("");
    setSelectedLanguage("");
  };
  if (loading.initial) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8">
      <div className="max-w-4xl w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Document Analysis</h1>          <button
            onClick={() => navigate(-1)}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md flex items-center gap-2 border border-gray-600"
          >
            <FaArrowLeft /> Back to Files
          </button>
        </div>

        {error && (
          <div className="bg-red-800/30 p-4 rounded-lg mb-6 border border-red-400">
            <p className="text-red-400">{error}</p>
          </div>
        )}        {fileInfo && (
          <div className="bg-gray-900 p-4 rounded-lg mb-6 grid grid-cols-2 gap-4 border border-gray-700">
            <div>
              <p className="text-gray-400 text-sm">Filename</p>
              <p className="truncate">{fileInfo.name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Upload Date</p>
              <p>{fileInfo.uploaded}</p>
            </div>
          </div>
        )}        <div className="bg-gray-900 p-6 rounded-lg shadow-xl border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Document Summary</h2>
            {summary && !translatedSummary && (
              <div className="flex items-center gap-3">
                <FaGlobe className="text-blue-400" />                <select
                  onChange={(e) => handleTranslate(e.target.value)}
                  value=""
                  className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm border border-gray-600"
                  disabled={loading.translation}
                >
                  <option value="">Translate to...</option>
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {translatedSummary && (              <button
                onClick={resetTranslation}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm border border-gray-600"
              >
                Show Original
              </button>
            )}
          </div>

          <div className="h-96 overflow-y-auto bg-gray-900 p-4 rounded-lg mb-6 relative border border-gray-700">
            {loading.summary ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <FaSpinner className="animate-spin text-2xl text-blue-500" />
              </div>
            ) : loading.translation ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <FaSpinner className="animate-spin text-2xl text-blue-500 mx-auto mb-2" />
                  <p className="text-gray-400">Translating to {languages.find(l => l.code === selectedLanguage)?.name}...</p>
                </div>
              </div>
            ) : translatedSummary ? (
              <div className="prose prose-invert max-w-none">
                <div className="bg-blue-900/30 p-3 rounded-lg mb-4 border border-blue-400">
                  <p className="text-blue-300 text-sm">
                    Translated to {languages.find(l => l.code === selectedLanguage)?.name}
                  </p>
                </div>
                {translatedSummary.split('\n').map((line, index) => (
                  <p key={index} className="text-gray-300 mb-4">{line}</p>
                ))}
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
                  Loading document analysis...
                </p>
              </div>
            )}
          </div>

          {!summary && !loading.summary && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default SummarizedPage;