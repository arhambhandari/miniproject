"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Star, CheckCircle2, Sparkles, Building2, Calendar, Stethoscope, ThumbsUp, UserCircle2 } from "lucide-react";
import { toast } from "sonner";
import type { Appointment } from "@/types";

interface WriteReviewModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  onReviewSubmitted: (appointmentId: string, review: any) => void;
}

const RATING_LABELS: Record<number, string> = {
  1: "Needs Improvement",
  2: "Fair Consultation",
  3: "Good & Satisfactory",
  4: "Very Good & Attentive",
  5: "Exceptional & Highly Recommended",
};

const QUICK_TAGS = [
  "Accurate Diagnosis",
  "Thorough Explanation",
  "Gentle & Reassuring",
  "Polite Bedside Manner",
  "Minimal OPD Wait",
  "Clear Prescription",
];

export function WriteReviewModal({
  appointment,
  onClose,
  onReviewSubmitted,
}: WriteReviewModalProps) {
  const [reviewerName, setReviewerName] = useState<string>(appointment?.patientName || "Rahul Sharma");
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!appointment) return null;

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
    } else {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating) {
      toast.error("Please select a star rating");
      return;
    }

    setIsSubmitting(true);

    try {
      // Build final feedback text incorporating selected tags if any
      let finalComment = comment.trim();
      if (selectedTags.length > 0) {
        const tagSummary = `Highlights: ${selectedTags.join(", ")}.`;
        finalComment = finalComment ? `${finalComment} (${tagSummary})` : tagSummary;
      }

      if (!finalComment) {
        finalComment = "Great consultation, clear diagnosis, and prompt attention to my concerns.";
      }

      const activeName = reviewerName.trim() || appointment.patientName || "Verified Patient";

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: appointment.doctorId,
          rating,
          comment: finalComment,
          appointmentId: appointment.id,
          patientName: activeName,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to submit review");
      }

      // Optimistically store in localStorage for instant rendering on doctor profile page
      try {
        const localReview = {
          id: data.review?.id || `review_${Date.now()}`,
          author: activeName,
          rating,
          date: "Just now",
          text: finalComment,
        };
        const existing = JSON.parse(localStorage.getItem(`medibook_reviews_${appointment.doctorId}`) || "[]");
        localStorage.setItem(
          `medibook_reviews_${appointment.doctorId}`,
          JSON.stringify([localReview, ...existing.filter((r: any) => r.id !== localReview.id)])
        );
      } catch (e) {
        console.warn("Could not write to localStorage:", e);
      }

      toast.success(
        `Thank you ${activeName}! Your verified ${rating}-star review for ${appointment.doctorName} has been published.`
      );
      onReviewSubmitted(appointment.id, data.review);
      onClose();
    } catch (error: any) {
      console.error("Review submission error:", error);
      toast.error(error.message || "Failed to publish review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeRating = hoverRating || rating;

  return (
    <Modal isOpen={Boolean(appointment)} onClose={onClose}>
      <div className="p-6 sm:p-7 max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="size-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center font-bold">
              <Star className="size-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Write Doctor Review
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Help other patients with your verified consultation feedback
              </p>
            </div>
          </div>
        </div>

        {/* Doctor Summary Card */}
        <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-slate-800/60 border border-blue-100 dark:border-slate-700 mb-6 flex items-start gap-3.5">
          <div className="size-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-base shrink-0 shadow-sm shadow-blue-500/25">
            {appointment.doctorName.replace("Dr. ", "").charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
              {appointment.doctorName}
            </h4>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 mt-0.5">
              <Stethoscope className="size-3" /> {appointment.specialty}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <Building2 className="size-3" />
                {appointment.hospitalName || "Super Specialty Hospital"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="size-3" />
                {appointment.date}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Reviewer Display Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <UserCircle2 className="size-3.5 text-blue-600 dark:text-blue-400" />
              Your Name (Displayed on Review)
            </label>
            <input
              type="text"
              required
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="e.g. Rahul Sharma, Arham, etc."
              className="w-full text-xs p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Star Rating Selection */}
          <div className="text-center py-2 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-700/60">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Overall Experience Rating
            </label>
            <div className="flex items-center justify-center gap-2 mb-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-125 active:scale-95 cursor-pointer focus:outline-none"
                  aria-label={`Rate ${star} star`}
                >
                  <Star
                    className={`size-8 transition-colors ${
                      star <= activeRating
                        ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                        : "text-slate-200 dark:text-slate-700"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400 min-h-[16px]">
              {RATING_LABELS[activeRating] || "Select Rating"}
            </p>
          </div>

          {/* Quick Praise Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1">
              <ThumbsUp className="size-3 text-blue-600" />
              What went particularly well? (Optional)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300"
                    }`}
                  >
                    {isSelected ? "✓ " : "+ "}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Detailed Clinical Feedback
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe your appointment, the doctor's explanation of your symptoms, care instructions, and overall bedside manner..."
              className="w-full text-xs p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-700/80">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/25 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Publishing Review...</span>
              ) : (
                <>
                  <Sparkles className="size-3.5" />
                  <span>Publish Verified Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
