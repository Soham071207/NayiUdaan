import { createServer } from "miragejs";
import { faker } from "@faker-js/faker";

const INDIAN_FEMALE_NAMES = [
  "Priya Sharma", "Ananya Krishnamurthy", "Divya Patel", "Kavya Reddy",
  "Sneha Gupta", "Pooja Iyer", "Meera Nair", "Shreya Joshi",
  "Deepika Singh", "Aishwarya Mehta", "Riya Bose", "Swati Desai",
];

const ROLES = [
  "Senior Software Engineer", "Data Scientist", "Product Manager",
  "UX Designer", "Business Analyst", "Marketing Manager",
  "Full Stack Developer", "DevOps Engineer", "Data Analyst", "HR Business Partner",
];

const EDUCATIONS = [
  "B.Tech Computer Science, IIT Delhi",
  "MBA, IIM Ahmedabad",
  "B.E. Electronics, BITS Pilani",
  "M.Tech Data Science, IIT Bombay",
  "BCA, Delhi University",
  "B.Sc Statistics, Pune University",
];

const ALL_SKILLS = [
  "Python", "React", "SQL", "Java", "JavaScript", "TypeScript",
  "Node.js", "Docker", "AWS", "Machine Learning", "Kubernetes",
  "System Design", "Power BI", "Tableau", "Salesforce", "Excel",
  "Google Analytics", "JIRA", "Agile", "Scrum", "Figma",
];

const COMPANIES = [
  { name: "Microsoft", logo: "MS", industry: "Technology" },
  { name: "Google", logo: "G", industry: "Technology" },
  { name: "Amazon", logo: "A", industry: "E-Commerce" },
  { name: "Accenture", logo: "AC", industry: "Consulting" },
  { name: "Infosys", logo: "IN", industry: "IT Services" },
  { name: "Flipkart", logo: "FL", industry: "E-Commerce" },
  { name: "PhonePe", logo: "PP", industry: "Fintech" },
  { name: "Razorpay", logo: "RZ", industry: "Fintech" },
  { name: "Swiggy", logo: "SW", industry: "Food Tech" },
  { name: "CRED", logo: "CR", industry: "Fintech" },
];

const INTERVIEW_QUESTIONS = {
  behavioral: [
    "Tell me about yourself and your career journey so far.",
    "How do you handle situations where priorities conflict?",
    "Describe a time you had to learn something new quickly.",
    "What motivated you to return to work after your career break?",
    "Tell me about a challenging project you led successfully.",
    "How do you handle feedback and criticism from your manager?",
  ],
  technical: [
    "What are the key principles of object-oriented programming?",
    "Explain the difference between REST and GraphQL APIs.",
    "How would you optimize a slow-performing database query?",
    "What is the difference between supervised and unsupervised learning?",
    "Describe your approach to debugging a production issue at scale.",
    "What design patterns have you used in your past projects?",
  ],
  hr: [
    "Where do you see yourself in the next 5 years?",
    "Why are you interested in this specific role and company?",
    "What are your salary expectations for this role?",
    "How do you stay updated with the latest industry trends?",
    "What is your preferred work style — remote, hybrid, or in-office?",
  ],
};

function generateMockAnalysis() {
  const name = faker.helpers.arrayElement(INDIAN_FEMALE_NAMES);
  const role = faker.helpers.arrayElement(ROLES);
  const expYears = faker.number.int({ min: 3, max: 12 });
  const gapYears = faker.number.int({ min: 1, max: 5 });
  const lastWorkingYear = new Date().getFullYear() - gapYears;
  const currentYear = new Date().getFullYear();
  const readinessScore = faker.number.int({ min: 52, max: 88 });
  const atsScore = faker.number.int({ min: 55, max: 90 });

  const strongSkills = faker.helpers.arrayElements(ALL_SKILLS, 5);
  const missingSkills = faker.helpers.arrayElements(
    ALL_SKILLS.filter((s) => !strongSkills.includes(s)), 4
  );
  const prioritySkills = missingSkills.slice(0, 2);

  const roadmapData = [
    {
      week: 1, title: `${prioritySkills[0]} Fundamentals`,
      tasks: [`Complete ${prioritySkills[0]} crash course on Udemy`, `Build 2 mini-projects using ${prioritySkills[0]}`, "Push all projects to GitHub"],
      resources: ["Udemy", "Official Documentation", "YouTube Tutorials"],
    },
    {
      week: 2, title: "System Design & Architecture",
      tasks: ["Study scalability and high-level design patterns", "Practice drawing HLD diagrams for 3 popular apps", "Review SOLID principles"],
      resources: ["System Design Primer (GitHub)", "Grokking the System Design Interview", "LeetCode Design"],
    },
    {
      week: 3, title: `${prioritySkills[1] || "Cloud Fundamentals"} Deep Dive`,
      tasks: [`Master core concepts of ${prioritySkills[1] || "Cloud"}`, "Build and deploy a sample application", "Complete a hands-on lab or certification module"],
      resources: ["Official Docs", "Coursera", "A Cloud Guru"],
    },
    {
      week: 4, title: "Portfolio & GitHub Cleanup",
      tasks: ["Create or update 3 showcase GitHub projects", "Write 2 technical blog posts (Medium or Dev.to)", "Update portfolio website with new projects"],
      resources: ["GitHub Pages", "Dev.to", "Medium"],
    },
    {
      week: 5, title: "Resume & LinkedIn Optimisation",
      tasks: ["Apply all ATS recommendations from NayiUdaan", "Rewrite LinkedIn headline, about section, and experience", "Request 3-5 LinkedIn recommendations from past colleagues"],
      resources: ["Jobscan.co", "LinkedIn Learning", "Resume.io"],
    },
    {
      week: 6, title: "Interview Preparation",
      tasks: ["Solve 40 LeetCode problems (Easy & Medium)", "Practice 10 behavioral questions using STAR method", "Complete 3 mock interviews on Pramp or Interviewing.io"],
      resources: ["LeetCode", "Pramp", "STAR Method Cheat Sheet"],
    },
    {
      week: 7, title: "Returnship & Networking",
      tasks: ["Research returnship programs at 15 companies", "Attend 2 virtual networking events or webinars", "Connect with 10 professionals in your target role on LinkedIn"],
      resources: ["Returnship.com", "LinkedIn Events", "Herkey (formerly JobsForHer)"],
    },
    {
      week: 8, title: "Active Application & Follow-Up",
      tasks: ["Apply to 15+ targeted job positions", "Follow up on all pending applications", "Schedule and prepare for first-round interviews"],
      resources: ["LinkedIn Jobs", "Naukri", "Indeed", "Company Careers Pages"],
    },
  ];

  return {
    name,
    previous_role: role,
    experience_years: expYears,
    education: faker.helpers.arrayElement(EDUCATIONS),
    skills: strongSkills,
    career_gap: {
      career_gap_detected: true,
      career_gap_years: gapYears,
      last_working_year: lastWorkingYear,
      confidence: "high",
      reasoning: `No professional activity detected between ${lastWorkingYear} and ${currentYear}. This gap is likely attributable to personal caregiving, family responsibilities, or relocation.`,
    },
    market: {
      strong_skills: strongSkills,
      missing_skills: missingSkills,
      priority_to_learn: prioritySkills,
      market_required_skills: [...new Set([...strongSkills, ...missingSkills])],
      career_readiness_score: readinessScore,
      reason: `Core skills in ${strongSkills.slice(0, 2).join(" and ")} are strong and market-relevant. However, modern ${missingSkills.slice(0, 2).join(" and ")} skills are in high demand and require upskilling.`,
    },
    roadmap: { roadmap: roadmapData },
    resume_review: {
      ats_score: atsScore,
      resume_tips: [
        "Add quantifiable achievements to each role (e.g., 'improved API response time by 40%')",
        "Include a dedicated Projects section with GitHub links",
        "Add a Skills section with technologies clearly listed",
        "Use strong action verbs at the start of every bullet point",
        "Tailor your resume keywords to each job description",
      ],
      missing_sections: ["Projects", "Certifications", "Volunteer Work"],
      keyword_suggestions: missingSkills,
      professional_summary: `Results-driven ${role} with ${expYears}+ years of expertise in ${strongSkills.slice(0, 3).join(", ")}. After a purposeful career break, I am energised and ready to bring renewed perspective and updated skills to a challenging role in a forward-thinking organisation.`,
      overall_feedback: `Strong professional background with ${expYears} years of solid experience. After a ${gapYears}-year career break, the priority is closing gaps in ${missingSkills.slice(0, 2).join(" and ")} and quantifying past impact with metrics.`,
    },
    career_report: {
      executive_summary: `${name} is a ${role} with ${expYears} years of professional experience, currently returning to the workforce after a ${gapYears}-year career break.`,
      career_gap: {
        detected: true,
        years: gapYears,
        reasoning: `Career break between ${lastWorkingYear} and ${currentYear} for personal and family responsibilities.`,
      },
      market_readiness: {
        score: readinessScore,
        reason: `Strong foundational skills with identifiable gaps in high-demand modern technologies.`,
      },
      top_strengths: strongSkills,
      top_priorities: prioritySkills,
      ats_score: atsScore,
      resume_tips: ["Quantify your achievements with numbers", "Add missing projects section", "Include in-demand keywords"],
      professional_summary: `Results-driven ${role} with ${expYears} years of expertise in ${strongSkills.slice(0, 2).join(" and ")}.`,
      estimated_return_time: "8 Weeks",
      recommended_next_step: prioritySkills[0],
      overall_recommendation: "Your previous experience is highly valuable. Focus on the priority skills in the roadmap, strengthen your resume with the ATS recommendations, and apply to returnship programs with our matched employers.",
      roadmap: roadmapData,
    },
  };
}

function generateMockEmployers() {
  return COMPANIES.map((company) => ({
    id: faker.string.uuid(),
    name: company.name,
    logo: company.logo,
    industry: company.industry,
    location: faker.helpers.arrayElement(["Bengaluru", "Mumbai", "Hyderabad", "Pune", "Remote"]),
    compatibilityScore: faker.number.int({ min: 62, max: 98 }),
    hasReturnship: faker.datatype.boolean({ probability: 0.7 }),
    openRoles: faker.helpers.arrayElements(["Senior Engineer", "Data Analyst", "Product Manager", "UX Designer", "Business Analyst"], { min: 1, max: 3 }),
    description: `${company.name} is a leading ${company.industry} company committed to inclusive hiring and actively runs returnship programs for experienced professionals re-entering the workforce.`,
    returnshipDuration: faker.helpers.arrayElement(["6 Weeks", "3 Months", "6 Months"]),
    stipend: `₹${faker.number.int({ min: 50, max: 150 })}K/month`,
    tags: faker.helpers.arrayElements(["Returnship", "Flexible Work", "Remote-First", "Mentorship", "Training Budget", "Women-Led Teams"], { min: 2, max: 4 }),
  }));
}

function generateInterviewQuestion(category: "behavioral" | "technical" | "hr" = "behavioral") {
  const questions = INTERVIEW_QUESTIONS[category];
  return {
    id: faker.string.uuid(),
    category,
    question: faker.helpers.arrayElement(questions),
  };
}

function generateInterviewFeedback(category: string) {
  return {
    score: faker.number.int({ min: 55, max: 95 }),
    strengths: [
      "Clear and structured communication",
      "Relevant experience cited effectively",
      "Positive and confident tone",
    ],
    improvements: [
      "Could add more specific quantifiable metrics",
      "Expand on the outcome and lessons learned",
    ],
    model_answer: `A strong answer here would use the STAR method (Situation, Task, Action, Result) to clearly structure your response with a specific professional example from your past experience, concluding with a measurable outcome.`,
  };
}

let _server: ReturnType<typeof createServer> | undefined;

export function startMirage() {
  if (typeof window === "undefined") return;
  if (_server) {
    _server.shutdown();
  }

  _server = createServer({
    routes() {
      this.urlPrefix = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
      this.namespace = "/api";

      // ─── Resume Analysis ───────────────────────────────────────
      this.post("/upload-resume", () => {
        return {
          success: true,
          filename: "resume.pdf",
          data: generateMockAnalysis(),
        };
      });

      // ─── Employer Matching ─────────────────────────────────────
      this.get("/employers/matches", () => {
        return { success: true, employers: generateMockEmployers() };
      });

      // ─── Interview Coach ───────────────────────────────────────
      this.post("/interview/start", (schema, request) => {
        const body = JSON.parse(request.requestBody ?? "{}");
        const category = body.category ?? "behavioral";
        return {
          success: true,
          session_id: faker.string.uuid(),
          question: generateInterviewQuestion(category),
        };
      });

      this.post("/interview/answer", (schema, request) => {
        const body = JSON.parse(request.requestBody ?? "{}");
        const category = body.category ?? "behavioral";
        return {
          success: true,
          feedback: generateInterviewFeedback(category),
          next_question: generateInterviewQuestion(category),
        };
      });

      // ─── Health ────────────────────────────────────────────────
      this.get("/health", () => ({ status: "healthy (mirage)" }));

      // ─── Passthrough: Next.js internals ───────────────────────
      // Prevent Mirage from intercepting Next.js RSC navigation requests
      this.passthrough("http://localhost:3000/**");
      this.passthrough("http://localhost:3001/**");
    },
  });

  return _server;
}
