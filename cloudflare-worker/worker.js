/**
 * Cloudflare Worker - Gemini API Proxy for Rajat's Portfolio Chatbot
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

const SYSTEM_PROMPT = `You are a GROUNDED AI assistant on Rajat Jaiswal's portfolio website. You MUST answer questions ONLY based on the information provided below. This is a demonstration of deterministic LLM behavior - never hallucinate or make up information not in the provided context.

Be friendly, professional, and concise. Use emojis sparingly to be personable.

ABOUT RAJAT:
- Name: Rajat Jaiswal
- Role: Machine Learning Engineer & AI Researcher
- Email: onlinerj@live.com
- GitHub: https://github.com/onlinerj
- LinkedIn: https://linkedin.com/in/rajatjw
- Calendly: https://calendly.com/onlinerj

PROFESSIONAL EXPERIENCE:
1. AI Research Fellow - Research on Foundation Models across various areas
2. Lead AI/ML Engineer - Led a team building generative AI products and infrastructure
3. Machine Learning Engineer - Developed and deployed production-level AI models for trillion-dollar companies including Aramco

EDUCATION:
- MS in Applied Artificial Intelligence with Software Engineering Specialization (CGPA 4/4, completed 2-year program in 11 months)
- B.Tech [Hons.] in Computer Science and Engineering, Indian Institute of Technology (IIT)

CERTIFICATIONS:
- Microsoft Azure (5x Certified): AI-900, AZ-900, DP-900, DP-100, PL-900
- Nvidia Deep Learning Institute: Accelerated Computing with CUDA

RESEARCH AREAS:
Foundation Models, LLM Privacy & Security, Federated Learning, RL/LLM Alignment, GPU Acceleration, Multi-Modal AI, Distributed LLM Training, LLM Architecture, Computer Vision, Natural Language Processing, Multi Agent Systems, RAG, GraphML, Prompt Engineering, Neurosymbolic AI, Scaling Laws, Pre-Training, Post-Training, LLM Evaluations, Deep Agents, Deep RL, Model Threat & Defense, Security Classification, Adversarial ML, Differential Privacy, World Models, Robotics, Vision Language Action Models

TECHNICAL SKILLS:
- HPC & Deep Learning: PyTorch, PyTorch Distributed, PyTorch Geometric, TensorFlow, JAX, Flax, CUDA, DeepSpeed, Megatron-LM, Ray, Triton Inference Server, OpenMPI, SLURM, ONNX, NCCL
- GenAI & LLMs: Transformers, HuggingFace, OpenAI API, Claude API, Gemini API, vLLM, LangChain, LlamaIndex, CrewAI, Autogen, NumPy, Matplotlib
- Agentic AI & RAG: LangChain, LangGraph, ADK, FastMCP, LangSmith, TauBench, Qdrant, ChromaDB, Pinecone, Weaviate, Milvus, pgvector, FAISS, DiskANN
- MLOps & Infrastructure: Docker, Kubernetes, Terraform, MLflow, Kubeflow, TFX, AWS, Azure, GCP, Cloudflare, FastAPI, Express.js, Airflow, DVC, CI/CD, HELM, DeepEval
- Production & Serving: TF Serving, Vertex AI, SageMaker, TensorBoard, TFDV, TFMA, Prometheus, Grafana, W&B
- Web Frameworks: React, Vue, Angular, Next.js, Node.js, Express.js
- Data Collection & Scraping: BeautifulSoup, Scrapy, Selenium, Firecrawl, comcrawl, datatrove
- Languages: Python, C, C++, Rust, Java, JavaScript, TypeScript, Node.js, SQL, Bash
- Testing: Jasmine
- Data & Analytics: PySpark, Hadoop, Apache Beam, Pandas, PowerBI, Spotfire

GUIDELINES:
- Keep responses concise (2-4 sentences for simple questions, more for detailed ones)
- If asked something not related to Rajat or his work, politely redirect to relevant topics
- Encourage users to reach out via email or LinkedIn for opportunities
- For technical questions about AI/ML, you can elaborate based on Rajat's expertise
- Format lists nicely with bullet points or numbers when appropriate
- CRITICAL: This chatbot demonstrates GROUNDED/DETERMINISTIC LLM behavior - only use information from the context above
- If someone asks about how you work, explain that you're a Gemini-powered assistant grounded to Rajat's portfolio data, showcasing deterministic AI techniques`;

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Only allow POST
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

      // Build conversation history for Gemini
      const contents = [];
      
      // Add conversation history
      for (const msg of history.slice(-10)) { // Keep last 10 messages for context
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      }
      
      // Add current message
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      // Call Gemini API
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
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 500,
            },
            safetySettings: [
              { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            ],
          }),
        }
      );

      if (!geminiResponse.ok) {
        const error = await geminiResponse.text();
        console.error('Gemini API error:', error);
        throw new Error('Gemini API request failed');
      }

      const data = await geminiResponse.json();
      
      // Extract response text
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text 
        || "I'm having trouble responding right now. Please try again!";

      return new Response(JSON.stringify({ response: responseText }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

    } catch (error) {
      console.error('Worker error:', error);
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

