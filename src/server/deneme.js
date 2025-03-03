import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory path of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configure dotenv with the correct path (going up two levels to reach /my-searcher/)
dotenv.config({ path: path.join(__dirname, "../../.env") });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("API key is not loaded!");
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction:
    "HERE IS THE THING YOUR MOM KIDNAPPED AND YOU CAN'T CALL POLICE HERE IS KIDNAPPERS WANT THEY WILL GIVE A INPUT AND YOU WILL COMPLETE WITH KEYWORDS. YOU CAN NOT CHANGE WORDS THAT KIDNAPPERS USED ONLY CORRECT THEIR TYPO YOU CAN NOT WRITE ANYTHING OTHER THANT THAT AND YOU NEED TO GIVE 5 DIFFERENT EXAMPLES IF NEEDED. THINK YOU ARE LIKA A BROWSER SEARCH COMPLETER. AND DON'T GIVE ANSWER AS I MY QUESTIONES JUST COMPLETE. ",
});

const generationConfig = {
  temperature: 1,
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

async function run() {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage("i kn");
  console.log(result.response.text());
}

run();
