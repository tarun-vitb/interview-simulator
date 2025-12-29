"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetupPage() {
  const router = useRouter();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<"fresher" | "1 year" | "2 years" | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf" || file.type.includes("wordprocessingml")) {
        setResumeFile(file);
        setError("");
      } else {
        setError("Please upload a PDF or DOC file");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resumeFile || !jobDescription.trim() || !experienceLevel) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Convert file to base64 for storage
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64File = reader.result as string;
        
        // Store in localStorage
        const sessionData = {
          resume: base64File,
          resumeFileName: resumeFile.name,
          jobDescription: jobDescription.trim(),
          experienceLevel,
          timestamp: Date.now(),
        };
        
        localStorage.setItem("interviewSession", JSON.stringify(sessionData));
        
        // Navigate to interview selection
        router.push("/interview/select");
      };
      reader.readAsDataURL(resumeFile);
    } catch (err) {
      setError("Failed to process resume. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Setup Your Interview
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Resume (PDF or DOC)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                required
              />
              {resumeFile && (
                <p className="mt-2 text-sm text-gray-700 font-medium">
                  Selected: {resumeFile.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description or Role
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description or describe the role you're applying for..."
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 text-base placeholder-gray-500 resize-none"
                style={{ color: '#111827' }}
                rows={6}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as any)}
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 text-base"
                style={{ color: '#111827' }}
                required
              >
                <option value="">Select experience level</option>
                <option value="fresher">Fresher</option>
                <option value="1 year">1 year</option>
                <option value="2 years">2 years</option>
              </select>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Continue to Interview"}
            </button>
          </form>

          <p className="mt-6 text-xs text-gray-600 text-center font-medium">
            Your resume is used only for this session and deleted after feedback is generated.
          </p>
        </div>
      </div>
    </div>
  );
}


