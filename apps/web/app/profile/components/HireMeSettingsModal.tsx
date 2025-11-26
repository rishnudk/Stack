"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Briefcase, DollarSign, FileText } from "lucide-react";
import { trpc } from "@/utils/trpc";

interface HireMeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HireMeSettingsModal({
  isOpen,
  onClose,
}: HireMeSettingsModalProps) {
  const [mounted, setMounted] = useState(false);

  // Fetch current hire me status
  const { data: currentStatus } = trpc.hireMe.getStatus.useQuery();
  
  // Update mutation
  const updateMutation = trpc.hireMe.updateSettings.useMutation({
    onSuccess: () => {
      // Invalidate query to refetch data
      trpcUtils.hireMe.getStatus.invalidate();
      onClose();
    },
  });

  const trpcUtils = trpc.useUtils();

  // Form state
  const [availableForHire, setAvailableForHire] = useState(false);
  const [hourlyRate, setHourlyRate] = useState("");
  const [preferredWorkType, setPreferredWorkType] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");

  // Check if component is mounted (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Populate form when data loads
  useEffect(() => {
    if (currentStatus) {
      setAvailableForHire(currentStatus.availableForHire);
      setHourlyRate(currentStatus.hourlyRate || "");
      setPreferredWorkType(currentStatus.preferredWorkType || "");
      setResumeUrl(currentStatus.resumeUrl || "");
    }
  }, [currentStatus]);

  const handleSave = () => {
    updateMutation.mutate({
      availableForHire,
      hourlyRate: hourlyRate || undefined,
      preferredWorkType: preferredWorkType || undefined,
      resumeUrl: resumeUrl || undefined,
    });
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600/20 rounded-lg">
              <Briefcase className="text-green-500" size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Hire Me Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-neutral-400" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Available for Hire Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Available for Hire</label>
              <p className="text-sm text-neutral-400 mt-1">
                Show your availability status to others
              </p>
            </div>
            <button
              onClick={() => setAvailableForHire(!availableForHire)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                availableForHire ? "bg-green-600" : "bg-neutral-700"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  availableForHire ? "translate-x-7" : ""
                }`}
              />
            </button>
          </div>

          {/* Hourly Rate */}
          <div>
            <label className="flex items-center gap-2 text-white font-medium mb-2">
              <DollarSign size={18} className="text-green-500" />
              Hourly Rate
            </label>
            <input
              type="text"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              placeholder="e.g., $50-100/hr or Negotiable"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-green-600 transition-colors"
            />
            <p className="text-xs text-neutral-500 mt-1">
              Leave blank if you prefer not to disclose
            </p>
          </div>

          {/* Preferred Work Type */}
          <div>
            <label className="flex items-center gap-2 text-white font-medium mb-2">
              <Briefcase size={18} className="text-green-500" />
              Preferred Work Type
            </label>
            <select
              value={preferredWorkType}
              onChange={(e) => setPreferredWorkType(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-600 transition-colors"
            >
              <option value="">Select work type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
              <option value="Full-time, Contract">Full-time, Contract</option>
              <option value="Part-time, Freelance">Part-time, Freelance</option>
            </select>
          </div>

          {/* Resume URL */}
          <div>
            <label className="flex items-center gap-2 text-white font-medium mb-2">
              <FileText size={18} className="text-green-500" />
              Resume URL
            </label>
            <input
              type="url"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="https://example.com/resume.pdf"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-green-600 transition-colors"
            />
            <p className="text-xs text-neutral-500 mt-1">
              Link to your resume (Google Drive, Dropbox, etc.)
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-neutral-800">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );

  // Use portal to render at document root
  return createPortal(modalContent, document.body);
}