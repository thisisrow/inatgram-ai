import React from 'react';
import { Instagram, ArrowRight } from 'lucide-react';
import { getInstagramAuthUrl } from '../services/instagramService';

export const Login: React.FC = () => {
  const handleLogin = () => {
    window.location.href = getInstagramAuthUrl();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-white/50">
        <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
          <Instagram className="text-white w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SocialAI</h1>
        <p className="text-gray-600 mb-8">
          Connect your Instagram Business account to view insights and supercharge your content with Gemini AI.
        </p>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Instagram className="w-5 h-5" />
          Log in with Instagram
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
        
        <p className="mt-6 text-xs text-gray-500">
          Uses Instagram Basic Display & Graph API. 
          <br />
          Ensure your account is added to the Sandbox testers list.
        </p>
      </div>
    </div>
  );
};
