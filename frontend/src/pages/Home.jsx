import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Playlists from "../components/PlayLists";
import Materials from "../components/Materials";
import Footer from "../components/Footer";
import Features from "../components/Features";
import VideoLessons from "../components/VideoLessons";
import Community from "../components/Community";
import AIMentor from "../components/AIMentor";
import ScrollHome from "../components/ScrollHome";
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
