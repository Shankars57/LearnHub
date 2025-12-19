import { motion } from "framer-motion";
import {
  FileText,
  BookOpen,
  Image,
  FileType,
  Download,
  Star,
  Map,
  ScrollText,
  FileUser,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Snowfall from "react-snowfall";
const materialTypes = [
  {
    icon: FileText,
    title: "PDF Resources",
    description:
      "Comprehensive study materials and reference guides in PDF format",
    count: "500+",
    gradient: "from-red-500 to-orange-500",
  },
  {
    icon: BookOpen,
    title: "Study Notes",
    description:
      "Concise, well-organized notes for quick revision and learning",
    count: "1000+",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: FileType,
    title: "DOCX Files",
    description: "Editable documents for assignments and practice exercises",
    count: "300+",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Image,
    title: "Visual Diagrams",
    description: "Infographics and diagrams to visualize complex concepts",
    count: "800+",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: ScrollText,
    title: "Cheat Sheets",
    description:
      "Quick reference sheets for syntax, algorithms, and important formulas",
    count: "200+",
    gradient: "from-yellow-500 to-amber-500",
  },
  {
    icon: Map,
    title: "Roadmaps",
    description:
      "Step-by-step learning paths to guide your development journey",
    count: "50+",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    icon: FileUser,
    title: "Resume Templates",
    description:
      "Professional resume templates to help you stand out in job applications",
    count: "100+",
    gradient: "from-pink-500 to-rose-500",
  },
];

export default function Materials() {
  const navigate = useNavigate();
  return (
    <section
      id="materials"
      className="relative py-24 bg-gradient-to-br from-blue-950 via-gray-900 to-purple-950 overflow-hidden"
    >
      <Snowfall />
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-10"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Learn with
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              {" "}
              Rich Materials
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Access comprehensive study materials including PDFs, notes,
            documents, diagrams, cheat sheets, roadmaps, and more to strengthen
            your theoretical and practical knowledge.
          </p>
        </motion.div>

       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {materialTypes.map((material, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all h-full">
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${material.gradient} mb-4`}
                >
                  <material.icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  {material.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {material.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">
                    {material.count}
                  </span>
                  <span className="text-sm text-gray-400">resources</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-3">
            Download Anytime, Learn Anywhere
          </h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            All study materials are available for offline access. Download once
            and study without internet connection.
          </p>
          <button
            onClick={() => navigate("/materials")}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:scale-105 transition-transform shadow-lg shadow-purple-500/30"
          >
            Browse All Materials
          </button>
        </motion.div>
      </div>
    </section>
  );
}
