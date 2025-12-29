"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSessionData } from "@/lib/utils";
import Link from "next/link";

export default function TechnicalFeedbackPage() {
  const router = useRouter();
  const [evaluation, setEvaluation] = useState<any>(null);

  useEffect(() => {
    const data = getSessionData();
    if (!data) {
      router.push("/setup");
      return;
    }

    if (data.rounds?.technical?.evaluation) {
      setEvaluation(data.rounds.technical.evaluation);
    } else {
      router.push("/interview/technical");
    }
  }, [router]);

  if (!evaluation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading feedback...</p>
        </div>
      </div>
    );
  }

  const scores = evaluation.scores || {};
  const feedback = evaluation.feedback || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Technical Interview Feedback</h1>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Evaluation Scores</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {scores.dsa || 0}%
              </div>
              <div className="text-gray-900 font-semibold">DSA Understanding</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {scores.fundamentals || 0}%
              </div>
              <div className="text-gray-900 font-semibold">Fundamentals Clarity</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {scores.problemSolving || 0}%
              </div>
              <div className="text-gray-900 font-semibold">Problem Solving</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                {scores.communication || 0}%
              </div>
              <div className="text-gray-900 font-semibold">Technical Communication</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Detailed Feedback</h2>
          <div className="space-y-6">
            {feedback.dsa && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">DSA Understanding</h3>
                <p className="text-gray-900 text-base leading-relaxed">{feedback.dsa}</p>
              </div>
            )}
            {feedback.fundamentals && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Fundamentals</h3>
                <p className="text-gray-900 text-base leading-relaxed">{feedback.fundamentals}</p>
              </div>
            )}
            {feedback.problemSolving && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Problem Solving</h3>
                <p className="text-gray-900 text-base leading-relaxed">{feedback.problemSolving}</p>
              </div>
            )}
            {feedback.communication && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Communication</h3>
                <p className="text-gray-900 text-base leading-relaxed">{feedback.communication}</p>
              </div>
            )}
          </div>
        </div>

        {evaluation.strengths && evaluation.strengths.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-green-900 mb-2">Strengths</h3>
            <ul className="list-disc list-inside space-y-2 text-green-900 font-medium">
              {evaluation.strengths.map((strength: string, idx: number) => (
                <li key={idx} className="text-base">{strength}</li>
              ))}
            </ul>
          </div>
        )}

        {evaluation.weaknesses && evaluation.weaknesses.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Areas for Improvement</h3>
            <ul className="list-disc list-inside space-y-2 text-yellow-900 font-medium">
              {evaluation.weaknesses.map((weakness: string, idx: number) => (
                <li key={idx} className="text-base">{weakness}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-between">
          <Link
            href="/interview/select"
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Back to Rounds
          </Link>
          <Link
            href="/feedback/final"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            View Final Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}



