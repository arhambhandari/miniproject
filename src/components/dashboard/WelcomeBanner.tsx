"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Calendar } from "lucide-react";

interface WelcomeBannerProps {
  userName?: string;
  upcomingCount?: number;
}

export function WelcomeBanner({
  userName = "Patient",
  upcomingCount = 2,
}: WelcomeBannerProps) {
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [dayName, setDayName] = useState("Monday");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      };
      setCurrentDateTime(now.toLocaleDateString("en-US", options));
      setDayName(now.toLocaleDateString("en-US", { weekday: "long" }));
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white p-6 sm:p-8 shadow-xl shadow-blue-600/15">
      {/* Background Decorative Medical Geometry */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="absolute -right-8 -top-10 w-96 h-96 text-white/5"
          viewBox="0 0 200 200"
          fill="currentColor"
        >
          <path d="M45.7,-78.4C58.9,-71.4,69.1,-58.5,76.5,-44.3C83.9,-30.1,88.5,-15.1,87.6,-0.5C86.7,14,80.4,28.1,72.2,40.9C64.1,53.8,54.1,65.5,41.4,72.9C28.7,80.3,13.4,83.4,-1.8,86.5C-17,89.6,-34,92.6,-48.5,86.4C-63.1,80.2,-75.2,64.8,-82.4,47.7C-89.5,30.6,-91.7,11.8,-88.7,-5.7C-85.7,-23.3,-77.5,-39.6,-66.2,-52.1C-54.8,-64.6,-40.4,-73.3,-25.7,-78.9C-11,-84.5,4.1,-87,19.3,-84.4C34.5,-81.7,49.8,-74,45.7,-78.4Z" transform="translate(100 100)" />
        </svg>
        <div className="absolute top-4 right-1/3 size-2 bg-white/30 rounded-full animate-ping" />
        <div className="absolute bottom-6 left-1/4 size-2.5 bg-white/20 rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* Left: Greeting & Badges */}
        <div className="space-y-4 max-w-lg">
          {/* Date / Time Badge matching the image: [Apr 13, 2026 | 2:15 pm] */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-white/90 border border-white/20 shadow-sm">
            <Calendar className="size-3.5 text-blue-200" />
            <span>{currentDateTime || "Today • Schedule Active"}</span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Good Day, {userName}!
            </h1>
            <p className="mt-1 text-sm sm:text-base text-blue-100/90 font-medium">
              Have a nice {dayName}! You have{" "}
              <span className="font-bold underline decoration-blue-300 underline-offset-2">
                {upcomingCount} upcoming {upcomingCount === 1 ? "consultation" : "consultations"}
              </span>{" "}
              today.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-blue-100 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-white/10">
              <Sparkles className="size-3.5 text-amber-300" />
              <span>All vital health records synced</span>
            </div>
          </div>
        </div>

        {/* Right: Friendly Doctor Vector Illustration matching reference screenshot */}
        <div className="relative shrink-0 hidden sm:flex items-center justify-center pr-2">
          <div className="relative size-36 lg:size-44">
            {/* Soft backdrop halo */}
            <div className="absolute inset-0 bg-white/10 rounded-full blur-xl transform scale-90" />
            
            {/* Custom high-res SVG Doctor Graphic matching reference artwork */}
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full drop-shadow-xl"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Doctor Head & Hair */}
              <circle cx="100" cy="65" r="28" fill="#FBD38D" />
              {/* Hair */}
              <path
                d="M72 60C72 42 84 32 100 32C116 32 128 42 128 60C128 50 120 44 100 44C82 44 74 52 72 60Z"
                fill="#2D3748"
              />
              {/* Face features */}
              <circle cx="91" cy="63" r="3" fill="#2D3748" />
              <circle cx="109" cy="63" r="3" fill="#2D3748" />
              <path
                d="M94 73C96 76 104 76 106 73"
                stroke="#E53E3E"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Friendly ears */}
              <circle cx="71" cy="66" r="4.5" fill="#FBD38D" />
              <circle cx="129" cy="66" r="4.5" fill="#FBD38D" />

              {/* Doctor White Coat & Body */}
              <path
                d="M58 155C58 116 76 100 100 100C124 100 142 116 142 155V170H58V155Z"
                fill="#FFFFFF"
              />
              {/* Inner Scrub / Shirt (Teal Blue) */}
              <path
                d="M86 100L100 124L114 100C110 99 90 99 86 100Z"
                fill="#319795"
              />
              {/* Neck */}
              <rect x="92" y="88" width="16" height="15" rx="3" fill="#FBD38D" />

              {/* Coat Lapels */}
              <path
                d="M75 108L90 145H80L66 118C68 114 71 111 75 108Z"
                fill="#E2E8F0"
              />
              <path
                d="M125 108L110 145H120L134 118C132 114 129 111 125 108Z"
                fill="#E2E8F0"
              />

              {/* Stethoscope */}
              <path
                d="M84 105C84 126 94 138 100 138C106 138 116 126 116 105"
                stroke="#4A5568"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="100" cy="144" r="7" fill="#CBD5E0" stroke="#4A5568" strokeWidth="3" />

              {/* Clipboard in hand */}
              <rect
                x="126"
                y="125"
                width="34"
                height="45"
                rx="4"
                fill="#EDF2F7"
                stroke="#CBD5E0"
                strokeWidth="2"
              />
              <rect x="134" y="121" width="18" height="6" rx="2" fill="#718096" />
              <line x1="133" y1="136" x2="153" y2="136" stroke="#4299E1" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="133" y1="144" x2="150" y2="144" stroke="#CBD5E0" strokeWidth="2" strokeLinecap="round" />
              <line x1="133" y1="152" x2="146" y2="152" stroke="#CBD5E0" strokeWidth="2" strokeLinecap="round" />

              {/* Floating Mini Pill & Medical Cross Badges */}
              <g className="animate-bounce" style={{ animationDuration: "3s" }}>
                <circle cx="44" cy="90" r="16" fill="#FFFFFF" fillOpacity="0.95" />
                <path d="M44 82V98M36 90H52" stroke="#3182CE" strokeWidth="3.5" strokeLinecap="round" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
