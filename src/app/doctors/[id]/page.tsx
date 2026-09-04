"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HeartPulse, Star, MapPin, Building2, CalendarCheck, ArrowLeft, UserCircle2 } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function DoctorProfilePage() {
  const params = useParams();
  const doctorId = params.id;
  
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/doctors/${doctorId}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setDoctor({
            ...data,
            name: data.user?.name || "Unknown Doctor",
            specialty: data.specialty || "General Medicine",
            hospital: "City General Hospital",
            location: "New York, NY",
            rating: 4.9,
            fee: "₹1,500",
            about: `${data.user?.name || "Doctor"} is a highly experienced specialist focused on patient-first care and advanced treatments.`
          });
          setReviews([
            { id: 1, author: "Raj Patel", rating: 5, date: "Aug 2026", text: "Very attentive and professional. Took the time to explain all my test results." },
            { id: 2, author: "Sarah Jenkins", rating: 5, date: "Jul 2026", text: "The best doctor in the city. The clinic staff is also wonderful." },
          ]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [doctorId]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    
    setSubmitting(true);
    setTimeout(() => {
      const newReview = {
        id: Date.now(),
        author: "You (Patient)",
        rating: reviewRating,
        date: "Just now",
        text: reviewText
      };
      setReviews([newReview, ...reviews]);
      setReviewText("");
      setReviewRating(5);
      setSubmitting(false);
    }, 800);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Loading profile...</div>;
  }

  if (!doctor) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Doctor not found.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center px-4">
          <Link href="/" className="flex items-center text-slate-500 hover:text-slate-900 transition-colors mr-6">
            <ArrowLeft className="size-5 mr-2" /> Back
          </Link>
          <Link className="flex items-center gap-2" href="/">
            <span className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <HeartPulse className="size-4" />
            </span>
            <span className="font-bold tracking-tight text-slate-900">MediBook</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
        {/* Doctor Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8 flex flex-col md:flex-row gap-8 items-start">
          <div className="size-32 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-5xl shrink-0">
            {doctor.name.replace("Dr. ", "")[0]}
          </div>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-1">{doctor.name}</h1>
                <p className="text-lg font-medium text-blue-600 mb-4">{doctor.specialty}</p>
                
                <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-slate-600 mb-6">
                  <span className="flex items-center gap-2"><Building2 className="size-4" /> {doctor.hospital}</span>
                  <span className="flex items-center gap-2"><MapPin className="size-4" /> {doctor.location}</span>
                  <span className="flex items-center gap-2 font-medium text-amber-500"><Star className="size-4 fill-amber-500" /> {doctor.rating} Rating</span>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center min-w-[140px]">
                <div className="text-xs font-semibold text-slate-500 mb-1">CONSULTATION FEE</div>
                <div className="text-xl font-bold text-slate-900">{doctor.fee}</div>
              </div>
            </div>
            
            <h3 className="font-bold text-slate-900 mb-2">About the Doctor</h3>
            <p className="text-slate-600 leading-relaxed">{doctor.about}</p>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              Patient Reviews <span className="text-slate-400 font-normal text-lg">({reviews.length})</span>
            </h2>
            
            {/* Write a Review Form */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
              <h3 className="font-semibold text-slate-900 mb-4">Write a Review</h3>
              <form onSubmit={handleSubmitReview}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-medium text-slate-700 mr-2">Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      type="button" 
                      onClick={() => setReviewRating(star)}
                      className="focus:outline-none"
                    >
                      <Star className={`size-6 ${star <= reviewRating ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} />
                    </button>
                  ))}
                </div>
                <textarea 
                  required
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="How was your appointment? (Leave a review to help others...)"
                  className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm resize-none mb-3"
                  rows={3}
                ></textarea>
                <div className="flex justify-end">
                  <button 
                    disabled={submitting}
                    type="submit" 
                    className="bg-slate-900 text-white font-medium py-2 px-6 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </form>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {reviews.map(review => (
                <div key={review.id} className="pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <UserCircle2 className="size-10 text-slate-300" />
                      <div>
                        <div className="font-semibold text-slate-900">{review.author}</div>
                        <div className="text-xs text-slate-500">{review.date}</div>
                      </div>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`size-4 ${i < review.rating ? "fill-amber-400" : "text-slate-200"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm mt-3 ml-13 leading-relaxed">"{review.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
