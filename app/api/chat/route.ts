import { NextResponse } from'next/server';
import OpenAI from'openai';
import { cosineSimilarity } from'../../lib/cosineSimilarity';
import { knowledgeBase, loadKnowledgeBase } from'../../lib/loadKnowledgeBase';

const systemPrompt = "You are a helpful assistant."; 

export const POST = async (req: Request, __res: Response) => {
  const openaiApiKey = process.env.OPENAI_API_KEY;

  // Ensure the knowledge base is loaded (could be done during server startup)
  if (knowledgeBase.length === 0) {
    await loadKnowledgeBase();
  }

  const openai = new OpenAI({ apiKey: openaiApiKey });
  const data = await req.json();

  const userMessage = data[data.length - 1].content;

  // Compute embedding for the user query
  const queryEmbedding = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: userMessage,
  });

  // Find the most relevant piece of text from the knowledge base
  let bestMatch = { text: '', similarity: -1 };
  knowledgeBase.forEach((entry) => {
    const similarity = cosineSimilarity(queryEmbedding.data[0].embedding, entry.embedding);
    if (similarity > bestMatch.similarity) {
      bestMatch = { text: entry.text, similarity };
    }
  });

  // Generate response based on the best match and user query
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `${systemPrompt} Please base your answer on the following information: "${bestMatch.text}"`,
      },
      ...data
    ],
    model: "gpt-4",
    stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            const text = encoder.encode(content);
            controller.enqueue(text);
          }
        }
      } catch (e) {
        controller.error(e);
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream);
};
