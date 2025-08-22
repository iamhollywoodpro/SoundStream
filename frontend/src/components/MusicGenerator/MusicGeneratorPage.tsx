import React, { useState, useEffect, useRef } from 'react';
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
  audioUrl?: string;
  waveform?: number[];
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
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

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

  // REAL AI Lyric Generator
  const generateLyrics = async () => {
    setIsGeneratingLyrics(true);
    try {
      // Call your actual backend API for lyrics generation
      const response = await fetch('/api/generate-lyrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          genre, 
          mood, 
          voiceType,
          title: settings.title,
          description: settings.description
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setLyrics(data.lyrics);
        setSettings(s => ({ ...s, lyrics: data.lyrics }));
      } else {
        // Enhanced fallback with proper song structures
        const structures = {
          'Hip-Hop': '[Verse 1]\n{verse1}\n\n[Chorus]\n{chorus}\n\n[Verse 2]\n{verse2}\n\n[Chorus]\n{chorus}\n\n[Bridge]\n{bridge}',
          'R&B': '[Verse 1]\n{verse1}\n\n[Pre-Chorus]\n{pre}\n\n[Chorus]\n{chorus}\n\n[Verse 2]\n{verse2}\n\n[Chorus]\n{chorus}',
          'Pop': '[Verse 1]\n{verse1}\n\n[Chorus]\n{chorus}\n\n[Verse 2]\n{verse2}\n\n[Chorus]\n{chorus}\n\n[Bridge]\n{bridge}\n\n[Chorus]\n{chorus}',
          'Jazz': '[Verse 1]\n{verse1}\n\n[Chorus]\n{chorus}\n\n[Solo Section]\n{solo}\n\n[Verse 2]\n{verse2}\n\n[Outro]\n{outro}',
          'Rock': '[Verse 1]\n{verse1}\n\n[Chorus]\n{chorus}\n\n[Verse 2]\n{verse2}\n\n[Chorus]\n{chorus}\n\n[Guitar Solo]\n{solo}\n\n[Final Chorus]\n{chorus}'
        };
        
        const moodContent = {
          'Energetic': { verse1: 'Pumping up the volume, feeling so alive\nEvery beat drops harder, helping me to thrive', chorus: 'We rise up, never fall down\nSoundStream playing all around town' },
          'Chill': { verse1: 'Floating on this melody, so smooth and so free\nTaking time to breathe, just you and me', chorus: 'Let the rhythm take control\nMusic healing every soul' },
          'Dark': { verse1: 'Shadows creeping in the night, but I stand my ground\nIn the darkness find my light, through the haunting sound', chorus: 'In the darkness we are strong\nThis is where we all belong' },
          'Uplifting': { verse1: 'Every step we take together, reaching for the sky\nNothing gonna last forever, but we still gonna try', chorus: 'Higher, higher we will climb\nThis our moment, this our time' }
        };
        
        const structure = structures[genre as keyof typeof structures] || structures['Hip-Hop'];
        const content = moodContent[mood as keyof typeof moodContent] || moodContent['Energetic'];
        
        const aiLyrics = structure
          .replace('{verse1}', content.verse1)
          .replace('{chorus}', content.chorus)
          .replace('{verse2}', 'Building up the energy, can you feel the vibe\nMusic is our destiny, keeping dreams alive')
          .replace('{bridge}', 'In the silence find the sound\nWhere the rhythm can be found')
          .replace('{pre}', 'Can you feel it in the air tonight\nEverything is gonna be alright')
          .replace('{solo}', '(Instrumental solo section)')
          .replace('{outro}', 'As the music fades away\nMemories of this will stay');
        
        setLyrics(aiLyrics);
        setSettings(s => ({ ...s, lyrics: aiLyrics }));
      }
    } catch (error) {
      console.error('Failed to generate lyrics:', error);
      alert('Failed to generate lyrics. Please try again.');
    } finally {
      setIsGeneratingLyrics(false);
    }
  };

  // REAL Music Generation
  const generateMusic = async () => {
    if (!lyrics.trim()) {
      alert('Please add lyrics or generate them first!');
      return;
    }

    setIsGenerating(true);
    try {
      // Call your actual backend API for music generation
      const response = await fetch('/api/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lyrics: lyrics,
          genre: genre,
          mood: mood,
          voiceType: voiceType,
          tempo: tempo,
          key: songKey,
          title: settings.title,
          description: settings.description,
          duration: 30 // 30 seconds for demo
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        const newTrack: GeneratedTrack = {
          id: Date.now().toString(),
          title: settings.title || `${genre} ${mood} Track`,
          artist: 'Hollywood Producer',
          duration: data.duration || '0:30',
          plays: '0',
          likes: 0,
          shares: 0,
          genre: genre,
          mood: mood,
          bpm: tempo ? parseInt(tempo) : undefined,
          key: songKey || undefined,
          lyrics: lyrics,
          image: data.image || '',
          audioUrl: data.audio_url, // Real generated audio URL!
          generatedAt: 'Just now',
          waveform: data.waveform || []
        };

        setGeneratedTracks([newTrack, ...generatedTracks]);
        setSelectedTrack(newTrack);
        
        // Clear form for next generation
        setLyrics('');
        setSettings(s => ({ ...s, title: '', description: '', lyrics: '' }));
        
        alert('🎵 Music generated successfully! Click play to listen.');
      } else {
        throw new Error('Music generation failed');
      }
      
    } catch (error) {
      console.error('Music generation failed:', error);
      alert('Failed to generate music. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Audio playback controls
  const playTrack = (track: GeneratedTrack) => {
    if (currentlyPlaying === track.id) {
      // Pause current track
      if (audioRef.current) {
        audioRef.current.pause();
        setCurrentlyPlaying(null);
      }
    } else {
      // Play new track
      if (audioRef.current && track.audioUrl) {
        audioRef.current.src = track.audioUrl;
        audioRef.current.play();
        setCurrentlyPlaying(track.id);
      } else if (!track.audioUrl) {
        alert('No audio available for this track');
      }
    }
  };

  // Handle audio ended
  const handleAudioEnd = () => {
    setCurrentlyPlaying(null);
  };

  // Track actions with real functionality
  const handleTrackAction = (trackId: string, action: 'like' | 'share' | 'download') => {
    const track = generatedTracks.find(t => t.id === trackId);
    
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
    
    if (action === 'download' && track?.audioUrl) {
      // Create download link for the audio
      const link = document.createElement('a');
      link.href = track.audioUrl;
      link.download = `${track.title}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert('Download started!');
    } else if (action === 'download') {
      alert('No audio file available to download');
    } else if (action === 'share') {
      navigator.clipboard.writeText(`Check out my track "${track?.title}" created with SoundStream!`);
      alert('Share link copied to clipboard!');
    }
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
              <option>R&B Singer</option>
              <option>Pop Star</option>
              <option>Jazz Vocalist</option>
              <option>Rock Singer</option>
              <option>Auto-Tuned</option>
              <option>Soulful</option>
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
              <option>Jazz</option>
              <option>Rock</option>
              <option>Reggae</option>
              <option>Country</option>
              <option>Classical</option>
              <option>Blues</option>
              <option>Funk</option>
              <option>Soul</option>
              <option>Reggaeton</option>
              <option>Afrobeat</option>
              <option>Trap</option>
              <option>House</option>
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
              <option>Romantic</option>
              <option>Melancholic</option>
              <option>Aggressive</option>
              <option>Peaceful</option>
              <option>Motivational</option>
              <option>Nostalgic</option>
              <option>Dreamy</option>
              <option>Party</option>
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
                  background: currentlyPlaying === track.id ? '#FFD600' : '#222',
                  borderRadius: '50%',
                  width: 34,
                  height: 34,
                  border: 'none',
                  color: currentlyPlaying === track.id ? '#000' : '#FFD600',
                  marginRight: 14,
                  fontSize: 16,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  playTrack(track);
                }}
                title={currentlyPlaying === track.id ? 'Pause' : 'Play'}
              >
                <i className={`fas fa-${currentlyPlaying === track.id ? 'pause' : 'play'}`}></i>
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
            {/* Audio Player Controls */}
            <div style={{ marginBottom: 15 }}>
              <button
                onClick={() => playTrack(selectedTrack)}
                style={{
                  width: '100%',
                  background: currentlyPlaying === selectedTrack.id ? '#FFD600' : '#1976d2',
                  color: currentlyPlaying === selectedTrack.id ? '#000' : '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '12px 20px',
                  fontSize: 16,
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginBottom: 10,
                  transition: 'all 0.3s ease'
                }}
              >
                <i className={`fas fa-${currentlyPlaying === selectedTrack.id ? 'pause' : 'play'}`} style={{ marginRight: 8 }}></i>
                {currentlyPlaying === selectedTrack.id ? 'Pause Track' : 'Play Track'}
              </button>
              
              {selectedTrack.audioUrl && (
                <div style={{ 
                  background: 'rgba(0,0,0,0.3)', 
                  borderRadius: 6, 
                  padding: 8, 
                  fontSize: 12, 
                  color: '#aaa',
                  textAlign: 'center'
                }}>
                  <i className="fas fa-volume-up" style={{ marginRight: 6 }}></i>
                  Audio Ready
                </div>
              )}
            </div>

            {/* Track Info */}
            {(selectedTrack.bpm || selectedTrack.key) && (
              <div style={{ marginBottom: 15, padding: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
                {selectedTrack.bpm && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: '#aaa' }}>BPM:</span>
                    <span style={{ color: '#FFD600' }}>{selectedTrack.bpm}</span>
                  </div>
                )}
                {selectedTrack.key && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#aaa' }}>Key:</span>
                    <span style={{ color: '#FFD600' }}>{selectedTrack.key}</span>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <button className="action-btn" style={{ color: '#FFD600', flex: 1 }} onClick={() => handleTrackAction(selectedTrack.id, 'like')}>
                <i className="fas fa-heart"></i> {selectedTrack.likes}
              </button>
              <button className="action-btn" style={{ color: '#FFD600', flex: 1 }} onClick={() => handleTrackAction(selectedTrack.id, 'share')}>
                <i className="fas fa-share"></i> Share
              </button>
              <button className="action-btn" style={{ color: '#FFD600', flex: 1 }} onClick={() => handleTrackAction(selectedTrack.id, 'download')}>
                <i className="fas fa-download"></i> Save
              </button>
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
      
      {/* Hidden Audio Element for Playback */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnd}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default MusicGeneratorPage;