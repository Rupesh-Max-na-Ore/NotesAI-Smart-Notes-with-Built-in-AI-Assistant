const OpenAI = require("openai");
const redisClient = require("../config/redis");
const { Buffer } = require("buffer");

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY missing");
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// 1. Summarize user notes
async function summarizeNotes(notes, userId) {
  const cacheKey = `summary:user:${userId}`;

  const cached = await redisClient.get(cacheKey);
  if (cached) return cached;

  try {
    const content = notes.map(n => `- ${n.content}`).join("\n");

    const prompt = `
You are a helpful assistant.

Summarize the following notes into clear bullet points:

${content}
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });

    const result = response.choices[0].message.content;

    // Cache for 1 hour
    await redisClient.set(cacheKey, result, "EX", 3600);

    return result;

  } catch (err) {
    console.error("LLM Error:", err.message);
    throw err;
  }
}


// 2. Summarize arbitrary text 
async function summarizeText(text) {
  const cacheKey = `summary:text:${Buffer.from(text).toString("base64").slice(0, 50)}`;

  const cached = await redisClient.get(cacheKey);
  if (cached) return cached;

  try {
    const prompt = `
Summarize the following text concisely:

${text}
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });

    const result = response.choices[0].message.content;

    // Cache result
    await redisClient.set(cacheKey, result, "EX", 3600);

    return result;

  } catch (err) {
    console.error("LLM Error:", err.message);
    throw err;
  }
}

async function queryNotes(notes, query) {
  try {
    const content = notes.map(n => `- ${n.title}\n${n.content}`).join("\n");

    const prompt = `
You are an intelligent assistant.

User Notes:
${content}

User Question:
${query}

Answer clearly based only on the notes.
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });

    return response.choices[0].message.content;

  } catch (err) {
    console.error("LLM Query Error:", err.message);
    throw err;
  }
}

async function generateTags(text) {
  const prompt = `Extract 3-5 short tags from this text:\n${text}`;

  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return res.choices[0].message.content
    .split(",")
    .map(t => t.trim());
}

module.exports = {
  summarizeNotes,
  summarizeText,
  queryNotes,
  generateTags,
};