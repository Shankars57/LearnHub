import React, { useEffect, useState } from "react";
import SideBar from "../layout/SideBar";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleSticky = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setSticky(window.screenY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleSticky);
    return () => window.removeEventListener("scroll", handleSticky);
  }, []);
  console.log(sticky);
  
  return (
    <div className="flex h-screen">
      <SideBar />
      <div className="flex-1 overflow-auto lg:px-8 lg:py-8">
        <Navbar sticky={sticky} />
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
