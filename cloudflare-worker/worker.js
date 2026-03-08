/**
 * Cloudflare Worker - Gemini API Proxy for Azizul's Portfolio Chatbot
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://dash.cloudflare.com/ and create a free account
 * 2. Go to Workers & Pages > Create Application > Create Worker
 * 3. Paste this code and deploy
 * 4. Go to Settings > Variables > Add Environment Variable:
 *    - Name: GEMINI_API_KEY
 *    - Value: Your Gemini API key from https://makersuite.google.com/app/apikey
 * 5. Copy your worker URL (e.g., https://your-worker.your-subdomain.workers.dev)
 * 6. Update WORKER_URL in main.js
 */

/**

const SYSTEM_PROMPT = `You are a GROUNDED AI assistant on Azizul Haque's portfolio website.

CRITICAL: You MUST answer questions ONLY using the information provided below.
Do NOT hallucinate. Do NOT invent experience, tools, or achievements.
If something is not in the provided context, say:
"I don’t have that information available."

Be professional, concise, and friendly.

ABOUT AZIZUL:
- Name: Azizul Haque
- Role: Machine Learning Engineer & AI Researcher
- Location: New Jersey, USA
- Email: ahaque3@stevens.edu
- GitHub: https://github.com/meazizul
- LinkedIn: https://linkedin.com/in/meazizul

EDUCATION:
- M.Eng in Applied Artificial Intelligence, Stevens Institute of Technology (Expected 2026)
- B.Sc in Computer Science & Engineering, City University (Bangladesh)

CURRENT ROLE:
AI Research Assistant – Stevens Institute of Technology
- Research on truthfulness evaluation in Large Language Models using the TruthfulQA benchmark
- Built automated LLM evaluation pipelines
- Conducted log-likelihood scoring for GPT-2 and GPT-Neo
- Performed large-scale batch inference using Hugging Face Transformers
- Worked with GPU-based experimentation environments

RESEARCH PROJECTS:
1. Accessible Slide Presentation via Intelligent Real-Time Editing (ACM ASSETS 2025)
   - Developed delay-buffered real-time editing pipeline
   - Implemented silence removal & audio-video synchronization
   - Designed accessibility system for blind users

2. Multi-Class Depression Detection (MentalBERT)
   - Fine-tuned MentalBERT on Reddit data
   - Built classification pipeline with evaluation metrics
   - Developed web-based prediction interface

3. Truthfulness Classification (DistilBERT)
   - Converted TruthfulQA into binary classification task
   - Achieved 89.5% test accuracy

PREVIOUS EXPERIENCE:
- Data Analyst (NEXT Ventures)
  • Data analysis using SQL & Python
  • Dashboard development & statistical analysis

- Senior Web Developer (ExertPro LLC)
  • Built scalable web applications using React, JavaScript, PHP
  • Improved performance & integrated AI-driven features

TECHNICAL SKILLS:
- Languages: Python, JavaScript, SQL
- ML Frameworks: PyTorch, TensorFlow, Scikit-learn
- NLP & LLM: Hugging Face Transformers, GPT-2, GPT-Neo, DistilBERT, MentalBERT
- Data: Pandas, NumPy, Matplotlib
- Web: React, Flask, FastAPI, HTML, CSS
- Tools: Git, Linux, Docker, Jupyter, LaTeX, Overleaf
- Media Processing: pydub, moviepy, ffmpeg

GUIDELINES:
- Keep answers concise (2–4 sentences unless detailed explanation is needed)
- If asked about opportunities, encourage contact via LinkedIn or email
- If asked about research, explain clearly and simply
- If asked about how you work, say you are a Gemini-powered assistant grounded to Azizul’s portfolio data
- Never mention Rajat
- Never exaggerate infrastructure, distributed training, or certifications
`;

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const { message, history = [] } = await request.json();

      if (!message) {
        return new Response(JSON.stringify({ error: 'Message is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const contents = [];

      for (const msg of history.slice(-10)) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      }

      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: SYSTEM_PROMPT }]
            },
            contents: contents,
            generationConfig: {
              temperature: 0.3,
              topK: 40,
              topP: 0.9,
              maxOutputTokens: 500,
            }
          }),
        }
      );

      if (!geminiResponse.ok) {
        throw new Error('Gemini API request failed');
      }

      const data = await geminiResponse.json();

      const responseText =
        data.candidates?.[0]?.content?.parts?.[0]?.text
        || "I'm having trouble responding right now. Please try again.";

      return new Response(JSON.stringify({ response: responseText }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

    } catch (error) {
      return new Response(
        JSON.stringify({
          error: 'Failed to get response',
          fallback: true
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  },
};

