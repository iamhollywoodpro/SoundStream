import { Track } from "../../types/track";
interface Props {
  favorites: Track[];
  playTrack: (track: Track) => void;
  toggleFavorite: (trackId: string) => void;
}
const FavoritesPage: React.FC<Props> = () => (
  <div style={{color:'#fff'}}>Favorites Coming Soon!</div>
);
export default FavoritesPage;