import fs from'fs';
import OpenAI from'openai';

// Define the interface for the knowledge base entries
interface KnowledgeBaseEntry {
  text: string;
  embedding: number[];
}

// Define the knowledge base array with the proper type
let knowledgeBase: KnowledgeBaseEntry[] = [];

// Function to load and process the knowledge base

const loadKnowledgeBase = async (): Promise<KnowledgeBaseEntry[]> => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const text = fs.readFileSync('public/knowledge_base.txt', 'utf-8');

  const validInput = text.split('\n').filter(line => line.trim() !== '');

  const embeddings = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: validInput,
  });

  // Map the embeddings to their corresponding text
  return embeddings.data.map((embedding, index) => ({
    text: text.split('\n')[index],
    embedding: embedding.embedding,
  }));
};

// Load the knowledge base and store it in the knowledgeBase variable
loadKnowledgeBase().then((data) => {
  knowledgeBase = data;
});

export { knowledgeBase, loadKnowledgeBase };
