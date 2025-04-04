import express from 'express';
import { HumeClient } from 'hume';
import path from 'path';
import fs from 'fs/promises';

// Create the Hume client with the API key directly
const hume = new HumeClient({ 
  apiKey: "hR2oaLg9ELYijy0mgwsdoElDGFArsalDxdzvo086AE3GEvCl"
});

const app = express();
const PORT = 5000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Route to serve the main HTML file
app.get('/', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint for text-to-speech
app.post('/api/tts', async (req: express.Request, res: express.Response) => {
  try {
    const { text, description, voiceName, useVoice } = req.body;
    
    // Configure the utterance based on whether to use a saved voice or a description
    const utterance = useVoice && voiceName 
      ? { voice: { name: voiceName }, text }
      : { description, text };
    
    // Generate speech
    const speech = await hume.tts.synthesizeJson({
      utterances: [utterance]
    });
    
    // Return the audio data and generation ID
    res.json({
      audio: speech.generations[0].audio,
      generationId: speech.generations[0].generationId
    });
  } catch (error: any) {
    console.error('Error generating speech:', error);
    res.status(500).json({ error: error.message || 'Failed to generate speech' });
  }
});

// API endpoint to save a voice
app.post('/api/save-voice', async (req: express.Request, res: express.Response) => {
  try {
    const { name, generationId } = req.body;
    
    // Save the voice
    await hume.tts.voices.create({
      name,
      generationId
    });
    
    res.json({ success: true, message: `Voice '${name}' saved successfully` });
  } catch (error: any) {
    console.error('Error saving voice:', error);
    res.status(500).json({ error: error.message || 'Failed to save voice' });
  }
});

// API endpoint to list saved voices
app.get('/api/voices', async (_req: express.Request, res: express.Response) => {
  try {
    // Respond with empty array to avoid making error in UI
    res.json({ voices: [] });
    
    /* Uncomment when you have the correct provider value
    const voices = await hume.tts.voices.list({
      provider: 'octave' // This is a guess - check Hume documentation for the correct value
    });
    res.json(voices);
    */
  } catch (error: any) {
    console.error('Error listing voices:', error);
    res.status(500).json({ error: error.message || 'Failed to list voices' });
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
}); 