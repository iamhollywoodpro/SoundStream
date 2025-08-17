const express = require('express');
const router = express.Router();
const WorkingSunoService = require('../services/ai/workingSunoService');
const EnhancedLyricsService = require('../services/ai/enhancedLyricsService');

// Initialize services
const sunoService = new WorkingSunoService();
const lyricsService = new EnhancedLyricsService();

// Get available options for SUNO-style interface
router.get('/options', (req, res) => {
    try {
        const options = {
            styles: lyricsService.getAvailableStyles(),
            moods: lyricsService.getAvailableMoods(),
            themes: lyricsService.getAvailableThemes(),
            models: ['V3_5', 'V4', 'V4_5'],
            generationTypes: ['full', 'line']
        };

        res.json({
            success: true,
            data: options,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve options',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Generate AI lyrics only
router.post('/generate-lyrics', async (req, res) => {
    try {
        const {
            description = "A song about life and dreams",
            style = "pop",
            mood = "upbeat",
            theme = "general",
            customPrompt = "",
            generationType = "full",
            language = "english",
            songTitle = ""
        } = req.body;

        console.log('🎼 Generating lyrics with parameters:', req.body);

        const result = await lyricsService.generateLyrics({
            description,
            style,
            mood,
            theme,
            customPrompt,
            generationType,
            language,
            songTitle
        });

        if (result.success) {
            res.json({
                success: true,
                message: 'Lyrics generated successfully',
                lyrics: result.lyrics,
                rawText: result.rawText,
                metadata: result.metadata,
                timestamp: new Date().toISOString()
            });
        } else {
            throw new Error('Lyrics generation failed');
        }

    } catch (error) {
        console.error('❌ Lyrics generation error:', error);
        res.status(500).json({
            success: false,
            message: 'Lyrics generation failed',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// SUNO-style complete generation (lyrics + music)
router.post('/suno-generate', async (req, res) => {
    try {
        const {
            // Lyrics options
            useAILyrics = true,
            customLyrics = "",
            description = "A song about life and dreams",

            // Style options
            style = "pop",
            mood = "upbeat",
            theme = "general",
            customPrompt = "",

            // Music options
            songTitle = "",
            instrumental = false,
            model = "V4",
            generationType = "full",

            // Advanced options
            language = "english",
            callBackUrl = ""
        } = req.body;

        console.log('🎵 SUNO-style generation with parameters:', req.body);

        let finalLyrics = customLyrics;
        let lyricsMetadata = null;

        // Generate AI lyrics if requested
        if (useAILyrics && !customLyrics) {
            console.log('🎼 Generating AI lyrics first...');
            const lyricsResult = await lyricsService.generateLyrics({
                description,
                style,
                mood,
                theme,
                customPrompt,
                generationType,
                language,
                songTitle
            });

            if (lyricsResult.success) {
                // Convert structured lyrics to string format for SUNO
                const structuredLyrics = lyricsResult.lyrics;
                finalLyrics = [
                    structuredLyrics.verse1,
                    structuredLyrics.chorus,
                    structuredLyrics.verse2,
                    structuredLyrics.bridge,
                    structuredLyrics.outro
                ].filter(section => section && section.trim()).join('\n\n');

                lyricsMetadata = lyricsResult.metadata;
                console.log('✅ AI lyrics generated successfully');
            } else {
                console.log('⚠️ AI lyrics failed, using fallback');
                const fallbackResult = lyricsService.getFallbackLyrics({ style, theme });
                const structuredLyrics = fallbackResult.lyrics;
                finalLyrics = [
                    structuredLyrics.verse1,
                    structuredLyrics.chorus,
                    structuredLyrics.verse2
                ].filter(section => section && section.trim()).join('\n\n');
                lyricsMetadata = fallbackResult.metadata;
            }
        }

        // Generate music with SUNO
        console.log('🎵 Generating music with SUNO...');
        const musicResult = await sunoService.generateMusic({
            lyrics: finalLyrics,
            style: style,
            title: songTitle || lyricsMetadata?.songTitle || `${style.charAt(0).toUpperCase() + style.slice(1)} Song`,
            instrumental: instrumental,
            model: model,
            customMode: true,
            callBackUrl: callBackUrl || `https://your-app.com/api/music-test/callback`
        });

        if (musicResult.success) {
            res.json({
                success: true,
                message: 'SUNO-style generation completed successfully',
                music: {
                    taskId: musicResult.taskId,
                    estimatedTime: musicResult.estimatedTime
                },
                lyrics: useAILyrics ? {
                    text: finalLyrics,
                    metadata: lyricsMetadata,
                    isAI: true
                } : {
                    text: finalLyrics,
                    isAI: false
                },
                generation: {
                    style,
                    mood,
                    theme,
                    model,
                    instrumental,
                    songTitle: songTitle || lyricsMetadata?.songTitle || 'Untitled Song'
                },
                timestamp: new Date().toISOString()
            });
        } else {
            throw new Error('Music generation failed');
        }

    } catch (error) {
        console.error('❌ SUNO-style generation error:', error);
        res.status(500).json({
            success: false,
            message: 'SUNO-style generation failed',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Credits check (mock response since SUNO API doesn't have credits endpoint)
router.get('/credits', async (req, res) => {
    try {
        const result = await sunoService.checkCredits();
        res.json({
            success: true,
            message: result.message,
            credits: result.credits,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Credits check failed',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Original generate endpoint (for backward compatibility)
router.post('/generate', async (req, res) => {
    try {
        const { lyrics, style = 'pop', title = 'Generated Song', model = 'V4' } = req.body;

        let finalLyrics = lyrics;

        // If no lyrics provided, generate some
        if (!lyrics || lyrics.trim() === '') {
            const theme = style === 'hip-hop' ? 'hip-hop' : 'fresh juice';
            const templateLyrics = sunoService.generateTemplateLyrics(theme);
            finalLyrics = `${templateLyrics.verse1}\n\n${templateLyrics.chorus}\n\n${templateLyrics.verse2}`;
        }

        const result = await sunoService.generateMusic({
            lyrics: finalLyrics,
            style: style,
            title: title,
            model: model,
            customMode: true
        });

        if (result.success) {
            res.json({
                success: true,
                message: result.message,
                taskId: result.taskId,
                lyrics: {
                    verse1: templateLyrics?.verse1 || 'Custom lyrics provided',
                    chorus: templateLyrics?.chorus || '',
                    verse2: templateLyrics?.verse2 || ''
                },
                genre: style,
                mood: 'upbeat',
                theme: 'inspiration',
                timestamp: new Date().toISOString()
            });
        } else {
            throw new Error('Music generation failed');
        }

    } catch (error) {
        console.error('❌ Music generation error:', error);
        res.status(500).json({
            success: false,
            message: 'Music generation test endpoint failed',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Get task status
router.get('/status/:taskId', async (req, res) => {
    try {
        const { taskId } = req.params;
        const result = await sunoService.getTaskStatus(taskId);

        if (result.success) {
            res.json({
                success: true,
                taskId: taskId,
                status: result.status,
                response: result.response,
                timestamp: new Date().toISOString()
            });
        } else {
            throw new Error('Status check failed');
        }

    } catch (error) {
        console.error('❌ Status check error:', error);
        res.status(500).json({
            success: false,
            message: 'Status check failed',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Callback endpoint for SUNO webhooks
router.post('/callback', (req, res) => {
    try {
        console.log('🔔 SUNO callback received:', req.body);

        // Process the callback data
        const { code, data, msg } = req.body;

        if (code === 200 && data) {
            console.log('✅ Generation completed successfully');
            console.log('🎵 Generated tracks:', data.data);
        } else {
            console.log('❌ Generation failed:', msg);
        }

        // Acknowledge the callback
        res.status(200).json({
            success: true,
            message: 'Callback received and processed',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Callback processing error:', error);
        res.status(500).json({
            success: false,
            message: 'Callback processing failed',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Simple ping endpoint
router.get('/ping', (req, res) => {
    res.json({
        success: true,
        message: 'Enhanced music test routes are working!',
        endpoints: {
            options: 'GET /api/music-test/options',
            generateLyrics: 'POST /api/music-test/generate-lyrics',
            sunoGenerate: 'POST /api/music-test/suno-generate',
            credits: 'GET /api/music-test/credits',
            generate: 'POST /api/music-test/generate',
            status: 'GET /api/music-test/status/:taskId',
            callback: 'POST /api/music-test/callback',
            ping: 'GET /api/music-test/ping'
        },
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
