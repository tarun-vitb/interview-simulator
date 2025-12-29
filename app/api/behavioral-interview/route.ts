import { NextRequest, NextResponse } from "next/server";
import { conductBehavioralInterview } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const { resumeText, conversationHistory } = await request.json();

    if (!resumeText) {
      return NextResponse.json(
        { error: "Resume text required", message: "Please provide resume text." },
        { status: 400 }
      );
    }

    const result = await conductBehavioralInterview(
      resumeText,
      conversationHistory || []
    );

    // Ensure result has a valid message
    if (!result || !result.message || result.message.trim() === "") {
      console.error("Empty message from conductBehavioralInterview:", result);
      return NextResponse.json({
        message: "Tell me about a time when you faced a significant challenge at work. How did you handle it?",
        isComplete: false,
        evaluation: null
      });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in behavioral interview:", error);
    const errorMessage = error?.message || "Failed to conduct interview";
    
    // Return a fallback question instead of just an error
    return NextResponse.json(
      { 
        message: "I apologize for the technical issue. Let's continue. Can you describe a situation where you had to work under pressure?",
        isComplete: false,
        evaluation: null,
        error: errorMessage
      },
      { status: 500 }
    );
  }
}



