import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Materials from "./pages/Materials";
import Chat from "./pages/Chat";
import AI from "./pages/AI";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import PlayList from "./pages/PlayList";
import { Toaster } from "react-hot-toast";
import { LearnContext } from "../context/LearnContextProvider";
import Login from "./components/Login";
import Playlists from "./components/PlayLists";
import VideoContent from "./components/VideoContent";
import PersistentPlayer from "./components/PersistencePlayer";
import OtpVerify from "./components/OtpVerify";
import ChatRoomDemo from "./demo/ChatRoomDemo";
import { memo } from "react";
const NotFound = () => (
  <div className="h-screen flex items-center justify-center">
    <h1 className="text-white text-5xl">Page Not Found 404.</h1>
  </div>
);
const App = () => {
  const { token, userData } = useContext(LearnContext);
  return (
    <>
      <Toaster />

      {token && <Navbar />}
      <PersistentPlayer />
      <main className={`${token && "pt-16"}`}>
        <Routes>
          <Route path="/" element={token ? <Home /> : <Login />} />
          <Route
            path="/otp"
            element={userData.isVerified ? <OtpVerify /> : <Profile />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/playlist" element={<PlayList />}>
            <Route index element={<VideoContent />} />
            <Route path=":playlistId" element={<Playlists />} />
          </Route>

          <Route path="/materials" element={<Materials />} />
          <Route path="/chats" element={<Chat />}>
            <Route
              index
              element={<Navigate to="6901a102e93045ffc9ef8c24" replace />}
            />
            <Route path=":roomId" element={<ChatRoomDemo />} />
          </Route>
          <Route path="/ai" element={<AI />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/testing" element={memo(()=>(
            <div>
                <h1 className="testing">testing</h1>
            </div>

          ))} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
