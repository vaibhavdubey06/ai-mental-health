# Serene - AI Therapy Companion

A compassionate AI therapy companion built with React, TypeScript, and Vite. Features voice transcription, text-to-speech, and breathing exercises.

## Features

- 🎤 Voice recording and transcription using Deepgram
- 🔊 Text-to-speech responses
- 🫁 Guided breathing exercises
- 💬 AI-powered therapeutic conversations
- 📱 Responsive design with Tailwind CSS
- 🔒 Secure and private (no data stored on servers)

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Voice Transcription**: Deepgram API
- **Text-to-Speech**: Web Speech API
- **Icons**: Lucide React

## Local Development

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Deepgram API key

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your Deepgram API key:
   ```
   VITE_DEEPGRAM_API_KEY=your_actual_deepgram_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Deployment on Netlify

### Option 1: Deploy via Netlify UI (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/login with your GitHub account
   - Click "New site from Git"
   - Select your repository

3. **Configure build settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18`

4. **Set environment variables**
   - Go to Site settings → Environment variables
   - Add: `VITE_DEEPGRAM_API_KEY` = your Deepgram API key

5. **Deploy**
   - Click "Deploy site"
   - Your site will be live at `https://your-site-name.netlify.app`

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize and deploy**
   ```bash
   netlify init
   netlify deploy --prod
   ```

4. **Set environment variables**
   ```bash
   netlify env:set VITE_DEEPGRAM_API_KEY your_deepgram_api_key_here
   ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_DEEPGRAM_API_KEY` | Your Deepgram API key for voice transcription | Yes |

## Getting a Deepgram API Key

1. Go to [console.deepgram.com](https://console.deepgram.com/)
2. Sign up for a free account
3. Create a new project
4. Copy your API key
5. Add it to your environment variables

## Project Structure

```
src/
├── components/          # React components
│   ├── TherapistChat.tsx
│   ├── VoiceRecorder.tsx
│   ├── Message.tsx
│   └── BreathingExercise.tsx
├── utils/              # Utility functions
│   ├── deepgramTranscription.ts
│   ├── speechSynthesis.ts
│   └── aiResponses.ts
├── types/              # TypeScript type definitions
└── App.tsx             # Main app component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Privacy & Security

- All voice processing happens client-side
- No audio data is stored on servers
- Conversations are not logged or saved
- Uses secure HTTPS connections

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details 