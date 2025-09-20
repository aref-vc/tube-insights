# 🎬 Tube Insights

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yourusername/tube-insights)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)

> **AI-powered YouTube analytics platform for content creators to analyze comments and generate viral video ideas**

Tube Insights helps content creators make data-driven decisions by analyzing YouTube comments on AI-related videos and generating actionable content strategies using Google's advanced AI models.

## ✨ Features

### 🔍 **Smart Video Discovery**
- Search YouTube videos with AI-focused keywords
- Fetch up to 10 relevant videos per search
- Extract 20 most engaging comments per video
- Filter for high-engagement content

### 🤖 **AI-Powered Analysis**
- **Comment Analysis**: Deep insights into audience sentiment and interests
- **Pattern Recognition**: Identify trending topics and pain points
- **Content Strategy**: Generate video ideas based on comment patterns
- **Interactive Chat**: Conversational AI interface powered by Gemini 1.5 Flash

### 📊 **Project Management**
- Organize analysis into focused projects
- Track multiple video sets simultaneously
- Historical analysis and trend tracking
- Export insights for content planning

### 🎨 **Modern Interface**
- **Dark Theme**: Professional, eye-friendly design
- **Glassmorphism**: Modern card layouts with backdrop effects
- **Responsive**: Works seamlessly on desktop and mobile
- **Intuitive UX**: Clean, creator-focused workflow

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Cloud Project with YouTube Data API v3 enabled
- Google AI API key for Gemini access

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tube-insights.git
   cd tube-insights
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your API keys:
   ```env
   YOUTUBE_API_KEY=your_youtube_api_key_here
   GOOGLE_GENAI_API_KEY=your_google_ai_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   Navigate to [http://localhost:9002](http://localhost:9002)

## 📖 Usage Guide

### Getting Started
1. **Search Videos**: Enter AI-related keywords (e.g., "machine learning", "ChatGPT", "AI tools")
2. **Review Results**: Browse fetched videos with view counts and engagement metrics
3. **Create Project**: Select relevant videos to create an analysis project
4. **AI Analysis**: Use the chat interface to analyze comments and generate insights

### Example Workflows

**Content Strategy Analysis**
```
1. Search: "AI productivity tools"
2. Select: Top 5 performing videos
3. Chat: "What are the main pain points users mention?"
4. Result: Detailed breakdown of user frustrations and content gaps
```

**Viral Video Ideas**
```
1. Search: "ChatGPT tutorials"
2. Select: High-engagement videos
3. Chat: "Generate 5 video ideas based on these comments"
4. Result: Data-driven video concepts with target audience insights
```

## 🛠 Technical Architecture

### Frontend Stack
- **Next.js 15**: App Router with Turbopack for fast development
- **TypeScript**: Full type safety with Zod schema validation
- **Tailwind CSS**: Utility-first styling with custom design system
- **ShadCN UI**: 40+ accessible, customizable components

### AI Integration
- **Google Genkit**: Modern AI framework for TypeScript/JavaScript
- **Gemini 1.5 Flash**: Advanced language model for comment analysis
- **Server Actions**: Secure API calls with 'use server' directive
- **Streaming**: Real-time AI responses with proper error handling

### Data Flow
```
User Input → YouTube API → Comment Extraction → AI Analysis → Structured Insights
```

## 🎯 Use Cases

### **Content Creators**
- Identify trending topics in your niche
- Understand audience pain points
- Generate data-driven video ideas
- Optimize content strategy based on competitor analysis

### **Marketing Teams**
- Analyze competitor content performance
- Understand target audience sentiment
- Develop content calendars based on engagement patterns
- Track industry trends and opportunities

### **Researchers**
- Study AI content consumption patterns
- Analyze sentiment around AI topics
- Track evolution of AI discourse
- Generate reports on content trends

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server on port 9002
npm run genkit:dev   # Start Genkit with dev server
npm run genkit:watch # Start Genkit with auto-reload

# Production
npm run build        # Create production build
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run typecheck    # TypeScript type checking
```

### Project Structure

```
tube-insights/
├── src/
│   ├── app/                 # Next.js 15 App Router
│   ├── components/          # React components
│   │   ├── dashboard.tsx    # Main application interface
│   │   └── ui/             # ShadCN UI components (40+)
│   ├── ai/                 # Genkit AI integration
│   │   ├── genkit.ts       # AI instance configuration
│   │   └── flows/          # AI chat flows
│   ├── services/           # External API services
│   │   │   └── youtube-service.ts # YouTube Data API client
│   ├── lib/                # Utilities and types
│   └── hooks/              # Custom React hooks
├── docs/                   # Documentation
├── .env.example           # Environment template
└── CLAUDE.md              # AI assistant context
```

## 🔑 API Keys Setup

### YouTube Data API v3
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Restrict key to YouTube Data API v3

### Google AI API (Gemini)
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create API key
3. Copy key to environment variables

## 🚨 Rate Limits & Costs

### YouTube API
- **Quota**: 10,000 units/day (free tier)
- **Search**: 100 units per request
- **Comments**: 1 unit per request
- **Daily Capacity**: ~100 searches or 10,000 comment fetches

### Google AI API
- **Gemini 1.5 Flash**: $0.35/$1.05 per million tokens (input/output)
- **Rate Limits**: 15 RPM, 1 million TPM, 1,500 RPD
- **Free Tier**: Available with usage limits

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Genkit](https://firebase.google.com/docs/genkit) for AI framework
- [ShadCN](https://ui.shadcn.com/) for beautiful UI components
- [YouTube Data API](https://developers.google.com/youtube/v3) for video data
- [Next.js](https://nextjs.org/) for the amazing React framework

## 📞 Support

- 📧 Email: [your-email@domain.com](mailto:your-email@domain.com)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/tube-insights/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/tube-insights/discussions)

---

<div align="center">
  <strong>Built with ❤️ for content creators</strong>
  <br>
  <sub>Created by [Your Name] • Follow us on <a href="https://twitter.com/yourusername">Twitter</a></sub>
</div>
