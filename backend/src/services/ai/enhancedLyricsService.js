const axios = require('axios');

class EnhancedLyricsService {
    constructor() {
        this.aimlApiKey = process.env.AIML_API_KEY || '67fc2e7de17f4189929ce534df2074a5';
        this.baseUrl = 'https://api.aimlapi.com/chat/completions';
        this.headers = {
            'Authorization': `Bearer ${this.aimlApiKey}`,
            'Content-Type': 'application/json'
        };

        console.log('🎵 Enhanced Lyrics Service initialized');
        console.log(`🔑 AIML API Key: ${this.aimlApiKey.substring(0, 8)}...`);
    }

    async generateLyrics(options = {}) {
        try {
            const {
                description = "A song about life and dreams",
                style = "pop",
                mood = "upbeat",
                theme = "general",
                customPrompt = "",
                generationType = "full", // "full" or "line"
                language = "english",
                songTitle = ""
            } = options;

            console.log('🎼 Generating AI lyrics with options:', options);

            // Create a comprehensive prompt based on SUNO-style inputs
            const lyricsPrompt = this.buildLyricsPrompt({
                description,
                style,
                mood,
                theme,
                customPrompt,
                generationType,
                language,
                songTitle
            });

            console.log('📝 Lyrics prompt:', lyricsPrompt);

            const response = await axios.post(this.baseUrl, {
                model: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a professional songwriter and lyricist. Create engaging, memorable lyrics that match the specified style, mood, and theme. Always structure your response as a proper song with verse, chorus, and bridge sections clearly labeled."
                    },
                    {
                        role: "user",
                        content: lyricsPrompt
                    }
                ],
                max_tokens: 1500,
                temperature: 0.8,
                top_p: 0.9
            }, {
                headers: this.headers,
                timeout: 30000
            });

            if (response.data && response.data.choices && response.data.choices[0]) {
                const generatedText = response.data.choices[0].message.content;
                const structuredLyrics = this.parseGeneratedLyrics(generatedText);

                return {
                    success: true,
                    lyrics: structuredLyrics,
                    rawText: generatedText,
                    metadata: {
                        style,
                        mood,
                        theme,
                        generationType,
                        songTitle: songTitle || this.extractTitleFromLyrics(generatedText)
                    }
                };
            } else {
                throw new Error('Invalid response from AI service');
            }

        } catch (error) {
            console.error('❌ Lyrics generation failed:', error.message);
            return this.getFallbackLyrics(options);
        }
    }

    buildLyricsPrompt(options) {
        const { description, style, mood, theme, customPrompt, generationType, language, songTitle } = options;

        let prompt = `Create ${generationType === "line" ? "a single verse or chorus" : "complete song lyrics"} with the following specifications:

**Song Description:** ${description}
**Musical Style:** ${style}
**Mood:** ${mood}
**Theme:** ${theme}
**Language:** ${language}`;

        if (songTitle) {
            prompt += `
**Song Title:** ${songTitle}`;
        }

        if (customPrompt) {
            prompt += `
**Additional Instructions:** ${customPrompt}`;
        }

        prompt += `

**Requirements:**
- Create original, engaging lyrics that fit the ${style} genre
- Maintain a ${mood} mood throughout
- Focus on the theme of ${theme}
- Structure the lyrics clearly with [Verse], [Chorus], [Bridge] labels
- Make the lyrics memorable and singable
- Ensure the content is appropriate for general audiences
- Include rhyming patterns typical of ${style} music

Please generate creative, original lyrics that would work well for AI music generation.`;

        return prompt;
    }

    parseGeneratedLyrics(text) {
        // Parse the generated text into structured lyrics
        const lines = text.split('\n').filter(line => line.trim());
        const structured = {
            title: '',
            verse1: '',
            chorus: '',
            verse2: '',
            bridge: '',
            outro: ''
        };

        let currentSection = '';
        let currentContent = [];

        for (const line of lines) {
            const trimmedLine = line.trim();

            // Check for section headers
            if (trimmedLine.match(/\[(verse|chorus|bridge|outro|intro).*\]/i)) {
                // Save previous section
                if (currentSection && currentContent.length > 0) {
                    this.assignLyricsSection(structured, currentSection, currentContent.join('\n'));
                }

                // Start new section
                currentSection = trimmedLine.replace(/[\[\]]/g, '').toLowerCase();
                currentContent = [];
            } else if (trimmedLine.match(/^(title|song title):/i)) {
                structured.title = trimmedLine.replace(/^(title|song title):/i, '').trim();
            } else if (trimmedLine && !trimmedLine.startsWith('**')) {
                currentContent.push(trimmedLine);
            }
        }

        // Save the last section
        if (currentSection && currentContent.length > 0) {
            this.assignLyricsSection(structured, currentSection, currentContent.join('\n'));
        }

        // If no structured sections found, treat as verse
        if (!structured.verse1 && !structured.chorus && currentContent.length === 0) {
            structured.verse1 = text.trim();
        }

        return structured;
    }

    assignLyricsSection(structured, sectionName, content) {
        if (sectionName.includes('verse') && !structured.verse1) {
            structured.verse1 = content;
        } else if (sectionName.includes('verse') && !structured.verse2) {
            structured.verse2 = content;
        } else if (sectionName.includes('chorus')) {
            structured.chorus = content;
        } else if (sectionName.includes('bridge')) {
            structured.bridge = content;
        } else if (sectionName.includes('outro')) {
            structured.outro = content;
        } else {
            // Default to verse1 if unclear
            if (!structured.verse1) structured.verse1 = content;
            else if (!structured.chorus) structured.chorus = content;
        }
    }

    extractTitleFromLyrics(text) {
        // Try to extract a title from the lyrics
        const titleMatch = text.match(/^(title|song title):\s*(.+)$/im);
        if (titleMatch) return titleMatch[2].trim();

        // Look for repeated phrases that might be the title
        const lines = text.split('\n').filter(line => line.trim() && !line.startsWith('['));
        if (lines.length > 0) {
            return lines[0].substring(0, 50).trim();
        }

        return 'Untitled Song';
    }

    getFallbackLyrics(options) {
        const { style = 'pop', theme = 'general' } = options;

        const fallbackTemplates = {
            'hip-hop': {
                verse1: "Started from the bottom, now we rising up\nDreams in our pockets, never giving up\nCity lights shining, but we shine bright too\nThis is our moment, this is what we do",
                chorus: "We're breaking through the silence\nMaking noise with our defiance\nEvery step's a new alliance\nWith the dreams that keep us vibrant",
                verse2: "Stories on the street corners, tales to tell\nBeats in our hearts, rhythm we know well\nFrom the ground up, building our sound\nThis is our time, this is our ground"
            },
            'pop': {
                verse1: "Dancing through the daylight, feeling so alive\nColors all around us, helping us to thrive\nMusic in the moment, heartbeat in the song\nThis is where we started, this is where we belong",
                chorus: "We're shining like the stars tonight\nNothing's gonna dim our light\nTogether we can reach so high\nTouch the dreams up in the sky",
                verse2: "Melodies are calling, harmony's so sweet\nEvery note's a promise, every rhythm's a beat\nSinging out our story, letting the world know\nThis is just the beginning, watch us as we grow"
            },
            'rock': {
                verse1: "Thunder in the distance, lightning in our veins\nPower in the music, breaking all the chains\nGuitar strings are calling, drums are beating loud\nWe're here to make a statement, we're here to rock the crowd",
                chorus: "Turn it up, turn it loud\nWe're breaking through the crowd\nRock and roll is in our soul\nMusic makes us whole",
                verse2: "Electric energy flowing, amplifiers scream\nThis is not just music, this is living the dream\nHeads are banging, bodies moving to the sound\nRock and roll forever, this is hallowed ground"
            }
        };

        const template = fallbackTemplates[style.toLowerCase()] || fallbackTemplates['pop'];

        return {
            success: true,
            lyrics: template,
            rawText: Object.values(template).join('\n\n'),
            metadata: {
                style,
                theme,
                generationType: 'full',
                songTitle: `${style.charAt(0).toUpperCase() + style.slice(1)} Song`,
                fallback: true
            }
        };
    }

    // SUNO-style genre and mood options
    getAvailableStyles() {
        return [
            'pop', 'hip-hop', 'rock', 'electronic', 'jazz', 'blues', 'country',
            'r&b', 'reggae', 'folk', 'classical', 'edm', 'house', 'techno',
            'dubstep', 'ambient', 'indie', 'alternative', 'punk', 'metal',
            'latin', 'bossa-nova', 'afrobeat', 'k-pop', 'trap', 'lo-fi'
        ];
    }

    getAvailableMoods() {
        return [
            'upbeat', 'melancholic', 'energetic', 'calm', 'romantic', 'mysterious',
            'aggressive', 'peaceful', 'nostalgic', 'hopeful', 'dramatic', 'playful',
            'dark', 'bright', 'emotional', 'confident', 'dreamy', 'intense'
        ];
    }

    getAvailableThemes() {
        return [
            'love', 'friendship', 'dreams', 'success', 'struggle', 'celebration',
            'nature', 'city life', 'freedom', 'adventure', 'nostalgia', 'hope',
            'change', 'unity', 'inspiration', 'rebellion', 'peace', 'journey'
        ];
    }
}

module.exports = EnhancedLyricsService;
