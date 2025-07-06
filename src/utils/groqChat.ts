export async function getGroqResponse(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('Groq API key is not configured. Please set VITE_GROQ_API_KEY in your environment variables.');
  }
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama3-70b-8192", // You can change to another supported model if desired
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
    }),
  });
  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't generate a response.";
} 