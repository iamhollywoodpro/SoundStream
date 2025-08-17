import React, { useState, useEffect } from 'react';
import './Dashboard.css';

// Remove the problematic imports - we'll define everything in this file
// import MusicGeneratorPage from '../components/MusicGenerator/MusicGeneratorPage';
// import { MusicSettings } from '../types/music';

// Define MusicSettings interface here
interface MusicSettings {
    title: string;
    description: string;
    style: string;
    mood: string;
    instrumental: boolean;
    duration: number;
    tempo: number;
    key: string;
    lyrics: string;
}

interface User {
    name: string;
    username: string;
    avatar: string | null;
    tier: string;
    bio: string;
    socialLinks: {
        instagram: string;
        twitter: string;
        tiktok: string;
        youtube: string;
        spotify: string;
        website: string;
    };
}

interface Track {
    id: string;
    title: string;
    artist: string;
    genre: string;
    artwork: string;
    liked?: boolean;
}

interface SyncOpportunity {
    id: string;
    company: string;
    description: string;
    payment: string;
    deadline: string;
    genres: string[];
    badge: 'hot' | 'premium' | 'new';
    submitted: boolean;
}

interface ChatMessage {
    id: string;
    sender: string;
    content: string;
    timestamp: string;
}

const Dashboard: React.FC = () => {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [settingsModalOpen, setSettingsModalOpen] = useState(false);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [user, setUser] = useState<User>({
        name: 'Hollywood Producer',
        username: '@hollywood_producer',
        avatar: null,
        tier: 'Elite Artist',
        bio: 'Music producer and owner of Fresh Blendz Juice Bar. Always thinking about new ideas and wants to change the world one prompt at a time.',
        socialLinks: {
            instagram: '',
            twitter: '',
            tiktok: '',
            youtube: '',
            spotify: '',
            website: ''
        }
    });

    const [library, setLibrary] = useState<Track[]>([
        { id: '1', title: 'Midnight Dreams', artist: 'Hollywood Producer', genre: 'Electronic', artwork: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { id: '2', title: 'Electric Nights', artist: 'Hollywood Producer', genre: 'Hip Hop', artwork: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
        { id: '3', title: 'Urban Vibes', artist: 'Hollywood Producer', genre: 'Chill', artwork: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
        { id: '4', title: 'Summer Breeze', artist: 'Hollywood Producer', genre: 'Synthwave', artwork: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
        { id: '5', title: 'Neon Lights', artist: 'Hollywood Producer', genre: 'Ambient', artwork: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }
    ]);

    const [favorites, setFavorites] = useState<Track[]>([
        { id: '6', title: 'Bass Drop', artist: 'Various Artists', genre: 'Lo-Fi', artwork: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', liked: true },
        { id: '7', title: 'Sunset Drive', artist: 'Various Artists', genre: 'Lo-Fi', artwork: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', liked: true }
    ]);

    const [discoveryTracks] = useState<Track[]>([
        { id: '8', title: 'Future Bass Anthem', artist: 'Neon Dreams', genre: 'Electronic', artwork: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { id: '9', title: 'Trap City', artist: 'Beat Maker', genre: 'Hip Hop', artwork: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
        { id: '10', title: 'Chill Waves', artist: 'Ambient Soul', genre: 'Chill', artwork: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }
    ]);

    const [syncOpportunities, setSyncOpportunities] = useState<SyncOpportunity[]>([
        {
            id: '1',
            company: 'Netflix Original Series',
            description: 'Looking for electronic/ambient tracks for dramatic scenes in upcoming thriller series.',
            payment: '$5,000 - $15,000',
            deadline: '3 days',
            genres: ['Electronic', 'Ambient', 'Cinematic'],
            badge: 'hot',
            submitted: false
        },
        {
            id: '2',
            company: 'Apple Commercial',
            description: 'Upbeat electronic music for new iPhone campaign launching next quarter.',
            payment: '$10,000 - $25,000',
            deadline: '5 days',
            genres: ['Electronic', 'Pop', 'Upbeat'],
            badge: 'premium',
            submitted: false
        }
    ]);

    const [musicGenSettings, setMusicGenSettings] = useState<MusicSettings>({
        title: '',
        description: '',
        style: 'Electronic',
        mood: 'Energetic',
        instrumental: false,
        duration: 120,
        tempo: 120,
        key: 'C Major',
        lyrics: ''
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownOpen && !(event.target as Element).closest('.user-info')) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [dropdownOpen]);

    const playTrack = (track: Track) => {
        setCurrentTrack(track);
        setIsPlaying(true);
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const toggleFavorite = (trackId: string) => {
        const track = [...library, ...discoveryTracks].find(t => t.id === trackId);
        if (track) {
            const isFavorited = favorites.some(f => f.id === trackId);
            if (isFavorited) {
                setFavorites(prev => prev.filter(f => f.id !== trackId));
            } else {
                setFavorites(prev => [...prev, { ...track, liked: true }]);
            }
        }
    };

    const submitToSync = (opportunityId: string) => {
        setSyncOpportunities(prev => 
            prev.map(opp => 
                opp.id === opportunityId 
                    ? { ...opp, submitted: true }
                    : opp
            )
        );
    };

    const handleProfileEdit = () => {
        setProfileModalOpen(true);
        setDropdownOpen(false);
    };

    const handleSettings = () => {
        setSettingsModalOpen(true);
        setDropdownOpen(false);
    };

    const handleUpgrade = () => {
        if (user.tier !== 'Elite Artist') {
            alert('Upgrade feature coming soon!');
        }
        setDropdownOpen(false);
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            alert('Logged out successfully!');
        }
        setDropdownOpen(false);
    };

    const handleProfileSave = (profileData: Partial<User>) => {
        setUser(prev => ({ ...prev, ...profileData }));
        setProfileModalOpen(false);
    };

    const generateMusic = async () => {
        console.log('Generating music with settings:', musicGenSettings);
        alert('Music generation feature coming soon!');
    };

    return (
        <div className="dashboard">
            {/* Background Elements */}
            <div className="floating-particles">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="particle">♪</div>
                ))}
            </div>

            <div className="background-orbs">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
            </div>

            <Sidebar 
                currentPage={currentPage} 
                setCurrentPage={setCurrentPage}
                setUploadModalOpen={setUploadModalOpen}
            />
            
            <div className="main-content">
                <Header 
                    user={user}
                    dropdownOpen={dropdownOpen}
                    setDropdownOpen={setDropdownOpen}
                    onProfileEdit={handleProfileEdit}
                    onSettings={handleSettings}
                    onUpgrade={handleUpgrade}
                    onLogout={handleLogout}
                />

                {currentPage === 'dashboard' && (
                    <DashboardPage 
                        user={user}
                        tracks={library}
                        trendingTracks={discoveryTracks}
                        playTrack={playTrack}
                        setCurrentPage={setCurrentPage}
                    />
                )}

                {currentPage === 'discovery' && (
                    <DiscoveryPage 
                        tracks={discoveryTracks}
                        playTrack={playTrack}
                        toggleFavorite={toggleFavorite}
                        favorites={favorites}
                    />
                )}

                {currentPage === 'library' && (
                    <LibraryPage 
                        tracks={library}
                        playTrack={playTrack}
                        toggleFavorite={toggleFavorite}
                        favorites={favorites}
                    />
                )}

                {currentPage === 'favorites' && (
                    <FavoritesPage 
                        favorites={favorites}
                        playTrack={playTrack}
                        toggleFavorite={toggleFavorite}
                    />
                )}

                {currentPage === 'ai-ar' && <AIARPage />}

                {currentPage === 'music-generator' && (
                    <MusicGeneratorPage 
                        settings={musicGenSettings}
                        setSettings={setMusicGenSettings}
                        onGenerate={generateMusic}
                    />
                )}

                {currentPage === 'analytics' && <AnalyticsPage />}
                
                {currentPage === 'sync-opportunities' && (
                    <SyncOpportunitiesPage 
                        opportunities={syncOpportunities}
                        onSubmit={submitToSync}
                    />
                )}

                {currentPage === 'community' && <CommunityPage />}

                {currentPage === 'chat' && <ChatPage />}

                {['ai-manager', 'vocal-ai'].includes(currentPage) && (
                    <ComingSoonPage page={currentPage} />
                )}
            </div>

            {currentTrack && (
                <MusicPlayer 
                    track={currentTrack}
                    isPlaying={isPlaying}
                    togglePlay={togglePlay}
                />
            )}

            {profileModalOpen && (
                <EnhancedProfileModal 
                    user={user}
                    onClose={() => setProfileModalOpen(false)}
                    onSave={handleProfileSave}
                />
            )}

            {settingsModalOpen && (
                <SettingsModal 
                    onClose={() => setSettingsModalOpen(false)}
                />
            )}

            {uploadModalOpen && (
                <UploadModal 
                    onClose={() => setUploadModalOpen(false)}
                />
            )}
        </div>
    );
};

// Sidebar Component
const Sidebar: React.FC<{
    currentPage: string;
    setCurrentPage: (page: string) => void;
    setUploadModalOpen: (open: boolean) => void;
}> = ({ currentPage, setCurrentPage, setUploadModalOpen }) => {
    const navItems = [
        { id: 'dashboard', icon: 'fas fa-home', label: 'Dashboard', section: 'Navigate' },
        { id: 'discovery', icon: 'fas fa-compass', label: 'Discovery', section: 'Navigate' },
        { id: 'library', icon: 'fas fa-book', label: 'Library', section: 'Navigate' },
        { id: 'favorites', icon: 'fas fa-heart', label: 'Favorites', section: 'Navigate' },
        { id: 'ai-ar', icon: 'fas fa-chart-line', label: 'AI A&R', section: 'AI Tools' },
        { id: 'ai-manager', icon: 'fas fa-user-tie', label: 'AI Manager', section: 'AI Tools' },
        { id: 'music-generator', icon: 'fas fa-music', label: 'Music Generator', section: 'AI Tools' },
        { id: 'vocal-ai', icon: 'fas fa-microphone', label: 'Vocal AI', section: 'AI Tools' },
        { id: 'community', icon: 'fas fa-users', label: 'Community', section: 'Community' },
        { id: 'chat', icon: 'fas fa-comments', label: 'Chat', section: 'Community' }
    ];

    const sections = ['Navigate', 'AI Tools', 'Community'];

    return (
        <div className="sidebar">
            <div className="logo">
                <div className="logo-icon">
                    <div className="waveform">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="wave"></div>
                        ))}
                    </div>
                </div>
                <span className="logo-text">SoundStream</span>
            </div>

            {sections.map(section => (
                <div key={section} className="nav-section">
                    <div className="nav-title">{section}</div>
                    {navItems
                        .filter(item => item.section === section)
                        .map(item => (
                            <button
                                key={item.id}
                                className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                                onClick={() => setCurrentPage(item.id)}
                            >
                                <i className={item.icon}></i>
                                <span>{item.label}</span>
                            </button>
                        ))
                    }
                </div>
            ))}

            <button className="upload-button" onClick={() => setUploadModalOpen(true)}>
                <i className="fas fa-upload"></i>
                Upload Track
            </button>
            <button className="analytics-button" onClick={() => setCurrentPage('analytics')}>
                <i className="fas fa-chart-bar"></i>
                View Analytics
            </button>
        </div>
    );
};

// Header Component
const Header: React.FC<{
    user: User;
    dropdownOpen: boolean;
    setDropdownOpen: (open: boolean) => void;
    onProfileEdit: () => void;
    onSettings: () => void;
    onUpgrade: () => void;
    onLogout: () => void;
}> = ({ user, dropdownOpen, setDropdownOpen, onProfileEdit, onSettings, onUpgrade, onLogout }) => {
    return (
        <div className="header">
            <div className="search-bar">
                <input type="text" placeholder="Search tracks, artists, playlists..." />
            </div>
            <div className="user-profile">
                <div className="notification-bell">
                    <i className="fas fa-bell"></i>
                    <span className="notification-badge">3</span>
                </div>
                <div className="user-info" onClick={() => setDropdownOpen(!dropdownOpen)}>
                    <div className="user-avatar">
                        {user.avatar ? (
                            <img src={user.avatar} alt="Profile" />
                        ) : (
                            user.name.split(' ').map(n => n[0]).join('')
                        )}
                    </div>
                    <div className="user-details">
                        <h4>{user.name}</h4>
                        <span>{user.tier}</span>
                    </div>
                    <i className="fas fa-chevron-down"></i>
                </div>
                <div className={`dropdown-menu ${dropdownOpen ? 'active' : ''}`}>
                    <button className="dropdown-item" onClick={onProfileEdit}>
                        <i className="fas fa-user"></i>
                        <span>Edit Profile</span>
                    </button>
                    <button className="dropdown-item" onClick={onSettings}>
                        <i className="fas fa-cog"></i>
                        <span>Settings</span>
                    </button>
                    {user.tier !== 'Elite Artist' && (
                        <button className="dropdown-item" onClick={onUpgrade}>
                            <i className="fas fa-crown"></i>
                            <span>Upgrade Account</span>
                        </button>
                    )}
                    <button className="dropdown-item" onClick={onLogout}>
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// Dashboard Page Component
const DashboardPage: React.FC<{
    user: User;
    tracks: Track[];
    trendingTracks: Track[];
    playTrack: (track: Track) => void;
    setCurrentPage: (page: string) => void;
}> = ({ user, tracks, trendingTracks, playTrack, setCurrentPage }) => {
    const [activeCategory, setActiveCategory] = useState('All music');
    const categories = ['All music', 'Pop music', 'Hip Hop music', 'Rock music', 'Jazz music', 'Electronic music', 'Country music', 'Classical music'];

    return (
        <div className="page active">
            <div className="welcome-section">
                <h1 className="welcome-title">
                    Welcome back, <span className="highlight">{user.name.split(' ')[0]}</span>
                </h1>
                <p className="welcome-subtitle">Ready to create something amazing today?</p>
            </div>

            <div className="dashboard-layout">
                <div className="main-dashboard">
                    <StatsGrid />
                    
                    <div className="hero-cards">
                        <div className="hero-card">
                            <h3>Your Music Empire</h3>
                            <p>Unlock the realm of sonic bliss with our AI-powered tools. Get career insights, track analysis, and sync opportunities tailored just for you.</p>
                            <button className="hero-button" onClick={() => setCurrentPage('ai-ar')}>
                                <i className="fas fa-robot"></i>
                                Explore AI Tools
                            </button>
                        </div>
                        <div className="hero-card">
                            <h3>Sync Opportunities</h3>
                            <p>New placement opportunities matched to your style. Film, TV, and brand partnerships waiting for your sound.</p>
                            <button className="hero-button gold" onClick={() => setCurrentPage('sync-opportunities')}>
                                <i className="fas fa-eye"></i>
                                View Matches
                            </button>
                        </div>
                    </div>

                    <div className="category-pills">
                        {categories.map(category => (
                            <button
                                key={category}
                                className={`category-pill ${activeCategory === category ? 'active' : ''}`}
                                onClick={() => setActiveCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <TrackSection 
                        title="Latest Uploads"
                        tracks={tracks}
                        playTrack={playTrack}
                    />

                    <TrackSection 
                        title="Trending Now"
                        tracks={trendingTracks}
                        playTrack={playTrack}
                    />
                </div>

                <div className="sidebar-right">
                    <AchievementsWidget />
                    <SyncOpportunitiesWidget setCurrentPage={setCurrentPage} />
                    <CommunityWidget setCurrentPage={setCurrentPage} />
                    <TrendingArtistsWidget />
                </div>
            </div>
        </div>
    );
};

// Stats Grid Component
const StatsGrid: React.FC = () => {
    return (
        <div className="stats-grid">
            <div className="stat-card">
                <span className="stat-number">1.2M</span>
                <div className="stat-label">Total Streams</div>
                <div className="stat-change">+45% this month</div>
            </div>
            <div className="stat-card earnings">
                <span className="stat-number">$3,247</span>
                <div className="stat-label">Monthly Earnings</div>
                <div className="stat-change">+23% this month</div>
            </div>
            <div className="stat-card">
                <span className="stat-number">45.8K</span>
                <div className="stat-label">Monthly Listeners</div>
                <div className="stat-change">+18% this month</div>
            </div>
            <div className="stat-card">
                <span className="stat-number">12</span>
                <div className="stat-label">Sync Placements</div>
                <div className="stat-change">+3 this month</div>
            </div>
        </div>
    );
};

// Track Section Component
const TrackSection: React.FC<{
    title: string;
    tracks: Track[];
    playTrack: (track: Track) => void;
}> = ({ title, tracks, playTrack }) => {
    return (
        <div className="content-section">
            <div className="section-header">
                <h2 className="section-title">{title}</h2>
                <a href="#" className="view-all">View All</a>
            </div>
            <div className="tracks-grid">
                {tracks.map(track => (
                    <div key={track.id} className="track-card" onClick={() => playTrack(track)}>
                        <div className="track-artwork" style={{ background: track.artwork }}>
                            <i className="fas fa-music"></i>
                        </div>
                        <div className="track-info">
                            <h4>{track.title}</h4>
                            <p>{track.genre}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Discovery Page Component
const DiscoveryPage: React.FC<{
    tracks: Track[];
    playTrack: (track: Track) => void;
    toggleFavorite: (trackId: string) => void;
    favorites: Track[];
}> = ({ tracks, playTrack, toggleFavorite, favorites }) => {
    const [activeFilter, setActiveFilter] = useState('All');
    const genres = ['All', 'Electronic', 'Hip Hop', 'Pop', 'Rock', 'Ambient'];

    const filteredTracks = activeFilter === 'All' 
        ? tracks 
        : tracks.filter(track => track.genre === activeFilter);

    return (
        <div className="page active">
            <div className="welcome-section">
                <h1 className="welcome-title">
                    <span className="highlight">Discovery</span>
                </h1>
                <p className="welcome-subtitle">Explore new artists and trending tracks</p>
            </div>

            <div className="category-pills">
                {genres.map(genre => (
                    <button
                        key={genre}
                        className={`category-pill ${activeFilter === genre ? 'active' : ''}`}
                        onClick={() => setActiveFilter(genre)}
                    >
                        {genre}
                    </button>
                ))}
            </div>

            <div className="content-section">
                <div className="section-header">
                    <h2 className="section-title">New Releases</h2>
                </div>
                <div className="tracks-grid">
                    {filteredTracks.map(track => (
                        <div key={track.id} className="track-card">
                            <div className="track-artwork" style={{ background: track.artwork }}>
                                <i className="fas fa-music"></i>
                                <button 
                                    className="favorite-btn"
                                    onClick={() => toggleFavorite(track.id)}
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        background: 'none',
                                        border: 'none',
                                        color: favorites.some(f => f.id === track.id) ? '#ef4444' : 'rgba(255,255,255,0.7)',
                                        fontSize: '1.2rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <i className="fas fa-heart"></i>
                                </button>
                            </div>
                            <div className="track-info">
                                <h4>{track.title}</h4>
                                <p>{track.artist}</p>
                                <button 
                                    className="btn-primary"
                                    onClick={() => playTrack(track)}
                                    style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                                >
                                    <i className="fas fa-play"></i> Play
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Library Page Component
const LibraryPage: React.FC<{
    tracks: Track[];
    playTrack: (track: Track) => void;
    toggleFavorite: (trackId: string) => void;
    favorites: Track[];
}> = ({ tracks, playTrack, toggleFavorite, favorites }) => {
    const [sortBy, setSortBy] = useState('recent');

    const sortedTracks = [...tracks].sort((a, b) => {
        if (sortBy === 'name') return a.title.localeCompare(b.title);
        if (sortBy === 'artist') return a.artist.localeCompare(b.artist);
        return 0;
    });

    return (
        <div className="page active">
            <div className="welcome-section">
                <h1 className="welcome-title">
                    Your <span className="highlight">Library</span>
                </h1>
                <p className="welcome-subtitle">Your personal music collection</p>
            </div>

            <div className="library-controls" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <select 
                    className="form-input" 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ width: 'auto' }}
                >
                    <option value="recent">Recent</option>
                    <option value="name">Name</option>
                    <option value="artist">Artist</option>
                </select>
            </div>

            <div className="content-section">
                <div className="section-header">
                    <h2 className="section-title">Your Tracks ({tracks.length})</h2>
                </div>
                <div className="tracks-grid">
                    {sortedTracks.map(track => (
                        <div key={track.id} className="track-card">
                            <div className="track-artwork" style={{ background: track.artwork }}>
                                <i className="fas fa-music"></i>
                                <button 
                                    className="favorite-btn"
                                    onClick={() => toggleFavorite(track.id)}
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        background: 'none',
                                        border: 'none',
                                        color: favorites.some(f => f.id === track.id) ? '#ef4444' : 'rgba(255,255,255,0.7)',
                                        fontSize: '1.2rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <i className="fas fa-heart"></i>
                                </button>
                            </div>
                            <div className="track-info">
                                <h4>{track.title}</h4>
                                <p>{track.artist}</p>
                                <button 
                                    className="btn-primary"
                                    onClick={() => playTrack(track)}
                                    style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                                >
                                    <i className="fas fa-play"></i> Play
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Favorites Page Component
const FavoritesPage: React.FC<{
    favorites: Track[];
    playTrack: (track: Track) => void;
    toggleFavorite: (trackId: string) => void;
}> = ({ favorites, playTrack, toggleFavorite }) => {
    return (
        <div className="page active">
            <div className="welcome-section">
                <h1 className="welcome-title">
                    Your <span className="highlight">Favorites</span>
                </h1>
                <p className="welcome-subtitle">Tracks and artists you love</p>
            </div>

            <div className="content-section">
                <div className="section-header">
                    <h2 className="section-title">Liked Songs ({favorites.length})</h2>
                </div>
                {favorites.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.7)' }}>
                        <i className="fas fa-heart" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}></i>
                        <p>No favorites yet. Start liking tracks to see them here!</p>
                    </div>
                ) : (
                    <div className="tracks-grid">
                        {favorites.map(track => (
                            <div key={track.id} className="track-card">
                                <div className="track-artwork" style={{ background: track.artwork }}>
                                    <i className="fas fa-music"></i>
                                    <button 
                                        className="favorite-btn"
                                        onClick={() => toggleFavorite(track.id)}
                                        style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            background: 'none',
                                            border: 'none',
                                            color: '#ef4444',
                                            fontSize: '1.2rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <i className="fas fa-heart"></i>
                                    </button>
                                </div>
                                <div className="track-info">
                                    <h4>{track.title}</h4>
                                    <p>{track.artist}</p>
                                    <button 
                                        className="btn-primary"
                                        onClick={() => playTrack(track)}
                                        style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                                    >
                                        <i className="fas fa-play"></i> Play
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// AI A&R Page Component
const AIARPage: React.FC = () => {
    const trackAnalysis = [
        { track: 'Midnight Dreams', score: 8.7, potential: 'High', market: 'Electronic/Festival' },
        { track: 'Electric Nights', score: 7.9, potential: 'Medium', market: 'Hip Hop/Urban' },
        { track: 'Urban Vibes', score: 9.2, potential: 'Very High', market: 'Chill/Streaming' }
    ];

    const syncMatches = [
        { opportunity: 'Netflix Series', match: 94, track: 'Midnight Dreams' },
        { opportunity: 'Apple Commercial', match: 87, track: 'Electric Nights' },
        { opportunity: 'Indie Game', match: 91, track: 'Urban Vibes' }
    ];

    return (
        <div className="page active">
            <div className="welcome-section">
                <h1 className="welcome-title">
                    AI <span className="highlight">A&R</span>
                </h1>
                <p className="welcome-subtitle">AI-powered track analysis and hit prediction</p>
            </div>

            <div className="dashboard-layout">
                <div className="main-dashboard">
                    <div className="sidebar-widget">
                        <h3 className="widget-title">Track Analysis</h3>
                        {trackAnalysis.map((analysis, index) => (
                            <div key={index} className="recommendation-item">
                                <div className="recommendation-header">
                                    <div className="recommendation-icon">
                                        <i className="fas fa-chart-line"></i>
                                    </div>
                                    <div className="recommendation-title">{analysis.track}</div>
                                    <div className="recommendation-badge">Score: {analysis.score}</div>
                                </div>
                                <div className="recommendation-content">
                                    Market Potential: {analysis.potential}<br/>
                                    Best Market: {analysis.market}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="sidebar-widget">
                        <h3 className="widget-title">Sync Match Analysis</h3>
                        {syncMatches.map((match, index) => (
                            <div key={index} className="achievement-item">
                                <div className="achievement-icon">
                                    <i className="fas fa-bullseye"></i>
                                </div>
                                <div className="achievement-content">
                                    <h4>{match.opportunity}</h4>
                                    <p>{match.match}% match with "{match.track}"</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="sidebar-right">
                    <div className="sidebar-widget">
                        <h3 className="widget-title">AI Insights</h3>
                        <div className="recommendation-item">
                            <div className="recommendation-content">
                                <strong>Trending Genre:</strong> Electronic music is up 23% this month
                            </div>
                        </div>
                        <div className="recommendation-item">
                            <div className="recommendation-content">
                                <strong>Best Release Time:</strong> Friday 12 PM EST for maximum impact
                            </div>
                        </div>
                        <div className="recommendation-item">
                            <div className="recommendation-content">
                                <strong>Career Advice:</strong> Focus on sync licensing - your style matches current market demand
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Music Generator Page Component
const MusicGeneratorPage: React.FC<{
    settings: MusicSettings;
    setSettings: (settings: MusicSettings) => void;
    onGenerate: () => void;
}> = ({ settings, setSettings, onGenerate }) => {
    return (
        <div className="page active">
            <div className="welcome-section">
                <h1 className="welcome-title">
                    Music <span className="highlight">Generator</span>
                </h1>
                <p className="welcome-subtitle">AI-powered music creation with SUNO integration</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', height: 'calc(100vh - 200px)' }}>
                <div className="sidebar-widget" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 className="widget-title">Create Your Music</h3>
                    
                    <div className="form-group">
                        <label>Song Title</label>
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Enter song title..." 
                            value={settings.title}
                            onChange={(e) => setSettings({...settings, title: e.target.value})}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Description</label>
                        <textarea 
                            className="form-input" 
                            placeholder="Describe your song..." 
                            value={settings.description}
                            onChange={(e) => setSettings({...settings, description: e.target.value})}
                            style={{ height: '80px' }}
                        />
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="form-group">
                            <label>Genre</label>
                            <select 
                                className="form-input" 
                                value={settings.style}
                                onChange={(e) => setSettings({...settings, style: e.target.value})}
                            >
                                <option>Electronic</option>
                                <option>Hip-Hop</option>
                                <option>Pop</option>
                                <option>Rock</option>
                                <option>R&B</option>
                                <option>Jazz</option>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label>Mood</label>
                            <select 
                                className="form-input"
                                value={settings.mood}
                                onChange={(e) => setSettings({...settings, mood: e.target.value})}
                            >
                                <option>Energetic</option>
                                <option>Chill</option>
                                <option>Emotional</option>
                                <option>Dark</option>
                                <option>Uplifting</option>
                            </select>
                        </div>
                    </div>
                    
                    <button 
                        onClick={onGenerate}
                        style={{ 
                            background: 'linear-gradient(135deg, #10B981, #059669)', 
                            border: 'none', 
                            borderRadius: '8px', 
                            padding: '12px 24px', 
                            color: 'white', 
                            fontWeight: '600', 
                            cursor: 'pointer', 
                            marginTop: 'auto' 
                        }}
                    >
                        <i className="fas fa-play"></i> Generate Music
                    </button>
                </div>
                
                <div className="sidebar-widget" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <h3 className="widget-title">Generated Music</h3>
                    
                    <div style={{ 
                        width: '180px', 
                        height: '180px', 
                        borderRadius: '12px', 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '3rem', 
                        color: 'white', 
                        marginBottom: '20px' 
                    }}>
                        <i className="fas fa-music"></i>
                    </div>
                    
                    <h4 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>
                        {settings.title || 'Your Generated Track'}
                    </h4>
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '20px' }}>
                        {settings.style} • {settings.mood}
                    </p>
                    
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                        <button style={{ background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', padding: '8px 12px', color: 'white', cursor: 'pointer' }}>
                            <i className="fas fa-heart"></i>
                        </button>
                        <button style={{ background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', padding: '8px 12px', color: 'white', cursor: 'pointer' }}>
                            <i className="fas fa-share"></i>
                        </button>
                        <button style={{ background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', padding: '8px 12px', color: 'white', cursor: 'pointer' }}>
                            <i className="fas fa-download"></i>
                        </button>
                    </div>
                    
                    <div style={{ flex: 1, width: '100%' }}>
                        <h4 style={{ marginBottom: '12px', color: '#3B82F6' }}>Description</h4>
                        <div style={{ 
                            background: 'rgba(15, 20, 25, 0.3)', 
                            border: '1px solid rgba(59, 130, 246, 0.1)', 
                            borderRadius: '8px', 
                            padding: '16px', 
                            maxHeight: '200px', 
                            overflowY: 'auto', 
                            fontSize: '0.9rem', 
                            lineHeight: '1.6', 
                            color: 'rgba(255, 255, 255, 0.8)', 
                            textAlign: 'left' 
                        }}>
                            {settings.description || 'Add a description to your track to see it here...'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Community Page Component
const CommunityPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('feed');
    const [newPost, setNewPost] = useState('');
    const [posts, setPosts] = useState([
        {
            id: '1',
            user: { name: 'Alex Rivera', avatar: 'AR', verified: true },
            content: 'Just dropped my new track "Midnight Vibes"! Working on this for months. What do you all think? 🎵',
            timestamp: '2 hours ago',
            likes: 23,
            comments: 5,
            shares: 2,
            track: { title: 'Midnight Vibes', genre: 'Electronic' }
        },
        {
            id: '2', 
            user: { name: 'Maya Chen', avatar: 'MC', verified: false },
            content: 'Looking for a vocalist for my new pop track. Need someone with range and soul. DM me if interested! 🎤',
            timestamp: '4 hours ago',
            likes: 15,
            comments: 8,
            shares: 1
        },
        {
            id: '3',
            user: { name: 'Jordan Smith', avatar: 'JS', verified: true },
            content: 'Studio session vibes 🔥 Working on something special with the team. Can\'t wait to share!',
            timestamp: '6 hours ago',
            likes: 42,
            comments: 12,
            shares: 5
        }
    ]);

    const submitPost = () => {
        if (!newPost.trim()) return;
        
        const post = {
            id: Date.now().toString(),
            user: { name: 'Hollywood Producer', avatar: 'HP', verified: true },
            content: newPost,
            timestamp: 'now',
            likes: 0,
            comments: 0,
            shares: 0
        };
        
        setPosts([post, ...posts]);
        setNewPost('');
    };

    return (
        <div className="page active">
            <div className="welcome-section">
                <h1 className="welcome-title">Community</h1>
                <p className="welcome-subtitle">Connect with fellow artists, share your journey, and discover new collaborations.</p>
            </div>

            <div className="community-tabs">
                <button 
                    className={`tab-button ${activeTab === 'feed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('feed')}
                >
                    <i className="fas fa-home"></i> Feed
                </button>
                <button 
                    className={`tab-button ${activeTab === 'artists' ? 'active' : ''}`}
                    onClick={() => setActiveTab('artists')}
                >
                    <i className="fas fa-users"></i> Artists
                </button>
                <button 
                    className={`tab-button ${activeTab === 'collaborations' ? 'active' : ''}`}
                    onClick={() => setActiveTab('collaborations')}
                >
                    <i className="fas fa-handshake"></i> Collaborations
                </button>
            </div>

            {activeTab === 'feed' && (
                <div className="community-feed">
                    <div className="post-composer">
                        <div className="composer-header">
                            <div className="user-avatar">HP</div>
                            <textarea
                                placeholder="Share your musical journey..."
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                                className="post-textarea"
                            />
                        </div>
                        <div className="composer-actions">
                            <button className="attach-button"><i className="fas fa-music"></i> Attach Track</button>
                            <button className="post-button" onClick={submitPost}>
                                <i className="fas fa-paper-plane"></i> Post
                            </button>
                        </div>
                    </div>

                    <div className="posts-container">
                        {posts.map(post => (
                            <div key={post.id} className="community-post">
                                <div className="post-header">
                                    <div className="post-user">
                                        <div className="user-avatar">{post.user.avatar}</div>
                                        <div className="user-info">
                                            <h4>
                                                {post.user.name}
                                                {post.user.verified && <i className="fas fa-check-circle verified"></i>}
                                            </h4>
                                            <span>{post.timestamp}</span>
                                        </div>
                                    </div>
                                    <button className="post-menu"><i className="fas fa-ellipsis-h"></i></button>
                                </div>
                                
                                <div className="post-content">
                                    <p>{post.content}</p>
                                    {post.track && (
                                        <div className="attached-track">
                                            <div className="track-artwork">
                                                <i className="fas fa-music"></i>
                                            </div>
                                            <div className="track-info">
                                                <h5>{post.track.title}</h5>
                                                <p>{post.track.genre}</p>
                                            </div>
                                            <button className="play-btn"><i className="fas fa-play"></i></button>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="post-actions">
                                    <button className="action-btn">
                                        <i className="fas fa-heart"></i> {post.likes}
                                    </button>
                                    <button className="action-btn">
                                        <i className="fas fa-comment"></i> {post.comments}
                                    </button>
                                    <button className="action-btn">
                                        <i className="fas fa-share"></i> {post.shares}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'artists' && (
                <div className="artists-grid">
                    {[
                        { name: 'Synth Wave', followers: '2.3M', genre: 'Electronic', avatar: 'SW' },
                        { name: 'Beat Masters', followers: '1.8M', genre: 'Hip Hop', avatar: 'BM' },
                        { name: 'Chill Vibes', followers: '1.2M', genre: 'Ambient', avatar: 'CV' }
                    ].map((artist, index) => (
                        <div key={index} className="artist-card">
                            <div className="artist-avatar">{artist.avatar}</div>
                            <h4>{artist.name}</h4>
                            <p>{artist.genre} • {artist.followers} followers</p>
                            <button className="follow-btn">Follow</button>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'collaborations' && (
                <div className="collaboration-requests">
                    <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
                        Collaboration features coming soon!
                    </p>
                </div>
            )}
        </div>
    );
};

// Chat Page Component
const ChatPage: React.FC = () => {
    const [activeChat, setActiveChat] = useState('alex');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
        alex: [
            { id: '1', sender: 'Alex Rivera', content: 'Hey! Loved your latest track!', timestamp: '10:30 AM' },
            { id: '2', sender: 'me', content: 'Thanks! Working on something new', timestamp: '10:32 AM' }
        ]
    });

    const chats = [
        { id: 'alex', name: 'Alex Rivera', avatar: 'AR', lastMessage: 'Thanks! Working on something new', online: true },
        { id: 'maya', name: 'Maya Chen', avatar: 'MC', lastMessage: 'Let\'s collaborate!', online: false },
        { id: 'jordan', name: 'Jordan Smith', avatar: 'JS', lastMessage: 'Studio session tomorrow?', online: true }
    ];

    const sendMessage = () => {
        if (!message.trim()) return;
        
        const newMessage = {
            id: Date.now().toString(),
            sender: 'me',
            content: message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => ({
            ...prev,
            [activeChat]: [...(prev[activeChat] || []), newMessage]
        }));
        setMessage('');
    };

    return (
        <div className="page active">
            <div className="chat-container">
                <div className="chat-sidebar">
                    <div className="chat-header">
                        <h3>Messages</h3>
                        <button className="new-chat-btn"><i className="fas fa-plus"></i></button>
                    </div>
                    <div className="chat-list">
                        {chats.map(chat => (
                            <div 
                                key={chat.id} 
                                className={`chat-item ${activeChat === chat.id ? 'active' : ''}`}
                                onClick={() => setActiveChat(chat.id)}
                            >
                                <div className="chat-avatar">
                                    {chat.avatar}
                                    {chat.online && <div className="online-indicator"></div>}
                                </div>
                                <div className="chat-info">
                                    <h4>{chat.name}</h4>
                                    <p>{chat.lastMessage}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="chat-main">
                    <div className="chat-header">
                        <div className="active-chat-info">
                            <div className="chat-avatar">AR</div>
                            <div>
                                <h4>Alex Rivera</h4>
                                <span>Online</span>
                            </div>
                        </div>
                        <button className="chat-actions"><i className="fas fa-ellipsis-v"></i></button>
                    </div>

                    <div className="messages-container">
                        {(messages[activeChat] || []).map(msg => (
                            <div key={msg.id} className={`message ${msg.sender === 'me' ? 'sent' : 'received'}`}>
                                <div className="message-content">{msg.content}</div>
                                <div className="message-time">{msg.timestamp}</div>
                            </div>
                        ))}
                    </div>

                    <div className="message-input">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <button onClick={sendMessage}><i className="fas fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Analytics Page Component
const AnalyticsPage: React.FC = () => {
    const [timeRange, setTimeRange] = useState('monthly');
    
    const exportAnalytics = () => {
        const csvData = [
            ['Metric', 'Value', 'Change'],
            ['Total Streams', '1,200,000', '+45%'],
            ['Monthly Earnings', '$3,247', '+23%'],
            ['Monthly Listeners', '45,800', '+18%'],
            ['Sync Placements', '12', '+3']
        ];

        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'soundstream-analytics-report.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        alert('Analytics report downloaded successfully!');
    };

    return (
        <div className="page active">
            <div className="analytics-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="analytics-title" style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Analytics Dashboard</h1>
                    <p style={{ color: 'rgba(255,255,255,0.7)' }}>Track your performance and growth over time</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <select 
                        value={timeRange} 
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="form-input"
                        style={{ width: 'auto' }}
                    >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                    <button className="export-button btn btn-primary" onClick={exportAnalytics}>
                        <i className="fas fa-download"></i>
                        Export Report
                    </button>
                </div>
            </div>

            <StatsGrid />

            <div className="analytics-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                <div className="chart-container" style={{ background: 'rgba(26, 31, 58, 0.3)', borderRadius: '16px', padding: '1.5rem' }}>
                    <h3 className="chart-title" style={{ marginBottom: '1rem', color: '#3B82F6' }}>
                        {timeRange === 'weekly' ? 'Weekly' : timeRange === 'monthly' ? 'Monthly' : 'Yearly'} Streams
                    </h3>
                    <div className="chart-canvas" style={{ 
                        height: '300px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: 'rgba(255,255,255,0.7)',
                        border: '2px dashed rgba(59, 130, 246, 0.3)',
                        borderRadius: '8px'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <i className="fas fa-chart-line" style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.5 }}></i>
                            <p>Streams chart will load here</p>
                            <small>Integration with Chart.js coming soon</small>
                        </div>
                    </div>
                </div>
                
                <div className="chart-container" style={{ background: 'rgba(26, 31, 58, 0.3)', borderRadius: '16px', padding: '1.5rem' }}>
                    <h3 className="chart-title" style={{ marginBottom: '1rem', color: '#10B981' }}>Revenue Growth</h3>
                    <div className="chart-canvas" style={{ 
                        height: '300px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: 'rgba(255,255,255,0.7)',
                        border: '2px dashed rgba(16, 185, 129, 0.3)',
                        borderRadius: '8px'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <i className="fas fa-dollar-sign" style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.5 }}></i>
                            <p>Revenue chart will load here</p>
                            <small>Integration with Chart.js coming soon</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sync Opportunities Page Component
const SyncOpportunitiesPage: React.FC<{
    opportunities: SyncOpportunity[];
    onSubmit: (id: string) => void;
}> = ({ opportunities, onSubmit }) => {
    return (
        <div className="page active sync-opportunities-page">
            <div className="sync-header">
                <h1 className="sync-title">Sync Opportunities</h1>
                <p className="sync-subtitle">Discover placement opportunities for your music in films, TV shows, commercials, and games.</p>
            </div>

            <div className="sync-grid">
                {opportunities.map(opportunity => (
                    <div key={opportunity.id} className={`sync-opportunity ${opportunity.badge === 'premium' ? 'premium' : ''}`}>
                        <div className={`sync-badge ${opportunity.badge}`}>
                            {opportunity.badge === 'hot' && 'HOT MATCH'}
                            {opportunity.badge === 'premium' && 'PREMIUM'}
                            {opportunity.badge === 'new' && 'NEW'}
                        </div>
                        
                        <h3 className="sync-company">{opportunity.company}</h3>
                        <p className="sync-description">{opportunity.description}</p>
                        
                        <div className="sync-details">
                            <div className="sync-payment">{opportunity.payment}</div>
                            <div className="sync-deadline">Deadline: {opportunity.deadline}</div>
                        </div>
                        
                        <div className="sync-genres">
                            {opportunity.genres.map((genre, index) => (
                                <span key={index} className="sync-genre">{genre}</span>
                            ))}
                        </div>
                        
                        <button 
                            className={`submit-button ${opportunity.submitted ? 'submitted' : ''}`}
                            onClick={() => !opportunity.submitted && onSubmit(opportunity.id)}
                            disabled={opportunity.submitted}
                        >
                            {opportunity.submitted ? (
                                <>
                                    <i className="fas fa-check"></i>
                                    Submitted Successfully
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-paper-plane"></i>
                                    Submit Music
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Coming Soon Page Component
const ComingSoonPage: React.FC<{ page: string }> = ({ page }) => {
    const pageInfo: { [key: string]: { icon: string; title: string; description: string } } = {
        'ai-manager': { icon: 'fas fa-user-tie', title: 'AI Manager', description: 'Your personal AI career manager and strategic advisor. Coming soon!' },
        'vocal-ai': { icon: 'fas fa-microphone', title: 'Vocal AI', description: 'AI vocal enhancement and processing tools. Coming soon!' }
    };

    const info = pageInfo[page] || { icon: 'fas fa-cog', title: 'Feature', description: 'This feature is coming soon!' };

    return (
        <div className="page active">
            <div className="coming-soon" style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.7)' }}>
                <div className="coming-soon-icon" style={{ fontSize: '4rem', marginBottom: '2rem', opacity: 0.3 }}>
                    <i className={info.icon}></i>
                </div>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{info.title}</h2>
                <p style={{ fontSize: '1.1rem' }}>{info.description}</p>
            </div>
        </div>
    );
};

// Music Player Component
const MusicPlayer: React.FC<{
    track: Track;
    isPlaying: boolean;
    togglePlay: () => void;
}> = ({ track, isPlaying, togglePlay }) => {
    return (
        <div className="bottom-music-player active">
            <div className="player-track-info">
                <div className="player-artwork">
                    <i className="fas fa-music"></i>
                </div>
                <div className="player-info">
                    <h4>{track.title}</h4>
                    <p>{track.artist}</p>
                </div>
            </div>
            <div className="player-controls">
                <button className="player-button">
                    <i className="fas fa-step-backward"></i>
                </button>
                <button className="play-button" onClick={togglePlay}>
                    <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`}></i>
                </button>
                <button className="player-button">
                    <i className="fas fa-step-forward"></i>
                </button>
            </div>
            <div className="player-volume">
                <button className="player-button">
                    <i className="fas fa-volume-up"></i>
                </button>
                <input type="range" className="volume-slider" min="0" max="100" defaultValue={70} />
            </div>
        </div>
    );
};

// Enhanced Profile Modal Component
const EnhancedProfileModal: React.FC<{
    user: User;
    onClose: () => void;
    onSave: (data: Partial<User>) => void;
}> = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState(user);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData({...formData, avatar: e.target?.result as string});
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <div className="modal-overlay active">
            <div className="modal-content" style={{ maxWidth: '600px' }}>
                <div className="modal-header">
                    <h2>Edit Profile</h2>
                    <button className="close-button" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label>Profile Picture</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div className="user-avatar" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                                {formData.avatar ? (
                                    <img src={formData.avatar} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                                ) : (
                                    formData.name.split(' ').map(n => n[0]).join('')
                                )}
                            </div>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="form-input" />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>Display Name</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Bio</label>
                        <textarea
                            className="form-input"
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                            rows={3}
                            placeholder="Tell us about yourself..."
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Social Media Links</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                            <input
                                type="url"
                                className="form-input"
                                placeholder="Instagram URL"
                                value={formData.socialLinks.instagram}
                                onChange={(e) => setFormData({
                                    ...formData, 
                                    socialLinks: {...formData.socialLinks, instagram: e.target.value}
                                })}
                            />
                            <input
                                type="url"
                                className="form-input"
                                placeholder="Twitter URL"
                                value={formData.socialLinks.twitter}
                                onChange={(e) => setFormData({
                                    ...formData, 
                                    socialLinks: {...formData.socialLinks, twitter: e.target.value}
                                })}
                            />
                            <input
                                type="url"
                                className="form-input"
                                placeholder="TikTok URL"
                                value={formData.socialLinks.tiktok}
                                onChange={(e) => setFormData({
                                    ...formData, 
                                    socialLinks: {...formData.socialLinks, tiktok: e.target.value}
                                })}
                            />
                            <input
                                type="url"
                                className="form-input"
                                placeholder="YouTube URL"
                                value={formData.socialLinks.youtube}
                                onChange={(e) => setFormData({
                                    ...formData, 
                                    socialLinks: {...formData.socialLinks, youtube: e.target.value}
                                })}
                            />
                            <input
                                type="url"
                                className="form-input"
                                placeholder="Spotify URL"
                                value={formData.socialLinks.spotify}
                                onChange={(e) => setFormData({
                                    ...formData, 
                                    socialLinks: {...formData.socialLinks, spotify: e.target.value}
                                })}
                            />
                            <input
                                type="url"
                                className="form-input"
                                placeholder="Website URL"
                                value={formData.socialLinks.website}
                                onChange={(e) => setFormData({
                                    ...formData, 
                                    socialLinks: {...formData.socialLinks, website: e.target.value}
                                })}
                            />
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
                </div>
            </div>
        </div>
    );
};

// Settings Modal Component
const SettingsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const handleSave = () => {
        alert('Settings saved successfully!');
        onClose();
    };

    return (
        <div className="modal-overlay active">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Settings</h2>
                    <button className="close-button" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="modal-body">
                    <div className="checkbox-group">
                        <input type="checkbox" id="notifications" defaultChecked />
                        <label htmlFor="notifications">Email Notifications</label>
                    </div>
                    <div className="checkbox-group">
                        <input type="checkbox" id="autoplay" defaultChecked />
                        <label htmlFor="autoplay">Autoplay</label>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
};

// Upload Modal Component
const UploadModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [trackData, setTrackData] = useState({
        name: '',
        genre: 'Electronic',
        allowDownload: false
    });

    const handleUpload = () => {
        if (!trackData.name) {
            alert('Please enter a track name');
            return;
        }
        alert(`Track "${trackData.name}" uploaded successfully!`);
        onClose();
    };

    return (
        <div className="modal-overlay active">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Upload Track</h2>
                    <button className="close-button" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="modal-body">
                    <div className="upload-area" style={{
                        border: '2px dashed rgba(59, 130, 246, 0.3)',
                        borderRadius: '12px',
                        padding: '40px',
                        textAlign: 'center',
                        marginBottom: '20px'
                    }}>
                        <div className="upload-icon" style={{ fontSize: '3rem', color: 'rgba(59, 130, 246, 0.5)', marginBottom: '16px' }}>
                            <i className="fas fa-cloud-upload-alt"></i>
                        </div>
                        <div className="upload-text" style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Drag & drop your track here</div>
                        <div className="upload-subtext" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>or click to browse (MP3, WAV, FLAC)</div>
                    </div>

                    <div className="form-group">
                        <label>Track Name</label>
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Enter track name"
                            value={trackData.name}
                            onChange={(e) => setTrackData({...trackData, name: e.target.value})}
                        />
                    </div>

                    <div className="checkbox-group">
                        <input 
                            type="checkbox" 
                            id="allowDownload"
                            checked={trackData.allowDownload}
                            onChange={(e) => setTrackData({...trackData, allowDownload: e.target.checked})}
                        />
                        <label htmlFor="allowDownload">Allow fans to download this track</label>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleUpload}>Upload Track</button>
                </div>
            </div>
        </div>
    );
};

// Widget Components
const AchievementsWidget: React.FC = () => {
    const achievements = [
        { icon: 'fas fa-crown', title: 'Elite Status Achieved', description: 'Welcome to the Elite tier!' },
        { icon: 'fas fa-chart-line', title: '1M Streams Milestone', description: 'Your music reached 1 million streams' },
        { icon: 'fas fa-tv', title: 'Sync Placement Success', description: 'Featured in Netflix series' }
    ];

    return (
        <div className="sidebar-widget">
            <h3 className="widget-title">Recent Achievements</h3>
            {achievements.map((achievement, index) => (
                <div key={index} className="achievement-item">
                    <div className="achievement-icon">
                        <i className={achievement.icon}></i>
                    </div>
                    <div className="achievement-content">
                        <h4>{achievement.title}</h4>
                        <p>{achievement.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

const SyncOpportunitiesWidget: React.FC<{ setCurrentPage: (page: string) => void }> = ({ setCurrentPage }) => {
    const opportunities = [
        { icon: 'fas fa-tv', title: 'Netflix Original Series', badge: 'HOT MATCH', description: 'Looking for electronic/ambient tracks for dramatic scenes', meta: 'Deadline: 3 days • $5,000 - $15,000' },
        { icon: 'fas fa-bullhorn', title: 'Apple Commercial', badge: 'PREMIUM', description: 'Upbeat electronic music for new iPhone campaign', meta: 'Deadline: 5 days • $10,000 - $25,000' },
        { icon: 'fas fa-gamepad', title: 'Gaming Soundtrack', badge: 'NEW', description: 'Atmospheric tracks for indie game soundtrack', meta: 'Deadline: 1 week • $2,000 - $8,000' }
    ];

    return (
        <div className="sidebar-widget">
            <h3 className="widget-title">Premium Sync Opportunities</h3>
            {opportunities.map((opp, index) => (
                <div key={index} className="recommendation-item" onClick={() => setCurrentPage('sync-opportunities')}>
                    <div className="recommendation-header">
                        <div className="recommendation-icon">
                            <i className={opp.icon}></i>
                        </div>
                        <div className="recommendation-title">{opp.title}</div>
                        <div className="recommendation-badge">{opp.badge}</div>
                    </div>
                    <div className="recommendation-content">{opp.description}</div>
                    <div className="recommendation-meta">{opp.meta}</div>
                </div>
            ))}
        </div>
    );
};

const CommunityWidget: React.FC<{ setCurrentPage: (page: string) => void }> = ({ setCurrentPage }) => {
    const communityPosts = [
        { avatar: 'AR', name: 'Alex Rivera', content: 'Just dropped my new track "Midnight Vibes"! What do you think?', likes: 23, comments: 5 },
        { avatar: 'MC', name: 'Maya Chen', content: 'Looking for a vocalist for my new pop track. DM me if interested!', likes: 15, comments: 8 },
        { avatar: 'JS', name: 'Jordan Smith', content: 'Studio session vibes 🔥 Working on something special', likes: 42, comments: 12 }
    ];

    return (
        <div className="sidebar-widget">
            <h3 className="widget-title">Community Feed</h3>
            {communityPosts.map((post, index) => (
                <div key={index} className="community-item" onClick={() => setCurrentPage('community')}>
                    <div className="community-avatar">{post.avatar}</div>
                    <div className="community-content">
                        <h4>{post.name}</h4>
                        <p>{post.content}</p>
                        <div className="community-meta">
                            <span><i className="fas fa-heart"></i> {post.likes}</span>
                            <span><i className="fas fa-comment"></i> {post.comments}</span>
                            <span><i className="fas fa-share"></i> Share</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const TrendingArtistsWidget: React.FC = () => {
    const artists = [
        { rank: 1, avatar: 'SW', name: 'Synth Wave', followers: '2.3M followers' },
        { rank: 2, avatar: 'BM', name: 'Beat Masters', followers: '1.8M followers' },
        { rank: 3, avatar: 'CV', name: 'Chill Vibes', followers: '1.2M followers' }
    ];

    return (
        <div className="sidebar-widget">
            <h3 className="widget-title">Trending Artists</h3>
            {artists.map((artist, index) => (
                <div key={index} className="trending-item">
                    <div className="trending-rank">#{artist.rank}</div>
                    <div className="trending-avatar">{artist.avatar}</div>
                    <div className="trending-info">
                        <h4>{artist.name}</h4>
                        <p>{artist.followers}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Dashboard;