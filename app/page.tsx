"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Jobbr AI
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            AI-powered interview simulation with real-time feedback
          </p>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Practice technical interviews with interview-grade feedback. 
            Understand exactly where you need to improve and get a personalized roadmap to success.
          </p>
          
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <p className="text-sm text-gray-500 mb-6">
              Your resume is used only for this session and deleted after feedback is generated.
            </p>
            <Link
              href="/setup"
              className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Start Interview Simulation
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-2">Written Test</h3>
              <p className="text-gray-600">
                Timed aptitude, DSA, and CS fundamentals test
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-2">Technical Interview</h3>
              <p className="text-gray-600">
                AI-led technical mock interview with adaptive questions
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-2">HR Interview</h3>
              <p className="text-gray-600">
                Behavioral interview with STAR-based evaluation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

