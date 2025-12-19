import { motion } from "framer-motion";
import { Bot, Code, Lightbulb, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Snowfall from "react-snowfall";
const features = [
  { icon: Code, text: "Explain code line-by-line" },
  { icon: Lightbulb, text: "Generate practice problems" },
  { icon: CheckCircle, text: "Review your solutions" },
  { icon: Bot, text: "Available 24/7" },
];

export default function AIMentor() {
  const navigate = useNavigate();
  return (
    <section id="ai" className="relative py-24 bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 overflow-hidden">
      <Snowfall />

      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-20"></div>

              <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">AI Mentor</div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-400 font-semibold">
                        Online
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                    className="bg-blue-600/20 rounded-lg p-4 border border-blue-500/30"
                  >
                    <p className="text-white text-sm">
                      Can you explain how recursion works in JavaScript?
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    viewport={{ once: true }}
                    className="bg-purple-600/20 rounded-lg p-4 border border-purple-500/30 ml-8"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <Bot className="w-4 h-4 text-purple-400 mt-1" />
                      <p className="text-white text-sm">
                        Of course! Recursion is when a function calls itself.
                        Here's a simple example:
                      </p>
                    </div>
                    <div className="bg-gray-900 rounded-md p-3 mt-2">
                      <code className="text-green-400 text-xs font-mono">
                        function factorial(n) {"{"}
                        <br />
                        &nbsp;&nbsp;if (n === 0) return 1;
                        <br />
                        &nbsp;&nbsp;return n * factorial(n - 1);
                        <br />
                        {"}"}
                      </code>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    viewport={{ once: true }}
                    className="bg-blue-600/20 rounded-lg p-4 border border-blue-500/30"
                  >
                    <p className="text-white text-sm">
                      That makes sense! Can you give me a practice problem?
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    viewport={{ once: true }}
                    className="bg-purple-600/20 rounded-lg p-4 border border-purple-500/30 ml-8"
                  >
                    <div className="flex items-start gap-2">
                      <Bot className="w-4 h-4 text-purple-400 mt-1" />
                      <p className="text-white text-sm">
                        Sure! Try writing a recursive function to calculate the
                        Fibonacci sequence...
                      </p>
                    </div>
                  </motion.div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span>AI is typing...</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Your Personal
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                AI Coding Mentor
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Get instant, personalized help whenever you're stuck. Our AI
              mentor understands your learning style and adapts explanations to
              match your level.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10"
                >
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                    <feature.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white text-sm font-medium">
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-gray-300">
                  Instant code explanations and debugging help
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-gray-300">
                  Personalized learning recommendations
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-gray-300">
                  Practice problems tailored to your skill level
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate("/ai")}
              className="mt-8 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:scale-105 transition-transform shadow-lg shadow-purple-500/30"
            >
              Try AI Mentor Free
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
