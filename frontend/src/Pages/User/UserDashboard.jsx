/**
 * Dashboard.jsx
 *
 * Requirements:
 *  - TailwindCSS installed & configured
 *  - lucide-react installed (npm i lucide-react)
 *  - Add Inter/Roboto to index.html or import via CSS:
 *
 * Example index.html head entry:
 * <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet">
 *
 * Then ensure your tailwind config includes `fontFamily: { sans: ['Inter', 'ui-sans-serif', ...] }`
 */

import React, { useState } from "react";
import {
  Bell,
  Menu,
  ArrowRight,
  PieChart,
  Compass,
  Target,
  Upload,
  Clipboard,
  FileText,
  User,
} from "lucide-react";

/* -------------------------
   Reusable UI Components
   ------------------------- */

const PRIMARY = "#4A90E2";
const SECONDARY = "#F5F5F5";
const ACCENT = "#FFA500";

const IconWrapper = ({ children }) => (
  <div className="w-12 h-12 rounded-lg flex items-center justify-center shadow-sm" style={{ background: "#fff" }}>
    {children}
  </div>
);

const Button = ({ children, variant = "primary", onClick, className = "" }) => {
  if (variant === "primary") {
    return (
      <button
        onClick={onClick}
        className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-white font-semibold shadow-md transform hover:-translate-y-0.5 transition ${className}`}
        style={{ background: PRIMARY }}
      >
        {children}
      </button>
    );
  }
  if (variant === "ghost") {
    return (
      <button
        onClick={onClick}
        className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-gray-800 bg-white border hover:bg-gray-50 transition ${className}`}
      >
        {children}
      </button>
    );
  }
  if (variant === "accent") {
    return (
      <button
        onClick={onClick}
        className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-white font-semibold shadow-md transform hover:-translate-y-0.5 transition ${className}`}
        style={{ background: ACCENT }}
      >
        {children}
      </button>
    );
  }
  return null;
};

/* -------------------------
   FeatureCard
   ------------------------- */
const FeatureCard = ({ icon, title, body, gradientFrom, gradientTo }) => {
  return (
    <div
      className="p-6 rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
      style={{
        background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
        color: "#06213A",
      }}
    >
      <div className="flex items-start gap-4">
        <div className="bg-white/80 rounded-lg p-3 shadow-sm">
          {icon}
        </div>
        <div>
          <h4 className="font-semibold text-lg">{title}</h4>
          <p className="mt-2 text-sm text-slate-700">{body}</p>
        </div>
      </div>
    </div>
  );
};

/* -------------------------
   TimelineStep
   ------------------------- */
const TimelineStep = ({ number, title, subtitle, isLast }) => {
  return (
    <div className="flex flex-col items-center text-center relative">
      {/* circle */}
      <div className="z-10">
        <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center font-semibold text-indigo-700">
          {number}
        </div>
      </div>
      {/* box */}
      <div className="mt-4 bg-white rounded-xl p-4 shadow-sm w-52">
        <h5 className="font-semibold text-sm">{title}</h5>
        <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
      </div>

      {/* connector line (desktop) */}
      {!isLast && (
        <div className="hidden lg:block absolute top-6 right-[-50%] w-[100%] h-0.5 bg-indigo-200 -z-0"></div>
      )}
    </div>
  );
};

/* -------------------------
   TestimonialCard
   ------------------------- */
const TestimonialCard = ({ person }) => {
  return (
    <div className="p-6 rounded-2xl backdrop-blur-md bg-white/30 shadow-lg border border-white/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-indigo-700 font-bold">
          {person.initials}
        </div>
        <div>
          <div className="font-semibold">{person.name}</div>
          <div className="text-xs text-slate-100">{person.role}</div>
        </div>
      </div>
      <p className="text-sm text-white/90">“{person.quote}”</p>
    </div>
  );
};

/* -------------------------
   DATA (placeholder)
   ------------------------- */
const metrics = {
  readiness: 78,
  topSkills: ["React", "Node.js", "Data Structures"],
  growth: "12% MoM",
};

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Computer Science Student",
    initials: "SJ",
    quote:
      "The platform helped me identify strengths I didn't know I had — landed an internship within weeks.",
  },
  {
    name: "Michael Chen",
    role: "Business Graduate",
    initials: "MC",
    quote:
      "Career mapping opened new, exciting paths I hadn't considered.",
  },
  {
    name: "Priya Patel",
    role: "Engineering Professional",
    initials: "PP",
    quote:
      "Focused recommendations helped me upskill and get promoted.",
  },
];

/* -------------------------
   Main Dashboard
   ------------------------- */
const UserDashboard = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // placeholder user
  const user = { name: "Alex Turner", role: "Product Manager" };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,_#eef6ff_100%)] font-sans text-slate-800">
      {/* --------- Header / Navbar ---------- */}
      <header className="fixed w-full top-0 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-4">
              <div className="text-xl font-extrabold flex items-center gap-2">
                <div
                  className="w-9 h-9 rounded-md flex items-center justify-center text-white shadow"
                  style={{ background: PRIMARY }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 12h18" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 6h18" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span style={{ color: PRIMARY }}>SkillUp</span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-4">
              <a className="text-sm font-medium hover:text-slate-600" href="#features">Features</a>
              <a className="text-sm font-medium hover:text-slate-600" href="#how">How it Works</a>
              <a className="text-sm font-medium hover:text-slate-600" href="#testimonials">Testimonials</a>
            </nav>

            <div className="flex items-center gap-3">
              <button
                className="p-2 rounded-full hover:bg-white/60 transition relative"
                aria-label="notifications"
              >
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 border border-white" />
              </button>

              <div className="hidden md:flex items-center gap-3 bg-white rounded-full px-3 py-1 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-slate-700">
                  {user.name.split(" ").map(n => n[0]).slice(0,2).join("")}
                </div>
                <div className="text-sm">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-slate-500">{user.role}</div>
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(p => !p)}
                className="ml-1 md:hidden p-2 rounded-md bg-white shadow"
                aria-label="menu"
              >
                <Menu size={18} />
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white rounded-xl shadow p-3">
              <a className="block py-2 px-2 rounded hover:bg-gray-50" href="#features">Features</a>
              <a className="block py-2 px-2 rounded hover:bg-gray-50" href="#how">How It Works</a>
              <a className="block py-2 px-2 rounded hover:bg-gray-50" href="#testimonials">Testimonials</a>
            </div>
          )}
        </div>
      </header>

      {/* ---------- Page content ---------- */}
      <main className="pt-28">
        {/* ---------- Hero ---------- */}
        <section className="px-4">
          <div className="max-w-4xl mx-auto rounded-2xl p-8 md:p-12 bg-white shadow-xl relative overflow-hidden">
            {/* decorative blobs */}
            <div className="absolute -right-20 -top-20 w-56 h-56 rounded-full opacity-20" style={{ background: PRIMARY }} />
            <div className="absolute -left-16 -bottom-16 w-40 h-40 rounded-full opacity-20" style={{ background: ACCENT }} />

            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                Discover Your <span style={{ color: PRIMARY }}>Professional Potential</span>
              </h1>
              <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
                AI-powered applicant tracking and career assessment tools to help you find, evaluate, and hire talent faster — or to discover your own career roadmap.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Button variant="primary">
                  Get Started <ArrowRight size={16} />
                </Button>
                <Button variant="ghost">Learn More</Button>
              </div>

              {/* feature badges */}
              <div className="mt-6 flex flex-wrap justify-center gap-3 items-center">
                <div className="px-4 py-2 rounded-full bg-white shadow flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md flex items-center justify-center" style={{ background: PRIMARY }}>
                    <PieChart size={18} color="white" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Readiness</div>
                    <div className="font-semibold"> {metrics.readiness}%</div>
                  </div>
                </div>

                <div className="px-4 py-2 rounded-full bg-white shadow flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md flex items-center justify-center" style={{ background: ACCENT }}>
                    <Compass size={18} color="white" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Top Skills</div>
                    <div className="font-semibold">{metrics.topSkills.join(", ")}</div>
                  </div>
                </div>

                <div className="px-4 py-2 rounded-full bg-white shadow flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md flex items-center justify-center" style={{ background: "#34D399" }}>
                    <Target size={18} color="white" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Growth</div>
                    <div className="font-semibold">{metrics.growth}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Feature Cards ---------- */}
        <section id="features" className="mt-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Platform Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard
                icon={<PieChart size={20} color="#4A90E2" />}
                title="Skill Analysis"
                body="Discover candidate strengths and gaps with our deep-skill analysis and scoring."
                gradientFrom="#E6F0FF"
                gradientTo="#DCEEFF"
              />
              <FeatureCard
                icon={<Compass size={20} color="#7C3AED" />}
                title="Career Path Mapping"
                body="Map candidates to ideal roles & career progression with AI-driven recommendations."
                gradientFrom="#FCF7E6"
                gradientTo="#FFF4E0"
              />
              <FeatureCard
                icon={<Target size={20} color="#2563EB" />}
                title="Personalized Goals"
                body="Create role-specific milestones and track candidate progress through assessments."
                gradientFrom="#E6FAF1"
                gradientTo="#DFF7EE"
              />
            </div>
          </div>
        </section>

        {/* ---------- Timeline / Steps ---------- */}
        <section id="how" className="mt-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">How it Works</h2>

            {/* Vertical on mobile, horizontal on desktop */}
            <div className="relative">
              {/* connecting line for desktop */}
              <div className="hidden lg:block absolute left-0 right-0 top-10 h-1 bg-indigo-100"></div>

              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <TimelineStep number={1} title="Upload Resume" subtitle="Submit candidate's resume for parsing." />
                <TimelineStep number={2} title="Take Assessment" subtitle="Assess skills, aptitude & culture fit." />
                <TimelineStep number={3} title="Get Report" subtitle="Comprehensive scorecards & insights." />
                <TimelineStep number={4} title="Take Action" subtitle="Interview, hire, or provide learning paths." isLast />
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Testimonials ---------- */}
        <section id="testimonials" className="mt-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, idx) => (
                <TestimonialCard key={idx} person={t} />
              ))}
            </div>
          </div>
        </section>

        {/* ---------- CTA ---------- */}
        <section className="mt-16 px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-10 text-center shadow-xl">
            <h3 className="text-2xl font-bold">Ready to discover the best talent — or your next role?</h3>
            <p className="mt-3 text-slate-600">Start free. Upgrade later for advanced applicant insights and team collaboration.</p>
            <div className="mt-6 flex justify-center gap-4">
              <Button variant="primary">Get Started</Button>
              <Button variant="ghost">Book a demo</Button>
            </div>
          </div>
        </section>

        {/* ---------- Footer ---------- */}
        <footer className="mt-20 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-xl font-bold" style={{ color: PRIMARY }}>SkillUp</div>
              <p className="mt-3 text-sm text-slate-300">Guiding hiring and careers with data-driven insights.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Resources</h4>
              <ul className="text-sm text-slate-400 space-y-2">
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Guides</a></li>
                <li><a href="#" className="hover:text-white">Webinars</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="text-sm text-slate-400 space-y-2">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="text-sm text-slate-400 space-y-2">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 py-6 text-center text-slate-400 text-sm">
            © {new Date().getFullYear()} SkillUp — All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  );
};

export default UserDashboard;
