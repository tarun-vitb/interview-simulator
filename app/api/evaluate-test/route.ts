import { NextRequest, NextResponse } from "next/server";
import { evaluateWrittenTest } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { questions, answers } = body;

    if (!questions || !answers) {
      return NextResponse.json(
        { error: "Questions and answers required" },
        { status: 400 }
      );
    }

    // Validate questions structure
    if (!questions.aptitude || !Array.isArray(questions.aptitude) ||
        !questions.dsa || !Array.isArray(questions.dsa) ||
        !questions.fundamentals || !Array.isArray(questions.fundamentals)) {
      return NextResponse.json(
        { error: "Invalid questions structure" },
        { status: 400 }
      );
    }

    const evaluation = await evaluateWrittenTest(answers, questions);
    return NextResponse.json(evaluation);
  } catch (error: any) {
    console.error("Error evaluating test:", error);
    const errorMessage = error.message || "Failed to evaluate test";
    return NextResponse.json(
      { error: errorMessage, details: error.toString() },
      { status: 500 }
    );
  }
}


