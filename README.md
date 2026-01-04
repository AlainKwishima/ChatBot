# Empirical Tours AI Chatbot 🤖

An intelligent, local-first chatbot for Empirical Tour & Travel featuring:
- ✅ 100% local AI (Ollama + Llama 3.1)
- ✅ Website content indexing
- ✅ Beautiful modern UI
- ✅ FAQ knowledge base
- ✅ Zero API costs

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Ollama (https://ollama.ai/download)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd chatbot
```

2. **Install dependencies**
```bash
npm install
```

3. **Install Ollama & Download Model**
```bash
ollama pull llama3.1
```

4. **Start the chatbot**
```bash
npm run dev
```

Visit `http://localhost:5173` to see the chat widget.

## 📁 Project Structure

```
chatbot/
├── server/          # Node.js backend (Express + Ollama)
├── widget/          # React chat UI
├── assets/          # Logo and images
└── docs/            # Documentation
```

## 🎯 Features

### FAQ System
Instant answers for common questions (location, services, contact)

### Smart Indexing
- Crawls empiricaltour.com
- Respects robots.txt
- Word-based chunking (300-800 words)
- LanceDB vector storage

### Local AI
- Embeddings: all-MiniLM-L6-v2
- Generation: Llama 3.1 8B (via Ollama)
- Answers ONLY from website content

## 📝 Commands

```bash
npm run dev          # Start both server and widget
npm run index        # Re-index website content
npm run build:server # Build server
npm run build:widget # Build widget
```

## 🌐 Deployment

### Requirements
- Server with 8GB+ RAM
- Ollama installed
- Node.js 18+

### Environment Variables
Create `server/.env`:
```
PORT=3000
```

### Production Build
```bash
npm run build:server
npm run build:widget
npm run start:server
```

See `docs/README.md` for detailed deployment guide.

## 🎨 Customization

### Colors
Edit `widget/src/index.css`:
```css
--primary-color: #16a34a;  /* Your brand color */
```

### Logo
Replace `assets/logo.png` with your logo

### FAQ
Add entries to `server/src/faq.ts`

## 🔧 Configuration

### Crawler
- Target URL: `server/src/crawler.ts` (line 21)
- Chunk size: 300-800 words
- Max pages: 100

### AI Model
- Change model in `server/src/embeddings.ts`
- Options: llama3.1, mistral, phi3

## 📊 System Requirements

### Development
- RAM: 4GB minimum
- Disk: 6GB (5GB for model)

### Production
- RAM: 8GB recommended
- Disk: 10GB

## 🛠️ Troubleshooting

**"Ollama is not running"**
```bash
ollama serve
```

**"Model not found"**
```bash
ollama pull llama3.1
```

**Chat not responding**
- Check Ollama at http://localhost:11434
- Verify model downloaded: `ollama list`

## 📄 License

Proprietary - Empirical Tour & Travel Ltd

## 🤝 Support

For issues or questions, contact your development team.

---

**Built with ❤️ for Empirical Tours**
