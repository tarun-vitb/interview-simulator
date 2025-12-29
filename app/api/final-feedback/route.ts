import { NextRequest, NextResponse } from "next/server";
import { generateFinalFeedback } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const sessionData = await request.json();

    if (!sessionData) {
      return NextResponse.json(
        { error: "Session data required" },
        { status: 400 }
      );
    }

    const feedback = await generateFinalFeedback(sessionData);
    return NextResponse.json(feedback);
  } catch (error: any) {
    console.error("Error generating final feedback:", error);
    return NextResponse.json(
      { error: "Failed to generate final feedback" },
      { status: 500 }
    );
  }
}



