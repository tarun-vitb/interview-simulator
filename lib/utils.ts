import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface SessionData {
  resume: string;
  resumeFileName: string;
  jobDescription: string;
  experienceLevel: "fresher" | "1 year" | "2 years";
  timestamp: number;
  rounds?: {
    written?: any;
    technical?: any;
    behavioral?: any;
  };
}

export function getSessionData(): SessionData | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("interviewSession");
  return data ? JSON.parse(data) : null;
}

export function saveSessionData(data: Partial<SessionData>) {
  if (typeof window === "undefined") return;
  const existing = getSessionData();
  const updated = { ...existing, ...data };
  localStorage.setItem("interviewSession", JSON.stringify(updated));
}

export function clearSessionData() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("interviewSession");
}


