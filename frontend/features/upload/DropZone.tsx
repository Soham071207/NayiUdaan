"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export default function DropZone({ onFileSelect, disabled }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (file.type !== "application/pdf") return "Only PDF files are accepted.";
    if (file.size > 5 * 1024 * 1024) return "File size must be under 5MB.";
    return null;
  };

  const handleFile = useCallback((file: File) => {
    const err = validateFile(file);
    if (err) { setError(err); return; }
    setError(null);
    setSelectedFile(file);
    onFileSelect(file);
  }, [onFileSelect]);

  const onDragEnter = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearFile = () => { setSelectedFile(null); setError(null); };

  return (
    <div className="w-full max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        {selectedFile ? (
          /* Selected state */
          <motion.div
            key="selected"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[var(--bg-light)] rounded-2xl p-6 border border-[#DCEFD8] shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-600/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-[#5F8D4E]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{selectedFile.name}</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#5F8D4E]" />
                {!disabled && (
                  <button onClick={clearFile} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          /* Drop zone */
            <motion.label
            key="dropzone"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            htmlFor="resume-upload"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                document.getElementById("resume-upload")?.click();
              }
            }}
            className={cn(
              "flex flex-col items-center justify-center w-full h-56 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#5F8D4E] focus:ring-offset-2",
              isDragging
                ? "border-violet-600 bg-violet-600/5 scale-[1.02]"
                : "border-gray-200 bg-[var(--bg-light)] hover:border-violet-600/50 hover:bg-violet-600/5",
              disabled && "pointer-events-none opacity-50"
            )}
            onDragEnter={onDragEnter}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <motion.div
              animate={isDragging ? { scale: 1.15, rotate: -5 } : { scale: 1, rotate: 0 }}
              className="w-14 h-14 rounded-2xl bg-violet-600/10 flex items-center justify-center mb-4"
            >
              <Upload className="w-7 h-7 text-[#5F8D4E]" />
            </motion.div>

            <p className="text-gray-900 font-medium mb-1">
              {isDragging ? "Drop your resume here!" : "Drag & drop your resume"}
            </p>
            <p className="text-sm text-gray-500 mb-3">or click to browse</p>
            <span className="px-3 py-1 rounded-full bg-[#FCE7F3] text-[#7C3AED] text-xs font-semibold">PDF · Max 5MB</span>

            <input
              id="resume-upload"
              type="file"
              accept=".pdf"
              className="sr-only"
              onChange={onInputChange}
              disabled={disabled}
            />
          </motion.label>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-sm text-red-400 text-center"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
