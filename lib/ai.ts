import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini - user will need to set GEMINI_API_KEY in .env.local
// Note: This file runs on server-side, so we use GEMINI_API_KEY (not NEXT_PUBLIC)
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

  if (!apiKey || apiKey === "your_api_key_here" || apiKey.trim() === "") {
    throw new Error("GEMINI_API_KEY is not set. Please add your API key to .env.local file and restart the server.");
  }

  return new GoogleGenerativeAI(apiKey);
};

// Get model name - using gemini-1.5-pro for better compatibility
const getModelName = (): string => {
  // Based on available models for this user
  return "gemini-2.5-flash";
};

export async function analyzeResume(resumeText: string, jobDescription: string) {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: getModelName() });

  const prompt = `Analyze this resume and job description. Extract key skills, experience, and identify gaps.

Resume:
${resumeText}

Job Description:
${jobDescription}

Provide a JSON response with:
{
  "skills": ["skill1", "skill2"],
  "experience": "summary",
  "gaps": ["gap1", "gap2"],
  "strengths": ["strength1", "strength2"]
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw error;
  }
}

export async function generateWrittenTestQuestions(experienceLevel: string) {
  const genAI = getGenAI();
  const modelName = getModelName();
  const model = genAI.getGenerativeModel({ model: modelName });

  const prompt = `You are a technical interviewer. Generate a written test with exactly 15 questions for a ${experienceLevel} software engineer candidate.

Requirements:
- 5 aptitude questions (logical reasoning, math, problem-solving)
- 5 DSA fundamentals questions (arrays, linked lists, trees, algorithms, time complexity)
- 5 core CS basics (OS, DBMS, networks, OOP concepts)

Each question must have:
- question: The question text
- options: Array of exactly 4 options like ["A) option1", "B) option2", "C) option3", "D) option4"]
- correct: The correct option letter (A, B, C, or D)
- explanation: Brief explanation of why this is correct

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "aptitude": [
    {"question": "What is 2+2?", "options": ["A) 3", "B) 4", "C) 5", "D) 6"], "correct": "B", "explanation": "Basic addition"}
  ],
  "dsa": [
    {"question": "What is the time complexity of binary search?", "options": ["A) O(n)", "B) O(log n)", "C) O(n log n)", "D) O(1)"], "correct": "B", "explanation": "Binary search divides the search space in half each iteration"}
  ],
  "fundamentals": [
    {"question": "What is a primary key?", "options": ["A) A foreign key", "B) A unique identifier", "C) An index", "D) A constraint"], "correct": "B", "explanation": "Primary key uniquely identifies each row"}
  ]
}

Make sure all arrays have exactly 5 questions each. Return only the JSON object, nothing else.`;

  try {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ebbbdb8b-9caa-4469-81bd-aad2adc311c1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'lib/ai.ts:generateWrittenTestQuestions', message: 'Before model.generateContent call', data: { modelName, experienceLevel }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'F' }) }).catch(() => { });
    // #endregion
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ebbbdb8b-9caa-4469-81bd-aad2adc311c1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'lib/ai.ts:generateWrittenTestQuestions', message: 'Model call successful', data: { modelName, responseLength: text.length }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'F' }) }).catch(() => { });
    // #endregion

    // Clean the text - remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ebbbdb8b-9caa-4469-81bd-aad2adc311c1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'lib/ai.ts:96', message: 'Before JSON extraction', data: { cleanedTextLength: cleanedText.length, startsWithBrace: cleanedText.trim().startsWith('{') }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C' }) }).catch(() => { });
    // #endregion
    // Try to extract JSON
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ebbbdb8b-9caa-4469-81bd-aad2adc311c1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'lib/ai.ts:98', message: 'Before JSON.parse', data: { jsonMatchLength: jsonMatch[0].length, firstChars: jsonMatch[0].substring(0, 50) }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C' }) }).catch(() => { });
      // #endregion
      let parsed;
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/ebbbdb8b-9caa-4469-81bd-aad2adc311c1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'lib/ai.ts:100', message: 'JSON.parse failed', data: { parseError: parseError instanceof Error ? parseError.message : String(parseError), jsonPreview: jsonMatch[0].substring(0, 200) }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C' }) }).catch(() => { });
        // #endregion
        throw new Error(`Failed to parse JSON response: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
      }
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ebbbdb8b-9caa-4469-81bd-aad2adc311c1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'lib/ai.ts:99', message: 'JSON.parse successful, validating structure', data: { hasAptitude: !!parsed.aptitude, hasDsa: !!parsed.dsa, hasFundamentals: !!parsed.fundamentals, aptitudeLength: parsed.aptitude?.length, dsaLength: parsed.dsa?.length, fundamentalsLength: parsed.fundamentals?.length }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C' }) }).catch(() => { });
      // #endregion

      // Validate structure
      if (!parsed.aptitude || !parsed.dsa || !parsed.fundamentals) {
        throw new Error("Invalid test structure: missing sections");
      }

      return parsed;
    }

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ebbbdb8b-9caa-4469-81bd-aad2adc311c1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'lib/ai.ts:108', message: 'No JSON match found', data: { cleanedTextPreview: cleanedText.substring(0, 200) }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C' }) }).catch(() => { });
    // #endregion
    throw new Error("No valid JSON found in response");
  } catch (error: any) {
    console.error("Error generating questions:", error);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ebbbdb8b-9caa-4469-81bd-aad2adc311c1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'lib/ai.ts:generateWrittenTestQuestions:catch', message: 'Error in generateWrittenTestQuestions', data: { modelName, errorMessage: error.message, errorString: String(error), errorStack: error.stack }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'F' }) }).catch(() => { });
    // #endregion
    if (error.message?.includes("API_KEY")) {
      throw new Error("Invalid or missing GEMINI_API_KEY. Please check your .env.local file.");
    }
    if (error.message?.includes("not found") || error.message?.includes("404") || error.message?.includes("is not found")) {
      // Try fallback model
      console.warn(`Model ${modelName} not found, trying fallback: getModelName()`);
      try {
        // Retry with the same model or you could switch to another fallback like "gemini-pro"
        // But if flash 404s, likely an API key issue or region lock.
        // Let's try "gemini-pro" as legacy fallback just in case
        // Try gemini-3-flash-preview as next fallback
        const fallbackModel = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        const result = await fallbackModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        // Continue with the same processing...
        let cleanedText = text.trim();
        if (cleanedText.startsWith("```")) {
          cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
        }
        const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (!parsed.aptitude || !parsed.dsa || !parsed.fundamentals) {
            throw new Error("Invalid test structure: missing sections");
          }
          return parsed;
        }
        throw new Error("No valid JSON found in response");
      } catch (fallbackError) {
        throw new Error(`Model ${modelName} not found, and fallback also failed. Please check available models. Original error: ${error.message}`);
      }
    }
    throw new Error(`Failed to generate test questions: ${error.message || error.toString()}`);
  }
}

export async function evaluateWrittenTest(answers: any, questions: any) {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: getModelName() });

  const prompt = `Evaluate this written test. Calculate scores and provide detailed feedback.

Questions: ${JSON.stringify(questions)}
Answers: ${JSON.stringify(answers)}

Return JSON:
{
  "scores": {
    "aptitude": 80,
    "dsa": 60,
    "fundamentals": 70
  },
  "feedback": {
    "aptitude": "What went wrong and why it matters",
    "dsa": "...",
    "fundamentals": "..."
  },
  "weakAreas": ["area1", "area2"]
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the text - remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        throw new Error(`Failed to parse evaluation JSON: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
      }
    }

    try {
      return JSON.parse(cleanedText);
    } catch (parseError) {
      throw new Error(`No valid JSON found in evaluation response: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
    }
  } catch (error: any) {
    console.error("Error evaluating test:", error);
    if (error.message?.includes("API_KEY")) {
      throw new Error("Invalid or missing GEMINI_API_KEY. Please check your .env.local file.");
    }
    throw error;
  }
}

export async function conductTechnicalInterview(
  resumeText: string,
  jobDescription: string,
  conversationHistory: Array<{ role: string; content: string }>
) {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: getModelName() });

  const systemPrompt = `You are a professional technical interviewer conducting a mock interview. 
Your ABSOLUTE PRIMARY GOAL is to ASK QUESTIONS to assess the candidate's technical skills.

CRITICAL MANDATORY RULES - NEVER VIOLATE THESE:
1. EVERY single response MUST end with a question mark (?)
2. EVERY single response MUST contain a specific technical question
3. NEVER respond with just "Thank you" or acknowledgments without a follow-up question
4. If starting the interview, immediately ask the first technical question about their experience
5. If continuing, briefly acknowledge their answer (1 sentence max) then IMMEDIATELY ask a new technical question
6. Ask about: coding problems, algorithms, system design, technologies mentioned in resume, debugging scenarios
7. Keep total response under 3 sentences: brief comment + question
8. If they give a short answer, ask a deeper follow-up question on the same topic
9. YOUR RESPONSE MUST ALWAYS END WITH A QUESTION MARK (?)

Maximum interview duration: 3 minutes.

EXAMPLE GOOD RESPONSES (ALL END WITH ?):
- "Good. Now, can you explain the time complexity of merge sort?"
- "I see you have React experience. How would you optimize a component that re-renders too frequently?"
- "Let's start with algorithms. Can you describe how binary search works?"

BAD RESPONSES (NEVER DO THIS):
- "Thank you for your response." (NO QUESTION MARK - FORBIDDEN)
- "Thank you." (NO QUESTION - FORBIDDEN)
- "I understand." (NO QUESTION - FORBIDDEN)`;

  const isFirstMessage = conversationHistory.length === 0;
  const lastUserMessage = conversationHistory.filter((m: any) => m.role === "user").pop()?.content || "";
  
  const prompt = `${systemPrompt}

Resume:
${resumeText}

Job Description:
${jobDescription}

Conversation History:
${JSON.stringify(conversationHistory)}

${isFirstMessage 
  ? "Start the interview with a greeting and immediately ask your first technical question. Your message MUST end with a question mark (?)." 
  : `The candidate just said: "${lastUserMessage}". Acknowledge briefly (1 sentence max) and then ask a follow-up technical question. Your message MUST end with a question mark (?).`}

IMPORTANT: Your response message field MUST contain a question that ends with a question mark (?). Do not just acknowledge - you MUST ask a question.

Return JSON:
{
  "message": "Your question or response (MUST end with ?)",
  "isComplete": false,
  "evaluation": null
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Validate that we got text from the model
    if (!text || text.trim() === "") {
      console.error("Technical Interview: Empty response from model");
      return {
        message: conversationHistory.length === 0 
          ? "Hello! Let's begin the technical interview. Can you tell me about your experience with the technologies listed in your resume?"
          : "Can you walk me through your most recent project and the technical challenges you faced?",
        isComplete: false,
        evaluation: null
      };
    }

    // Clean markdown formatting
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    let finalMessage = "";
    
    if (jsonMatch) {
      console.log("Technical Interview RAW Text:", text);
      console.log("Technical Interview JSON Match:", jsonMatch[0]);
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log("Technical Interview Parsed:", parsed);

        // Ensure message field is never empty
        if (!parsed.message || parsed.message.trim() === "") {
          console.warn("Technical Interview: Parsed message is empty, using fallback");
          finalMessage = conversationHistory.length === 0
            ? "Can you tell me about your experience with the technologies listed in your resume?"
            : "Can you walk me through your most recent project and the technical challenges you faced?";
        } else {
          finalMessage = parsed.message.trim();
        }
      } catch (e) {
        console.error("Technical Interview JSON Parse Error:", e);
        // Use the raw text if it's not empty, otherwise use fallback
        finalMessage = (text && text.trim() !== "") 
          ? text.trim() 
          : (conversationHistory.length === 0
              ? "Let's start with your background. Can you walk me through your most recent project?"
              : "Can you explain a time when you had to debug a complex issue? What was your approach?");
      }
    } else {
      console.log("Technical Interview No JSON Match. Text:", text);
      // Use the raw text if it's not empty, otherwise use fallback
      finalMessage = (text && text.trim() !== "") 
        ? text.trim() 
        : (conversationHistory.length === 0
            ? "Let's start with your background. Can you walk me through your most recent project?"
            : "Can you explain a time when you had to debug a complex issue? What was your approach?");
    }

    // CRITICAL: Validate that the message contains a question mark
    // If not, append a question based on context
    const hasQuestionMark = finalMessage.includes("?");
    const isJustAcknowledgment = finalMessage.toLowerCase().includes("thank you") && !hasQuestionMark;
    
    if (!hasQuestionMark || isJustAcknowledgment) {
      console.warn("Technical Interview: Response missing question mark, appending question");
      
      // Generate a contextual question based on conversation history
      const hasAskedAboutExperience = conversationHistory.some((m: any) => 
        m.role === "assistant" && m.content.toLowerCase().includes("experience")
      );
      const hasAskedAboutProject = conversationHistory.some((m: any) => 
        m.role === "assistant" && m.content.toLowerCase().includes("project")
      );
      
      let fallbackQuestion = "";
      if (conversationHistory.length === 0) {
        fallbackQuestion = "Can you tell me about your experience with the technologies listed in your resume?";
      } else if (!hasAskedAboutProject) {
        fallbackQuestion = "Can you walk me through your most recent project and the technical challenges you faced?";
      } else if (!hasAskedAboutExperience) {
        fallbackQuestion = "What technologies are you most comfortable with, and can you explain how you've used them in real projects?";
      } else {
        fallbackQuestion = "Can you explain a time when you had to debug a complex issue? What was your approach?";
      }
      
      // If the message is just an acknowledgment, replace it with a question
      if (finalMessage.toLowerCase().includes("thank you") || finalMessage.toLowerCase().includes("i see") || finalMessage.toLowerCase().includes("good")) {
        finalMessage = finalMessage.replace(/\.$/, "").trim() + " " + fallbackQuestion;
      } else {
        finalMessage = finalMessage.trim() + " " + fallbackQuestion;
      }
    }

    return {
      message: finalMessage,
      isComplete: false,
      evaluation: null
    };
  } catch (error) {
    console.error("Error in technical interview:", error);
    throw error;
  }
}

export async function conductBehavioralInterview(
  resumeText: string,
  conversationHistory: Array<{ role: string; content: string }>
) {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: getModelName() });

  const systemPrompt = `You are an HR interviewer conducting a behavioral interview.
Your ABSOLUTE PRIMARY GOAL is to ASK BEHAVIORAL QUESTIONS using the STAR method.

CRITICAL MANDATORY RULES - NEVER VIOLATE THESE:
1. EVERY single response MUST end with a question mark (?)
2. EVERY single response MUST contain a specific behavioral question
3. NEVER respond with just "Thank you" or acknowledgments without a follow-up question
4. If starting, immediately ask the first behavioral question about their experience
5. If continuing, briefly acknowledge (1 sentence max) then IMMEDIATELY ask a new STAR-based behavioral question
6. Ask about: teamwork, conflict resolution, leadership, challenges, failures, achievements
7. Use STAR format prompts: "Tell me about a time when...", "Describe a situation where..."
8. Keep total response under 3 sentences: brief comment + question
9. YOUR RESPONSE MUST ALWAYS END WITH A QUESTION MARK (?)

Maximum interview duration: 3 minutes.

EXAMPLE GOOD RESPONSES (ALL END WITH ?):
- "Thank you for sharing. Tell me about a time when you had to resolve a conflict with a team member?"
- "I see. Describe a situation where you had to meet a tight deadline. How did you handle it?"
- "Let's begin. Can you tell me about a time when you showed leadership in a difficult situation?"

BAD RESPONSES (NEVER DO THIS):
- "Thank you for your response." (NO QUESTION MARK - FORBIDDEN)
- "Thank you." (NO QUESTION - FORBIDDEN)
- "I understand." (NO QUESTION - FORBIDDEN)`;

  const isFirstMessage = conversationHistory.length === 0;
  const lastUserMessage = conversationHistory.filter((m: any) => m.role === "user").pop()?.content || "";
  
  const prompt = `${systemPrompt}

Resume:
${resumeText}

Conversation History:
${JSON.stringify(conversationHistory)}

${isFirstMessage 
  ? "Start with a greeting and immediately ask your first behavioral question using STAR format. Your message MUST end with a question mark (?)." 
  : `The candidate just said: "${lastUserMessage}". Acknowledge briefly (1 sentence max) and then ask a follow-up behavioral question using STAR format. Your message MUST end with a question mark (?).`}

IMPORTANT: Your response message field MUST contain a behavioral question that ends with a question mark (?). Do not just acknowledge - you MUST ask a question.

Return JSON:
{
  "message": "Your question or response (MUST end with ?)",
  "isComplete": false,
  "evaluation": null
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Validate that we got text from the model
    if (!text || text.trim() === "") {
      console.error("Behavioral Interview: Empty response from model");
      return {
        message: conversationHistory.length === 0 
          ? "Hello! Let's begin the behavioral interview. Tell me about a time when you faced a significant challenge at work. How did you handle it?"
          : "Can you describe a situation where you had to work under pressure? How did you manage it?",
        isComplete: false,
        evaluation: null
      };
    }

    // Clean markdown formatting
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    let finalMessage = "";
    
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);

        // Ensure message field is never empty
        if (!parsed.message || parsed.message.trim() === "") {
          console.warn("Behavioral Interview: Parsed message is empty, using fallback");
          finalMessage = conversationHistory.length === 0
            ? "Tell me about a time when you faced a significant challenge at work. How did you handle it?"
            : "Can you describe a situation where you had to work under pressure? How did you manage it?";
        } else {
          finalMessage = parsed.message.trim();
        }
      } catch (e) {
        console.error("Behavioral Interview JSON Parse Error:", e);
        // Use the raw text if it's not empty, otherwise use fallback
        finalMessage = (text && text.trim() !== "") 
          ? text.trim() 
          : (conversationHistory.length === 0
              ? "Let's start. Can you describe a situation where you had to work under pressure?"
              : "Can you share an example of when you demonstrated leadership in a difficult situation?");
      }
    } else {
      // Use the raw text if it's not empty, otherwise use fallback
      finalMessage = (text && text.trim() !== "") 
        ? text.trim() 
        : (conversationHistory.length === 0
            ? "Let's start. Can you describe a situation where you had to work under pressure?"
            : "Can you share an example of when you demonstrated leadership in a difficult situation?");
    }

    // CRITICAL: Validate that the message contains a question mark
    // If not, append a question based on context
    const hasQuestionMark = finalMessage.includes("?");
    const isJustAcknowledgment = finalMessage.toLowerCase().includes("thank you") && !hasQuestionMark;
    
    if (!hasQuestionMark || isJustAcknowledgment) {
      console.warn("Behavioral Interview: Response missing question mark, appending question");
      
      // Generate a contextual question based on conversation history
      const hasAskedAboutChallenge = conversationHistory.some((m: any) => 
        m.role === "assistant" && (m.content.toLowerCase().includes("challenge") || m.content.toLowerCase().includes("difficult"))
      );
      const hasAskedAboutTeamwork = conversationHistory.some((m: any) => 
        m.role === "assistant" && m.content.toLowerCase().includes("team")
      );
      const hasAskedAboutConflict = conversationHistory.some((m: any) => 
        m.role === "assistant" && m.content.toLowerCase().includes("conflict")
      );
      
      let fallbackQuestion = "";
      if (conversationHistory.length === 0) {
        fallbackQuestion = "Tell me about a time when you faced a significant challenge at work. How did you handle it?";
      } else if (!hasAskedAboutChallenge) {
        fallbackQuestion = "Can you describe a situation where you had to overcome a major obstacle? What was your approach?";
      } else if (!hasAskedAboutTeamwork) {
        fallbackQuestion = "Tell me about a time when you had to work closely with a team. How did you contribute?";
      } else if (!hasAskedAboutConflict) {
        fallbackQuestion = "Describe a situation where you had to resolve a conflict with a colleague. How did you handle it?";
      } else {
        fallbackQuestion = "Can you share an example of when you demonstrated leadership in a difficult situation?";
      }
      
      // If the message is just an acknowledgment, replace it with a question
      if (finalMessage.toLowerCase().includes("thank you") || finalMessage.toLowerCase().includes("i see") || finalMessage.toLowerCase().includes("good")) {
        finalMessage = finalMessage.replace(/\.$/, "").trim() + " " + fallbackQuestion;
      } else {
        finalMessage = finalMessage.trim() + " " + fallbackQuestion;
      }
    }

    return {
      message: finalMessage,
      isComplete: false,
      evaluation: null
    };
  } catch (error) {
    console.error("Error in behavioral interview:", error);
    throw error;
  }
}

export async function generateFinalFeedback(sessionData: any) {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: getModelName() });

  const prompt = `Generate comprehensive interview feedback based on all rounds.

Session Data:
${JSON.stringify(sessionData, null, 2)}

Provide:
1. Strengths summary
2. Weakness heatmap (areas needing improvement)
3. Resume vs Job Description gap analysis
4. Personalized 7-14 day improvement roadmap
5. Overall interview readiness assessment (percentage)

Return JSON:
{
  "strengths": ["strength1", "strength2"],
  "weaknesses": {
    "area1": "description",
    "area2": "description"
  },
  "gapAnalysis": "detailed analysis",
  "roadmap": [
    {"day": 1, "task": "..."},
    {"day": 2, "task": "..."}
  ],
  "readinessScore": 75,
  "overallAssessment": "detailed assessment"
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating final feedback:", error);
    throw error;
  }
}

