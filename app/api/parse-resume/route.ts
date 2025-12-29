import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
  if (!apiKey || apiKey === "your_api_key_here" || apiKey.trim() === "") {
    throw new Error("GEMINI_API_KEY is not set. Please add your API key to .env.local file and restart the server.");
  }
  return new GoogleGenerativeAI(apiKey);
};

const getModelName = (): string => {
  return "gemini-2.5-flash";
};

export async function POST(request: NextRequest) {
  try {
    const { base64File, mimeType } = await request.json();

    if (!base64File) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Get GenAI instance (will throw if API key is not set)
    let genAI;
    try {
      genAI = getGenAI();
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "GEMINI_API_KEY is not configured. Please set it in your .env.local file and restart the server." },
        { status: 500 }
      );
    }

    // Use Gemini to extract text from PDF
    const modelName = getModelName();
    const model = genAI.getGenerativeModel({ model: modelName });
    
    // Convert base64 to buffer for Gemini
    const base64Data = base64File.split(",")[1] || base64File;
    
    if (!base64Data || base64Data.trim() === "") {
      return NextResponse.json(
        { error: "Invalid file data provided" },
        { status: 400 }
      );
    }
    
    const prompt = `Extract all text from this resume document. Return only the text content, no formatting.`;

    try {
      // For PDF, we can use Gemini's vision capabilities if available
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType || "application/pdf",
          },
        },
      ]);

      const response = await result.response;
      const resumeText = response.text();

      if (!resumeText || resumeText.trim() === "") {
        return NextResponse.json(
          { error: "Failed to extract text from resume. The file might be corrupted or empty." },
          { status: 500 }
        );
      }

      return NextResponse.json({ resumeText });
    } catch (error: any) {
      // Better error handling
      console.error("Error parsing resume:", error);
      const errorMessage = error?.message || String(error);
      
      if (errorMessage.includes("API_KEY") || errorMessage.includes("api key")) {
        return NextResponse.json(
          { error: "Invalid or missing GEMINI_API_KEY. Please check your .env.local file and restart the server." },
          { status: 500 }
        );
      }
      
      if (errorMessage.includes("quota") || errorMessage.includes("limit")) {
        return NextResponse.json(
          { error: "API quota exceeded. Please check your Gemini API usage limits." },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: `Failed to parse resume: ${errorMessage}. Please ensure it's a valid PDF file.` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in parse-resume route:", error);
    const errorMessage = error?.message || "Internal server error";
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}


