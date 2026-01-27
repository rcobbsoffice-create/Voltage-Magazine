import { Article } from '../../types';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export const generateArticleFromAnswers = async (
    artistName: string,
    genre: string,
    bio: string,
    influences: string,
    deepCut: string
): Promise<Article> => {

    console.log("Generating story for:", artistName);

    if (!GEMINI_API_KEY) {
        console.error("Missing Gemini API Key");
        throw new Error("API Key Missing. Please add EXPO_PUBLIC_GEMINI_API_KEY to .env");
    }

    const systemPrompt = `
    You are a senior music journalist for VOLTAGE (a Rolling Stone-style industrial/luxury magazine).
    Write a gritty, high-energy feature story (approx 400 words) about the artist "${artistName}".
    
    Data:
    - Genre: ${genre}
    - Bio: ${bio}
    - Influences: ${influences}
    - Deep Cut Answer: "${deepCut}"

    Format the output as a JSON object with this structure (do not use Markdown code blocks, just raw JSON):
    {
      "title": "A catchy, bold headline",
      "excerpt": "A 1-sentence hook.",
      "content": "The full article body in Markdown format. Use ## for section headers.",
      "slug": "kebab-case-title"
    }
  `;

    try {
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }]
            })
        });

        const data = await response.json();

        // Parse Gemini Response
        const rawText = data.candidates[0].content.parts[0].text;
        // Clean up potential markdown code blocks from the JSON string
        const jsonString = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedArticle = JSON.parse(jsonString);

        return {
            id: `gen-${Date.now()}`,
            title: parsedArticle.title,
            slug: parsedArticle.slug,
            coverImage: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?q=80&w=800&auto=format&fit=crop',
            excerpt: parsedArticle.excerpt,
            content: parsedArticle.content,
            author: {
                id: 'ai-bot',
                username: 'VOLTAGE AI',
                email: 'ai@voltage.com',
                role: 'WRITER',
                rating: 5,
                completedJobs: 1000,
                expertise: ['Algorithmic Journalism'],
                portfolio: []
            },
            publishedAt: new Date().toISOString(),
            isPremium: false
        };

    } catch (error) {
        console.error("AI Generation Failed:", error);
        // Fallback Mock for Demo if API fails
        return {
            id: 'fallback-1',
            title: `Falback: The Rise of ${artistName}`,
            slug: 'fallback-article',
            coverImage: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e',
            excerpt: 'AI generation failed, but the show must go on.',
            content: `## System Error \n\n We couldn't reach the VOLTAGE AI mainframe. Check your API Key.`,
            author: { id: 'bot', username: 'System', email: '', role: 'ADMIN', rating: 0, completedJobs: 0, portfolio: [] },
            publishedAt: new Date().toISOString(),
            isPremium: false
        };
    }
};
