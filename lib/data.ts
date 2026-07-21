// ─── Portfolio data — single source of truth ────────────────────────────────

export const profile = {
  name: "Mohamed Ebrahim Elaraby",
  role: "AI & Full-Stack Engineer",
  tagline: "Building intelligent systems that live on your machine.",
  about:
    "Engineer focused on AI & LLM systems, full-stack development, and cybersecurity. I build production-grade multi-agent platforms, RAG pipelines and secure backends — end to end, from the model to the UI.",
  // ↓↓↓ حط لينكاتك الحقيقية هنا — دي الأماكن الوحيدة اللي محتاج تعدلها ↓↓↓
  email: "alaraby1856@gmail.com",
  github: "https://github.com/al3araby",
  linkedin: "https://www.linkedin.com/in/moelaraby1/",
  facebook: "https://www.facebook.com/el3araby",
  // WhatsApp: رقمك بالكود الدولي من غير + أو أصفار — مثال: https://wa.me/201012345678
  whatsapp: "https://wa.me/201090390942",
};

export const expertise = [
  {
    icon: "Bot",
    title: "AI & LLM Engineering",
    desc: "Multi-agent systems, RAG, local LLMs, prompt engineering and computer vision.",
  },
  {
    icon: "Code2",
    title: "Full-Stack Development",
    desc: "React, Next.js and FastAPI — fast, modern and type-safe from DB to pixel.",
  },
  {
    icon: "ShieldCheck",
    title: "Cybersecurity",
    desc: "Web security, penetration testing, network security and OSINT.",
  },
  {
    icon: "Database",
    title: "Backend & Databases",
    desc: "REST APIs, PostgreSQL, database design and authentication.",
  },
];

export const skillGroups = [
  {
    label: "Artificial Intelligence",
    skills: [
      "Machine Learning",
      "Deep Learning",
      "NLP",
      "LLMs",
      "AI Agents",
      "RAG",
      "Prompt Engineering",
      "Computer Vision",
    ],
  },
  {
    label: "Languages",
    skills: ["Python", "TypeScript", "JavaScript", "SQL", "C++", "C"],
  },
  {
    label: "Backend",
    skills: [
      "FastAPI",
      "REST APIs",
      "PostgreSQL",
      "Database Design",
      "Authentication",
    ],
  },
  {
    label: "Frontend",
    skills: ["React", "Next.js", "Tailwind CSS", "HTML5", "CSS3"],
  },
  {
    label: "AI Frameworks",
    skills: [
      "Hugging Face",
      "Ollama",
      "LiteLLM",
      "scikit-learn",
      "Pandas",
      "NumPy",
    ],
  },
  {
    label: "3D & Motion",
    skills: ["Three.js", "React Three Fiber", "Drei", "GSAP", "Framer Motion"],
  },
  {
    label: "Cybersecurity",
    skills: [
      "Web Security",
      "Penetration Testing",
      "Network Security",
      "OSINT",
      "Burp Suite",
      "Nmap",
    ],
  },
  {
    label: "Networking",
    skills: ["Cisco", "VLAN", "OSPF", "Routing & Switching"],
  },
  {
    label: "Tools",
    skills: ["Git", "GitHub", "Docker", "Linux", "VS Code"],
  },
];

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  tech: string[];
  highlights?: string[];
  featured?: boolean;
  icon: string;
};

export const projects: Project[] = [
  {
    id: "nilepi",
    title: "NilePi",
    subtitle: "Multi-Agent AI Platform — 100% Local",
    desc: "A production-oriented multi-agent AI assistant that runs fully offline on a consumer laptop. Understands Arabic & English, answers from your documents with exact source & page, writes runnable code, generates images in under a second and remembers you across sessions.",
    tech: [
      "Python",
      "FastAPI",
      "Ollama",
      "LiteLLM",
      "Qwen",
      "PostgreSQL",
      "React",
      "Next.js",
    ],
    highlights: [
      "389 passing tests",
      "MRR 0.967 · hit@3 100%",
      "0.9s image generation",
      "Multi-agent + RAG + OCR + Vision",
    ],
    featured: true,
    icon: "Waves",
  },
  {
    id: "mwasalat-ai",
    title: "Mwasalat AI",
    subtitle: "Smart Transportation Platform — Egypt",
    desc: "A smart transportation platform recommending the fastest, most cost-effective routes across Egypt. Full-stack Node.js app with backend, frontend, database, an admin panel with usage stats and an integrated chatbot — hardened against SQL Injection, XSS and CSRF.",
    tech: [
      "Node.js",
      "Express",
      "SQL",
      "Chatbot",
      "Admin Panel",
      "Security Hardening",
    ],
    highlights: [
      "Route optimization",
      "Admin panel + usage stats",
      "Integrated chatbot",
      "SQLi / XSS / CSRF defended",
    ],
    icon: "Bus",
  },
  {
    id: "web-recon",
    title: "Web Recon Framework",
    subtitle: "Automated Security Assessment",
    desc: "Automated web reconnaissance and security assessment framework chaining Subfinder, Katana, Dalfox, SecretFinder and LinkFinder — subdomain discovery, endpoint enumeration, XSS/CSRF detection and secret exposure during pentesting engagements.",
    tech: [
      "Subfinder",
      "Katana",
      "Dalfox",
      "SecretFinder",
      "LinkFinder",
      "Bash / Python",
    ],
    highlights: [
      "Subdomain discovery",
      "Endpoint enumeration",
      "XSS / CSRF detection",
      "Secret exposure hunting",
    ],
    icon: "Radar",
  },
  {
    id: "crime-prediction",
    title: "AI Crime Prediction",
    subtitle: "Machine Learning Classification",
    desc: "Supervised ML system predicting crime categories — full pipeline from data cleaning and feature engineering to PCA, model comparison and performance evaluation.",
    tech: [
      "Python",
      "scikit-learn",
      "Logistic Regression",
      "SVM",
      "Decision Tree",
      "Neural Network",
    ],
    icon: "BrainCircuit",
  },
  {
    id: "maze-solver",
    title: "AI Maze Solver",
    subtitle: "Search Algorithms Visualizer",
    desc: "Interactive visualization platform for 8 classical search algorithms — watch BFS, DFS, UCS, Greedy, A*, Beam Search, Hill Climbing and IDA* race through mazes.",
    tech: ["Python", "BFS / DFS / UCS", "A* / IDA*", "Beam Search"],
    icon: "Route",
  },
  {
    id: "cpu-16bit",
    title: "16-bit CPU Design",
    subtitle: "Hardwired CPU from scratch",
    desc: "Complete 16-bit hardwired CPU: ALU, registers, program counter, control unit, instruction register and a full fetch-decode-execute cycle.",
    tech: ["Logisim Evolution", "Digital Logic", "Computer Architecture"],
    icon: "Cpu",
  },
  {
    id: "university-network",
    title: "Enterprise University Network",
    subtitle: "Cisco enterprise-scale design",
    desc: "Enterprise university network with VLANs, OSPF routing, multi-layer switching, firewall, IDS/IPS, NAC and full network segmentation.",
    tech: ["Cisco Packet Tracer", "VLAN", "OSPF", "IDS/IPS", "NAC"],
    icon: "Network",
  },
];

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  date: string; // display
  sortDate: string; // ISO for timeline ordering
  image: string | null;
};

export const certificates: Certificate[] = [
  {
    id: "hf-agents",
    title: "AI Agents Fundamentals",
    issuer: "Hugging Face",
    date: "Jul 11, 2026",
    sortDate: "2026-07-11",
    image: "/certificates/hf-agents.jpeg",
  },
  {
    id: "hackerrank-sql",
    title: "SQL (Intermediate)",
    issuer: "HackerRank",
    date: "Jul 20, 2026",
    sortDate: "2026-07-20",
    image: "/certificates/hackerrank-sql.jpeg",
  },
  {
    id: "kaggle-intro-ml",
    title: "Intro to Machine Learning",
    issuer: "Kaggle",
    date: "Jul 12, 2026",
    sortDate: "2026-07-12",
    image: "/certificates/kaggle-intro-ml.jpeg",
  },
  {
    id: "cisco-modern-ai",
    title: "Introduction to Modern AI",
    issuer: "Cisco Networking Academy",
    date: "Jul 12, 2026",
    sortDate: "2026-07-12",
    image: "/certificates/cisco-modern-ai.jpeg",
  },
  {
    id: "ibm-ai-fundamentals",
    title: "Artificial Intelligence Fundamentals",
    issuer: "IBM SkillsBuild",
    date: "Jul 10, 2026",
    sortDate: "2026-07-10",
    image: "/certificates/ibm-ai-fundamentals.jpeg",
  },
  {
    id: "ibm-language-vision",
    title: "AI Fundamentals: Language & Vision in AI",
    issuer: "IBM SkillsBuild",
    date: "Jul 11, 2026",
    sortDate: "2026-07-11",
    image: "/certificates/ibm-language-vision.jpeg",
  },
  {
    id: "ibm-cybersecurity",
    title: "Cybersecurity Fundamentals",
    issuer: "IBM SkillsBuild",
    date: "Jul 10, 2026",
    sortDate: "2026-07-10",
    image: "/certificates/ibm-cybersecurity.jpeg",
  },
  {
    id: "cisco-intro-cybersecurity",
    title: "Introduction to Cybersecurity",
    issuer: "Cisco Networking Academy",
    date: "Jun 16, 2026",
    sortDate: "2026-06-16",
    image: "/certificates/cisco-intro-cybersecurity.jpeg",
  },
  {
    id: "ms-ai-concepts",
    title: "AI Concepts for Developers & Technology Professionals",
    issuer: "Microsoft",
    date: "2026",
    sortDate: "2026-05-01",
    image: null,
  },
];

export type TimelineEvent = {
  id: string;
  date: string;
  sortDate: string;
  title: string;
  org: string;
  kind: "certificate" | "project";
  desc?: string;
};

export const timeline: TimelineEvent[] = [
  {
    id: "t-nilepi",
    date: "2026",
    sortDate: "2026-07-21",
    title: "NilePi — Multi-Agent AI Platform",
    org: "Flagship project",
    kind: "project" as const,
    desc: "Fully local multi-agent assistant: RAG with exact sources, vision, code generation, image generation — 389 passing tests.",
  },
  ...certificates
    .filter((c) => c.id !== "ms-ai-concepts")
    .map((c) => ({
      id: `t-${c.id}`,
      date: c.date,
      sortDate: c.sortDate,
      title: c.title,
      org: c.issuer,
      kind: "certificate" as const,
    })),
  {
    id: "t-ms-ai",
    date: "2026",
    sortDate: "2026-05-01",
    title: "AI Concepts for Developers & Technology Professionals",
    org: "Microsoft",
    kind: "certificate" as const,
  },
  {
    id: "t-mwasalat",
    date: "2026",
    sortDate: "2026-06-01",
    title: "Mwasalat AI — Smart Transportation Platform",
    org: "Full-stack project",
    kind: "project" as const,
    desc: "Route recommendations across Egypt: Node.js backend, admin panel, chatbot — SQLi/XSS/CSRF defended.",
  },
  {
    id: "t-web-recon",
    date: "2026",
    sortDate: "2026-05-15",
    title: "Web Recon Framework",
    org: "Security project",
    kind: "project" as const,
    desc: "Automated recon: Subfinder, Katana, Dalfox, SecretFinder, LinkFinder.",
  },
  {
    id: "t-network",
    date: "2025",
    sortDate: "2025-12-01",
    title: "Enterprise University Network",
    org: "Networking project",
    kind: "project" as const,
    desc: "Enterprise-scale Cisco design: VLANs, OSPF, IDS/IPS, NAC.",
  },
  {
    id: "t-cpu",
    date: "2025",
    sortDate: "2025-06-01",
    title: "16-bit CPU Design",
    org: "Architecture project",
    kind: "project" as const,
    desc: "Complete hardwired CPU in Logisim Evolution.",
  },
].sort((a, b) => (a.sortDate < b.sortDate ? 1 : -1));

// ─── Code typed on the 3D laptop screen ─────────────────────────────────────
export const heroCode = `# NilePi — Multi-Agent AI Platform
from fastapi import FastAPI
from nilepi.agents import Orchestrator, RAGAgent, VisionAgent

app = FastAPI(title="NilePi")
brain = Orchestrator(
    agents=[RAGAgent(), VisionAgent()],
    memory="long_term",
    local_only=True,   # zero data leaves the machine
)

@app.post("/chat")
async def chat(msg: str):
    plan = brain.route(msg)          # pick the right agent
    answer = await plan.run(msg)     # RAG w/ exact sources
    return {"answer": answer,
            "source": answer.citation}

# 389 tests passed ✅  MRR 0.967 🎯
if __name__ == "__main__":
    brain.wake()  # يلا بينا 🚀`;
