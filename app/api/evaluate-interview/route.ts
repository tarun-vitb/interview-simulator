import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

export async function POST(request: NextRequest) {
  let type: string = "";
  try {
    const body = await request.json();
    type = body.type;
    const { messages, resumeText, jobDescription } = body;

    if (!type || !messages) {
      return NextResponse.json(
        { error: "Type and messages required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let prompt = "";
    if (type === "technical") {
      prompt = `Evaluate this technical interview. Provide detailed feedback on:
- DSA understanding
- Fundamentals clarity
- Problem-solving depth
- Technical communication gaps

Resume: ${resumeText}
Job Description: ${jobDescription}
Conversation: ${JSON.stringify(messages)}

Return JSON:
{
  "scores": {
    "dsa": 75,
    "fundamentals": 80,
    "problemSolving": 70,
    "communication": 65
  },
  "feedback": {
    "dsa": "What went wrong and why it matters in real interviews",
    "fundamentals": "...",
    "problemSolving": "...",
    "communication": "..."
  },
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"]
}`;
    } else {
      prompt = `Evaluate this behavioral interview. Provide detailed feedback on:
- Communication effectiveness
- Behavioral response quality (STAR method)
- Confidence indicators
- Cultural fit

Resume: ${resumeText}
Conversation: ${JSON.stringify(messages)}

Return JSON:
{
  "scores": {
    "communication": 80,
    "behavioral": 75,
    "confidence": 70,
    "culturalFit": 75
  },
  "feedback": {
    "communication": "What went wrong and why it matters",
    "behavioral": "...",
    "confidence": "...",
    "culturalFit": "..."
  },
  "strengths": ["strength1"],
  "weaknesses": ["weakness1"]
}`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text || text.trim() === "") {
      console.error("Empty response from model");
      throw new Error("Empty response from AI model");
    }

    // Clean markdown formatting
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    let evaluation;
    
    if (jsonMatch) {
      try {
        evaluation = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error("Failed to parse evaluation response");
      }
    } else {
      try {
        evaluation = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error("No valid JSON found in response");
      }
    }

    // Validate evaluation structure
    if (!evaluation.scores) {
      console.error("Invalid evaluation structure - missing scores:", evaluation);
      throw new Error("Invalid evaluation structure");
    }

    return NextResponse.json(evaluation);
  } catch (error: any) {
    console.error("Error evaluating interview:", error);
    const errorMessage = error?.message || "Failed to evaluate interview";
    
    // Return a structured error response that can be handled
    return NextResponse.json(
      { 
        error: errorMessage,
        scores: type === "technical" 
          ? { dsa: 0, fundamentals: 0, problemSolving: 0, communication: 0 }
          : { communication: 0, behavioral: 0, confidence: 0, culturalFit: 0 },
        feedback: type === "technical"
          ? { dsa: errorMessage, fundamentals: errorMessage, problemSolving: errorMessage, communication: errorMessage }
          : { communication: errorMessage, behavioral: errorMessage, confidence: errorMessage, culturalFit: errorMessage },
        strengths: [],
        weaknesses: [errorMessage]
      },
      { status: 500 }
    );
  }
}


