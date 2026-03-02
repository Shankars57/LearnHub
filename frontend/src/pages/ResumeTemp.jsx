import React from "react";
import { Briefcase, CheckSquare, ExternalLink, FileText, Sparkles } from "lucide-react";

const resumeTemplates = [
  {
    title: "Fresher Software Resume",
    tag: "Entry Level",
    summary:
      "Simple one-page format focused on skills, projects, and quantified achievements.",
    sections: [
      "Header + Links (GitHub, LinkedIn, Portfolio)",
      "Education and coursework highlights",
      "Technical skills grouped by category",
      "2-3 impact driven projects with metrics",
    ],
    image:
      "https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "Frontend Developer Resume",
    tag: "Web Focus",
    summary:
      "Best for React/Vue devs with product work, UI optimization, and collaboration stories.",
    sections: [
      "Short profile summary with years of experience",
      "Core stack + tooling + testing skills",
      "Work/project experience with measurable outcomes",
      "Open-source, hackathons, and certifications",
    ],
    image:
      "https://images.pexels.com/photos/4974922/pexels-photo-4974922.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "Backend / API Engineer Resume",
    tag: "Systems Focus",
    summary:
      "Highlights architecture decisions, API design, scaling wins, and reliability ownership.",
    sections: [
      "System/API expertise summary",
      "Infra + DB + observability tools",
      "Performance and cost optimization bullets",
      "Security and reliability achievements",
    ],
    image:
      "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "Data / ML Resume",
    tag: "Analytics Focus",
    summary:
      "Ideal for ML/data roles with modeling outcomes, experiment tracking, and production impact.",
    sections: [
      "Domain summary and project scope",
      "Modeling + Python + SQL toolkit",
      "Experiment metrics and validation strategy",
      "Deployed pipelines and business impact",
    ],
    image:
      "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

const actionWords = [
  "Designed",
  "Implemented",
  "Optimized",
  "Automated",
  "Refactored",
  "Led",
  "Delivered",
  "Shipped",
];

const resourceLinks = [
  { label: "Overleaf Resume Templates", url: "https://www.overleaf.com/latex/templates/tagged/cv" },
  { label: "Canva Resume Design Library", url: "https://www.canva.com/resumes/templates/" },
  { label: "Google Docs Resume Templates", url: "https://docs.google.com/document/u/0/" },
  { label: "GitHub Education Resume PDF", url: "https://education.github.com/git-cheat-sheet-education.pdf" },
];

const ResumeTemp = () => {
  return (
    <section className="theme-page pt-24 pb-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="theme-card rounded-3xl p-6 sm:p-9 relative overflow-hidden">
          <div className="absolute -top-16 -right-8 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-16 left-0 w-64 h-64 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="relative">
            <p className="theme-chip inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={14} />
              ATS Friendly Resume Zone
            </p>
            <h1
              className="mt-3 text-3xl sm:text-5xl font-extrabold"
              style={{ fontFamily: "Roboto Mono, monospace" }}
            >
              Resume Templates & Content Guide
            </h1>
            <p className="theme-muted mt-3 max-w-3xl leading-relaxed">
              Use these templates as structure references and customize bullet points
              with measurable impact. Keep your resume concise, keyword-aligned,
              and role-specific.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {resumeTemplates.map((template) => (
            <article key={template.title} className="theme-card rounded-3xl overflow-hidden">
              <img
                src={template.image}
                alt={template.title}
                className="h-52 w-full object-cover"
                loading="lazy"
              />
              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Briefcase size={20} className="theme-accent" />
                    {template.title}
                  </h2>
                  <span className="theme-chip px-3 py-1 rounded-md text-xs font-semibold">
                    {template.tag}
                  </span>
                </div>

                <p className="theme-muted mt-3 leading-relaxed">{template.summary}</p>

                <ul className="mt-4 space-y-2">
                  {template.sections.map((sectionPoint) => (
                    <li key={sectionPoint} className="text-sm flex items-start gap-2">
                      <CheckSquare size={16} className="mt-0.5 theme-accent" />
                      <span>{sectionPoint}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="theme-surface rounded-3xl p-5 sm:p-7">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <FileText size={20} className="theme-accent" />
              ATS Checklist Before Applying
            </h3>
            <div className="mt-4 space-y-3">
              <div className="theme-card rounded-2xl p-4 text-sm">
                Keep layout single-column and avoid overly graphic-heavy designs.
              </div>
              <div className="theme-card rounded-2xl p-4 text-sm">
                Match keywords from the job description to your skill/project bullets.
              </div>
              <div className="theme-card rounded-2xl p-4 text-sm">
                Use quantified impact: percentages, load time reduction, user numbers.
              </div>
              <div className="theme-card rounded-2xl p-4 text-sm">
                Save as PDF and verify links to GitHub, portfolio, and LinkedIn.
              </div>
            </div>
          </section>

          <section className="theme-surface rounded-3xl p-5 sm:p-7">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles size={20} className="theme-accent" />
              High-Impact Action Words
            </h3>
            <div className="flex flex-wrap gap-2 mt-4">
              {actionWords.map((word) => (
                <span
                  key={word}
                  className="theme-chip px-3 py-1 rounded-full text-sm font-semibold"
                >
                  {word}
                </span>
              ))}
            </div>
            <div className="mt-6 space-y-2">
              {resourceLinks.map((resource) => (
                <a
                  key={resource.label}
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="theme-btn-secondary rounded-lg px-3 py-2 text-sm font-medium flex items-center justify-between"
                >
                  <span>{resource.label}</span>
                  <ExternalLink size={15} />
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default ResumeTemp;
