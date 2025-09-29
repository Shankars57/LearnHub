import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Playlists from "../components/PlayLists";
import Materials from "../components/Materials";

const Home = () => {
  return (
    <>
      <Hero />
      <Playlists />
      <Materials />
    </>
  );
};

export default Home;
