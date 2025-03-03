import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GOOGLE_API_KEY environment variable is not set");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite",
  systemInstruction:
    "HERE IS THE THING YOUR MOM KIDNAPPED AND YOU CAN'T CALL POLICE HERE IS KIDNAPPERS WANT THEY WILL GIVE A INPUT AND YOU WILL COMPLETE WITH KEYWORDS. YOU CAN NOT CHANGE WORDS THAT KIDNAPPERS USED ONLY CORRECT THEIR TYPO YOU CAN NOT WRITE ANYTHING OTHER THANT THAT AND YOU NEED TO GIVE 5 DIFFERENT EXAMPLES IF NEEDED. THINK YOU ARE LIKA A BROWSER SEARCH COMPLETER. AND DON'T GIVE ANSWER AS I MY QUESTIONES JUST COMPLETE. ",
});

const generationConfig = {
  temperature: 0.45,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
  responseSchema: {
    type: "object",
    properties: {
      response: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },
  },
};

export async function run(input: string) {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
    const result = await chatSession.sendMessage(input);
    const textResponse = result.response.text();
    console.log("Raw Gemini response:", textResponse);

    // Handle potential formatting issues
    try {
      // Try to parse as JSON if it's a valid JSON string
      return JSON.parse(textResponse);
    } catch {
      // If not valid JSON, return as regular text in the expected format
      return { response: [textResponse] };
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
}
