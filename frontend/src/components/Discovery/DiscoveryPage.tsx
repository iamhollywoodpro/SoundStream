import { Track } from "../../types/track";
interface Props {
  tracks: Track[];
  playTrack: (track: Track) => void;
  toggleFavorite: (trackId: string) => void;
  favorites: Track[];
}
const DiscoveryPage: React.FC<Props> = () => (
  <div style={{color:'#fff'}}>Discovery Coming Soon!</div>
);
export default DiscoveryPage;