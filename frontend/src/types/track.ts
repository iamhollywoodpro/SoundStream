export interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  artwork: string;
  url?: string;       // <-- new!
  coverArt?: string;  // <-- optional real image
  liked?: boolean;
}