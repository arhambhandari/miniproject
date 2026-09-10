"use client";

import React, { useState } from "react";
import { MessageSquare, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { WhatsAppSmsSimulatorModal } from "./WhatsAppSmsSimulatorModal";

interface SimulatorFloatingButtonProps {
  initialAppointment?: any;
  defaultTemplate?: "APPOINTMENT_PASS" | "MEDICATION_REMINDER" | "DOCTOR_DELAY" | "LAB_READY";
}

export function SimulatorFloatingButton({
  initialAppointment,
  defaultTemplate = "APPOINTMENT_PASS",
}: SimulatorFloatingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen(true)}
          data-testid="open-whatsapp-simulator-fab"
          title="Open WhatsApp & SMS Alert Simulator"
          className="h-12 px-4 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2.5 cursor-pointer border border-white/20 transition-all backdrop-blur-md"
        >
          <div className="size-7 rounded-full bg-white/20 flex items-center justify-center">
            <MessageSquare className="size-4 text-white" />
          </div>
          <span className="hidden sm:inline">WhatsApp & SMS Alerts</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/25 uppercase tracking-wider font-extrabold flex items-center gap-1">
            <Sparkles className="size-2.5" /> Sim
          </span>
        </motion.button>
      </div>

      <WhatsAppSmsSimulatorModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        defaultTemplate={defaultTemplate}
        initialAppointment={initialAppointment}
      />
    </>
  );
}
