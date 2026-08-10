"""
skill_taxonomy.py
----------------------------------------------------------------------
Skill Synonym & Category Taxonomy

Solves the core matching problem: a candidate who writes "ML" on their
resume has the same skill as someone who writes "Machine Learning" or
"Deep Learning". Naive set-intersection misses these — this module
fixes that.

How it works:
    - SKILL_GROUPS maps a canonical label to a frozenset of aliases.
    - expand_skills(skills) takes any skill list and returns an expanded
      set containing every alias for every skill the candidate mentioned.
    - match_score(candidate_skills, job_stack) returns a 0.0-1.0 ratio
      using the expanded sets, giving much higher recall than raw intersection.

Used by:
    - employer_compatibility.py  (rule-based fallback scorer)
    - skill_analyzer.py          (gap analysis)
----------------------------------------------------------------------
"""

from typing import List, Set

# ---------------------------------------------------------------------------
# Taxonomy: canonical name → frozenset of all equivalent terms (lowercase)
# ---------------------------------------------------------------------------
SKILL_GROUPS: dict[str, frozenset] = {
    # ─── Languages ──────────────────────────────────────────────────────────
    "python": frozenset({"python", "python3", "py", "django", "flask", "fastapi",
                          "pandas", "numpy", "scipy", "streamlit"}),
    "java": frozenset({"java", "java 8", "java 11", "java 17", "spring",
                        "spring boot", "maven", "gradle", "j2ee", "jvm"}),
    "javascript": frozenset({"javascript", "js", "es6", "es2015", "ecmascript",
                               "node", "node.js", "nodejs", "react", "react.js",
                               "reactjs", "vue", "vue.js", "angular", "next.js",
                               "nextjs", "typescript", "ts"}),
    "typescript": frozenset({"typescript", "ts", "tsx"}),
    "c++": frozenset({"c++", "cpp", "c/c++", "stl"}),
    "c#": frozenset({"c#", "csharp", ".net", "dotnet", "asp.net", "blazor"}),
    "go": frozenset({"go", "golang"}),
    "rust": frozenset({"rust", "rust-lang"}),
    "r": frozenset({"r", "r language", "rlang", "ggplot", "tidyverse"}),
    "scala": frozenset({"scala", "akka", "spark scala"}),
    "kotlin": frozenset({"kotlin", "android kotlin"}),
    "swift": frozenset({"swift", "swiftui", "ios development"}),
    "php": frozenset({"php", "laravel", "symfony"}),
    "ruby": frozenset({"ruby", "ruby on rails", "rails"}),
    "shell": frozenset({"shell", "bash", "zsh", "sh", "shell scripting"}),
    "abap": frozenset({"abap", "sap abap", "sap development"}),

    # ─── Machine Learning & AI ───────────────────────────────────────────────
    "machine learning": frozenset({"machine learning", "ml", "deep learning", "dl",
                                    "neural networks", "neural network", "ai", "artificial intelligence",
                                    "nlp", "natural language processing", "computer vision",
                                    "reinforcement learning", "supervised learning",
                                    "unsupervised learning", "generative ai", "gen ai",
                                    "llm", "large language models", "transformers",
                                    "scikit-learn", "sklearn", "pytorch", "tensorflow",
                                    "keras", "xgboost", "lightgbm", "hugging face"}),

    # ─── Data & Analytics ────────────────────────────────────────────────────
    "data analysis": frozenset({"data analysis", "data analytics", "analytics",
                                  "data analyst", "business intelligence", "bi",
                                  "excel", "google sheets", "pivot tables",
                                  "sql", "mysql", "postgresql", "sqlite", "oracle sql",
                                  "power bi", "powerbi", "tableau", "looker",
                                  "qlik", "google data studio", "metabase",
                                  "pandas", "numpy", "jupyter", "jupyter notebook"}),
    "sql": frozenset({"sql", "mysql", "postgresql", "postgres", "sqlite",
                       "oracle", "pl/sql", "t-sql", "tsql", "ms sql server",
                       "redshift", "bigquery", "presto", "hive sql"}),
    "big data": frozenset({"big data", "hadoop", "spark", "apache spark", "pyspark",
                            "hive", "kafka", "apache kafka", "flink", "storm",
                            "databricks", "delta lake", "airflow", "apache airflow",
                            "luigi", "dbt"}),

    # ─── Cloud ───────────────────────────────────────────────────────────────
    "aws": frozenset({"aws", "amazon web services", "ec2", "s3", "lambda",
                       "rds", "dynamodb", "cloudformation", "sagemaker",
                       "cloud", "cloud computing"}),
    "azure": frozenset({"azure", "microsoft azure", "azure devops", "azure functions",
                         "azure ml", "azure databricks", "arm templates",
                         "cloud", "cloud computing"}),
    "gcp": frozenset({"gcp", "google cloud", "google cloud platform",
                       "bigquery", "cloud run", "vertex ai", "google kubernetes engine",
                       "cloud", "cloud computing"}),
    "cloud": frozenset({"cloud", "cloud computing", "aws", "azure", "gcp",
                          "multi-cloud", "cloud architecture", "serverless",
                          "iaas", "paas", "saas"}),

    # ─── DevOps & Infrastructure ─────────────────────────────────────────────
    "devops": frozenset({"devops", "devsecops", "ci/cd", "ci cd", "continuous integration",
                          "continuous delivery", "continuous deployment",
                          "jenkins", "github actions", "gitlab ci", "circle ci",
                          "docker", "kubernetes", "k8s", "helm", "terraform",
                          "ansible", "chef", "puppet", "prometheus", "grafana",
                          "elk stack", "site reliability engineering", "sre"}),
    "docker": frozenset({"docker", "docker compose", "dockerfile", "container",
                          "containerization", "podman"}),
    "kubernetes": frozenset({"kubernetes", "k8s", "helm", "kubectl", "eks", "aks", "gke"}),
    "terraform": frozenset({"terraform", "infrastructure as code", "iac",
                              "pulumi", "cloudformation"}),

    # ─── Databases ───────────────────────────────────────────────────────────
    "databases": frozenset({"sql", "nosql", "mysql", "postgresql", "mongodb",
                              "redis", "cassandra", "dynamodb", "firebase",
                              "elasticsearch", "neo4j", "database design",
                              "database administration", "dba"}),

    # ─── Web & APIs ──────────────────────────────────────────────────────────
    "web development": frozenset({"web development", "frontend", "backend", "fullstack",
                                   "full stack", "rest api", "restful", "graphql",
                                   "html", "css", "sass", "less", "tailwind",
                                   "bootstrap", "responsive design", "pwa"}),

    # ─── Product & Design ────────────────────────────────────────────────────
    "product management": frozenset({"product management", "product manager", "pm",
                                      "product owner", "po", "agile", "scrum",
                                      "kanban", "jira", "confluence", "roadmapping",
                                      "user stories", "backlog grooming"}),
    "ux design": frozenset({"ux", "ux design", "ui design", "ui/ux", "figma",
                              "sketch", "adobe xd", "invision", "user research",
                              "usability testing", "wireframing", "prototyping",
                              "design thinking"}),

    # ─── Enterprise & Consulting ─────────────────────────────────────────────
    "sap": frozenset({"sap", "sap hana", "sap s/4hana", "sap erp", "abap",
                       "sap fi", "sap mm", "sap sd", "sap basis",
                       "sap fiori", "sap btp"}),
    "salesforce": frozenset({"salesforce", "salesforce crm", "salesforce cloud",
                               "apex", "visualforce", "lightning", "soql",
                               "mulesoft", "salesforce admin", "salesforce developer"}),

    # ─── Finance / Domain ────────────────────────────────────────────────────
    "financial analysis": frozenset({"financial analysis", "financial modelling",
                                      "financial modeling", "excel", "valuation",
                                      "dcf", "investment banking", "accounting",
                                      "risk management", "risk analytics",
                                      "compliance", "audit", "credit analysis"}),

    # ─── Project / Process ───────────────────────────────────────────────────
    "project management": frozenset({"project management", "project manager",
                                      "pmp", "prince2", "agile", "scrum",
                                      "kanban", "waterfall", "stakeholder management",
                                      "jira", "ms project", "asana", "trello"}),
    "agile": frozenset({"agile", "scrum", "kanban", "sprint", "retrospective",
                          "standup", "safe", "scaled agile", "lean"}),

    # ─── Networking / Security ───────────────────────────────────────────────
    "networking": frozenset({"networking", "network engineer", "tcp/ip", "dns",
                               "routing", "switching", "firewall", "vpn",
                               "cisco", "juniper", "ccna", "ccnp"}),
    "cybersecurity": frozenset({"cybersecurity", "security", "infosec",
                                  "information security", "penetration testing",
                                  "pentest", "ethical hacking", "siem",
                                  "soc", "vulnerability assessment",
                                  "devsecops", "zero trust"}),
}


# ---------------------------------------------------------------------------
# Build a fast lookup: any lowercase alias → canonical group name
# ---------------------------------------------------------------------------
_ALIAS_TO_CANONICAL: dict[str, str] = {}
for _canonical, _aliases in SKILL_GROUPS.items():
    for _alias in _aliases:
        _ALIAS_TO_CANONICAL[_alias] = _canonical


def _normalise(skill: str) -> str:
    return skill.lower().strip()


def expand_skills(skills: List[str]) -> Set[str]:
    """
    Given a list of skills (as the candidate typed them), return an
    expanded set of all canonical group names + original aliases that
    cover the same semantic territory.

    Example:
        expand_skills(["ML", "AWS", "Django"])
        → {"machine learning", "aws", "cloud", "python", "ml", "django", ...}
    """
    expanded: Set[str] = set()
    for skill in skills:
        norm = _normalise(skill)
        expanded.add(norm)
        canonical = _ALIAS_TO_CANONICAL.get(norm)
        if canonical:
            expanded.add(canonical)
            # Add all aliases of that canonical group for maximum recall
            expanded.update(_normalise(a) for a in SKILL_GROUPS[canonical])
    return expanded


def match_score(candidate_skills: List[str], job_stack: List[str]) -> float:
    """
    Return a 0.0–1.0 match ratio between the candidate's skills and the
    job's tech stack, using taxonomy-expanded matching.

    0.0 = no overlap at all
    1.0 = every candidate skill is represented in the job stack
    """
    if not candidate_skills or not job_stack:
        return 0.0

    expanded_candidate = expand_skills(candidate_skills)
    expanded_job = expand_skills(job_stack)

    overlap = expanded_candidate & expanded_job
    return len(overlap) / len(expanded_candidate)


def find_skill_gaps(candidate_skills: List[str], job_stack: List[str]) -> List[str]:
    """
    Return job stack skills that the candidate does NOT cover,
    after taxonomy expansion.  Returns original job stack terms
    (not expanded aliases) for human-readable output.
    """
    expanded_candidate = expand_skills(candidate_skills)
    gaps = []
    for skill in job_stack:
        norm = _normalise(skill)
        canonical = _ALIAS_TO_CANONICAL.get(norm, norm)
        if norm not in expanded_candidate and canonical not in expanded_candidate:
            gaps.append(skill)
    return gaps
