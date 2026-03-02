import React from "react";
import { ArrowUpRight, Compass, Flag, Target } from "lucide-react";

const roadmapTracks = [
  {
    title: "Frontend Engineer",
    duration: "16 Weeks",
    focus: ["HTML/CSS mastery", "React ecosystem", "Performance", "Testing"],
    project: "Build a production-style learning dashboard with auth + analytics.",
    links: [
      { label: "Frontend Roadmap", url: "https://roadmap.sh/frontend" },
      { label: "React Docs", url: "https://react.dev/" },
      { label: "Web Performance", url: "https://web.dev/performance/" },
    ],
    image:
      "https://images.pexels.com/photos/177598/pexels-photo-177598.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "Backend Engineer",
    duration: "18 Weeks",
    focus: ["API design", "Databases", "Auth security", "Deployment"],
    project:
      "Ship a scalable REST API with caching, queues, and role-based access control.",
    links: [
      { label: "Backend Roadmap", url: "https://roadmap.sh/backend" },
      { label: "Node.js Docs", url: "https://nodejs.org/en/docs" },
      { label: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/" },
    ],
    image:
      "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "AI / ML Engineer",
    duration: "20 Weeks",
    focus: ["Python stack", "ML foundations", "Model eval", "MLOps basics"],
    project:
      "Create a recommendation engine with experiment tracking and model monitoring.",
    links: [
      { label: "AI/ML Roadmap", url: "https://roadmap.sh/ai-data-scientist" },
      { label: "Scikit-Learn", url: "https://scikit-learn.org/stable/" },
      { label: "PyTorch Tutorials", url: "https://pytorch.org/tutorials/" },
    ],
    image:
      "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "DevOps / Cloud",
    duration: "14 Weeks",
    focus: ["Linux + networking", "Containers", "CI/CD", "Observability"],
    project:
      "Deploy a full-stack app with Docker, automated pipelines, and monitoring dashboards.",
    links: [
      { label: "DevOps Roadmap", url: "https://roadmap.sh/devops" },
      { label: "Docker Docs", url: "https://docs.docker.com/" },
      { label: "Kubernetes Docs", url: "https://kubernetes.io/docs/home/" },
    ],
    image:
      "https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

const weeklyCadence = [
  {
    weekRange: "Weeks 1-4",
    target: "Foundation",
    detail:
      "Strengthen fundamentals and complete one mini project each week for recall.",
  },
  {
    weekRange: "Weeks 5-10",
    target: "Core Build",
    detail:
      "Focus on one stack deeply, apply patterns, and document architecture decisions.",
  },
  {
    weekRange: "Weeks 11-14",
    target: "Projects + Reviews",
    detail:
      "Build portfolio-ready projects and get peer/code review feedback loops.",
  },
  {
    weekRange: "Weeks 15+",
    target: "Interview Prep",
    detail:
      "Timed problem solving, system design drills, and targeted resume polishing.",
  },
];

const RoadMaps = () => {
  return (
    <section className="theme-page pt-24 pb-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="theme-card rounded-3xl p-6 sm:p-9 relative overflow-hidden">
          <div className="absolute -top-16 right-0 w-60 h-60 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-24 left-0 w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="relative">
            <p className="theme-chip inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Compass size={14} />
              Structured Growth Paths
            </p>
            <h1
              className="mt-3 text-3xl sm:text-5xl font-extrabold"
              style={{ fontFamily: "Roboto Mono, monospace" }}
            >
              Career Roadmaps
            </h1>
            <p className="theme-muted mt-3 max-w-3xl leading-relaxed">
              Follow role-specific plans with clear milestones, project outcomes,
              and trusted references. Pick one track, stay consistent, and measure
              progress every week.
            </p>
          </div>
        </div>

        <div className="theme-surface rounded-3xl p-5 sm:p-7">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target size={20} className="theme-accent" />
            Weekly Cadence Blueprint
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-5">
            {weeklyCadence.map((phase) => (
              <article key={phase.weekRange} className="theme-card rounded-2xl p-4">
                <p className="text-xs uppercase tracking-wider theme-muted">
                  {phase.weekRange}
                </p>
                <h3 className="text-lg font-semibold mt-2">{phase.target}</h3>
                <p className="theme-muted text-sm mt-2 leading-relaxed">
                  {phase.detail}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {roadmapTracks.map((track) => (
            <article key={track.title} className="theme-card rounded-3xl overflow-hidden">
              <img
                src={track.image}
                alt={track.title}
                className="h-52 w-full object-cover"
                loading="lazy"
              />
              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-2xl font-bold">{track.title}</h2>
                  <span className="theme-chip px-3 py-1 rounded-md text-xs font-semibold">
                    {track.duration}
                  </span>
                </div>

                <p className="theme-muted mt-3 leading-relaxed">{track.project}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {track.focus.map((topic) => (
                    <span
                      key={topic}
                      className="theme-chip px-2 py-1 rounded-md text-xs font-semibold"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                <div className="mt-5 space-y-2">
                  {track.links.map((resource) => (
                    <a
                      key={resource.label}
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="theme-btn-secondary rounded-lg px-3 py-2 text-sm font-medium flex items-center justify-between"
                    >
                      <span>{resource.label}</span>
                      <ArrowUpRight size={16} />
                    </a>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="theme-surface rounded-3xl p-5 sm:p-7">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Flag size={20} className="theme-accent" />
            Execution Rules for Better Results
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            <div className="theme-card rounded-2xl p-4">
              <h4 className="font-semibold">Rule 1: One Track at a Time</h4>
              <p className="theme-muted text-sm mt-2">
                Avoid context switching. Go deep for 8-12 weeks on a single path.
              </p>
            </div>
            <div className="theme-card rounded-2xl p-4">
              <h4 className="font-semibold">Rule 2: Project per Milestone</h4>
              <p className="theme-muted text-sm mt-2">
                Convert each phase into one working project with README and demo.
              </p>
            </div>
            <div className="theme-card rounded-2xl p-4">
              <h4 className="font-semibold">Rule 3: Weekly Reflection</h4>
              <p className="theme-muted text-sm mt-2">
                Log wins, blockers, and next actions every Sunday to stay consistent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoadMaps;
