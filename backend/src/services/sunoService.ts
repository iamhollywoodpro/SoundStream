// sunoService.ts
import axios from 'axios';

// Define the interface for the status response according to your existing types
export interface SunoTaskResult {
  status: string;
  audio_url?: string;  // Using the original property names expected by the component
  image_url?: string;
  lyrics?: string;
  error?: string;
  progress?: number;
  completion_percentage?: number;
  apiSource?: string;
}

// Define types for our service
interface LyricsParams {
  title: string;
  description: string;
  style: string;
  mood: string;
}

interface MusicParams {
  title: string;
  description: string;
  lyrics: string;
  style: string;
  mood: string;
  instrumental: boolean;
  tempo?: number;
  key?: string;
  duration?: number;
}

interface GenerationResponse {
  taskId?: string;
  generationId?: string;
  status?: string;
  apiSource?: string;
  lyrics?: string;
}

// Enhanced lyrics generation for mock fallbacks
const generateEnhancedMockLyrics = (params: LyricsParams): string => {
  const { title, description, style, mood } = params;
  
  // Genre based templates
  const genreTemplates: {[key: string]: string[]} = {
    'Pop': [
      '[Verse]\nI\'m dancing through the night\nFeeling the rhythm, feeling it right\nYour love is like a melody\nPlaying on repeat, can\'t you see',
      '[Verse]\nUnder the city lights\nWe find our paradise tonight\nEvery moment feels so right\nWhen I\'m with you, everything\'s bright'
    ],
    'Rock': [
      '[Verse]\nBreaking through the walls\nRising after every fall\nThe fire inside won\'t die\nScreaming out into the night',
      '[Verse]\nRebellion in my veins\nBreaking all these chains\nStanding tall against the world\nMy truth finally unfurled'
    ],
    'Hip Hop': [
      '[Verse]\nSpitting verses like fire\nElevating higher and higher\nReal talk, no fiction\nThis is my life, my addiction',
      '[Verse]\nOn these streets I found my way\nGrinding harder every day\nFrom nothing to something, watch me rise\nNo compromise, no disguise'
    ],
    'Electronic': [
      '[Verse]\nDigital waves washing over me\nLost in the sound, finally free\nPulsing beats, electric dreams\nReality tears at the seams',
      '[Verse]\nSynths taking control of my mind\nLeaving the ordinary behind\nVibrations through my soul tonight\nIn this electronic paradise'
    ]
  };
  
  // Mood based choruses
  const moodTemplates: {[key: string]: string[]} = {
    'Upbeat': [
      '[Chorus]\nThis is our moment to shine\nEverything's gonna be alright\nRaise your hands up to the sky\nLiving this life at full height',
      '[Chorus]\nJumping higher than before\nBreaking through every door\nFeeling this energy inside\nOn this amazing, endless ride'
    ],
    'Energetic': [
      '[Chorus]\nPower surging through my veins\nBreaking free from these chains\nNothing can stop us now\nWe'll make it somehow',
      '[Chorus]\nIgnite the fire within\nLet the energy begin\nExploding into the night\nWith passion burning bright'
    ],
    'Chill': [
      '[Chorus]\nTaking it easy, going with the flow\nWherever this journey decides to go\nNo pressure, no stress today\nJust living life the peaceful way',
      '[Chorus]\nGentle waves of tranquility\nWashing over you and me\nBreathing in the moment now\nJust being present, that's the vow'
    ],
    'Melancholic': [
      '[Chorus]\nMemories fade but feelings remain\nCan't escape this beautiful pain\nSomewhere between joy and sorrow\nUnsure of what comes tomorrow',
      '[Chorus]\nBittersweet symphony of life\nCutting through me like a knife\nBeauty in this melancholy\nEmbracing all that used to be'
    ]
  };
  
  // Determine which templates to use
  const verses = genreTemplates[style] || genreTemplates['Pop'];
  const choruses = moodTemplates[mood] || moodTemplates['Upbeat'];
  
  // Create bridge with title and description
  const bridge = `[Bridge]\nThrough ${title}'s journey we find\n${description}\nMoments that transform our soul\nMaking us feel whole`;
  
  // Assemble the song
  return `[Intro]\n${title}\n\n${verses[0]}\n\n${choruses[0]}\n\n${verses[verses.length > 1 ? 1 : 0]}\n\n${choruses[choruses.length > 1 ? 1 : 0]}\n\n${bridge}\n\n${choruses[0]}\n\n[Outro]\n${title} - ${mood} feelings remain`;
};

// Generate mock audio URL
const generateMockAudioUrl = (): string => {
  const mockUrls = [
    'https://soundstream-ai.s3.amazonaws.com/mock/ai-generated-song-1.mp3',
    'https://soundstream-ai.s3.amazonaws.com/mock/ai-generated-song-2.mp3',
    'https://soundstream-ai.s3.amazonaws.com/mock/ai-generated-song-3.mp3',
    'https://soundstream-ai.s3.amazonaws.com/mock/ai-generated-track.mp3',
    'https://soundstream-ai.s3.amazonaws.com/mock/fresh-ai-mix.mp3'
  ];
  return mockUrls[Math.floor(Math.random() * mockUrls.length)];
};

// Create the service
const sunoService = {
  // Generate lyrics - matches the original expected interface
  generateLyrics: async (params: LyricsParams): Promise<GenerationResponse> => {
    try {
      console.log('Generating lyrics with params:', params);
      const prompt = `Create ${params.mood || 'vibrant'} ${params.style || 'pop'} lyrics for a song titled "${params.title}" about ${params.description}`;
      
      // First try with SUNO API
      try {
        const response = await axios.post('/api/suno/generate-lyrics', { prompt });
        console.log('Lyrics API response:', response.data);
        
        if (response.data.lyrics) {
          // Direct response with lyrics
          return {
            status: 'SUCCESS',
            lyrics: response.data.lyrics,
            apiSource: response.data.apiSource || 'SUNO'
          };
        } else if (response.data.taskId) {
          // Need to check status later
          return {
            taskId: `${response.data.taskId}::${response.data.apiSource || 'SUNO'}`,
            status: 'PROCESSING',
            apiSource: response.data.apiSource || 'SUNO'
          };
        } else {
          throw new Error('Invalid API response format');
        }
      } catch (error) {
        console.error('API error generating lyrics:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in generateLyrics service:', error);
      // Use enhanced mock lyrics as fallback
      return {
        status: 'SUCCESS',
        lyrics: generateEnhancedMockLyrics(params),
        apiSource: 'MOCK'
      };
    }
  },
  
  // Generate music - matches the original expected interface
  generateMusic: async (params: MusicParams): Promise<GenerationResponse> => {
    try {
      console.log('Generating music with params:', params);
      
      try {
        const response = await axios.post('/api/suno/generate-music', { 
          lyrics: params.lyrics,
          genre: params.style
        });
        console.log('Music API response:', response.data);
        
        if (response.data.audio_url) {
          // Direct response with audio URL
          return {
            status: 'SUCCESS',
            taskId: response.data.taskId || 'mock-id',
            apiSource: response.data.apiSource || 'MOCK'
          };
        } else if (response.data.taskId) {
          // Need to check status later
          return {
            taskId: `${response.data.taskId}::${response.data.apiSource || 'SUNO'}`,
            status: 'PROCESSING',
            apiSource: response.data.apiSource || 'SUNO'
          };
        } else {
          throw new Error('Invalid API response format');
        }
      } catch (err) {
        console.error('API error generating music:', err);
        throw err;
      }
    } catch (error) {
      console.error('Error in generateMusic service:', error);
      
      // Return mock task ID as fallback
      return {
        taskId: `mock-${Date.now()}`,
        status: 'PROCESSING',
        apiSource: 'MOCK'
      };
    }
  },
  
  // Check generation status - IMPORTANT: Use the original parameter signature!
  getGenerationStatus: async (taskId: string): Promise<SunoTaskResult> => {
    try {
      console.log('Checking status for task:', taskId);
      
      // Extract the API source from the task ID if available
      const parts = taskId.split('::');
      const actualId = parts[0] || taskId;
      const apiSource = parts[1] || 'SUNO'; // Default to SUNO if not specified
      
      // Handle mock tasks immediately
      if (actualId.startsWith('mock-')) {
        return {
          status: 'SUCCESS',
          audio_url: generateMockAudioUrl(),
          lyrics: 'Mock lyrics were generated',
          apiSource: 'MOCK'
        };
      }
      
      const response = await axios.post('/api/suno/check-status', { 
        taskId: actualId, 
        apiSource: apiSource 
      });
      console.log('Status check response:', response.data);
      
      // Important: Convert the response to match your expected SunoTaskResult type
      return {
        status: response.data.status,
        audio_url: response.data.audioUrl || response.data.audio_url,
        lyrics: response.data.lyrics,
        image_url: response.data.imageUrl || response.data.image_url,
        error: response.data.error,
        progress: response.data.progress,
        completion_percentage: response.data.completion_percentage,
        apiSource: response.data.apiSource
      };
    } catch (error) {
      console.error('Error checking generation status:', error);
      throw error;
    }
  }
};

export default sunoService;