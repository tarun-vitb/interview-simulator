"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  bgGradient: string;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  duration?: string;
  delay?: number;
  children?: ReactNode;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient,
  bgGradient,
  iconBg,
  iconColor,
  borderColor,
  duration,
  delay = 0,
  children,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -8 }}
      className="group relative h-full"
    >
      <div className={`h-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100`}>
        <div className={`inline-flex p-4 rounded-2xl ${iconBg} mb-6 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-8 h-8 ${iconColor}`} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed mb-6">
          {description}
        </p>
        {duration && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{duration}</span>
            </div>
          </div>
        )}
        {children}
      </div>
    </motion.div>
  );
}

