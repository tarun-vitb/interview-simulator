"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getSessionData } from "@/lib/utils";
import Link from "next/link";
import { 
  FileText, 
  Code, 
  Users, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  Sparkles,
  Trophy
} from "lucide-react";

export default function SelectRoundPage() {
  const router = useRouter();
  const [sessionData, setSessionData] = useState<any>(null);
  const [completedRounds, setCompletedRounds] = useState<Set<string>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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

  const rounds = [
    {
      id: "written",
      name: "Round 1: Written Test",
      shortName: "Written Test",
      description: "Timed aptitude, DSA, and CS fundamentals test",
      duration: "30 minutes",
      path: "/interview/written",
      icon: FileText,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      id: "technical",
      name: "Round 2: Technical Interview",
      shortName: "Technical Interview",
      description: "AI-led technical mock interview with adaptive questions",
      duration: "~3 minutes",
      path: "/interview/technical",
      icon: Code,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200",
    },
    {
      id: "behavioral",
      name: "Round 3: HR/Behavioral Interview",
      shortName: "HR/Behavioral Interview",
      description: "STAR-based behavioral interview with personalized feedback",
      duration: "~3 minutes",
      path: "/interview/behavioral",
      icon: Users,
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-200",
    },
  ];

  const allCompleted = completedRounds.size === 3;

  if (!sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Interview Simulation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Select Interview Round
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete all three rounds to unlock your comprehensive feedback dashboard
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-700">
                Progress
              </span>
              <span className="text-sm font-semibold text-indigo-600">
                {completedRounds.size} / 3 Completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(completedRounds.size / 3) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Round Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {rounds.map((round, index) => {
            const isCompleted = completedRounds.has(round.id);
            const isHovered = hoveredCard === round.id;

            return (
              <motion.div
                key={round.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                onHoverStart={() => setHoveredCard(round.id)}
                onHoverEnd={() => setHoveredCard(null)}
                className="relative"
              >
                <Link href={round.path}>
                  <div className={`h-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${round.borderColor} ${isHovered ? 'border-opacity-100' : 'border-opacity-50'} relative overflow-hidden group`}>
                    {/* Background Gradient on Hover */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${round.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    />

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon and Status */}
                      <div className="flex items-start justify-between mb-6">
                        <div className={`p-4 rounded-2xl ${round.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                          <round.icon className={`w-8 h-8 ${round.iconColor}`} />
                        </div>
                        {isCompleted && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-2 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Done</span>
                          </motion.div>
                        )}
                      </div>

                      {/* Round Info */}
                      <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                        {round.shortName}
                      </h2>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {round.description}
                      </p>

                      {/* Duration */}
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                        <Clock className="w-4 h-4" />
                        <span>{round.duration}</span>
                      </div>

                      {/* CTA */}
                      <motion.div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm bg-gradient-to-r ${round.gradient} text-white group-hover:shadow-lg transition-all duration-300`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isCompleted ? (
                          <>
                            <span>Review Results</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            <span>Start Round</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </motion.div>
                    </div>

                    {/* Shine Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                      initial={{ x: "-100%" }}
                      animate={isHovered ? { x: "200%" } : { x: "-100%" }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Completion Banner */}
        <AnimatePresence>
          {allCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl p-8 md:p-12 shadow-2xl text-center relative overflow-hidden"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]"></div>
              </div>

              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6"
                >
                  <Trophy className="w-10 h-10 text-white" />
                </motion.div>

                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  All Rounds Completed! 🎉
                </h2>
                <p className="text-xl text-emerald-50 mb-8 max-w-2xl mx-auto">
                  Congratulations! You&apos;ve completed all interview rounds. View your comprehensive feedback dashboard to see detailed insights and your personalized improvement roadmap.
                </p>

                <motion.button
                  onClick={() => router.push("/feedback/final")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-emerald-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2"
                >
                  <span>View Final Feedback Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
