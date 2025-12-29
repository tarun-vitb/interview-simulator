import { NextRequest, NextResponse } from "next/server";
import { generateWrittenTestQuestions } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const { experienceLevel } = await request.json();

    if (!experienceLevel) {
      return NextResponse.json(
        { error: "Experience level required" },
        { status: 400 }
      );
    }

    // Check if API key is set
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_api_key_here" || apiKey.trim() === "") {
      return NextResponse.json(
        { 
          error: "GEMINI_API_KEY is not configured correctly. Please replace 'your_api_key_here' in .env.local with your actual API key from https://makersuite.google.com/app/apikey",
          hint: "Make sure to restart the dev server after updating .env.local"
        },
        { status: 500 }
      );
    }

    const questions = await generateWrittenTestQuestions(experienceLevel);
    return NextResponse.json(questions);
  } catch (error: any) {
    console.error("Error generating test:", error);
    const errorMessage = error.message || "Failed to generate test";
    return NextResponse.json(
      { error: errorMessage, details: error.toString() },
      { status: 500 }
    );
  }
}

