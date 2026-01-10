import OpenAI from 'openai';
import { SYSTEM_PROMPT } from '../src/prompts/systemPrompt.js';

export default async function handler(req, res) {
  // CORS headers to allow requests from any origin (or restrict to your domain)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message } = req.body;

  if (!process.env.NVIDIA_API_KEY) {
      console.error("Missing NVIDIA_API_KEY in server environment");
      return res.status(500).json({ error: 'Server configuration error: Missing API Key' });
  }

  const openai = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY,
    baseURL: 'https://integrate.api.nvidia.com/v1',
  });

  try {
    const completion = await openai.chat.completions.create({
        model: "minimaxai/minimax-m2",
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: message }
        ],
        temperature: 1,
        top_p: 0.95,
        max_tokens: 8192,
        stream: false
    });

    const text = completion.choices[0]?.message?.content || "";
    return res.status(200).json({ text });

  } catch (error) {
    console.error("API proxy error:", error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
