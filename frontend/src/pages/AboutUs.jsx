import React from "react";
import { motion } from "framer-motion";
import { Brain, Lock, MessageCircle, Users, Youtube } from "lucide-react";

const featureCards = [
  {
    title: "AI Mentor",
    icon: Brain,
    color: "text-cyan-500",
    description:
      "Ask doubts instantly and get learning-focused responses for concepts, coding, and revision.",
  },
  {
    title: "Curated Video Learning",
    icon: Youtube,
    color: "text-red-500",
    description:
      "Discover high-value playlists aligned to your path instead of searching randomly.",
  },
  {
    title: "Real-Time Collaboration",
    icon: MessageCircle,
    color: "text-emerald-500",
    description:
      "Chat with peers, create focused rooms, and learn together with quick feedback loops.",
  },
  {
    title: "Secure Access",
    icon: Lock,
    color: "text-amber-500",
    description:
      "Google OAuth, verification flow, and protected features for trusted learner accounts.",
  },
  {
    title: "Learning Community",
    icon: Users,
    color: "text-violet-500",
    description:
      "Share notes, discuss strategies, and build momentum through collaborative learning.",
  },
];

const AboutUs = () => {
  return (
    <section className="theme-page pt-24 pb-16 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="theme-card rounded-3xl p-6 sm:p-9"
        >
          <h1
            className="text-3xl sm:text-5xl font-extrabold"
            style={{ fontFamily: "Roboto Mono, monospace" }}
          >
            About LearnHub
          </h1>
          <p className="theme-muted mt-4 leading-relaxed max-w-3xl">
            LearnHub is a focused learning platform built to combine AI guidance,
            structured resources, and collaborative study workflows in one place.
            The goal is simple: reduce learning friction and increase consistency
            for students and early professionals.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featureCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className="theme-card rounded-2xl p-5"
              >
                <Icon className={`${card.color}`} size={30} />
                <h2 className="text-xl font-semibold mt-3">{card.title}</h2>
                <p className="theme-muted text-sm mt-2 leading-relaxed">
                  {card.description}
                </p>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="theme-surface rounded-2xl p-5 sm:p-6"
        >
          <p className="theme-muted leading-relaxed">
            LearnHub is designed for consistent, skill-based growth. Whether you
            are preparing for placements, internships, or technical interviews,
            the platform keeps content, practice, and mentorship connected in one
            workflow.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;
