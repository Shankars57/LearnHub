import React from "react";
import { motion } from "framer-motion";
import { Brain, Youtube, MessageCircle, Lock, Users } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center px-6 py-16">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text"
      >
        About LearnHub
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="max-w-3xl text-center text-gray-300 mb-12 leading-relaxed"
      >
        <span className="text-cyan-400 font-semibold">LearnHub</span> is an
        AI-powered real-time learning and resource-sharing platform built using
        the MERN stack. We're redefining how learners interact, collaborate, and
        grow by combining cutting-edge AI, community-driven discussions, and
        video-based learning — all in one place.
      </motion.p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl">
      
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-6 bg-gray-800 rounded-2xl shadow-lg border border-gray-700"
        >
          <Brain className="text-cyan-400 mb-4" size={40} />
          <h3 className="text-xl font-semibold mb-2 text-cyan-300">
            AI Mentor (Gemini API)
          </h3>
          <p className="text-gray-400 text-sm">
            Get personalized answers and learning assistance with our AI Mentor
            powered by Gemini API. It helps you clarify doubts, understand
            concepts, and boost productivity.
          </p>
        </motion.div>

    
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-6 bg-gray-800 rounded-2xl shadow-lg border border-gray-700"
        >
          <Youtube className="text-red-500 mb-4" size={40} />
          <h3 className="text-xl font-semibold mb-2 text-red-400">
            YouTube Learning
          </h3>
          <p className="text-gray-400 text-sm">
            Explore educational content fetched directly through the YouTube
            Data API — curated to match your interests and study goals.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-6 bg-gray-800 rounded-2xl shadow-lg border border-gray-700"
        >
          <MessageCircle className="text-green-400 mb-4" size={40} />
          <h3 className="text-xl font-semibold mb-2 text-green-300">
            Real-Time Chat
          </h3>
          <p className="text-gray-400 text-sm">
            Stay connected with peers and mentors through Socket.IO-powered
            real-time chat rooms with typing indicators and live collaboration.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-6 bg-gray-800 rounded-2xl shadow-lg border border-gray-700"
        >
          <Lock className="text-yellow-400 mb-4" size={40} />
          <h3 className="text-xl font-semibold mb-2 text-yellow-300">
            Secure Authentication
          </h3>
          <p className="text-gray-400 text-sm">
            Experience one-click sign-in using Google OAuth 2.0 with robust
            session management and email verification via Nodemailer.
          </p>
        </motion.div>

      
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-6 bg-gray-800 rounded-2xl shadow-lg border border-gray-700"
        >
          <Users className="text-purple-400 mb-4" size={40} />
          <h3 className="text-xl font-semibold mb-2 text-purple-300">
            Learning Community
          </h3>
          <p className="text-gray-400 text-sm">
            Join a growing community of learners, share resources, discuss
            ideas, and grow together in an interactive environment.
          </p>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="text-gray-500 mt-16 text-sm text-center max-w-2xl"
      >
        LearnHub isn't just a platform — it's a movement toward smarter,
        AI-enhanced, collaborative learning. Whether you're a student, mentor,
        or lifelong learner, we're here to make your journey easier and more
        engaging.
      </motion.p>
    </div>
  );
};

export default AboutUs;
