"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSessionData } from "@/lib/utils";
import Link from "next/link";

export default function WrittenFeedbackPage() {
  const router = useRouter();
  const [evaluation, setEvaluation] = useState<any>(null);

  useEffect(() => {
    const data = getSessionData();
    if (!data) {
      router.push("/setup");
      return;
    }

    if (data.rounds?.written?.evaluation) {
      setEvaluation(data.rounds.written.evaluation);
    } else {
      router.push("/interview/written");
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Written Test Feedback</h1>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold mb-6">Section-wise Scores</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {scores.aptitude || 0}%
              </div>
              <div className="text-gray-900 font-semibold">Aptitude</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {scores.dsa || 0}%
              </div>
              <div className="text-gray-900 font-semibold">DSA</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {scores.fundamentals || 0}%
              </div>
              <div className="text-gray-900 font-semibold">Fundamentals</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Detailed Feedback</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Aptitude</h3>
              <p className="text-gray-900 text-base leading-relaxed">{feedback.aptitude || "No feedback available"}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">DSA</h3>
              <p className="text-gray-900 text-base leading-relaxed">{feedback.dsa || "No feedback available"}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Fundamentals</h3>
              <p className="text-gray-900 text-base leading-relaxed">{feedback.fundamentals || "No feedback available"}</p>
            </div>
          </div>
        </div>

        {evaluation.weakAreas && evaluation.weakAreas.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Areas Needing Improvement</h3>
            <ul className="list-disc list-inside space-y-2 text-yellow-900 font-medium">
              {evaluation.weakAreas.map((area: string, idx: number) => (
                <li key={idx} className="text-base">{area}</li>
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



