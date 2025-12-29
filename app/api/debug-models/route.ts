
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "No API key" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Dummy model to get client? 
        // Actually SDK doesn't expose listModels on the client instance directly in some versions?
        // Wait, typical usage:
        // const genAI = new GoogleGenerativeAI(API_KEY);
        // const model = genAI.getGenerativeModel(...)
        // There is no global listModels on genAI instance in the JS SDK?
        // Checking docs... 
        // Attempting to use the underlying API via fetch if SDK doesn't support it easy.
        // Or just try to deduce from error. 

        // Actually, let's just use fetch to list models directly to avoid SDK ambiguity
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        return NextResponse.json(data);

    } catch (error: any) {
        return NextResponse.json({ error: error.toString() }, { status: 500 });
    }
}
