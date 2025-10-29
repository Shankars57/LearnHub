import React from "react";
import Hero from "../components/HomeComponents/Hero";
import Materials from "../components/HomeComponents/Materials";
import Footer from "../components/HomeComponents/Footer";
import Features from "../components/HomeComponents/Features";
import VideoLessons from "../components/HomeComponents/VideoLessons";
import Community from "../components/HomeComponents/Community";
import AIMentor from "../components/HomeComponents/AIMentor";
import ScrollHome from "../components/HomeComponents/ScrollHome";
const Home = () => {
  return (
    <div className="relative">
      <ScrollHome />
      <Hero />
      <Features />
      <VideoLessons />
      <Materials />
      <Community />
      <AIMentor />
      <Footer />
    </div>
  );
};

export default Home;
