import React, { useMemo, useState } from "react";
import {
  BookCheck,
  Code2,
  Download,
  ExternalLink,
  FileText,
  Search,
  Sparkles,
} from "lucide-react";

const cheatSheetItems = [
  {
    title: "Git Essentials",
    category: "Version Control",
    description:
      "Core commands for branching, rebasing, stashing, and safe team workflows.",
    highlight: ["commit --amend", "rebase -i", "stash pop", "cherry-pick"],
    reference: "https://git-scm.com/docs",
    pdf: "https://education.github.com/git-cheat-sheet-education.pdf",
    image:
      "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "JavaScript Quick Patterns",
    category: "Frontend",
    description:
      "Modern syntax patterns, array/object tricks, and async handling patterns.",
    highlight: ["map/filter/reduce", "optional chaining", "Promise.all", "debounce"],
    reference: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    pdf: "",
    image:
      "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "React Hooks Reference",
    category: "Frontend",
    description:
      "Practical usage guide for state, effects, memoization, and custom hooks.",
    highlight: ["useState", "useEffect", "useMemo", "useRef"],
    reference: "https://react.dev/reference/react",
    pdf: "",
    image:
      "https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "SQL Interview Cheats",
    category: "Databases",
    description:
      "Joins, aggregations, ranking, and CTE patterns used in assessments.",
    highlight: ["INNER/LEFT JOIN", "GROUP BY", "ROW_NUMBER", "WITH CTE"],
    reference: "https://www.postgresql.org/docs/current/tutorial-sql-intro.html",
    pdf: "",
    image:
      "https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "Python Data Structures",
    category: "Backend",
    description:
      "Lists, dicts, sets, slicing, comprehensions, and sorting recipes.",
    highlight: ["dict.get()", "list slicing", "set operations", "sorted(key=)"],
    reference: "https://docs.python.org/3/tutorial/datastructures.html",
    pdf: "",
    image:
      "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "Linux Command Flow",
    category: "DevOps",
    description:
      "Navigation, file permissions, process management, and network checks.",
    highlight: ["grep -R", "chmod", "ps aux", "curl -I"],
    reference: "https://linuxjourney.com/",
    pdf: "",
    image:
      "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

const snippets = [
  { command: "git log --oneline --graph", usage: "Compact branch history view." },
  { command: "npm run build", usage: "Generate production optimized bundle." },
  { command: "SELECT * FROM users LIMIT 10;", usage: "Sample result preview." },
  { command: "python -m venv .venv", usage: "Create isolated Python env." },
];

const CheatSheets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...new Set(cheatSheetItems.map((item) => item.category))],
    []
  );

  const filteredCheatSheets = useMemo(() => {
    return cheatSheetItems.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      const input = searchTerm.trim().toLowerCase();
      const matchesSearch =
        input.length === 0 ||
        item.title.toLowerCase().includes(input) ||
        item.description.toLowerCase().includes(input) ||
        item.highlight.some((keyword) => keyword.toLowerCase().includes(input));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  return (
    <section className="theme-page pt-24 pb-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="theme-card rounded-3xl p-6 sm:p-9 relative overflow-hidden">
          <div className="absolute -top-14 -right-10 w-48 h-48 rounded-full bg-blue-500/20 blur-2xl" />
          <div className="absolute -bottom-20 left-0 w-56 h-56 rounded-full bg-cyan-500/20 blur-2xl" />

          <div className="relative z-10">
            <p className="theme-chip inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={14} />
              Smart Revision Zone
            </p>
            <h1
              className="mt-3 text-3xl sm:text-5xl font-extrabold"
              style={{ fontFamily: "Roboto Mono, monospace" }}
            >
              CheatSheets Library
            </h1>
            <p className="theme-muted mt-3 max-w-2xl leading-relaxed">
              Practical sheets for fast recall before interviews, coding rounds,
              and deep work sessions. Filter by category and open official
              references instantly.
            </p>
          </div>
        </div>

        <div className="theme-surface rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="theme-input rounded-xl px-4 py-3 flex items-center gap-3 w-full lg:max-w-md">
              <Search size={18} className="theme-muted" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by topic, stack, or command"
                className="bg-transparent outline-none w-full text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    category === activeCategory
                      ? "theme-btn text-white"
                      : "theme-btn-secondary theme-text"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {snippets.map((snippet) => (
            <article key={snippet.command} className="theme-card rounded-2xl p-4">
              <p className="text-xs uppercase tracking-wide theme-muted mb-2">
                Quick Command
              </p>
              <code className="text-sm block rounded-lg px-3 py-2 bg-black/20 overflow-x-auto">
                {snippet.command}
              </code>
              <p className="mt-3 text-sm theme-muted">{snippet.usage}</p>
            </article>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCheatSheets.map((item) => (
            <article key={item.title} className="theme-card rounded-3xl overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="h-48 w-full object-cover"
                loading="lazy"
              />
              <div className="p-6">
                <p className="theme-chip inline-flex px-2 py-1 rounded-md text-xs font-semibold mb-3">
                  {item.category}
                </p>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <BookCheck size={22} className="theme-accent" />
                  {item.title}
                </h2>
                <p className="theme-muted mt-3 leading-relaxed">{item.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {item.highlight.map((point) => (
                    <span
                      key={point}
                      className="theme-chip px-2 py-1 rounded-md text-xs font-semibold"
                    >
                      {point}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={item.reference}
                    target="_blank"
                    rel="noreferrer"
                    className="theme-btn rounded-lg px-4 py-2 text-sm font-semibold inline-flex items-center gap-2"
                  >
                    <ExternalLink size={15} />
                    Open Reference
                  </a>
                  {item.pdf ? (
                    <a
                      href={item.pdf}
                      target="_blank"
                      rel="noreferrer"
                      className="theme-btn-secondary rounded-lg px-4 py-2 text-sm font-semibold inline-flex items-center gap-2"
                    >
                      <Download size={15} />
                      PDF
                    </a>
                  ) : (
                    <span className="theme-btn-secondary rounded-lg px-4 py-2 text-sm font-semibold inline-flex items-center gap-2">
                      <FileText size={15} />
                      Web Notes
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredCheatSheets.length === 0 ? (
          <div className="theme-surface rounded-2xl p-8 text-center">
            <Code2 size={28} className="mx-auto theme-accent" />
            <p className="mt-3 theme-text font-semibold">No cheat sheets found.</p>
            <p className="theme-muted text-sm">
              Try another keyword or switch to a different category.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default CheatSheets;
