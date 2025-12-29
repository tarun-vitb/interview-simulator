"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getSessionData, saveSessionData } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function BehavioralInterviewPage() {
  const router = useRouter();
  const [sessionData, setSessionData] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime] = useState(Date.now());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const startInterview = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = getSessionData();
      if (!data) {
        router.push("/setup");
        return;
      }

      // Check if we already have resumeText stored
      let resumeText = data?.rounds?.behavioral?.resumeText;
      
      // If not, parse the resume
      if (!resumeText) {
        const response = await fetch("/api/parse-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base64File: data.resume,
            mimeType: "application/pdf",
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to parse resume: ${response.status}`);
        }

        const parseResult = await response.json();
        if (!parseResult.resumeText || parseResult.resumeText.trim() === "") {
          throw new Error("Failed to extract text from resume. Please ensure your resume is a valid PDF.");
        }
        resumeText = parseResult.resumeText;
      }

      const interviewResponse = await fetch("/api/behavioral-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          conversationHistory: [],
        }),
      });

      if (!interviewResponse.ok) {
        const errorData = await interviewResponse.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to start interview: ${interviewResponse.status}`);
      }

      const result = await interviewResponse.json();
      
      // Validate response has a message
      if (!result || !result.message || result.message.trim() === "") {
        console.error("Empty response from API:", result);
        // Use a fallback question
        const fallbackMessage = "Hello! Let's begin the behavioral interview. Tell me about a time when you faced a significant challenge at work. How did you handle it?";
        const newMessages: Message[] = [
          { role: "assistant", content: fallbackMessage },
        ];
        setMessages(newMessages);
        saveSessionData({
          rounds: {
            ...data?.rounds,
            behavioral: {
              messages: newMessages,
              resumeText,
            },
          },
        });
        return;
      }

      const newMessages: Message[] = [
        { role: "assistant", content: result.message.trim() },
      ];
      setMessages(newMessages);

      saveSessionData({
        rounds: {
          ...data?.rounds,
          behavioral: {
            messages: newMessages,
            resumeText,
          },
        },
      });
    } catch (error) {
      console.error("Error starting interview:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to start interview. Please try again.";
      
      // Show detailed error message
      alert(`Error: ${errorMessage}\n\nPlease check:\n1. Your GEMINI_API_KEY is set in .env.local\n2. The server is running\n3. Your resume file is valid\n\nIf the issue persists, try refreshing the page.`);
      
      // Optionally, try to use a fallback to at least start the interview
      try {
        const data = getSessionData();
        if (data) {
          const fallbackMessage = "Hello! Let's begin the behavioral interview. Tell me about a time when you faced a significant challenge at work. How did you handle it?";
          const newMessages: Message[] = [
            { role: "assistant", content: fallbackMessage },
          ];
          setMessages(newMessages);
          saveSessionData({
            rounds: {
              ...data?.rounds,
              behavioral: {
                messages: newMessages,
                resumeText: data?.rounds?.behavioral?.resumeText || "Resume text unavailable",
              },
            },
          });
        }
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
      }
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleComplete = useCallback(async (evaluation?: any) => {
    if (isComplete) return;
    setIsComplete(true);

    try {
      const data = getSessionData();

      if (!evaluation) {
        try {
          const evalResponse = await fetch("/api/evaluate-interview", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "behavioral",
              messages: messages,
              resumeText: data?.rounds?.behavioral?.resumeText,
            }),
          });

          if (!evalResponse.ok) {
            throw new Error(`Evaluation failed: ${evalResponse.status}`);
          }

          evaluation = await evalResponse.json();
          
          // Validate evaluation structure
          if (!evaluation || !evaluation.scores) {
            console.error("Invalid evaluation structure:", evaluation);
            // Create fallback evaluation
            evaluation = {
              scores: {
                communication: 0,
                behavioral: 0,
                confidence: 0,
                culturalFit: 0
              },
              feedback: {
                communication: "Evaluation could not be generated. Please try again.",
                behavioral: "Evaluation could not be generated. Please try again.",
                confidence: "Evaluation could not be generated. Please try again.",
                culturalFit: "Evaluation could not be generated. Please try again."
              },
              strengths: [],
              weaknesses: ["Unable to generate evaluation"]
            };
          }
        } catch (evalError) {
          console.error("Error generating evaluation:", evalError);
          // Create fallback evaluation
          evaluation = {
            scores: {
              communication: 0,
              behavioral: 0,
              confidence: 0,
              culturalFit: 0
            },
            feedback: {
              communication: "Evaluation could not be generated. Please try again.",
              behavioral: "Evaluation could not be generated. Please try again.",
              confidence: "Evaluation could not be generated. Please try again.",
              culturalFit: "Evaluation could not be generated. Please try again."
            },
            strengths: [],
            weaknesses: ["Unable to generate evaluation"]
          };
        }
      }

      saveSessionData({
        rounds: {
          ...data?.rounds,
          behavioral: {
            ...data?.rounds?.behavioral,
            evaluation,
            completed: true,
          },
        },
      });

      router.push("/feedback/behavioral");
    } catch (error) {
      console.error("Error completing interview:", error);
    }
  }, [isComplete, messages, router]);

  useEffect(() => {
    const data = getSessionData();
    if (!data) {
      router.push("/setup");
      return;
    }
    setSessionData(data);

    if (data?.rounds?.behavioral?.messages) {
      setMessages(data?.rounds?.behavioral?.messages);
      setIsComplete(data?.rounds?.behavioral?.completed || false);
    } else {
      startInterview();
    }
  }, [router, startInterview]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const elapsed = (Date.now() - startTime) / 1000;
    if (elapsed >= 180 && !isComplete) {
      handleComplete();
    }
  }, [startTime, isComplete, handleComplete]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || isComplete) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const data = getSessionData();
      const conversationHistory = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("/api/behavioral-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: data?.rounds?.behavioral?.resumeText || "",
          conversationHistory,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const result = await response.json();
      
      // Validate that we have a message
      if (!result || !result.message || result.message.trim() === "") {
        console.error("Empty or invalid response from API:", result);
        throw new Error("Received empty response from AI. Please try again.");
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: result.message.trim(),
      };

      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);

      // Count assistant messages (questions asked)
      const questionCount = updatedMessages.filter(m => m.role === "assistant").length;

      // After 7 questions, automatically complete the interview
      if (questionCount >= 7 || result.isComplete || result.evaluation) {
        handleComplete(result.evaluation);
      } else {
        saveSessionData({
          rounds: {
            ...data?.rounds,
            behavioral: {
              ...data?.rounds?.behavioral,
              messages: updatedMessages,
            },
          },
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to send message. Please try again.";
      alert(errorMessage);
      
      // Add error message to chat so user knows what happened
      const errorChatMessage: Message = {
        role: "assistant",
        content: "I apologize, but I encountered an error. Please try sending your message again, or refresh the page if the issue persists.",
      };
      // Use the current messages state which already includes the user message
      setMessages([...messages, userMessage, errorChatMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">HR/Behavioral Interview</h1>
          <p className="text-sm text-gray-700 font-medium">Maximum duration: 3 minutes</p>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg h-[calc(100vh-200px)] flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && isLoading && (
              <div className="text-center text-gray-700 font-medium">Starting interview...</div>
            )}
            {messages.length > 0 && (
              <div className="text-center text-sm text-gray-600 mb-2">
                Question {messages.filter(m => m.role === "assistant").length} of 7
              </div>
            )}
            {messages
              .filter((msg) => msg.content && msg.content.trim() !== "")
              .map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 shadow-sm ${msg.role === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-50 text-gray-900 border border-gray-200"
                      }`}
                  >
                    <p className="whitespace-pre-wrap text-base leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
            {isLoading && messages.length > 0 && (
              <div className="flex justify-start">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700 font-medium">Thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {isComplete ? (
            <div className="border-t p-4 text-center">
              <p className="text-gray-800 font-semibold mb-4 text-lg">Interview completed!</p>
              <button
                onClick={() => router.push("/feedback/behavioral")}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
              >
                View Feedback
              </button>
            </div>
          ) : (
            <div className="border-t p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your answer..."
                  className="flex-1 px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 text-base placeholder-gray-500"
                  style={{ color: '#111827' }}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



