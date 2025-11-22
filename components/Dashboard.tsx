import React, { useEffect, useState } from 'react';
import { InstagramUser, InstagramMedia } from '../types';
import { fetchUserMedia, fetchUserProfile } from '../services/instagramService';
import { MediaCard } from './MediaCard';
import { AIModal } from './AIModal';
import { LogOut, User, Grid, Loader2 } from 'lucide-react';

interface DashboardProps {
  token: string;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ token, onLogout }) => {
  const [user, setUser] = useState<InstagramUser | null>(null);
  const [mediaList, setMediaList] = useState<InstagramMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedMedia, setSelectedMedia] = useState<InstagramMedia | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Parallel fetch for speed
        const [userData, mediaData] = await Promise.all([
          fetchUserProfile(token),
          fetchUserMedia(token)
        ]);
        
        setUser(userData);
        setMediaList(mediaData);
      } catch (err: any) {
        console.error("Dashboard error:", err);
        setError("Could not load Instagram data. Your token may have expired.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-purple-600 mx-auto" />
          <p className="text-gray-500 font-medium">Connecting to Instagram Graph API...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <h2 className="text-red-600 font-bold text-xl mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={onLogout}
            className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-black transition"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="bg-gradient-to-tr from-yellow-400 to-purple-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold">
               AI
             </div>
             <span className="font-bold text-gray-900 tracking-tight">SocialAI</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
               <User size={16} />
               <span className="font-semibold">{user?.username}</span>
            </div>
            <button 
              onClick={onLogout}
              className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-red-50"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Section */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.username}</h2>
              <p className="text-gray-500 text-sm capitalize">{user?.account_type.toLowerCase().replace('_', ' ')} Account</p>
            </div>
          </div>
          <div className="flex gap-8 text-center bg-gray-50 px-8 py-4 rounded-xl border border-gray-100">
             <div>
               <div className="text-2xl font-bold text-gray-900">{user?.media_count}</div>
               <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Posts</div>
             </div>
             <div className="w-px bg-gray-300 h-10"></div>
             <div>
                {/* Note: Follower count requires different permission scopes often restricted in Basic Display */}
               <div className="text-2xl font-bold text-gray-400">-</div>
               <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Followers</div>
             </div>
          </div>
        </div>

        {/* Media Grid */}
        <div className="space-y-4">
           <div className="flex items-center gap-2 text-gray-800 font-bold text-lg">
             <Grid size={20} />
             <h3>Recent Posts</h3>
           </div>
           
           {mediaList.length === 0 ? (
             <div className="text-center py-20 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
               <p>No media found.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {mediaList.map((media) => (
                 <MediaCard 
                    key={media.id} 
                    media={media} 
                    onClick={setSelectedMedia} 
                  />
               ))}
             </div>
           )}
        </div>
      </main>

      <AIModal 
        media={selectedMedia} 
        onClose={() => setSelectedMedia(null)} 
      />
    </div>
  );
};
