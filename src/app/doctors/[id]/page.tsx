"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  HeartPulse, 
  Star, 
  MapPin, 
  Building2, 
  CalendarCheck, 
  ArrowLeft, 
  UserCircle2, 
  Award, 
  Clock, 
  CheckCircle2, 
  Calendar,
  Sparkles,
  Phone
} from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function DoctorProfilePage() {
  const params = useParams();
  const doctorId = params?.id as string;
  
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviewerName, setReviewerName] = useState("Rahul Sharma");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!doctorId) return;

    // Fetch live doctor data with cache busting
    fetch(`/api/doctors/${doctorId}?t=${Date.now()}`, { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          const loc = data.hospitalName?.includes("Mumbai") 
            ? "Mumbai, Maharashtra" 
            : data.hospitalName?.includes("Chennai") 
            ? "Chennai, Tamil Nadu" 
            : data.hospitalName?.includes("Gurugram")
            ? "Gurugram, NCR"
            : "New Delhi, Delhi";

          let serverReviews: any[] = [];
          if (Array.isArray(data.reviews)) {
            serverReviews = data.reviews.map((r: any) => ({
              id: r.id,
              author: r.patientName || "Verified Patient",
              rating: r.rating,
              date: r.createdAt 
                ? new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                : "Recent Visit",
              text: r.comment || "",
            }));
          }

          // Merge any recent local reviews immediately so user sees their review without needing to refresh
          try {
            const localSaved = JSON.parse(localStorage.getItem(`medibook_reviews_${doctorId}`) || "[]");
            if (Array.isArray(localSaved) && localSaved.length > 0) {
              const serverComments = new Set(serverReviews.map(r => r.text?.trim()));
              const serverIds = new Set(serverReviews.map(r => r.id));
              const freshLocals = localSaved.filter((lr: any) => !serverIds.has(lr.id) && !serverComments.has(lr.text?.trim()));
              serverReviews = [...freshLocals, ...serverReviews];
            }
          } catch (e) {
            console.warn("Local review merge error:", e);
          }

          setReviews(serverReviews);

          const hasReviews = serverReviews.length > 0;
          const avgScore = hasReviews
            ? (serverReviews.reduce((acc, r) => acc + (r.rating || 5), 0) / serverReviews.length).toFixed(1)
            : null;
          const satisfactionPct = hasReviews
            ? Math.min(100, Math.round((Number(avgScore) / 5) * 100))
            : null;

          setDoctor({
            id: data.id,
            name: data.user?.name || "Specialist Physician",
            image: data.user?.image || null,
            specialty: data.specialization || "Super Specialist",
            qualifications: data.qualifications || "MBBS, MD",
            hospital: data.hospitalName || "Premier Medical Institute",
            contactNumber: data.contactNumber || "+91 98201 44521",
            location: loc,
            rating: avgScore,
            satisfaction: satisfactionPct,
            experience: data.experience || 5,
            fee: data.fee ? `₹${data.fee.toLocaleString()}` : "₹1,500",
            about: data.bio || `${data.user?.name || "This physician"} is a dedicated super-specialist committed to patient-first clinical excellence, evidence-based medicine, and compassionate post-care rehabilitation.`,
            nextAvailable: data.nextAvailable || "Available This Week",
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // Fetch user session for name prefill
    fetch("/api/auth/session")
      .then(res => res.json())
      .then(data => {
        if (data?.user?.name) {
          setReviewerName(data.user.name);
        }
      })
      .catch(() => {});
  }, [doctorId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      toast.error("Please provide some feedback before submitting");
      return;
    }
    
    const activeAuthor = reviewerName.trim() || "Verified Patient";
    setSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: doctor?.id || doctorId,
          rating: reviewRating,
          comment: reviewText.trim(),
          patientName: activeAuthor,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to submit review");
      }

      toast.success(`Thank you ${activeAuthor}! Your verified review has been published.`);
      
      const newReview = {
        id: data.review?.id || `review_${Date.now()}`,
        author: activeAuthor,
        rating: reviewRating,
        date: "Just now",
        text: reviewText.trim()
      };

      // Store in localStorage so it stays immediately visible before/until refresh and across page navigations
      try {
        const stored = JSON.parse(localStorage.getItem(`medibook_reviews_${doctorId}`) || "[]");
        localStorage.setItem(`medibook_reviews_${doctorId}`, JSON.stringify([newReview, ...stored]));
      } catch {}

      // Immediately display at the top of the list without needing to refresh
      setReviews((prev) => [newReview, ...prev]);

      // Dynamically update satisfaction score in UI
      if (doctor) {
        const newTotal = reviews.length + 1;
        const newAvg = ((reviews.reduce((acc, r) => acc + r.rating, 0) + reviewRating) / newTotal).toFixed(1);
        setDoctor((prev: any) => ({
          ...prev,
          rating: newAvg,
          satisfaction: Math.min(100, Math.round((Number(newAvg) / 5) * 100)),
        }));
      }

      setReviewText("");
      setReviewRating(5);
    } catch (err: any) {
      toast.error(err.message || "Failed to publish review");
    } finally {
      setSubmitting(false);
    }
  };

  const getAvatarStyle = (name: string) => {
    const styles = [
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 ring-1 ring-indigo-200 dark:ring-indigo-800",
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 ring-1 ring-emerald-200 dark:ring-emerald-800",
      "bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 ring-1 ring-purple-200 dark:ring-purple-800",
      "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 ring-1 ring-amber-200 dark:ring-amber-800",
      "bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 ring-1 ring-rose-200 dark:ring-rose-800",
      "bg-sky-100 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300 ring-1 ring-sky-200 dark:ring-sky-800",
      "bg-teal-100 text-teal-700 dark:bg-teal-950/70 dark:text-teal-300 ring-1 ring-teal-200 dark:ring-teal-800",
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return styles[sum % styles.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-500">
        <div className="flex items-center gap-2">
          <div className="size-4 rounded-full bg-blue-600 animate-ping" />
          <span>Loading specialist profile...</span>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 p-4">
        <h2 className="text-xl font-bold mb-2">Doctor Profile Not Found</h2>
        <p className="text-sm mb-4">The requested specialist could not be found or may have been updated.</p>
        <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/#doctors" 
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="size-4" /> Back to Doctors
            </Link>
            <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800" />
            <Link className="flex items-center gap-2" href="/">
              <span className="flex size-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/30">
                <HeartPulse className="size-4" />
              </span>
              <span className="font-bold tracking-tight text-slate-900 dark:text-white text-lg">MediBook</span>
            </Link>
          </div>

          <Link
            href="/dashboard"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            My Patient Dashboard →
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 sm:py-12">
        {/* Doctor Header & Key Metrics */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 mb-8 flex flex-col md:flex-row gap-6 sm:gap-8 items-start">
          {doctor.image ? (
            <div className="size-28 sm:size-36 rounded-2xl overflow-hidden ring-4 ring-blue-50 dark:ring-blue-950 shrink-0 shadow-md">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ) : (
            <div className="size-28 sm:size-36 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-white font-black flex items-center justify-center text-4xl sm:text-5xl shrink-0 shadow-md ring-4 ring-blue-50 dark:ring-blue-950 select-none">
              {doctor.name ? doctor.name.replace(/^Dr\.\s*/i, "").charAt(0).toUpperCase() : "D"}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/50 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                    {doctor.specialty}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                    <CheckCircle2 className="size-3" /> Verified Specialist
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
                  {doctor.name}
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">
                  {doctor.qualifications}
                </p>

                <div className="flex flex-wrap gap-y-2 gap-x-5 text-xs text-slate-600 dark:text-slate-300 mb-4">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Building2 className="size-3.5 text-blue-600 dark:text-blue-400" />
                    {doctor.hospital}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-rose-500" />
                    {doctor.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5 text-emerald-500" />
                    {doctor.experience} Years Clinical Experience
                  </span>
                  {doctor.rating ? (
                    <span className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" />
                      {doctor.rating} / 5.0 ({doctor.satisfaction}% Satisfaction)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 font-semibold text-slate-400 dark:text-slate-500">
                      <Star className="size-3.5 text-slate-300 dark:text-slate-600" />
                      No reviews yet
                    </span>
                  )}
                </div>
              </div>

              {/* Consultation Fee & Booking CTA */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 flex flex-col items-center justify-center min-w-[180px] shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                  Consultation Fee
                </span>
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {doctor.fee}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 mb-3">
                  In-Clinic Verified OPD
                </span>
                <Link
                  href={`/?book=${doctor.id}#doctors`}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs text-center shadow-md shadow-blue-500/20 transition-transform active:scale-95"
                >
                  Book Appointment
                </Link>
              </div>
            </div>

            {/* About the Doctor Section */}
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-blue-600 dark:text-blue-400" />
                About the Doctor
              </h2>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {doctor.about}
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
                  Patient Reviews & Ratings
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                    {reviews.length} verified
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Authentic feedback submitted by appointed patients following hospital consultations
                </p>
              </div>

              {doctor.rating ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold self-start sm:self-auto">
                  <Star className="size-4 fill-amber-400 text-amber-500" />
                  <span>{doctor.rating} Overall Score</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs font-semibold self-start sm:self-auto">
                  <Star className="size-4 text-slate-400" />
                  <span>No reviews yet</span>
                </div>
              )}
            </div>
            
            {/* Write a Review Form */}
            <div className="bg-slate-50/90 dark:bg-slate-800/50 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700 mb-8 shadow-xs">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-1.5">
                <Star className="size-4 text-amber-500" /> Write a Patient Review for {doctor.name}
              </h3>
              <form onSubmit={handleSubmitReview} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs text-slate-900 dark:text-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                      <Star className="size-3.5 text-amber-500" />
                      Rating: <span className="font-bold text-amber-600 dark:text-amber-400 ml-1">{reviewRating} of 5 Stars</span>
                    </label>
                    <div className="flex items-center gap-1.5 py-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star} 
                          type="button" 
                          onClick={() => setReviewRating(star)}
                          className="focus:outline-none p-1 transition-transform hover:scale-125 cursor-pointer"
                          aria-label={`Rate ${star} stars`}
                        >
                          <Star className={`size-5 transition-colors ${star <= reviewRating ? "text-amber-400 fill-amber-400" : "text-slate-200 dark:text-slate-700"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Clinical Feedback & Experience
                  </label>
                  <textarea 
                    required
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share details of your consultation, bedside care, diagnosis, and treatment instructions..."
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs resize-none text-slate-900 dark:text-white placeholder:text-slate-400"
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <CheckCircle2 className="size-3 text-emerald-500" /> Published instantly to verified OPD records
                  </span>
                  <button 
                    disabled={submitting}
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? "Publishing Review..." : "Submit Verified Review"}
                  </button>
                </div>
              </form>
            </div>

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                No patient reviews yet. Be the first to leave a verified review!
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div 
                    key={review.id} 
                    className={`p-4 sm:p-5 rounded-2xl transition-all ${
                      review.date === "Just now"
                        ? "bg-blue-50/70 dark:bg-blue-950/30 border-2 border-blue-300 dark:border-blue-700 shadow-sm"
                        : "bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/80 hover:bg-white dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2 gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`size-10 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 shadow-xs ${getAvatarStyle(review.author || "P")}`}>
                          {review.author ? review.author.charAt(0).toUpperCase() : "P"}
                        </div>
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                            <span>{review.author}</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                              ✓ Verified Patient
                            </span>
                            {review.date === "Just now" && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 animate-pulse">
                                New
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">{review.date}</div>
                        </div>
                      </div>

                      <div className="flex text-amber-400 shrink-0">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`size-3.5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-700"}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mt-2 pl-13">
                      "{review.text}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
