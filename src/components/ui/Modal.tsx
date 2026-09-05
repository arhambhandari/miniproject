"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "./Button";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={cn(
          "relative w-full max-w-lg rounded-3xl bg-white shadow-2xl dark:bg-slate-900 overflow-hidden outline-none flex flex-col max-h-[90vh]",
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-6 shrink-0">
            <h2 id="modal-title" className="text-xl font-bold text-slate-900 dark:text-white">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
          </div>
        )}
        {!title && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        )}
        <div className="overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
