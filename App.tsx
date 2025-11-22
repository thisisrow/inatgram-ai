import React, { useEffect, useState } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { exchangeCodeForToken } from './services/instagramService';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      // 1. Check LocalStorage for existing token
      const storedToken = localStorage.getItem('ig_access_token');
      if (storedToken) {
        setToken(storedToken);
        setLoading(false);
        return;
      }

      // 2. Check URL for Authorization Code (OAuth callback)
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) {
        try {
          // Clean URL
          window.history.replaceState({}, document.title, "/");
          
          // Exchange code for token
          // WARNING: Doing this client-side involves using the App Secret in the browser.
          // This is insecure and only for the purpose of this specific demo request.
          const data = await exchangeCodeForToken(code);
          
          if (data.access_token) {
            localStorage.setItem('ig_access_token', data.access_token);
            setToken(data.access_token);
          } else {
            setAuthError("No access token received.");
          }
        } catch (err) {
          console.error("Auth Error", err);
          setAuthError("Failed to authenticate with Instagram.");
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('ig_access_token');
    setToken(null);
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-500">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
        <p>Authenticating...</p>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow text-center max-w-sm">
           <h3 className="text-red-500 font-bold text-lg mb-2">Authentication Failed</h3>
           <p className="text-gray-600 text-sm mb-4">{authError}</p>
           <button 
              onClick={() => { setAuthError(null); window.location.href='/'; }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Try Again
           </button>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Login />;
  }

  return <Dashboard token={token} onLogout={handleLogout} />;
};

export default App;
