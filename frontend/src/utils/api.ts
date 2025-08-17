// API Configuration for SoundStream AI A&R Platform
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export interface TrackAnalysis {
  trackId: string;
  hitPotential: number;
  genreMatch: string;
  marketTrends: string[];
  syncOpportunities: SyncOpportunity[];
  recommendations: string[];
  confidence: number;
  analysisDate: Date;
  billboardComparison: BillboardMatch[];
  socialMediaPotential: SocialMediaPotential;
  successTimeline: SuccessTimeline;
  audioFeatures: AudioFeatures;
}

export interface SyncOpportunity {
  id: string;
  title: string;
  type: 'tv' | 'film' | 'commercial' | 'game' | 'podcast' | 'streaming' | 'social';
  description: string;
  budget: string;
  deadline: Date;
  genre: string[];
  mood: string[];
  matchScore: number;
  status: 'available' | 'submitted' | 'accepted' | 'rejected';
  estimatedRevenue?: {
    minimum: number;
    maximum: number;
    average: number;
  };
  competitionLevel?: string;
  successProbability?: number;
}

export interface BillboardMatch {
  songTitle: string;
  artist: string;
  peakPosition: number;
  similarity: number;
  year: number;
}

export interface SocialMediaPotential {
  tikTokPotential: number;
  instagramPotential: number;
  viralHookPotential: number;
  danceabilityScore: number;
  shareabilityScore: number;
  overallSocialScore: number;
  platforms: Array<{
    platform: string;
    score: number;
    recommendation: string;
  }>;
}

export interface SuccessTimeline {
  chartPotential: string;
  radioPlay: string;
  majorLabelInterest: string;
  syncPlacements: string;
}

export interface AudioFeatures {
  tempo: number;
  energy: number;
  danceability: number;
  valence: number;
  key: string;
  mode: string;
}

export interface AIManagerMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  trackContext?: string;
  actionItems?: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  userType: 'listener' | 'artist' | 'label';
  subscription: 'free' | 'pro' | 'pro_plus' | 'elite';
  createdAt: Date;
}

export class SoundStreamAPI {
  // Track Analysis
  static async analyzeTrack(audioFile: File, metadata: { title?: string; artist?: string; genre?: string }): Promise<TrackAnalysis> {
    const formData = new FormData();
    formData.append('audio', audioFile);
    if (metadata.title) formData.append('title', metadata.title);
    if (metadata.artist) formData.append('artist', metadata.artist);
    if (metadata.genre) formData.append('genre', metadata.genre);

    const response = await fetch(`${API_BASE_URL}/api/analyze-track`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Analysis failed: ${response.statusText}`);
    }

    return response.json();
  }

  // AI Manager Chat
  static async chatWithAIManager(message: string, trackAnalysis?: TrackAnalysis): Promise<AIManagerMessage> {
    const response = await fetch(`${API_BASE_URL}/api/ai-manager`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        trackAnalysis,
        context: 'career_guidance'
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `AI Manager error: ${response.statusText}`);
    }

    return response.json();
  }

  // Sync Opportunities
  static async getSyncOpportunities(trackAnalysis: TrackAnalysis): Promise<SyncOpportunity[]> {
    const response = await fetch(`${API_BASE_URL}/api/sync-opportunities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trackAnalysis),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Sync opportunities error: ${response.statusText}`);
    }

    return response.json();
  }

  // Submit to Sync Opportunities
  static async submitToSyncOpportunities(trackId: string, opportunityIds: string[]): Promise<{ success: boolean; submissions: string[] }> {
    const response = await fetch(`${API_BASE_URL}/api/sync-submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        trackId,
        opportunityIds,
        userConsent: true
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Submission error: ${response.statusText}`);
    }

    return response.json();
  }

  // Health Check
  static async healthCheck(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Get User Tracks
  static async getUserTracks(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/tracks`);
    
    if (!response.ok) {
      throw new Error(`Failed to get tracks: ${response.statusText}`);
    }

    return response.json();
  }

  // Get User Analyses
  static async getUserAnalyses(): Promise<TrackAnalysis[]> {
    const response = await fetch(`${API_BASE_URL}/api/analyses`);
    
    if (!response.ok) {
      throw new Error(`Failed to get analyses: ${response.statusText}`);
    }

    return response.json();
  }

  // Billboard Charts
  static async getBillboardCharts(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/billboard/charts`);
    
    if (!response.ok) {
      throw new Error(`Failed to get Billboard charts: ${response.statusText}`);
    }

    return response.json();
  }
}

// Auth API (placeholder for Supabase integration)
export class AuthAPI {
  static async signUp(userData: {
    email: string;
    password: string;
    name: string;
    userType: 'listener' | 'artist' | 'label';
  }): Promise<UserProfile> {
    // TODO: Integrate with Supabase
    console.log('Sign up:', userData);
    return {
      id: '1',
      name: userData.name,
      email: userData.email,
      userType: userData.userType,
      subscription: 'free',
      createdAt: new Date()
    };
  }

  static async signIn(credentials: {
    email: string;
    password: string;
  }): Promise<UserProfile> {
    // TODO: Integrate with Supabase
    console.log('Sign in:', credentials);
    return {
      id: '1',
      name: 'Demo User',
      email: credentials.email,
      userType: 'artist',
      subscription: 'pro',
      createdAt: new Date()
    };
  }

  static async signOut(): Promise<void> {
    // TODO: Integrate with Supabase
    console.log('Sign out');
  }

  static async getCurrentUser(): Promise<UserProfile | null> {
    // TODO: Integrate with Supabase
    return null;
  }
}

export default SoundStreamAPI;