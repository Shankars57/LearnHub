import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Materials from "./pages/Materials";
import Chat from "./pages/Chat";
import AI from "./pages/AI";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import PlayList from "./pages/PlayList";
import General from "./layout/General";
import DSA from "./layout/DSA";
import WebDev from "./layout/WebDev";
import AIML from "./layout/AIML";
import SystemDesign from "./layout/SystemDesign";
import Career from "./layout/Career";
import ChatRoom from "./components/ChatRoom";
import { Toaster } from "react-hot-toast";
import { LearnContext } from "../context/LearnContextProvider";
import Login from "./components/Login";
const NotFound = () => (
  <div className="h-screen flex items-center justify-center">
    <h1 className="text-white text-5xl">Page Not Found 404.</h1>
  </div>
);
const App = () => {
  const { token } = useContext(LearnContext);
  return (
    <>
      <Toaster />

      {token && <Navbar />}
      <main className={`${token && "pt-16"}`}>
        <Routes>
          <Route path="/" element={token ? <Home /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/playlist" element={<PlayList />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/chats" element={<Chat />}>
            <Route index element={<Navigate to="general" replace />} />
            <Route path=":roomId" element={<ChatRoom />} />
          </Route>
          <Route path="/ai" element={<AI />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
