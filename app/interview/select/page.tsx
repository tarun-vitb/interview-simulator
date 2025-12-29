"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSessionData } from "@/lib/utils";
import Link from "next/link";

export default function SelectRoundPage() {
  const router = useRouter();
  const [sessionData, setSessionData] = useState<any>(null);
  const [completedRounds, setCompletedRounds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const data = getSessionData();
    if (!data) {
      router.push("/setup");
      return;
    }
    setSessionData(data);
    
    // Check which rounds are completed
    if (data.rounds) {
      const completed = new Set<string>();
      if (data.rounds.written?.completed) completed.add("written");
      if (data.rounds.technical?.completed) completed.add("technical");
      if (data.rounds.behavioral?.completed) completed.add("behavioral");
      setCompletedRounds(completed);
    }
  }, [router]);

  if (!sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const rounds = [
    {
      id: "written",
      name: "Round 1: Written Test",
      description: "Timed aptitude, DSA, and CS fundamentals test",
      duration: "30 minutes",
      path: "/interview/written",
    },
    {
      id: "technical",
      name: "Round 2: Technical Interview",
      description: "AI-led technical mock interview with adaptive questions",
      duration: "~3 minutes",
      path: "/interview/technical",
    },
    {
      id: "behavioral",
      name: "Round 3: HR/Behavioral Interview",
      description: "STAR-based behavioral interview",
      duration: "~3 minutes",
      path: "/interview/behavioral",
    },
  ];

  const allCompleted = completedRounds.size === 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Select Interview Round
        </h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {rounds.map((round) => {
            const isCompleted = completedRounds.has(round.id);
            return (
              <Link
                key={round.id}
                href={round.path}
                className="block bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {round.name}
                  </h2>
                  {isCompleted && (
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                      ✓ Completed
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-2">{round.description}</p>
                <p className="text-sm text-gray-500">Duration: {round.duration}</p>
              </Link>
            );
          })}
        </div>

        {allCompleted && (
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              All Rounds Completed! 🎉
            </h2>
            <button
              onClick={() => router.push("/feedback/final")}
              className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              View Final Feedback Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


