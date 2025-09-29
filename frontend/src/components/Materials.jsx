import React, { useState } from "react";
import { Download, Eye, FileText, Search, Star, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const Materials = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Notes",
    "Cheat Sheets",
    "Templates",
    "Books",
    "Papers",
  ];

  const materials = [
    {
      id: 1,
      title: "Complete JavaScript Cheat Sheet",
      subject: "Web Development",
      category: "Cheat Sheets",
      description:
        "Comprehensive JavaScript reference with syntax, methods, and best practices.",
      size: "2.4 MB",
      format: "PDF",
      downloads: 15420,
      rating: 4.8,
      uploadDate: "2024-01-15",
      featured: true,
      downloadUrl: "/materials/js-cheatsheet.pdf",
      viewUrl: "/materials/js-cheatsheet.pdf",
    },
    {
      id: 2,
      title: "Data Structures & Algorithms Notes",
      subject: "Computer Science",
      category: "Notes",
      description:
        "Detailed notes covering all major data structures and algorithms with examples.",
      size: "8.7 MB",
      format: "PDF",
      downloads: 23150,
      rating: 4.9,
      uploadDate: "2024-01-12",
      featured: true,
      downloadUrl: "/materials/dsa-notes.pdf",
      viewUrl: "/materials/dsa-notes.pdf",
    },
    {
      id: 3,
      title: "React Project Boilerplate",
      subject: "Web Development",
      category: "Templates",
      description:
        "Production-ready React template with TypeScript, testing, and deployment setup.",
      size: "1.2 MB",
      format: "ZIP",
      downloads: 8934,
      rating: 4.7,
      uploadDate: "2024-01-10",
      featured: false,
      downloadUrl: "/materials/react-boilerplate.zip",
      viewUrl: "/materials/react-boilerplate.zip",
    },
    {
      id: 4,
      title: "System Design Interview Guide",
      subject: "System Design",
      category: "Books",
      description:
        "Complete guide to system design interviews with real-world examples.",
      size: "12.3 MB",
      format: "PDF",
      downloads: 19876,
      rating: 4.9,
      uploadDate: "2024-01-08",
      featured: true,
      downloadUrl: "/materials/system-design.pdf",
      viewUrl: "/materials/system-design.pdf",
    },
    {
      id: 5,
      title: "SQL Quick Reference",
      subject: "Database",
      category: "Cheat Sheets",
      description:
        "Essential SQL commands and queries for database operations.",
      size: "1.8 MB",
      format: "PDF",
      downloads: 12654,
      rating: 4.6,
      uploadDate: "2024-01-05",
      featured: false,
      downloadUrl: "/materials/sql-reference.pdf",
      viewUrl: "/materials/sql-reference.pdf",
    },
    {
      id: 6,
      title: "Machine Learning Research Paper",
      subject: "AI/ML",
      category: "Papers",
      description: "Latest research on deep learning optimization techniques.",
      size: "4.2 MB",
      format: "PDF",
      downloads: 5432,
      rating: 4.8,
      uploadDate: "2024-01-03",
      featured: false,
      downloadUrl: "/materials/ml-research.pdf",
      viewUrl: "/materials/ml-research.pdf",
    },
  ];

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || material.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="materials" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              Study Materials
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Download and access high-quality study materials, notes, and
            resources
          </p>
        </motion.div>

        {/* Search + Filters */}
        <motion.div
          className="flex flex-col lg:flex-row gap-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search materials, subjects, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-300"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category, i) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.4 }}
                viewport={{ once: true }}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg shadow-purple-500/25"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-purple-400"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Materials Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          viewport={{ once: true }}
        >
          {filteredMaterials.map((material) => (
            <motion.div
              key={material.id}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`group relative bg-gray-800/50 rounded-xl border transition-all duration-500 hover:transform hover:scale-105 hover:shadow-xl overflow-hidden ${
                material.featured
                  ? "border-gradient-to-r from-purple-500/50 to-blue-500/50 hover:shadow-purple-500/10"
                  : "border-gray-700/50 hover:border-purple-500/50 hover:shadow-purple-500/5"
              }`}
            >
              {/* Featured Badge */}
              {material.featured && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>Featured</span>
                  </div>
                </div>
              )}

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />

              <div className="relative p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <span className="inline-block bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs font-medium">
                        {material.format}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors duration-300">
                  {material.title}
                </h3>

                <div className="text-sm text-blue-400 mb-2 font-medium">
                  {material.subject}
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {material.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <span>{material.size}</span>
                    <div className="flex items-center space-x-1">
                      <Download className="w-3 h-3" />
                      <span>{material.downloads.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{material.rating}</span>
                  </div>
                </div>

                {/* Upload Date */}
                <div className="flex items-center text-xs text-gray-500 mb-6">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>
                    Updated {new Date(material.uploadDate).toLocaleDateString()}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {/* Download */}
                  <a
                    href={material.downloadUrl}
                    download
                    className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </a>

                  {/* View */}
                  <a
                    href={material.viewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-700 text-gray-300 py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:bg-gray-600 hover:text-white flex items-center justify-center"
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredMaterials.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No materials found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Materials;
