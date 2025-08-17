import React, { useState, useEffect } from 'react';
import './MusicGeneratorPage.css';
import { MusicSettings } from '../../types/music';

interface MusicGeneratorPageProps {
  settings: MusicSettings;
  setSettings: React.Dispatch<React.SetStateAction<MusicSettings>>;
  onGenerate: () => void;
}

interface GeneratedTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  plays: string;
  likes: number;
  shares: number;
  genre: string;
  mood: string;
  bpm?: number;
  key?: string;
  lyrics: string;
  image: string;
  isPlaying?: boolean;
  generatedAt: string;
}

const MusicGeneratorPage: React.FC<MusicGeneratorPageProps> = ({
  settings,
  setSettings,
  onGenerate,
}) => {
  // Local states for tracks and generator UI
  const [lyrics, setLyrics] = useState(settings.lyrics || '');
  const [voiceType, setVoiceType] = useState('Male Vocal');
  const [genre, setGenre] = useState(settings.style || 'Hip-Hop');
  const [mood, setMood] = useState(settings.mood || 'Energetic');
  const [tempo, setTempo] = useState(settings.tempo ? String(settings.tempo) : '');
  const [songKey, setSongKey] = useState(settings.key || '');
  const [isGeneratingLyrics, setIsGeneratingLyrics] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'recent' | 'favorites'>('all');

  // Mock tracks for demo
  const [generatedTracks, setGeneratedTracks] = useState<GeneratedTrack[]>([
    {
      id: '1',
      title: 'Urban Dreams',
      artist: 'Hollywood Producer',
      duration: '3:24',
      plays: '1.2K',
      likes: 342,
      shares: 89,
      genre: 'Hip-Hop',
      mood: 'Energetic',
      lyrics:
        `[Verse 1]
Walking through the city lights
Dreams are calling in the night
Every step I take is mine
Urban dreams that shine

[Chorus]
We rise above the city maze
Every moment, every phase
Urban dreams are in my sight
Chasing hope into the night`,
      image: '', // Placeholder
      generatedAt: 'Just now',
    },
    {
      id: '2',
      title: 'Midnight Vibes',
      artist: 'Hollywood Producer',
      duration: '4:12',
      plays: '890',
      likes: 143,
      shares: 33,
      genre: 'R&B',
      mood: 'Chill',
      lyrics: `[Verse 1]
Late at night, the world’s asleep
I find the magic that I keep
Midnight vibes, a velvet sound
Lift my soul from off the ground`,
      image: '',
      generatedAt: '1 hour ago',
    },
    {
      id: '3',
      title: 'Electric Storm',
      artist: 'Hollywood Producer',
      duration: '4:18',
      plays: '1.7K',
      likes: 210,
      shares: 58,
      genre: 'Electronic',
      mood: 'Energetic',
      lyrics: `[Verse 1]
Lightning strikes and I’m alive
Electric storm begins to drive
Every beat a thunder roll
Energy inside my soul`,
      image: '',
      generatedAt: '2 hours ago',
    },
  ]);

  const [selectedTrack, setSelectedTrack] = useState<GeneratedTrack | null>(generatedTracks[0]);

  // AI Lyric Generator
  const generateLyrics = async () => {
    setIsGeneratingLyrics(true);
    try {
      // Simulate an async AI call
      await new Promise(res => setTimeout(res, 1500));
      const aiLyrics = `[Verse 1]\nGenerated lyrics for ${settings.title || 'your song'}\n(Replace this with real AI results)`;
      setLyrics(aiLyrics);
      setSettings(s => ({ ...s, lyrics: aiLyrics }));
    } finally {
      setIsGeneratingLyrics(false);
    }
  };

  // Generate Music (mock)
  const generateMusic = async () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newTrack: GeneratedTrack = {
        id: Date.now().toString(),
        title: settings.title || `Untitled Track`,
        artist: 'Hollywood Producer',
        duration: '3:45',
        plays: '0',
        likes: 0,
        shares: 0,
        genre: genre,
        mood: mood,
        lyrics: lyrics,
        image: '',
        generatedAt: 'Just now',
      };
      setGeneratedTracks([newTrack, ...generatedTracks]);
      setSelectedTrack(newTrack);
      setIsGenerating(false);
      setLyrics('');
      setSettings(s => ({ ...s, title: '', description: '', lyrics: '' }));
    }, 1500);
  };

  // Track actions
  const handleTrackAction = (trackId: string, action: 'like' | 'share' | 'download') => {
    setGeneratedTracks(prev =>
      prev.map(track =>
        track.id === trackId
          ? {
              ...track,
              likes: action === 'like' ? track.likes + 1 : track.likes,
              shares: action === 'share' ? track.shares + 1 : track.shares,
            }
          : track
      )
    );
    if (action === 'download') alert('Download started!');
  };

  // UI
  return (
    <div className="music-generator-main" style={{ display: 'flex', gap: 32, padding: 32 }}>
      {/* Left: Create Panel */}
      <div className="create-panel" style={{
        background: 'rgba(25,28,55,0.8)',
        borderRadius: 14,
        padding: 28,
        minWidth: 320,
        maxWidth: 370,
        flex: '0 0 350px',
        boxShadow: '0 6px 32px rgba(0,0,0,0.13)'
      }}>
        <h3>Create Your Music</h3>
        <div style={{ margin: '20px 0' }}>
          <input
            className="form-input"
            placeholder="Enter song title..."
            value={settings.title}
            onChange={e => setSettings(s => ({ ...s, title: e.target.value }))}
            style={{ width: '100%', marginBottom: 15 }}
          />
          <input
            className="form-input"
            placeholder="Describe your song..."
            value={settings.description}
            onChange={e => setSettings(s => ({ ...s, description: e.target.value }))}
            style={{ width: '100%', marginBottom: 15 }}
          />
          <textarea
            className="form-input"
            placeholder="Enter your lyrics or generate them with AI..."
            value={lyrics}
            onChange={e => {
              setLyrics(e.target.value);
              setSettings(s => ({ ...s, lyrics: e.target.value }));
            }}
            style={{ width: '100%', minHeight: 75, marginBottom: 10 }}
          />
          <button
            className="btn-generate"
            style={{
              width: '100%',
              marginBottom: 18,
              background: '#FFD600',
              color: '#333',
              borderRadius: 7,
              border: 'none',
              fontWeight: 'bold',
              padding: 10,
              fontSize: 16
            }}
            onClick={generateLyrics}
            disabled={isGeneratingLyrics}
          >
            {isGeneratingLyrics ? 'Generating...' : 'AI Generate'}
          </button>
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <select
              className="form-input"
              value={voiceType}
              onChange={e => setVoiceType(e.target.value)}
              style={{ flex: 1 }}
            >
              <option>Male Vocal</option>
              <option>Female Vocal</option>
              <option>Rap</option>
              <option>Choir</option>
            </select>
            <select
              className="form-input"
              value={genre}
              onChange={e => setGenre(e.target.value)}
              style={{ flex: 1 }}
            >
              <option>Hip-Hop</option>
              <option>R&B</option>
              <option>Electronic</option>
              <option>Pop</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <input
              className="form-input"
              placeholder="e.g. 120 BPM"
              value={tempo}
              onChange={e => setTempo(e.target.value)}
              style={{ flex: 1 }}
            />
            <select
              className="form-input"
              value={mood}
              onChange={e => setMood(e.target.value)}
              style={{ flex: 1 }}
            >
              <option>Energetic</option>
              <option>Chill</option>
              <option>Dark</option>
              <option>Uplifting</option>
            </select>
          </div>
          <button
            className="btn-generate"
            style={{
              width: '100%',
              background: '#1976d2',
              color: '#fff',
              borderRadius: 7,
              border: 'none',
              fontWeight: 'bold',
              padding: 12,
              fontSize: 17
            }}
            onClick={generateMusic}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating Music...' : 'Generate Music'}
          </button>
        </div>
      </div>

      {/* Middle: Generated Songs List */}
      <div className="songs-panel" style={{
        flex: 1,
        padding: '0 10px',
        minWidth: 300,
        maxWidth: 400
      }}>
        <div style={{
          display: 'flex', gap: 12, alignItems: 'center',
          marginBottom: 12
        }}>
          <h3 style={{ flex: 1 }}>Generated Songs</h3>
          <button className="tab" style={{ background: activeTab === 'all' ? '#FFD600' : 'transparent' }} onClick={() => setActiveTab('all')}>All</button>
          <button className="tab" style={{ background: activeTab === 'recent' ? '#FFD600' : 'transparent' }} onClick={() => setActiveTab('recent')}>Recent</button>
          <button className="tab" style={{ background: activeTab === 'favorites' ? '#FFD600' : 'transparent' }} onClick={() => setActiveTab('favorites')}>Favorites</button>
        </div>
        <div>
          {generatedTracks.map(track => (
            <div
              key={track.id}
              className={`song-row${selectedTrack?.id === track.id ? ' selected' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: selectedTrack?.id === track.id ? 'rgba(255,255,255,0.07)' : 'rgba(35,40,55,0.84)',
                borderRadius: 9,
                marginBottom: 8,
                padding: 12,
                cursor: 'pointer',
                border: selectedTrack?.id === track.id ? '2px solid #FFD600' : 'none'
              }}
              onClick={() => setSelectedTrack(track)}
            >
              <button
                className="play-btn"
                style={{
                  background: '#222',
                  borderRadius: '50%',
                  width: 34,
                  height: 34,
                  border: 'none',
                  color: '#FFD600',
                  marginRight: 14,
                  fontSize: 16
                }}
              >
                <i className="fas fa-play"></i>
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: '#fff' }}>{track.title}</div>
                <div style={{ color: '#aaa', fontSize: 12 }}>{track.genre} • {track.mood} • {track.duration}</div>
              </div>
              <button
                className="fav-btn"
                style={{ background: 'none', border: 'none', color: '#FFD600', marginLeft: 12, fontSize: 16 }}
                onClick={e => { e.stopPropagation(); handleTrackAction(track.id, 'like'); }}
                title="Like"
              >
                <i className="fas fa-heart"></i>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Song Details */}
      <div className="details-panel" style={{
        minWidth: 270,
        maxWidth: 320,
        background: 'rgba(32,34,60,0.9)',
        borderRadius: 14,
        padding: 22,
        boxShadow: '0 2px 12px rgba(0,0,0,0.12)'
      }}>
        {selectedTrack ? (
          <>
            {/* Cover Art */}
            <div style={{
              width: '100%',
              height: 120,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 13,
              marginBottom: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="fas fa-music" style={{ fontSize: 42, color: '#fff' }}></i>
            </div>
            {/* Title/Artist */}
            <div style={{ fontWeight: 700, fontSize: 20, color: '#fff', marginBottom: 4 }}>
              {selectedTrack.title}
            </div>
            <div style={{ color: '#FFD600', fontWeight: 500, marginBottom: 10 }}>
              {selectedTrack.artist}
            </div>
            {/* Stats */}
            <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
              <div style={{ color: '#FFD600', fontWeight: 600 }}>{selectedTrack.plays}<span style={{ color: '#aaa', marginLeft: 3, fontWeight: 400 }}>PLAYS</span></div>
              <div style={{ color: '#FFD600', fontWeight: 600 }}>{selectedTrack.likes}<span style={{ color: '#aaa', marginLeft: 3, fontWeight: 400 }}>LIKES</span></div>
              <div style={{ color: '#FFD600', fontWeight: 600 }}>{selectedTrack.shares}<span style={{ color: '#aaa', marginLeft: 3, fontWeight: 400 }}>SHARES</span></div>
            </div>
            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <button className="action-btn" style={{ color: '#FFD600' }} onClick={() => handleTrackAction(selectedTrack.id, 'like')}><i className="fas fa-heart"></i></button>
              <button className="action-btn" style={{ color: '#FFD600' }} onClick={() => handleTrackAction(selectedTrack.id, 'share')}><i className="fas fa-share"></i></button>
              <button className="action-btn" style={{ color: '#FFD600' }} onClick={() => handleTrackAction(selectedTrack.id, 'download')}><i className="fas fa-download"></i></button>
            </div>
            {/* Lyrics */}
            <div style={{
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 8,
              padding: 12,
              color: '#fff',
              fontFamily: 'monospace',
              fontSize: 14,
              overflowY: 'auto',
              maxHeight: 180
            }}>
              <strong>Lyrics</strong>
              <div style={{ marginTop: 8, whiteSpace: 'pre-line' }}>
                {selectedTrack.lyrics}
              </div>
            </div>
          </>
        ) : (
          <div style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>
            <i className="fas fa-music" style={{ fontSize: 48, color: '#FFD600', marginBottom: 8 }}></i>
            <div>No track selected</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicGeneratorPage;