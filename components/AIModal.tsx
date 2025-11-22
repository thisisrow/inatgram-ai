import React, { useState, useEffect } from 'react';
import { InstagramMedia, AIAnalysisResult } from '../types';
import { analyzeInstagramPost, urlToBase64 } from '../services/geminiService';
import { X, Sparkles, Loader2, Hash, AlignLeft, Wand2 } from 'lucide-react';

interface AIModalProps {
  media: InstagramMedia | null;
  onClose: () => void;
}

export const AIModal: React.FC<AIModalProps> = ({ media, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);

  useEffect(() => {
    if (media) {
      handleAnalyze();
    } else {
      setResult(null);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media]);

  const handleAnalyze = async () => {
    if (!media) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Determine the URL to use (prefer thumbnail for videos)
      const targetUrl = media.media_type === 'VIDEO' && media.thumbnail_url 
        ? media.thumbnail_url 
        : media.media_url;

      // NOTE: In production, this requires a backend proxy because Instagram images 
      // are not always CORS-friendly for fetch() in the browser.
      const base64 = await urlToBase64(targetUrl);
      const data = await analyzeInstagramPost(base64, media.caption);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze image. Ensure API Key is set and CORS is handled.");
    } finally {
      setLoading(false);
    }
  };

  if (!media) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200">
        
        {/* Image Section */}
        <div className="w-full md:w-1/2 bg-gray-900 flex items-center justify-center relative">
          <img 
            src={media.media_type === 'VIDEO' ? (media.thumbnail_url || media.media_url) : media.media_url} 
            alt="Original Post" 
            className="max-h-[50vh] md:max-h-full w-full object-contain"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full md:hidden transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 flex flex-col h-full bg-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors hidden md:block"
          >
            <X size={24} />
          </button>

          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Sparkles className="text-purple-600" />
              AI Insights
            </h2>
            <p className="text-sm text-gray-500 mt-1">Powered by Gemini 2.5 Flash</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-48 space-y-4 text-purple-600">
                <Loader2 className="animate-spin w-10 h-10" />
                <p className="text-sm font-medium animate-pulse">Analyzing visual aesthetics...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
                <p className="font-semibold">Analysis Failed</p>
                <p className="text-sm mt-1">{error}</p>
                <button 
                  onClick={handleAnalyze}
                  className="mt-3 text-sm font-medium underline hover:text-red-800"
                >
                  Try Again
                </button>
              </div>
            ) : result ? (
              <>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-purple-700 font-semibold text-sm uppercase tracking-wider">
                    <Wand2 size={16} />
                    The Vibe
                  </div>
                  <p className="text-gray-800 text-lg font-medium leading-relaxed bg-purple-50 p-4 rounded-xl border border-purple-100">
                    "{result.vibe}"
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm uppercase tracking-wider">
                    <AlignLeft size={16} />
                    Suggested Caption
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-gray-700">
                    {result.caption}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-pink-700 font-semibold text-sm uppercase tracking-wider">
                    <Hash size={16} />
                    Trending Hashtags
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.hashtags.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-gradient-to-r from-pink-50 to-orange-50 border border-pink-100 text-pink-700 rounded-full text-sm font-medium hover:scale-105 transition-transform cursor-default"
                      >
                        {tag.startsWith('#') ? tag : `#${tag}`}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>
          
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
             <button 
                onClick={handleAnalyze}
                disabled={loading}
                className="text-sm text-gray-500 hover:text-purple-600 font-medium transition-colors"
             >
                Regenerate Analysis
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
