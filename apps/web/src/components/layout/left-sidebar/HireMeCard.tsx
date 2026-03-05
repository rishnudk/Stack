"use client";
import { Mail, FileText, Briefcase } from "lucide-react";
import { trpc } from "@/utils/trpc";

export default function HireMeCard() {
  // Fetch hire me status from backend
  const { data: hireStatus, isLoading } = trpc.hireMe.getStatus.useQuery();

  // Don't show card if not available for hire or still loading
  if (isLoading || !hireStatus?.availableForHire) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-700/50 rounded-2xl p-4">
      {/* Header with green badge */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <h3 className="text-green-400 font-semibold text-sm">
          Available for Hire
        </h3>
      </div>

      {/* Hourly Rate */}
      {hireStatus.hourlyRate && (
        <div className="flex items-center gap-2 mb-2 text-sm">
          <Briefcase size={16} className="text-green-500" />
          <span className="text-neutral-300">
            Rate: <span className="text-white font-medium">{hireStatus.hourlyRate}</span>
          </span>
        </div>
      )}

      {/* Preferred Work Type */}
      {hireStatus.preferredWorkType && (
        <div className="flex items-start gap-2 mb-3 text-sm">
          <FileText size={16} className="text-green-500 mt-0.5" />
          <span className="text-neutral-300">
            Type: <span className="text-white font-medium">{hireStatus.preferredWorkType}</span>
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        <button className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 text-sm font-medium transition-colors">
          <Mail size={16} />
          Contact Me
        </button>
        
        {hireStatus.resumeUrl && (
          <a
            href={hireStatus.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          >
            <FileText size={16} />
          </a>
        )}
      </div>
    </div>
  );
}