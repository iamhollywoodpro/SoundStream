export interface User {
  name: string;
  username: string;
  avatar: string | null;
  tier: string;
  bio?: string;
  socialLinks: {
    instagram: string;
    twitter: string;
    tiktok: string;
    youtube: string;
    spotify: string;
    website: string;
  };
}