import { InstagramUser, InstagramMedia, AuthResponse } from '../types';

// NOTE: In a production environment, APP_SECRET should NEVER be exposed on the frontend.
// The token exchange should happen on a secure backend server.
// These are included here strictly for the requested frontend-only demonstration.
const INSTAGRAM_APP_ID = '1251511386469731';
const INSTAGRAM_APP_SECRET = 'c0f05657a7ed375ed614576e9c467fd8'; 
const REDIRECT_URI = window.location.origin + '/'; // Dynamically use current origin

// Scopes required for the app
const SCOPES = [
  'instagram_business_basic',
  'instagram_business_manage_messages',
  'instagram_business_manage_comments',
  'instagram_business_content_publish',
  'instagram_business_manage_insights'
].join(',');

export const getInstagramAuthUrl = (): string => {
  return `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${INSTAGRAM_APP_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPES}`;
};

export const exchangeCodeForToken = async (code: string): Promise<AuthResponse> => {
  const params = new FormData();
  params.append('client_id', INSTAGRAM_APP_ID);
  params.append('client_secret', INSTAGRAM_APP_SECRET);
  params.append('grant_type', 'authorization_code');
  params.append('redirect_uri', REDIRECT_URI);
  params.append('code', code);

  const response = await fetch('https://api.instagram.com/oauth/access_token', {
    method: 'POST',
    body: params,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error_message || 'Failed to exchange token');
  }

  return response.json();
};

export const fetchUserProfile = async (accessToken: string): Promise<InstagramUser> => {
  const response = await fetch(`https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${accessToken}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }

  return response.json();
};

export const fetchUserMedia = async (accessToken: string): Promise<InstagramMedia[]> => {
  const response = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${accessToken}`);

  if (!response.ok) {
    throw new Error('Failed to fetch user media');
  }

  const data = await response.json();
  return data.data || [];
};
