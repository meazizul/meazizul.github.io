# Chatbot LLM Backend (Cloudflare Worker + Gemini)

This Cloudflare Worker proxies requests to Google's Gemini API, enabling your portfolio chatbot to give intelligent, contextual responses about you.

## Setup Instructions

### 1. Get a Gemini API Key (Free)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (starts with `AIza...`)

### 2. Deploy the Cloudflare Worker

1. Create a free account at [Cloudflare](https://dash.cloudflare.com/)
2. Go to **Workers & Pages** in the sidebar
3. Click **Create Application** → **Create Worker**
4. Give it a name (e.g., `rajat-chatbot`)
5. Click **Deploy** (with the default code)
6. Click **Edit Code** and replace everything with the contents of `worker.js`
7. Click **Deploy**

### 3. Add Your API Key as a Secret

1. Go to your worker's **Settings** tab
2. Click **Variables** in the sidebar
3. Under **Environment Variables**, click **Add variable**
4. Set:
   - Variable name: `GEMINI_API_KEY`
   - Value: Your Gemini API key
5. Click **Encrypt** (recommended) then **Save**

### 4. Get Your Worker URL

Your worker URL will be something like:
```
https://rajat-chatbot.your-subdomain.workers.dev
```

You can find it on your worker's overview page.

### 5. Update Your Portfolio

In `js/main.js`, find this line near the chatbot section:

```javascript
const CHATBOT_WORKER_URL = ''; // e.g., 'https://rajat-chatbot.your-subdomain.workers.dev'
```

Replace with your worker URL:

```javascript
const CHATBOT_WORKER_URL = 'https://rajat-chatbot.your-subdomain.workers.dev';
```

### 6. Test It!

1. Commit and push your changes
2. Open your portfolio
3. Click the chatbot and ask a question
4. You should get intelligent LLM-powered responses!

## How It Works

```
[User] → [Your Portfolio] → [Cloudflare Worker] → [Gemini API]
              ↓                     ↓
        (hides API key)    (adds system prompt with
                            your portfolio info)
```

- **Your API key stays secret** - it's stored in Cloudflare, never exposed to browsers
- **System prompt** - The worker includes detailed context about you, so Gemini gives accurate answers
- **Conversation history** - The chatbot sends recent messages for context
- **Fallback** - If the API fails, it falls back to pattern matching

## Free Tier Limits

| Service | Free Tier |
|---------|-----------|
| Cloudflare Workers | 100,000 requests/day |
| Gemini 1.5 Flash | 15 requests/min, 1M tokens/day |

This is more than enough for a portfolio site!

## Customization

### Update the System Prompt

Edit the `SYSTEM_PROMPT` constant in `worker.js` to update:
- Your personal info
- Experience details
- Skills and technologies
- Any new achievements

### Adjust Response Style

In the `generationConfig` section:
- `temperature`: 0.0-1.0 (lower = more focused, higher = more creative)
- `maxOutputTokens`: Maximum response length

## Troubleshooting

**"I'm having trouble responding right now"**
- Check your API key is correct
- Check Cloudflare Worker logs for errors

**Chatbot still uses pattern matching**
- Make sure `CHATBOT_WORKER_URL` is set correctly
- Check browser console for CORS or network errors

**Slow responses**
- Gemini is generally fast, but first request may be slower
- Check your network connection

