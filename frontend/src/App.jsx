import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Materials from "./pages/Materials";
import Chat from "./pages/Chat";
import AI from "./pages/AI";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import PlayList from "./pages/PlayList";
import Footer from "./components/Footer";
import General from "./layout/General";
import DSA from "./layout/DSA";
import WebDev from "./layout/WebDev";
import AIML from "./layout/AIML";
import SystemDesign from "./layout/SystemDesign";
import Career from "./layout/Career";
import ChatRoom from "./components/ChatRoom";
import { Toaster } from "react-hot-toast";
import { LearnContext } from "../context/LearnContextProvider";
const NotFound = () => (
  <div className="h-screen flex items-center justify-center">
    <h1 className="text-white text-5xl">Page Not Found 404.</h1>
  </div>
);
const App = () => {
  return (
    <>
      <Toaster />
      {/* Navbar always on top, merged with hero */}
      <Navbar />

      {/* Page Content */}
      <main className="pt-16">
        {/* pt-16 offsets the fixed navbar height */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/playlist" element={<PlayList />} />
          <Route path="/materials" element={<Materials />} />

          {/* Chat layout */}
          <Route path="/chats" element={<Chat />}>
            <Route index element={<Navigate to="general" replace />} />
            <Route path=":roomId" element={<ChatRoom />} />
          </Route>

          <Route path="/ai" element={<AI />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
