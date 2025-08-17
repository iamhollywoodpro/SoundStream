import React, { useState, useEffect } from 'react';
import { MusicSettings } from '../../types/music';
import './MusicGeneratorPage.css';

interface GeneratedSong {
  id: string;
  title: string;
  status: string;
  audioUrl?: string;
  streamUrl?: string;
  imageUrl?: string;
  timestamp: string;
  lyrics?: any;
  taskId: string;
}

interface MusicGeneratorPageProps {
  settings: MusicSettings;
  setSettings: (settings: MusicSettings) => void;
  onGenerate?: () => void;
}

const MusicGeneratorPage: React.FC<MusicGeneratorPageProps> = ({ 
  settings, 
  setSettings, 
  onGenerate 
}) => {
  // State management
  const [activeView, setActiveView] = useState<'create' | 'library'>('create');
  const [useAILyrics, setUseAILyrics] = useState(true);
  const [lyricsMode, setLyricsMode] = useState<'full' | 'line'>('full');
  const [credits, setCredits] = useState<number | string>('unknown');
  const [loading, setLoading] = useState(false);
  const [generatedSongs, setGeneratedSongs] = useState<GeneratedSong[]>([]);
  
  // Form state
  const [songTitle, setSongTitle] = useState('');
  const [customLyrics, setCustomLyrics] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [mood, setMood] = useState('');
  const [theme, setTheme] = useState('');
  const [model, setModel] = useState('V4');

  // Style tags (SUNO-style)
  const styleTags = [
    'electronic', 'piano', 'hip-hop', 'pop', 'rock', 'jazz', 'classical',
    'indie', 'folk', 'country', 'r&b', 'funk', 'blues', 'reggae',
    'latin', 'edm', 'house', 'techno', 'ambient', 'lo-fi'
  ];

  const moods = ['energetic', 'chill', 'melancholic', 'upbeat', 'dark', 'dreamy', 'confident'];
  const themes = ['love', 'success', 'adventure', 'nostalgia', 'freedom', 'friendship', 'motivation'];

  // Fetch credits on component mount
  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    try {
      const response = await fetch('/api/music-test/credits');
      const data = await response.json();
      if (data.success) {
        setCredits(data.credits);
      }
    } catch (error) {
      console.error('Failed to fetch credits:', error);
    }
  };

  const handleStyleToggle = (style: string) => {
    setSelectedStyles(prev => 
      prev.includes(style) 
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const generateLyrics = async () => {
    if (!theme || !mood) {
      alert('Please select a theme and mood for AI lyrics generation');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/music-test/generate-lyrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme,
          mood,
          style: selectedStyles.join(', '),
          customInstructions: `Generate lyrics for a ${mood} song about ${theme}`
        }),
      });

      const data = await response.json();
      if (data.success && data.rawText) {
        setCustomLyrics(data.rawText);
      } else {
        alert('Failed to generate lyrics: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error generating lyrics:', error);
      alert('Failed to generate lyrics');
    } finally {
      setLoading(false);
    }
  };

  const generateMusic = async () => {
    if (!songTitle) {
      alert('Please enter a song title');
      return;
    }

    if (!useAILyrics && !customLyrics) {
      alert('Please enter lyrics or enable AI lyrics generation');
      return;
    }

    setLoading(true);
    try {
      const requestBody = {
        theme: theme || 'general',
        mood: mood || 'upbeat',
        style: selectedStyles.join(', ') || 'pop',
        useAILyrics,
        customLyrics: useAILyrics ? undefined : customLyrics,
        model,
        songTitle
      };

      const response = await fetch('/api/music-test/suno-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (data.success) {
        const newSong: GeneratedSong = {
          id: Date.now().toString(),
          title: songTitle,
          status: 'generating',
          taskId: data.music.taskId,
          timestamp: new Date().toISOString(),
          lyrics: data.lyrics
        };
        
        setGeneratedSongs(prev => [newSong, ...prev]);
        
        // Start polling for status
        pollTaskStatus(data.music.taskId, newSong.id);
        
        alert('Music generation started! Check "My Workspace" for progress.');
      } else {
        alert('Failed to generate music: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error generating music:', error);
      alert('Failed to generate music');
    } finally {
      setLoading(false);
    }
  };

  const pollTaskStatus = async (taskId: string, songId: string) => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/music-test/status/${taskId}`);
        const data = await response.json();
        
        if (data.success && data.response?.sunoData) {
          const sunoData = data.response.sunoData[0];
          if (sunoData.streamAudioUrl || sunoData.audioUrl) {
            setGeneratedSongs(prev => prev.map(song => 
              song.id === songId 
                ? {
                    ...song,
                    status: 'completed',
                    audioUrl: sunoData.audioUrl,
                    streamUrl: sunoData.streamAudioUrl,
                    imageUrl: sunoData.imageUrl
                  }
                : song
            ));
            return;
          }
        }
        
        setTimeout(checkStatus, 10000);
      } catch (error) {
        console.error('Error checking status:', error);
        setTimeout(checkStatus, 15000);
      }
    };
    
    checkStatus();
  };

  return (
    <div className="suno-interface">
      {/* Header */}
      <div className="suno-header">
        <h1 className="soundstream-logo">
          Sound<span className="highlight">Stream</span>
        </h1>
        <div className="credits-display">Credits: {credits}</div>
      </div>

      <div className="suno-layout">
        {/* Left Sidebar */}
        <div className="suno-sidebar">
          <div className="sidebar-section">
            <h3>Navigate</h3>
            <button 
              className={`nav-button ${activeView === 'create' ? 'active' : ''}`}
              onClick={() => setActiveView('create')}
            >
              Create Music
            </button>
            <button 
              className={`nav-button ${activeView === 'library' ? 'active' : ''}`}
              onClick={() => setActiveView('library')}
            >
              My Workspace
            </button>
          </div>
        </div>

        {/* Center Panel */}
        <div className="suno-center">
          {activeView === 'create' ? (
            <div className="creation-panel">
              {/* Song Title */}
              <div className="form-section">
                <label>Song Title</label>
                <input
                  type="text"
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  className="suno-input"
                  placeholder="Enter your song title..."
                />
              </div>

              {/* Lyrics Section */}
              <div className="lyrics-section">
                <div className="section-header">
                  <h3>Lyrics</h3>
                  <div className="lyrics-controls">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={useAILyrics}
                        onChange={(e) => setUseAILyrics(e.target.checked)}
                      />
                      <span className="slider"></span>
                      Auto Lyrics
                    </label>
                    {useAILyrics && (
                      <div className="lyrics-mode">
                        <button 
                          className={lyricsMode === 'full' ? 'active' : ''}
                          onClick={() => setLyricsMode('full')}
                        >
                          Full Song
                        </button>
                        <button 
                          className={lyricsMode === 'line' ? 'active' : ''}
                          onClick={() => setLyricsMode('line')}
                        >
                          By Line
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {useAILyrics && (
                  <div className="ai-controls">
                    <div className="control-row">
                      <select
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        className="suno-select"
                      >
                        <option value="">Select theme...</option>
                        {themes.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <select
                        value={mood}
                        onChange={(e) => setMood(e.target.value)}
                        className="suno-select"
                      >
                        <option value="">Select mood...</option>
                        {moods.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                      <button
                        onClick={generateLyrics}
                        disabled={loading}
                        className="generate-lyrics-btn"
                      >
                        {loading ? 'Generating...' : 'Generate AI Lyrics'}
                      </button>
                    </div>
                  </div>
                )}

                <textarea
                  value={customLyrics}
                  onChange={(e) => setCustomLyrics(e.target.value)}
                  placeholder={useAILyrics ? "AI-generated lyrics will appear here..." : "Enter your lyrics here..."}
                  className="lyrics-textarea"
                  readOnly={useAILyrics && !customLyrics}
                />
              </div>

              {/* Style Tags */}
              <div className="styles-section">
                <h3>Styles</h3>
                <div className="style-tags">
                  {styleTags.map(style => (
                    <button
                      key={style}
                      onClick={() => handleStyleToggle(style)}
                      className={`style-tag ${selectedStyles.includes(style) ? 'selected' : ''}`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Options */}
              <div className="advanced-section">
                <h3>Advanced Options</h3>
                <div className="advanced-controls">
                  <div className="control-group">
                    <label>Model</label>
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="suno-select"
                    >
                      <option value="V3_5">V3.5 - Balanced</option>
                      <option value="V4">V4 - High Quality</option>
                      <option value="V4_5">V4.5 - Advanced</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Create Button */}
              <button
                onClick={generateMusic}
                disabled={loading}
                className="create-button"
              >
                {loading ? 'Creating Music...' : 'Create Music'}
              </button>
            </div>
          ) : (
            <div className="library-panel">
              <h2>My Workspace</h2>
              <div className="songs-grid">
                {generatedSongs.length === 0 ? (
                  <div className="empty-state">
                    <p>No songs generated yet. Create your first song!</p>
                  </div>
                ) : (
                  generatedSongs.map(song => (
                    <div key={song.id} className="song-card">
                      <div className="song-info">
                        <h4>{song.title}</h4>
                        <span className={`status ${song.status}`}>{song.status}</span>
                      </div>
                      {song.streamUrl && (
                        <audio controls>
                          <source src={song.streamUrl} type="audio/mpeg" />
                        </audio>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - My Workspace Preview */}
        <div className="suno-right">
          <h3>My Workspace</h3>
          <div className="workspace-preview">
            {generatedSongs.slice(0, 5).map(song => (
              <div key={song.id} className="preview-item">
                <div className="preview-info">
                  <span className="preview-title">{song.title}</span>
                  <span className={`preview-status ${song.status}`}>{song.status}</span>
                </div>
              </div>
            ))}
            {generatedSongs.length === 0 && (
              <p className="no-songs">No songs yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicGeneratorPage;