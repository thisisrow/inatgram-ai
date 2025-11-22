export interface InstagramUser {
  id: string;
  username: string;
  account_type: string;
  media_count: number;
}

export interface InstagramMedia {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

export interface AuthResponse {
  access_token: string;
  user_id: string;
}

export interface AIAnalysisResult {
  caption: string;
  hashtags: string[];
  vibe: string;
}
