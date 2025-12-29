
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Mocking the function from lib/ai.ts to test independently
async function testTechnicalInterview() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("GEMINI_API_KEY not found in env");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Using the model we just fixed to
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const resumeText = "Experienced React Developer with 3 years of experience.";
    const jobDescription = "Looking for a Senior Frontend Engineer.";

    // Simulating the user's reported flow
    // 1. Initial Start
    let conversationHistory = [];

    console.log("--- Round 1: Initial Start ---");
    let response1 = await conductInterview(model, resumeText, jobDescription, conversationHistory);
    console.log("AI Response:", response1.message);

    if (response1.message) conversationHistory.push({ role: "assistant", content: response1.message });

    // 2. User says "okay start"
    console.log("\n--- Round 2: User says 'okay start' ---");
    conversationHistory.push({ role: "user", content: "okay start" });
    let response2 = await conductInterview(model, resumeText, jobDescription, conversationHistory);
    console.log("AI Response:", response2.message);

    if (response2.message) conversationHistory.push({ role: "assistant", content: response2.message });

    // 3. User says "start" again
    console.log("\n--- Round 3: User says 'start' ---");
    conversationHistory.push({ role: "user", content: "let's start" });
    let response3 = await conductInterview(model, resumeText, jobDescription, conversationHistory);
    console.log("AI Response:", response3.message);
}

async function conductInterview(model, resumeText, jobDescription, conversationHistory) {
    const systemPrompt = `You are a professional technical interviewer conducting a mock interview. 
Be neutral and professional. Ask resume-based technical questions, conceptual problems, and scenario-based questions.
Adapt your follow-up questions based on the candidate's answers. Keep responses concise.
Maximum interview duration: 3 minutes.`;

    const prompt = `${systemPrompt}

Resume:
${resumeText}

Job Description:
${jobDescription}

Conversation History:
${JSON.stringify(conversationHistory)}

${conversationHistory.length === 0 ? "Start the interview with an introduction and first technical question." : "Continue the interview with a follow-up question or evaluation."}

Return JSON:
{
  "message": "Your question or response",
  "isComplete": false,
  "evaluation": null
}`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[0]);
            } catch (e) {
                console.log("JSON Parse Error:", e);
            }
        }
        return { message: text, isComplete: false, evaluation: null };
    } catch (error) {
        console.error("Error:", error);
        return { message: "Error", isComplete: false };
    }
}

testTechnicalInterview();
