"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSessionData, clearSessionData } from "@/lib/utils";
import Link from "next/link";

export default function FinalFeedbackPage() {
  const router = useRouter();
  const [sessionData, setSessionData] = useState<any>(null);
  const [finalFeedback, setFinalFeedback] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = getSessionData();
    if (!data) {
      router.push("/setup");
      return;
    }

    // Check if all rounds are completed
    const rounds = data.rounds || {};
    if (!rounds.written?.completed || !rounds.technical?.completed || !rounds.behavioral?.completed) {
      router.push("/interview/select");
      return;
    }

    setSessionData(data);
    loadFinalFeedback(data);
  }, [router]);

  const loadFinalFeedback = async (data: any) => {
    setIsLoading(true);
    try {
      // Check if final feedback already exists
      if (data.finalFeedback) {
        setFinalFeedback(data.finalFeedback);
        setIsLoading(false);
        return;
      }

      // Generate final feedback
      const response = await fetch("/api/final-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to generate feedback");

      const feedback = await response.json();
      setFinalFeedback(feedback);

      // Save to session
      const updated = { ...data, finalFeedback: feedback };
      localStorage.setItem("interviewSession", JSON.stringify(updated));
    } catch (error) {
      console.error("Error loading final feedback:", error);
      alert("Failed to load final feedback. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-900 font-semibold">Generating comprehensive feedback...</p>
        </div>
      </div>
    );
  }

  if (!finalFeedback) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load feedback</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Final Interview Feedback Dashboard
        </h1>

        {/* Overall Readiness Score */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Overall Interview Readiness</h2>
          <div className="text-6xl font-bold text-indigo-600 mb-4">
            {finalFeedback.readinessScore || 0}%
          </div>
          <p className="text-gray-900 text-lg font-medium leading-relaxed">{finalFeedback.overallAssessment || "Assessment pending"}</p>
        </div>

        {/* Strengths */}
        {finalFeedback.strengths && finalFeedback.strengths.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold text-green-900 mb-4">Strengths Summary</h2>
            <ul className="list-disc list-inside space-y-2 text-green-900 font-medium">
              {finalFeedback.strengths.map((strength: string, idx: number) => (
                <li key={idx} className="text-lg">{strength}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Weaknesses Heatmap */}
        {finalFeedback.weaknesses && Object.keys(finalFeedback.weaknesses).length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Weakness Heatmap</h2>
            <div className="space-y-4">
              {Object.entries(finalFeedback.weaknesses).map(([area, description]: [string, any]) => (
                <div key={area} className="border-l-4 border-yellow-400 pl-4 py-2">
                  <h3 className="font-semibold text-gray-900 mb-1">{area}</h3>
                  <p className="text-gray-900 text-base leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gap Analysis */}
        {finalFeedback.gapAnalysis && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Resume vs Job Description Gap Analysis</h2>
            <p className="text-gray-900 text-base leading-relaxed whitespace-pre-wrap">{finalFeedback.gapAnalysis}</p>
          </div>
        )}

        {/* Improvement Roadmap */}
        {finalFeedback.roadmap && finalFeedback.roadmap.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Personalized Improvement Roadmap (7-14 days)</h2>
            <div className="space-y-4">
              {finalFeedback.roadmap.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                    {item.day || idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 text-base font-medium">{item.task || item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => {
              clearSessionData();
              router.push("/");
            }}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Start New Interview
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-sm text-blue-900 font-medium">
            Your session data has been cleared. Thank you for using Jobbr AI!
          </p>
        </div>
      </div>
    </div>
  );
}

