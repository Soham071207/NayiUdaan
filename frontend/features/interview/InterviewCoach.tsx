"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Star, ChevronRight, ArrowLeft, Monitor, Heart, BarChart2, Megaphone, GraduationCap, Scale, Users, Settings, Briefcase, Palette } from "lucide-react";
import { startInterview, submitAnswer } from "@/services/api";
import { InterviewQuestion, AnswerEvaluation } from "@/types/career_coach";

type Stage = "pick-field" | "pick-role" | "pick-type" | "answering" | "feedback" | "done";

// Field icon map using Lucide icons to avoid emoji encoding issues
const FIELD_ICONS: Record<string, React.ReactNode> = {
  Technology: <Monitor className="w-7 h-7" />,
  Healthcare: <Heart className="w-7 h-7" />,
  Finance: <BarChart2 className="w-7 h-7" />,
  Marketing: <Megaphone className="w-7 h-7" />,
  Education: <GraduationCap className="w-7 h-7" />,
  Legal: <Scale className="w-7 h-7" />,
  "Human Resources": <Users className="w-7 h-7" />,
  Operations: <Settings className="w-7 h-7" />,
  Sales: <Briefcase className="w-7 h-7" />,
  Design: <Palette className="w-7 h-7" />,
};

const FIELDS: { id: string; label: string; color: string; iconColor: string; roles: string[] }[] = [
  {
    id: "Technology",
    label: "Technology",
    color: "from-violet-500/20 to-violet-700/10",
    iconColor: "text-gray-500",
    roles: ["Software Engineer", "Data Analyst", "Product Manager", "UX Designer", "DevOps Engineer", "Data Scientist", "QA Engineer", "Business Analyst"],
  },
  {
    id: "Healthcare",
    label: "Healthcare",
    color: "from-emerald-500/20 to-emerald-700/10",
    iconColor: "text-gray-500",
    roles: ["Nurse", "Clinical Research Associate", "Healthcare Administrator", "Medical Coder", "Pharmacist", "Physiotherapist", "Radiographer", "Lab Technician"],
  },
  {
    id: "Finance",
    label: "Finance & Banking",
    color: "from-amber-500/20 to-amber-700/10",
    iconColor: "text-amber-600",
    roles: ["Financial Analyst", "Accountant", "Risk Manager", "Investment Banker", "Compliance Officer", "Audit Manager", "Credit Analyst", "Treasury Analyst"],
  },
  {
    id: "Marketing",
    label: "Marketing",
    color: "from-pink-500/20 to-pink-700/10",
    iconColor: "text-pink-400",
    roles: ["Digital Marketing Manager", "Content Strategist", "Brand Manager", "SEO Specialist", "Social Media Manager", "Growth Analyst", "PR Manager", "Campaign Manager"],
  },
  {
    id: "Education",
    label: "Education",
    color: "from-sky-500/20 to-sky-700/10",
    iconColor: "text-sky-400",
    roles: ["Teacher", "Curriculum Developer", "Education Coordinator", "E-Learning Specialist", "School Counsellor", "Academic Advisor", "Training Facilitator", "Instructional Designer"],
  },
  {
    id: "Legal",
    label: "Legal",
    color: "from-slate-500/20 to-slate-700/10",
    iconColor: "text-gray-500",
    roles: ["Lawyer", "Legal Researcher", "Compliance Analyst", "Paralegal", "Contract Manager", "IP Specialist", "Corporate Counsel", "Policy Analyst"],
  },
  {
    id: "Human Resources",
    label: "Human Resources",
    color: "from-orange-500/20 to-orange-700/10",
    iconColor: "text-orange-400",
    roles: ["HR Manager", "Talent Acquisition Specialist", "L&D Manager", "Compensation Analyst", "HR Business Partner", "Diversity & Inclusion Lead", "Payroll Manager", "HR Operations Analyst"],
  },
  {
    id: "Operations",
    label: "Operations",
    color: "from-cyan-500/20 to-cyan-700/10",
    iconColor: "text-gray-500",
    roles: ["Operations Manager", "Supply Chain Analyst", "Logistics Coordinator", "Project Manager", "Process Improvement Analyst", "Procurement Specialist", "Facilities Manager", "Quality Assurance Manager"],
  },
  {
    id: "Sales",
    label: "Sales",
    color: "from-lime-500/20 to-lime-700/10",
    iconColor: "text-lime-400",
    roles: ["Sales Manager", "Account Executive", "Business Development Manager", "Key Account Manager", "Inside Sales Representative", "Sales Operations Analyst", "Pre-Sales Consultant", "Channel Partner Manager"],
  },
  {
    id: "Design",
    label: "Design & Creative",
    color: "from-fuchsia-500/20 to-fuchsia-700/10",
    iconColor: "text-fuchsia-400",
    roles: ["Graphic Designer", "UX/UI Designer", "Motion Designer", "Brand Designer", "Creative Director", "Product Designer", "Illustrator", "3D Artist"],
  },
];

const INTERVIEW_TYPES = [
  { id: "career_return", label: "Career Return", icon: "rotate-ccw", desc: "Gap framing, readiness, and return-to-work confidence" },
  { id: "behavioral", label: "Behavioural", icon: "brain", desc: "Situational, experience-based & STAR-method questions" },
  { id: "technical", label: "Technical", icon: "flask-conical", desc: "Role-specific domain knowledge & problem solving" },
];

export default function InterviewCoach() {
  const [stage, setStage] = useState<Stage>("pick-field");
  const [selectedField, setSelectedField] = useState<(typeof FIELDS)[0] | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [interviewType, setInterviewType] = useState("career_return");
  const [sessionId, setSessionId] = useState("");
  const [question, setQuestion] = useState<InterviewQuestion | null>(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<AnswerEvaluation | null>(null);
  const [nextQ, setNextQ] = useState<InterviewQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [questionCount, setCount] = useState(0);

  const handleFieldSelect = (field: (typeof FIELDS)[0]) => {
    setSelectedField(field);
    setTargetRole("");
    setStage("pick-role");
  };

  const handleStartSession = async (type: string) => {
    if (!targetRole.trim() || !selectedField) return;
    setInterviewType(type);
    setLoading(true);
    try {
      const session = await startInterview({
        target_role: targetRole,
        field: selectedField.id,
        interview_type: type,
        total_questions: 5,
        candidate_context: {
          career_gap: true,
          field: selectedField.id,
          target_role: targetRole,
        },
      });
      setSessionId(session.session_id);
      setQuestion(session.first_question);
      setCount(1);
      setStage("answering");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const submitCurrentAnswer = async () => {
    if (!answer.trim() || !question) return;
    setLoading(true);
    try {
      const res = await submitAnswer({ session_id: sessionId, answer });
      setFeedback(res.evaluation);
      setNextQ(res.next_question || null);
      if (res.is_complete) setNextQ(null);
      setStage("feedback");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const goToNextQuestion = () => {
    if (nextQ) {
      setQuestion(nextQ);
      setFeedback(null);
      setNextQ(null);
      setCount((c) => c + 1);
      setAnswer("");
      setStage("answering");
    } else {
      setStage("done");
    }
  };

  const reset = () => {
    setStage("pick-field");
    setSelectedField(null);
    setTargetRole("");
    setQuestion(null);
    setFeedback(null);
    setNextQ(null);
    setCount(0);
    setAnswer("");
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">

        {/* Step 1: Pick Field */}
        {stage === "pick-field" && (
          <motion.div key="pick-field" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="space-y-1">
              <p className="text-gray-700 text-sm font-medium">Step 1 of 3 &mdash; Choose your industry</p>
              <p className="text-gray-500 text-xs">Select the field you are preparing to return to. Your interview questions will be tailored to this domain.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {FIELDS.map((field) => (
                <button
                  key={field.id}
                  onClick={() => handleFieldSelect(field)}
                  className={`group text-left glass rounded-2xl p-4 border border-purple-500/20 hover:border-violet-500/40 transition-all duration-200 hover:-translate-y-1 bg-gradient-to-br ${field.color}`}
                >
                  <div className={`mb-2 ${field.iconColor}`}>{FIELD_ICONS[field.id]}</div>
                  <p className="font-semibold text-gray-800 text-sm leading-tight">{field.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{field.roles.length} roles</p>
                  <div className="mt-3 flex items-center gap-1 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    Select <ChevronRight className="w-3 h-3" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Pick Role */}
        {stage === "pick-role" && selectedField && (
          <motion.div key="pick-role" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
            <div className="flex items-center gap-3">
              <button onClick={() => setStage("pick-field")} className="p-1.5 rounded-lg bg-purple-50 hover:bg-violet-100 transition-colors">
                <ArrowLeft className="w-4 h-4 text-gray-500" />
              </button>
              <div>
                <p className="text-gray-700 text-sm font-medium">Step 2 of 3 &mdash; Choose your role</p>
                <p className="text-gray-500 text-xs">
                  Field: <span className="text-gray-700 font-medium">{selectedField.label}</span>
                </p>
              </div>
            </div>

            <div className="glass p-5 rounded-2xl border border-purple-500/20 space-y-3">
              <label className="block text-sm font-medium text-gray-700">What role are you targeting?</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && targetRole.trim() && setStage("pick-type")}
                placeholder={`e.g. ${selectedField.roles[0]}...`}
                className="w-full bg-[var(--bg-light)] border border-purple-500/20 rounded-xl px-4 py-3 text-gray-800 text-sm focus:outline-none focus:border-violet-500/50 placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <p className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Common roles in {selectedField.label}</p>
              <div className="flex flex-wrap gap-2">
                {selectedField.roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => setTargetRole(role)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      targetRole === role
                        ? "bg-violet-600 border-violet-600 text-white"
                        : "bg-[var(--bg-light)] border-purple-500/20 text-gray-500 hover:border-violet-500/40 hover:text-gray-800"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => targetRole.trim() && setStage("pick-type")}
              disabled={!targetRole.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:from-cyan-500 hover:to-violet-600 transition-all"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Step 3: Pick Interview Type */}
        {stage === "pick-type" && selectedField && (
          <motion.div key="pick-type" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
            <div className="flex items-center gap-3">
              <button onClick={() => setStage("pick-role")} className="p-1.5 rounded-lg bg-purple-50 hover:bg-violet-100 transition-colors">
                <ArrowLeft className="w-4 h-4 text-gray-500" />
              </button>
              <div>
                <p className="text-gray-700 text-sm font-medium">Step 3 of 3 &mdash; Choose interview focus</p>
                <p className="text-gray-500 text-xs">
                  {selectedField.label} &middot; <span className="text-gray-700">{targetRole}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {INTERVIEW_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleStartSession(type.id)}
                  disabled={loading}
                  className="group text-left glass rounded-2xl p-5 border border-purple-500/20 hover:border-violet-500/40 transition-all duration-200 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <p className="font-semibold text-gray-800 mb-1.5 text-base">{type.label}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{type.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <>Start session <ChevronRight className="w-3 h-3" /></>}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Answering */}
        {stage === "answering" && question && (
          <motion.div key="answering" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {selectedField && <span>{selectedField.label}</span>}
              <span>&middot;</span>
              <span className="text-gray-500">{targetRole}</span>
              <span>&middot;</span>
              <span className="capitalize">{interviewType.replace(/_/g, " ")}</span>
            </div>

            <div className="glass rounded-2xl p-5 border border-violet-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="badge-primary px-2.5 py-1 rounded-lg text-xs font-semibold capitalize">
                  {question.interview_type.replace("_", " ")}
                </span>
                <span className="text-xs text-gray-500">Question {question.question_number} of 5</span>
              </div>
              <p className="text-gray-800 font-medium leading-relaxed">{question.question}</p>
            </div>

            <div className="space-y-3">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                rows={6}
                className="w-full bg-[var(--bg-light)] border border-purple-500/20 rounded-2xl px-4 py-3.5 text-gray-700 text-sm placeholder:text-gray-500 focus:outline-none focus:border-violet-500/50 resize-none leading-relaxed"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">{answer.length} characters</p>
                <button
                  onClick={submitCurrentAnswer}
                  disabled={!answer.trim() || loading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-cyan-500 hover:to-violet-600 transition-all"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {loading ? "Evaluating..." : "Submit Answer"}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Feedback */}
        {stage === "feedback" && feedback && (
          <motion.div key="feedback" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="glass rounded-2xl p-5 border border-violet-500/30 flex items-center gap-5">
              <div className="relative w-16 h-16 flex-shrink-0">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(95,141,78,0.1)" strokeWidth="6" />
                  <circle cx="32" cy="32" r="26" fill="none" stroke="#10B981" strokeWidth="6"
                    strokeDasharray={`${(feedback.overall_score / 100) * 163.4} 163.4`} strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-500">{feedback.overall_score}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">AI Evaluation Score</p>
                <p className="text-sm text-gray-500">{feedback.feedback}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass rounded-2xl p-4 space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Strengths</p>
                {feedback.strengths.map((s, i) => (
                  <p key={i} className="text-xs text-gray-500 flex gap-2"><span className="text-violet-500">+</span>{s}</p>
                ))}
              </div>
              <div className="glass rounded-2xl p-4 space-y-2">
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Improve</p>
                {feedback.weaknesses.map((s, i) => (
                  <p key={i} className="text-xs text-gray-500 flex gap-2"><span className="text-amber-500">~</span>{s}</p>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-4 border border-violet-500/20 space-y-2">
              <p className="text-xs font-semibold text-gray-500 flex items-center gap-1"><Star className="w-3.5 h-3.5" /> Improved Answer</p>
              <p className="text-xs text-gray-500 leading-relaxed">{feedback.improved_answer}</p>
            </div>

            <button
              onClick={goToNextQuestion}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold hover:from-cyan-500 hover:to-violet-600 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
              {nextQ ? "Next Question" : "Finish Interview"}
            </button>
          </motion.div>
        )}

        {/* Done */}
        {stage === "done" && (
          <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4 py-8">
            <div className="w-16 h-16 bg-violet-100 text-gray-500 rounded-full flex items-center justify-center mx-auto">
              <Star className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Interview Complete!</h2>
            {selectedField && (
              <p className="text-gray-500 text-sm">
                <span className="text-gray-700 font-medium">{targetRole}</span> &middot; {selectedField.label}
              </p>
            )}
            <p className="text-gray-500 text-sm">Great practice session. You can view your full report in the dashboard.</p>
            <button onClick={reset} className="px-6 py-2 rounded-xl bg-[var(--bg-light)] border border-purple-500/20 text-gray-900 text-sm font-semibold hover:bg-purple-50">
              Practice Again
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}