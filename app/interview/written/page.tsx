"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getSessionData, saveSessionData } from "@/lib/utils";
import { ErrorBoundary } from "@/app/components/ErrorBoundary";

interface Question {
  question: string;
  options: string[];
  correct: string;
  explanation: string;
}

interface TestData {
  aptitude: Question[];
  dsa: Question[];
  fundamentals: Question[];
}

export default function WrittenTestPage() {
  const router = useRouter();
  const [sessionData, setSessionData] = useState<any>(null);
  const [testData, setTestData] = useState<TestData | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [currentSection, setCurrentSection] = useState<"aptitude" | "dsa" | "fundamentals">("aptitude");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ebbbdb8b-9caa-4469-81bd-aad2adc311c1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'written/page.tsx:30',message:'handleSubmit called',data:{testDataExists:!!testData,isSubmitting,answersCount:Object.keys(answers).length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    if (isSubmitting || !testData) return;
    setIsSubmitting(true);

    try {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ebbbdb8b-9caa-4469-81bd-aad2adc311c1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'written/page.tsx:36',message:'Before evaluate-test API call',data:{testDataStructure:testData?{aptitude:testData.aptitude?.length,dsa:testData.dsa?.length,fundamentals:testData.fundamentals?.length}:null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      // Evaluate test
      const response = await fetch("/api/evaluate-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questions: testData,
          answers,
        }),
      });

      if (!response.ok) throw new Error("Failed to evaluate test");

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ebbbdb8b-9caa-4469-81bd-aad2adc311c1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'written/page.tsx:50',message:'Before parsing evaluation response',data:{responseOk:response.ok,contentType:response.headers.get('content-type')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      const evaluation = await response.json();
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ebbbdb8b-9caa-4469-81bd-aad2adc311c1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'written/page.tsx:55',message:'Evaluation parsed successfully',data:{evaluationKeys:Object.keys(evaluation||{})},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion

      // Save results
      const data = getSessionData();
      saveSessionData({
        rounds: {
          ...data?.rounds,
          written: {
            ...data?.rounds?.written,
            evaluation,
            completed: true,
          },
        },
      });

      router.push("/feedback/written");
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ebbbdb8b-9caa-4469-81bd-aad2adc311c1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'written/page.tsx:74',message:'Error in handleSubmit',data:{errorMessage:error instanceof Error ? error.message : String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      console.error("Error submitting test:", error);
      alert("Failed to submit test. Please try again.");
      setIsSubmitting(false);
    }
  }, [testData, answers, isSubmitting, router]);

  useEffect(() => {
    const data = getSessionData();
    if (!data) {
      router.push("/setup");
      return;
    }
    setSessionData(data);

    // Load or generate test
    loadTest();
  }, [router]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/ebbbdb8b-9caa-4469-81bd-aad2adc311c1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'written/page.tsx:95',message:'Timer expired, calling handleSubmit',data:{timeLeft:prev,testDataExists:!!testData,isSubmitting},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
            // #endregion
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, handleSubmit]);

  const loadTest = async () => {
    setIsLoading(true);
    try {
      // Check if test already exists in session
      const data = getSessionData();
      if (data?.rounds?.written?.questions) {
        setTestData(data.rounds.written.questions);
        setAnswers(data.rounds.written.answers || {});
        setTimeLeft(data.rounds.written.timeLeft || 30 * 60);
        setIsLoading(false);
        return;
      }

      // Generate new test
      const response = await fetch("/api/generate-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experienceLevel: data?.experienceLevel,
        }),
      });

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ebbbdb8b-9caa-4469-81bd-aad2adc311c1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'written/page.tsx:79',message:'Before parsing generate-test response',data:{responseOk:response.ok,status:response.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      if (!response.ok) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/ebbbdb8b-9caa-4469-81bd-aad2adc311c1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'written/page.tsx:80',message:'Response not OK, attempting to parse error',data:{status:response.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/ebbbdb8b-9caa-4469-81bd-aad2adc311c1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'written/page.tsx:82',message:'Failed to parse error response as JSON',data:{status:response.status,parseError:parseError instanceof Error ? parseError.message : String(parseError)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
          // #endregion
          throw new Error(`Failed to generate test (Status: ${response.status})`);
        }
        throw new Error(errorData.error || "Failed to generate test");
      }

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ebbbdb8b-9caa-4469-81bd-aad2adc311c1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'written/page.tsx:87',message:'Before parsing test JSON',data:{contentType:response.headers.get('content-type')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      let test;
      try {
        test = await response.json();
      } catch (parseError) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/ebbbdb8b-9caa-4469-81bd-aad2adc311c1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'written/page.tsx:90',message:'Failed to parse test response as JSON',data:{parseError:parseError instanceof Error ? parseError.message : String(parseError)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        throw new Error("Invalid response format from server");
      }
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ebbbdb8b-9caa-4469-81bd-aad2adc311c1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'written/page.tsx:85',message:'Test JSON parsed, validating structure',data:{hasAptitude:!!test.aptitude,hasDsa:!!test.dsa,hasFundamentals:!!test.fundamentals,aptitudeLength:test.aptitude?.length,dsaLength:test.dsa?.length,fundamentalsLength:test.fundamentals?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      
      // Validate test structure
      if (!test.aptitude || !test.dsa || !test.fundamentals) {
        throw new Error("Invalid test format received");
      }
      
      setTestData(test);

      // Save to session
      saveSessionData({
        rounds: {
          ...data?.rounds,
          written: {
            questions: test,
            answers: {},
            timeLeft: 30 * 60,
          },
        },
      });
    } catch (error: any) {
      console.error("Error loading test:", error);
      const errorMessage = error.message || "Failed to load test. Please try again.";
      alert(errorMessage + "\n\nMake sure you have set GEMINI_API_KEY in your .env.local file.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (questionId: string, answer: string) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);

    // Auto-save
    const data = getSessionData();
    saveSessionData({
      rounds: {
        ...data?.rounds,
        written: {
          ...data?.rounds?.written,
          answers: newAnswers,
          timeLeft,
        },
      },
    });
  };


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  if (!testData && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Failed to Load Test</h2>
            <p className="text-gray-700 mb-6">
              The test could not be generated. This is usually because:
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-left mb-6">
              <h3 className="font-semibold text-yellow-900 mb-3">⚠️ Most Common Issue: Server Not Restarted</h3>
              <p className="text-yellow-800 mb-3">
                If you just added/updated your API key in <code className="bg-yellow-100 px-1 rounded">.env.local</code>, 
                you <strong>MUST restart</strong> the dev server for changes to take effect!
              </p>
              <div className="bg-white rounded p-3 mb-3">
                <p className="font-semibold text-gray-900 mb-2">To restart:</p>
                <ol className="list-decimal list-inside space-y-1 text-gray-700 text-sm">
                  <li>Go to your terminal (where <code>npm run dev</code> is running)</li>
                  <li>Press <strong>Ctrl+C</strong> to stop the server</li>
                  <li>Run <code className="bg-gray-100 px-1 rounded">npm run dev</code> again</li>
                  <li>Wait for "Ready" message, then refresh this page</li>
                </ol>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">If API key is not set:</h3>
              <ol className="list-decimal list-inside space-y-2 text-blue-800">
                <li>Get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google AI Studio</a></li>
                <li>Open <code className="bg-blue-100 px-1 rounded">.env.local</code> in the root directory</li>
                <li>Replace <code className="bg-blue-100 px-1 rounded">your_api_key_here</code> with your actual API key</li>
                <li><strong>Restart the dev server</strong> (Ctrl+C, then <code className="bg-blue-100 px-1 rounded">npm run dev</code>)</li>
              </ol>
            </div>
            <button
              onClick={() => router.push("/interview/select")}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Type guard: testData must be non-null at this point
  if (!testData) {
    return null;
  }

  // Validate testData structure
  if (!testData.aptitude || !Array.isArray(testData.aptitude) ||
      !testData.dsa || !Array.isArray(testData.dsa) ||
      !testData.fundamentals || !Array.isArray(testData.fundamentals)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Test Data</h2>
            <p className="text-gray-700 mb-6">
              The test data structure is invalid. Please try loading the test again.
            </p>
            <button
              onClick={() => {
                const data = getSessionData();
                if (data?.rounds?.written) {
                  delete data.rounds.written.questions;
                  saveSessionData(data);
                }
                window.location.reload();
              }}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Reload Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestions = testData[currentSection];
  
  // Validate currentQuestions exists and is an array
  if (!currentQuestions || !Array.isArray(currentQuestions) || currentQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">No Questions Available</h2>
            <p className="text-gray-700 mb-6">
              No questions found for the {currentSection} section. Please try reloading the test.
            </p>
            <button
              onClick={() => {
                const data = getSessionData();
                if (data?.rounds?.written) {
                  delete data.rounds.written.questions;
                  saveSessionData(data);
                }
                window.location.reload();
              }}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Reload Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  const allQuestions = [...testData.aptitude, ...testData.dsa, ...testData.fundamentals];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Written Test</h1>
            <div className="text-2xl font-mono font-bold text-red-600">
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setCurrentSection("aptitude")}
              className={`px-4 py-2 rounded-lg ${
                currentSection === "aptitude"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Aptitude (5)
            </button>
            <button
              onClick={() => setCurrentSection("dsa")}
              className={`px-4 py-2 rounded-lg ${
                currentSection === "dsa"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              DSA (5)
            </button>
            <button
              onClick={() => setCurrentSection("fundamentals")}
              className={`px-4 py-2 rounded-lg ${
                currentSection === "fundamentals"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Fundamentals (5)
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          {currentQuestions.map((q, idx) => {
            try {
              const questionId = `${currentSection}-${idx}`;
              // #region agent log
              if (idx === 0) fetch('http://127.0.0.1:7242/ingest/ebbbdb8b-9caa-4469-81bd-aad2adc311c1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'written/page.tsx:395',message:'Rendering questions',data:{section:currentSection,questionsCount:currentQuestions.length,firstQuestionHasOptions:!!q?.options,hasQuestion:!!q?.question,questionType:typeof q},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
              // #endregion
              
              // Validate question structure
              if (!q || typeof q !== 'object') {
                console.error(`Invalid question at index ${idx}:`, q);
                return (
                  <div key={questionId} className="border-b pb-6 last:border-b-0">
                    <p className="text-red-600">Invalid question format at index {idx + 1}</p>
                  </div>
                );
              }
              
              if (!q.question || typeof q.question !== 'string') {
                console.error(`Question missing text at index ${idx}:`, q);
                return (
                  <div key={questionId} className="border-b pb-6 last:border-b-0">
                    <p className="text-red-600">Question text missing at index {idx + 1}</p>
                  </div>
                );
              }
              
              if (!q.options || !Array.isArray(q.options) || q.options.length === 0) {
                console.error(`Question missing options at index ${idx}:`, q);
                return (
                  <div key={questionId} className="border-b pb-6 last:border-b-0">
                    <p className="text-red-600">Question options missing at index {idx + 1}</p>
                  </div>
                );
              }
              
              return (
                <div key={questionId} className="border-b pb-6 last:border-b-0">
                  <p className="font-semibold text-gray-900 mb-4 text-lg leading-relaxed">
                    {idx + 1}. {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((option, optIdx) => {
                      if (typeof option !== 'string') {
                        console.error(`Invalid option at question ${idx}, option ${optIdx}:`, option);
                        return null;
                      }
                      return (
                        <label
                          key={optIdx}
                          className="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-indigo-400 transition-colors"
                        >
                          <input
                            type="radio"
                            name={questionId}
                            value={option}
                            checked={answers[questionId] === option}
                            onChange={(e) => handleAnswer(questionId, e.target.value)}
                            className="mr-3 w-4 h-4 text-indigo-600"
                          />
                          <span className="text-gray-900 font-medium">{option}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            } catch (error) {
              console.error(`Error rendering question at index ${idx}:`, error);
              // #region agent log
              fetch('http://127.0.0.1:7242/ingest/ebbbdb8b-9caa-4469-81bd-aad2adc311c1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'written/page.tsx:435',message:'Error rendering question',data:{idx,errorMessage:error instanceof Error ? error.message : String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
              // #endregion
              return (
                <div key={`${currentSection}-${idx}`} className="border-b pb-6 last:border-b-0">
                  <p className="text-red-600">Error rendering question {idx + 1}</p>
                </div>
              );
            }
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Test"}
          </button>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}

