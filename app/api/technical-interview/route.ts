import { NextRequest, NextResponse } from "next/server";
import { conductTechnicalInterview } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobDescription, conversationHistory } = await request.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: "Resume text and job description required", message: "Please provide resume and job description." },
        { status: 400 }
      );
    }

    const result = await conductTechnicalInterview(
      resumeText,
      jobDescription,
      conversationHistory || []
    );

    // Ensure result has a valid message
    if (!result || !result.message || result.message.trim() === "") {
      console.error("Empty message from conductTechnicalInterview:", result);
      return NextResponse.json({
        message: "Can you tell me about your experience with the technologies listed in your resume?",
        isComplete: false,
        evaluation: null
      });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in technical interview:", error);
    const errorMessage = error?.message || "Failed to conduct interview";
    
    // Return a fallback question instead of just an error
    return NextResponse.json(
      { 
        message: "I apologize for the technical issue. Let's continue. Can you tell me about your most recent project?",
        isComplete: false,
        evaluation: null,
        error: errorMessage
      },
      { status: 500 }
    );
  }
}



