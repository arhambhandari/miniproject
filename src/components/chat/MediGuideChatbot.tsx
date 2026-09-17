"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  X,
  Send,
  Sparkles,
  ShieldAlert,
  Calendar,
  Radio,
  Pill,
  FileText,
  User,
  Stethoscope,
  Clock,
  Building2,
  PhoneCall,
  ArrowRight,
  RotateCcw,
  Loader2,
  ChevronDown,
  MessageSquare
} from "lucide-react";
import type { ChatAction, ChatMessage, Doctor } from "@/types";

interface MediGuideChatbotProps {
  isOpen?: boolean;
  onToggle?: () => void;
  onBookDoctor?: (doctor: Doctor, reason?: string) => void;
  onBookEmergency?: (reason?: string) => void;
  onOpenTriage?: () => void;
  onNavigateToQueue?: () => void;
  onNavigateToMedications?: () => void;
  onOpenPass?: () => void;
}

const INITIAL_BOT_MESSAGE: ChatMessage = {
  id: "msg_init",
  sender: "bot",
  text: "Hello! I am **MediGuide AI**, your 24/7 clinical navigator and hospital assistant.\n\nHow can I assist you today? You can describe any symptoms, ask about your doctor, check the Live OPD Queue status, or request emergency fast-track admission.",
  timestamp: "Just now",
  actions: [
    {
      type: "START_TRIAGE",
      label: "🔍 Run Clinical Pre-Triage",
    },
    {
      type: "VIEW_QUEUE",
      label: "📡 Track Chamber 304 Live Queue",
    },
    {
      type: "BOOK_EMERGENCY",
      label: "🚨 Emergency Fast-Track SOS",
      emergencyReason: "Acute Medical Review",
    },
  ],
  suggestedReplies: [
    "Which specialist should I see?",
    "How does the Live OPD Queue work?",
    "I have chest pain & breathlessness",
    "Where is my digital OPD pass?",
  ],
};

export function MediGuideChatbot({
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
  onBookDoctor,
  onBookEmergency,
  onOpenTriage,
  onNavigateToQueue,
  onNavigateToMedications,
  onOpenPass,
}: MediGuideChatbotProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const toggleChat = controlledOnToggle || (() => setInternalIsOpen((prev) => !prev));

  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_BOT_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || loading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const payload = {
        messages: [...messages, userMessage].map((m) => ({
          sender: m.sender,
          text: m.text,
        })),
      };

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const botResponse: ChatMessage = {
          id: `bot_${Date.now()}`,
          sender: "bot",
          text: data.reply || "I am processing your clinical inquiry.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          actions: data.actions || [],
          suggestedReplies: data.suggestedReplies || [],
          isEmergency: !!data.isEmergency,
        };
        setMessages((prev) => [...prev, botResponse]);
      } else {
        const errBotMsg: ChatMessage = {
          id: `bot_err_${Date.now()}`,
          sender: "bot",
          text: "I encountered an issue connecting to the hospital clinical engine. Please try asking again or check our emergency hotlines if urgent.",
          timestamp: "Just now",
        };
        setMessages((prev) => [...prev, errBotMsg]);
      }
    } catch (err) {
      console.error("Failed to fetch chat response:", err);
      const netErrMsg: ChatMessage = {
        id: `bot_err_${Date.now()}`,
        sender: "bot",
        text: "Network connection lost. If experiencing an emergency, please dial 108 or visit the nearest ER immediately.",
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, netErrMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([INITIAL_BOT_MESSAGE]);
  };

  const executeAction = (action: ChatAction) => {
    if (action.type === "BOOK_DOCTOR" && onBookDoctor && action.doctor) {
      onBookDoctor(action.doctor, action.triageDisease);
    } else if (action.type === "BOOK_EMERGENCY" && onBookEmergency) {
      onBookEmergency(action.emergencyReason);
    } else if (action.type === "START_TRIAGE" && onOpenTriage) {
      onOpenTriage();
    } else if (action.type === "VIEW_QUEUE" && onNavigateToQueue) {
      onNavigateToQueue();
    } else if (action.type === "VIEW_MEDICATIONS" && onNavigateToMedications) {
      onNavigateToMedications();
    } else if (action.type === "VIEW_PASS" && onOpenPass) {
      onOpenPass();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <motion.button
          data-testid="open-ai-chat-btn"
          onClick={toggleChat}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-2xl shadow-blue-600/40 hover:shadow-blue-600/60 border border-white/20 transition-all cursor-pointer group"
        >
          <div className="relative">
            <div className="size-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Bot className="size-4.5 text-white animate-pulse" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-400 border-2 border-blue-600" />
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs tracking-wide">MediGuide AI</span>
              <Sparkles className="size-3 text-amber-300 fill-amber-300" />
            </div>
            <span className="text-[10px] text-blue-100 font-medium block">
              24/7 Clinical Navigator
            </span>
          </div>
        </motion.button>
      )}

      {/* Expandable Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            data-testid="ai-chat-window"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-[94vw] sm:w-[420px] md:w-[440px] h-[580px] max-h-[85vh] bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-5 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-between shrink-0 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative size-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <Bot className="size-5 text-white" />
                  <span className="absolute -top-1 -right-1 size-3 rounded-full bg-emerald-400 border-2 border-indigo-700" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-sm text-white">MediGuide AI</h3>
                    <span className="px-1.5 py-0.2 rounded-full bg-blue-500/40 text-[9px] font-bold text-blue-100 border border-white/20">
                      Doctor Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-100/90 font-medium flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Clinical Assistant & OPD Guide
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleResetChat}
                  title="Reset conversation"
                  className="p-1.5 rounded-xl hover:bg-white/15 text-blue-100 hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="size-4" />
                </button>
                <button
                  data-testid="close-ai-chat-btn"
                  onClick={toggleChat}
                  title="Minimize chat"
                  className="p-1.5 rounded-xl hover:bg-white/15 text-blue-100 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Conversation Messages Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/40 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl p-3.5 shadow-xs ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-xs"
                        : msg.isEmergency
                        ? "bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 text-slate-800 dark:text-slate-100 rounded-bl-xs"
                        : "bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 rounded-bl-xs"
                    }`}
                  >
                    {/* Bot header tag if emergency */}
                    {msg.sender === "bot" && msg.isEmergency && (
                      <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-extrabold text-[11px] mb-2 pb-1.5 border-b border-rose-200 dark:border-rose-900/60">
                        <ShieldAlert className="size-4 animate-bounce" />
                        <span>EMERGENCY CLINICAL TRIAGE RED FLAG</span>
                      </div>
                    )}

                    {/* Message Text with basic markdown bullet/bold rendering */}
                    <div className="space-y-2 leading-relaxed whitespace-pre-line">
                      {msg.text}
                    </div>

                    <div
                      className={`text-[9px] mt-2 font-semibold ${
                        msg.sender === "user"
                          ? "text-blue-200 text-right"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {/* Interactive Action Cards */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="w-[88%] mt-2 space-y-2">
                      {msg.actions.map((act, idx) => {
                        // Doctor recommendation card
                        if (act.type === "BOOK_DOCTOR" && act.doctor) {
                          return (
                            <motion.div
                              key={idx}
                              whileHover={{ scale: 1.01 }}
                              className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-900/60 shadow-xs space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-extrabold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                                  Matched Specialist
                                </span>
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                                  {act.doctor.satisfaction}% Rating
                                </span>
                              </div>

                              <div className="flex items-center gap-2.5">
                                <div className="size-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center shrink-0">
                                  <Stethoscope className="size-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                                    {act.doctor.user.name}
                                  </h4>
                                  <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                                    {act.doctor.specialization}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-100 dark:border-slate-700">
                                <span>Fee: ₹{act.doctor.fee?.toLocaleString() || "1,800"}</span>
                                <span>Slot: {act.doctor.nextAvailable}</span>
                              </div>

                              <button
                                data-testid="chat-action-book-doctor-btn"
                                onClick={() => executeAction(act)}
                                className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                              >
                                <Calendar className="size-3.5" />
                                <span>Book Consultation</span>
                                <ArrowRight className="size-3" />
                              </button>
                            </motion.div>
                          );
                        }

                        // Emergency SOS Action Card
                        if (act.type === "BOOK_EMERGENCY") {
                          return (
                            <motion.div
                              key={idx}
                              whileHover={{ scale: 1.01 }}
                              className="p-3 rounded-2xl bg-rose-600 text-white shadow-md shadow-rose-600/30 space-y-2"
                            >
                              <div className="flex items-center gap-2">
                                <ShieldAlert className="size-4.5 animate-pulse shrink-0" />
                                <div>
                                  <strong className="block text-xs font-black">
                                    Fast-Track Priority Queue Jump
                                  </strong>
                                  <span className="text-[10px] text-rose-100">
                                    Immediate token insertion with zero upfront fee
                                  </span>
                                </div>
                              </div>

                              <button
                                data-testid="chat-action-emergency-btn"
                                onClick={() => executeAction(act)}
                                className="w-full py-2 rounded-xl bg-white text-rose-700 hover:bg-rose-50 font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                              >
                                <span>🚨 Book Emergency Priority Token</span>
                                <ArrowRight className="size-3.5" />
                              </button>
                            </motion.div>
                          );
                        }

                        // Pre-Triage or Queue Navigation Buttons
                        return (
                          <button
                            key={idx}
                            onClick={() => executeAction(act)}
                            className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[11px] flex items-center justify-between transition-colors cursor-pointer"
                          >
                            <span>{act.label}</span>
                            <ArrowRight className="size-3 text-blue-600 dark:text-blue-400" />
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Suggested Reply Chips */}
                  {msg.suggestedReplies && msg.suggestedReplies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[90%]">
                      {msg.suggestedReplies.map((reply, rIdx) => (
                        <button
                          key={rIdx}
                          data-testid={`suggested-reply-${rIdx}`}
                          onClick={() => handleSendMessage(reply)}
                          disabled={loading}
                          className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-slate-700 text-[10px] font-semibold transition-colors cursor-pointer"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {loading && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 w-24">
                  <div className="size-2 rounded-full bg-blue-600 animate-ping" />
                  <span className="text-[10px] text-slate-400 font-medium">Analyzing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    data-testid="ai-chat-input"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask MediGuide (symptoms, doctors, queue, OPD pass)..."
                    className="w-full h-10 pl-3.5 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                  {inputValue && (
                    <button
                      type="button"
                      onClick={() => setInputValue("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>

                <button
                  data-testid="ai-chat-send-btn"
                  type="submit"
                  disabled={!inputValue.trim() || loading}
                  className="size-10 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-sm"
                >
                  {loading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
