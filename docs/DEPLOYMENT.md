# Deployment Guide - Empirical Tours Chatbot

## Production Deployment Options

### Option 1: VPS/Cloud Server (Recommended)

#### Requirements
- Ubuntu 20.04+ or similar
- 8GB RAM minimum
- 20GB storage
- Node.js 18+

#### Steps

1. **Provision Server**
```bash
# DigitalOcean, AWS EC2, or Linode
# Choose instance: 8GB RAM, 2 vCPUs
```

2. **Install Dependencies**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Ollama
curl https://ollama.ai/install.sh | sh

# Pull model
ollama pull llama3.1
```

3. **Deploy Application**
```bash
# Clone repository
git clone <your-repo>
cd chatbot

# Install dependencies
npm install

# Build
npm run build:server
npm run build:widget

# Create .env
cp server/.env.example server/.env
```

4. **Setup PM2 (Process Manager)**
```bash
# Install PM2
npm install -g pm2

# Start Ollama
pm2 start "ollama serve" --name ollama

# Start server
cd server
pm2 start dist/index.js --name chatbot-server

# Save PM2 config
pm2 save
pm2 startup
```

5. **Setup Nginx (Optional - for HTTPS)**
```bash
sudo apt install nginx

# Configure Nginx
sudo nano /etc/nginx/sites-available/chatbot

# Add:
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        root /path/to/chatbot/widget/dist;
        try_files $uri $uri/ /index.html;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/chatbot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### Option 2: Docker Deployment

#### Dockerfile
```dockerfile
FROM node:18

# Install Ollama
RUN curl https://ollama.ai/install.sh | sh

# Set working directory
WORKDIR /app

# Copy files
COPY package*.json ./
RUN npm install

COPY . .

# Build
RUN npm run build:server
RUN npm run build:widget

# Pull model
RUN ollama pull llama3.1

# Expose ports
EXPOSE 3000 11434

# Start script
CMD ["sh", "-c", "ollama serve & npm run start:server"]
```

#### Build and Run
```bash
docker build -t empirical-chatbot .
docker run -d -p 3000:3000 -p 11434:11434 empirical-chatbot
```

---

### Option 3: Embedded on Existing Website

Add to your website:

```html
<!-- Add before </body> -->
<script type="module" src="https://your-cdn.com/chatbot-widget.js"></script>
<link rel="stylesheet" href="https://your-cdn.com/chatbot-widget.css">
```

---

## Environment Variables

**Production .env:**
```
PORT=3000
OLLAMA_HOST=http://localhost:11434
NODE_ENV=production
```

---

## Monitoring

### Health Check Endpoint
```bash
curl http://localhost:3000/health
```

### PM2 Monitoring
```bash
pm2 monit
pm2 logs chatbot-server
```

---

## Scaling

### Multiple Instances
```bash
pm2 start dist/index.js --name chatbot -i 4
```

### Load Balancer
Use Nginx upstream configuration for multiple backend instances.

---

## Maintenance

### Update Website Index
```bash
cd /path/to/chatbot/server
npm run index
```

Schedule via cron:
```bash
0 2 * * * cd /path/to/chatbot/server && npm run index
```

### Update Model
```bash
ollama pull llama3.1:latest
pm2 restart ollama
```

---

## Security Checklist

- [ ] Firewall configured (only  ports 80, 443 open)
- [ ] HTTPS enabled (Let's Encrypt)
- [ ] Environment variables secured
- [ ] Regular security updates
- [ ] Rate limiting on API endpoints
- [ ] CORS properly configured

---

## Backup Strategy

### What to Backup
- LanceDB vector database (`server/lancedb/`)
- Environment configuration (`server/.env`)
- Custom FAQ entries (`server/src/faq.ts`)

### Backup Script
```bash
#!/bin/bash
tar -czf backup-$(date +%Y%m%d).tar.gz \
  server/lancedb \
  server/.env \
  server/src/faq.ts
```

---

## Cost Estimates

### Option 1: Cloud VPS
- DigitalOcean 8GB Droplet: ~$48/month
- AWS t3.large: ~$60/month

### Option 2: Serverless (Not Recommended)
- Ollama requires persistent instance
- Not suitable for serverless

**Total: $50-60/month for dedicated hosting**

---

## Support Contacts

- Infrastructure: [Your DevOps Team]
- Application: [Your Dev Team]
- Ollama Issues: https://github.com/ollama/ollama
