# Enterprise Website Chatbot

A full-stack, TypeScript-based chatbot capable of crawling your website, indexing content, and answering user questions via a custom-designed, embeddable React widget.

## Features

- **Automated Crawling**: Fetches and cleans content from your website.
- **Semantic Search**: Uses OpenAI Embeddings and Vector Search (LanceDB) to find relevant context.
- **Smart Answers**: Generates responses using GPT-4/GPT-3.5 based *only* on your website's content.
- **Embeddable Widget**: Lightweight, shadow-DOM isolated React widget that works on any page.
- **Modern Stack**: Node.js, Express, React, Vite, TypeScript.

## Project Structure

```text
/
├── server/       # Backend API (Express + LanceDB + Crawler)
├── widget/       # Frontend Widget (React + Vite)
├── docs/         # Documentation
└── package.json  # Monorepo Orchestration
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- OpenAI API Key

### Installation

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Configure Environment**:
    - Copy `server/.env.example` to `server/.env`.
    - Add your `OPENAI_API_KEY`.

### Development

Run both the server and the widget in development mode:

```bash
# Terminal 1: Start Server
npm run dev:server

# Terminal 2: Start Widget (for testing/preview)
npm run dev:widget
```

### Usage

1.  **Index Your Website**:
    Send a POST request to trigger the crawler:
    ```bash
    curl -X POST http://localhost:3000/api/crawl \
      -H "Content-Type: application/json" \
      -d '{"url": "https://your-website.com"}'
    ```

2.  **Test the Chat**:
    Open the widget preview (usually `http://localhost:5173`) or use the embedded script.

## Deployment

### 1. Build the Widget
```bash
npm run build:widget
# Output: widget/dist/assets/widget.js
```
Host this file on your CDN or static server.

### 2. Embed on Your Website
Add this snippet to your HTML:
```html
<script src="https://your-domain.com/path/to/widget.js" type="module"></script>
```

### 3. Deploy Server
- Build the server: `npm run build:server`.
- Deploy `server/dist` to any Node.js host (Heroku, Railway, AWS, DigitalOcean).
- Ensure `data/` directory is persistent if using local LanceDB (use a volume).

## License
MIT
