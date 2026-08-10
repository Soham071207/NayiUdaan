"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ApiResponse } from "@/types/resume";

const STORAGE_KEY = "nayiudaan_career_report";

interface CareerReportContextType {
  report: ApiResponse | null;
  setReport: (report: ApiResponse) => void;
  clearReport: () => void;
  isLoading: boolean;
  hasReport: boolean;
}

const CareerReportContext = createContext<CareerReportContextType | null>(null);

export function CareerReportProvider({ children }: { children: ReactNode }) {
  const [report, setReportState] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setReportState(JSON.parse(stored));
      }
    } catch {
      // Ignore parse errors from corrupted storage
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setReport = (newReport: ApiResponse) => {
    setReportState(newReport);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newReport));
    } catch {
      // Ignore storage quota errors
    }
  };

  const clearReport = () => {
    setReportState(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <CareerReportContext.Provider
      value={{
        report,
        setReport,
        clearReport,
        isLoading,
        hasReport: report !== null,
      }}
    >
      {children}
    </CareerReportContext.Provider>
  );
}

export function useCareerReport() {
  const ctx = useContext(CareerReportContext);
  if (!ctx) {
    throw new Error("useCareerReport must be used within a CareerReportProvider");
  }
  return ctx;
}
