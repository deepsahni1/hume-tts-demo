# Hume Text-to-Speech Demo

A modern web application demonstrating the powerful speech generation capabilities of the [Hume AI](https://hume.ai/) Text-to-Speech API.

<img width="481" alt="image" src="https://github.com/user-attachments/assets/d4472e92-400d-4cbe-890c-ddd86727955c" />


## Features

- Generate natural, expressive speech from text
- Customize voice characteristics using descriptive prompts
- Save generated voices for future use
- Standalone HTML version for quick testing without a server
- Full web application with voice history and management
- Modern, responsive UI

## Project Structure

This repository contains two implementations of the Hume TTS interface:

1. **Web Application (Express + TypeScript)**
   - Full-featured web app with backend services
   - Voice saving and history management
   - Server-side API integration

2. **Standalone HTML Demo**
   - Single HTML file with no dependencies
   - Client-side API integration
   - Easy to run locally without a server

## Prerequisites

- Node.js (v14+)
- Hume AI API key (obtain from [Hume AI Developer Portal](https://dev.hume.ai/))

## Setup and Installation

### Clone the repository

```bash
git clone https://github.com/yourusername/hume-tts-demo.git
cd hume-tts-demo
```

### Install dependencies

```bash
npm install
```

### Configure API key

For the server-based application, update the API key in `server.ts`:

```typescript
const hume = new HumeClient({ 
  apiKey: "your_hume_api_key_here"
});
```

For the standalone HTML version, your API key can be entered directly in the web interface or updated in the HTML file.

## Running the Application

### Web Application

Start the server:

```bash
npm start
```

Open your browser and navigate to:
```
http://localhost:5000
```

### Standalone HTML Demo

Simply open the `standalone-tts.html` file in your web browser:

```bash
# Windows
start standalone-tts.html

# macOS
open standalone-tts.html

# Linux
xdg-open standalone-tts.html
```

## Usage

1. **Enter text**: Type or paste the text you want to convert to speech
2. **Describe voice**: Enter a description of how you want the voice to sound (e.g., "A friendly, enthusiastic female voice with a British accent")
3. **Generate**: Click the "Generate Speech" button
4. **Listen**: The generated audio will play automatically
5. **Save voice** (web app only): Enter a name for the voice and save it for future use

## Voice Description Tips

The Hume TTS API is capable of interpreting rich descriptions to create expressive voices. Try descriptions like:

- "A wise elderly professor speaking slowly and thoughtfully"
- "An energetic sports announcer with excitement in their voice"
- "A calm, soothing meditation guide with a gentle tone"
- "A dramatic movie trailer narrator with a deep voice"

## Advanced Features (Web App)

- **Voice Library**: Save and reuse voices across multiple sessions
- **Acting Instructions**: Add emotional context to saved voices
- **History**: Browse past generations and replay them

## Technologies Used

- TypeScript
- Express.js
- Hume AI Text-to-Speech API
- HTML/CSS/JavaScript

## Common Issues

- **Connection refused errors**: If you experience connection issues with the web server, try using the standalone HTML version instead.
- **API rate limiting**: The Hume API has usage limits. Check the [Hume documentation](https://dev.hume.ai/docs/text-to-speech-tts/overview) for current limits.

## License

MIT

## Acknowledgements

- [Hume AI](https://hume.ai/) for their powerful Text-to-Speech API
- Icons from [Heroicons](https://heroicons.com/)
- CSS inspired by [Tailwind CSS](https://tailwindcss.com/) 
