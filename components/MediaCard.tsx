import React from 'react';
import { InstagramMedia } from '../types';
import { Image, Video, Sparkles } from 'lucide-react';

interface MediaCardProps {
  media: InstagramMedia;
  onClick: (media: InstagramMedia) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ media, onClick }) => {
  const isVideo = media.media_type === 'VIDEO';
  const imageUrl = isVideo ? (media.thumbnail_url || media.media_url) : media.media_url;

  return (
    <div 
      className="group relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300"
      onClick={() => onClick(media)}
    >
      <div className="aspect-square relative bg-gray-100">
        <img 
          src={imageUrl} 
          alt={media.caption || 'Instagram Post'} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm p-1.5 rounded-full text-white">
          {isVideo ? <Video size={14} /> : <Image size={14} />}
        </div>
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button className="bg-white text-purple-600 px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Sparkles size={16} />
            Analyze with AI
          </button>
        </div>
      </div>

      <div className="p-3">
        <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5em]">
          {media.caption || <span className="italic text-gray-400">No caption</span>}
        </p>
        <div className="mt-2 text-xs text-gray-400">
          {new Date(media.timestamp).toLocaleDateString(undefined, {
            month: 'short', day: 'numeric', year: 'numeric'
          })}
        </div>
      </div>
    </div>
  );
};
