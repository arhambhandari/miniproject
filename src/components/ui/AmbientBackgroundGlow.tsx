"use client";

import React from "react";
import { motion } from "framer-motion";

export function AmbientBackgroundGlow() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
      {/* Soft Blue / Teal Ambient Orb Top Right */}
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 18,
          ease: "easeInOut",
        }}
        className="absolute -top-32 -right-32 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-blue-400/10 via-indigo-500/10 to-teal-400/5 dark:from-blue-600/10 dark:via-indigo-600/10 dark:to-cyan-500/5 blur-[120px]"
      />

      {/* Soft Emerald / Mint Ambient Orb Bottom Left */}
      <motion.div
        animate={{
          x: [0, -35, 25, 0],
          y: [0, 30, -25, 0],
          scale: [1, 0.95, 1.08, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 22,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-emerald-400/10 via-teal-500/10 to-sky-400/5 dark:from-emerald-600/10 dark:via-teal-600/10 dark:to-blue-600/5 blur-[140px]"
      />

      {/* Subtle Violet Accent Bottom Right */}
      <motion.div
        animate={{
          x: [0, 25, -20, 0],
          y: [0, -20, 15, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 25,
          ease: "easeInOut",
        }}
        className="absolute -bottom-32 right-1/4 w-[450px] h-[450px] rounded-full bg-purple-500/5 dark:bg-purple-600/8 blur-[100px]"
      />
    </div>
  );
}
