const axios = require('axios');

class WorkingSunoService {
    constructor() {
        this.apiKey = process.env.SUNO_API_KEY || 'c3367b96713745a2de3b1f8e1dde4787';
        this.baseUrl = 'https://api.sunoapi.org/api/v1';
        this.headers = {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
        };

        console.log('🎵 WorkingSunoService initialized');
        console.log(`🔑 API Key: ${this.apiKey.substring(0, 8)}...`);
        console.log(`🌐 Base URL: ${this.baseUrl}`);
    }

    async checkCredits() {
        // CRITICAL FIX: SUNO API doesn't have a credits endpoint!
        // Instead, we'll return a mock response and let generation fail if no credits
        console.log('💰 SUNO API has no credits endpoint - returning mock response');
        console.log('✅ Credits will be checked during generation');

        return {
            success: true,
            credits: 'unknown', // We can't check credits directly
            message: 'Credits status unknown - will be validated during generation'
        };
    }

    async generateMusic(options = {}) {
        try {
            console.log('🎵 Starting music generation with options:', options);

            // Prepare the generation request
            const generateRequest = {
                prompt: options.lyrics || "Create an upbeat, energetic song about fresh juice and healthy living",
                customMode: options.customMode !== undefined ? options.customMode : true,
                style: options.style || "Pop",
                title: options.title || "Fresh Vibes",
                instrumental: options.instrumental || false,
                model: options.model || "V4",
                callBackUrl: options.callBackUrl || "https://your-app.com/api/music-test/callback"
            };

            console.log('📤 Sending generation request:', generateRequest);

            const response = await axios.post(`${this.baseUrl}/generate`, generateRequest, {
                headers: this.headers,
                timeout: 60000
            });

            console.log('✅ SUNO API Response:', response.data);

            if (response.data && response.data.code === 200) {
                return {
                    success: true,
                    taskId: response.data.data.taskId,
                    message: 'Music generation started successfully',
                    estimatedTime: '2-3 minutes'
                };
            } else {
                // Check if it's a credits error
                if (response.data && response.data.msg && response.data.msg.includes('credit')) {
                    throw new Error(`Insufficient credits: ${response.data.msg}`);
                }
                throw new Error(`Generation failed: ${response.data.msg}`);
            }

        } catch (error) {
            console.error('❌ Music generation failed:', error.message);
            if (error.response) {
                console.error('📝 API Error Details:', error.response.data);

                // Check for specific credit-related errors
                if (error.response.status === 429 || 
                    (error.response.data && error.response.data.msg && 
                     error.response.data.msg.toLowerCase().includes('credit'))) {
                    throw new Error(`Insufficient credits. Please add more credits to your SUNO account.`);
                }
            }
            throw error;
        }
    }

    async getTaskStatus(taskId) {
        try {
            console.log(`🔍 Checking status for task: ${taskId}`);

            const response = await axios.get(`${this.baseUrl}/generate/record-info?taskId=${taskId}`, {
                headers: this.headers,
                timeout: 30000
            });

            console.log('📊 Task status response:', response.data);

            if (response.data && response.data.code === 200) {
                return {
                    success: true,
                    status: response.data.data.status,
                    response: response.data.data.response,
                    taskId: taskId
                };
            } else {
                throw new Error(`Status check failed: ${response.data.msg}`);
            }

        } catch (error) {
            console.error('❌ Status check failed:', error.message);
            throw error;
        }
    }

    // Template lyrics fallback (for testing without AIML API)
    generateTemplateLyrics(theme = 'fresh juice') {
        const templates = {
            'fresh juice': {
                verse1: "Morning sunshine, fruits so bright\nBlending colors, pure delight\nVitamins flowing, energy high\nFresh juice magic, reaching the sky",
                chorus: "Fresh blend, fresh start, fresh day\nHealthy living, that's our way\nJuicy dreams in every sip\nTake your taste buds on a trip",
                verse2: "Strawberries dancing, oranges sing\nApples and carrots, health they bring\nGreen smoothies, power packed\nNature's goodness, that's a fact"
            },
            'hip-hop': {
                verse1: "Yo, step into my juice bar scene\nFreshest blends you've ever seen\nKale and spinach, fruits so clean\nLiving healthy, living mean",
                chorus: "Fresh Blendz got that flavor, got that juice\nNatural power, let your energy loose\nFrom sunrise blend to the midnight boost\nWe got the magic, we got the juice",
                verse2: "Mixing beats like mixing drinks\nHealthy vibes, that's how we think\nEvery sip's a power link\nTo the future, quick as a wink"
            }
        };

        return templates[theme] || templates['fresh juice'];
    }
}

module.exports = WorkingSunoService;
