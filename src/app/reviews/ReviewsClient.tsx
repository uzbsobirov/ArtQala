'use client';

import React, { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle2 } from 'lucide-react';

interface ReviewsClientProps {
  initialReviews: any[];
}

export default function ReviewsClient({ initialReviews }: ReviewsClientProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author_name: authorName, rating, text }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews([data.review, ...reviews]);
        setSuccess(true);
        setAuthorName('');
        setText('');
      }
    } catch (e) {
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-14 sm:py-16">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-14">
        {/* Page Head */}
        <div className="max-w-2xl mb-12 space-y-2">
          <span className="text-xs font-semibold tracking-[3px] text-[#429599] uppercase">
            COLLECTOR TESTIMONIALS
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#281C18]">
            Reviews &amp; Experiences
          </h1>
          <p className="text-sm sm:text-base text-[#6E6057] leading-relaxed">
            Read reflections from visitors and international collectors who welcomed a piece of Uzbekistan into their homes.
          </p>
        </div>

        {/* 2-Column: Form on Right or Top, Reviews Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Reviews List */}
          <div className="lg:col-span-7 space-y-5">
            {reviews.length > 0 ? (
              reviews.map((r) => (
                <div
                  key={r.id}
                  className="bg-[#FDFBF9] border border-[#E7E0D8] rounded-[3px] p-6 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-[#281C18]">
                        {r.author_name}
                      </h3>
                      <span className="text-[11px] text-[#8F8178]">
                        {new Date(r.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex text-[#DAA932]">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-[#4D3F38] leading-relaxed italic">
                    "{r.text}"
                  </p>

                  {r.painting && (
                    <div className="text-xs text-[#BA4E25] font-semibold pt-1">
                      Artwork: {r.painting.title_en}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 bg-[#FDFBF9] border border-[#E7E0D8] rounded-[3px] text-xs text-[#726861] text-center">
                Be the first to share your experience with Art Qala Gallery.
              </div>
            )}
          </div>

          {/* Review Submission Form */}
          <div className="lg:col-span-5 bg-[#FDFBF9] border border-[#E7E0D8] rounded-[3px] p-7 space-y-5 shadow-xs">
            <div className="space-y-1">
              <h2 className="font-serif text-2xl font-semibold text-[#281C18]">
                Share Your Experience
              </h2>
              <p className="text-xs text-[#726861]">
                Have you acquired an original painting or visited us in Tashkent?
              </p>
            </div>

            {success ? (
              <div className="p-4 bg-[#E8F5E9] border border-[#A5D6A7] rounded-[3px] text-xs text-[#1B5E20] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#2E7D32]" />
                <span>Thank you! Your review has been posted.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Jean-Luc & Marie"
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#E7E0D8] rounded-[2px] focus:outline-none focus:border-[#BA4E25]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                    Rating (1 to 5 Stars) *
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className={`p-2 rounded-sm border transition-all ${
                          rating >= s
                            ? 'text-[#DAA932] border-[#DAA932] bg-[#FAF4EC]'
                            : 'text-gray-300 border-[#E7E0D8]'
                        }`}
                      >
                        <Star className={`w-5 h-5 ${rating >= s ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                    Your Review *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Describe the artwork, packaging, delivery, or your gallery visit in Tashkent..."
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#E7E0D8] rounded-[2px] focus:outline-none focus:border-[#BA4E25] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#BA4E25] hover:bg-[#9C3E1B] text-white font-semibold text-xs py-3 rounded-[2px] transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <MessageSquarePlus className="w-4 h-4" />
                  <span>{submitting ? 'Submitting...' : 'Post Review'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
