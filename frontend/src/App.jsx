import React, { useContext, Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { LearnContext } from "../context/LearnContextProvider";
import PersistentPlayer from "./components/PersistencePlayer";
import { memo } from "react";
import AboutUs from "./pages/AboutUs";
import ContactPage from "./pages/ContactPage";

const Home = lazy(() => import("./pages/Home"));
const Materials = lazy(() => import("./pages/Materials"));
const Chat = lazy(() => import("./pages/Chat"));
const AI = lazy(() => import("./pages/AI"));
const Profile = lazy(() => import("./pages/Profile"));
const Navbar = lazy(() => import("./components/Navbar"));
const PlayList = lazy(() => import("./pages/PlayList"));
const Login = lazy(() => import("./components/Login"));
const Playlists = lazy(() => import("./components/PlayLists"));
const VideoContent = lazy(() => import("./components/VideoContent"));
const OtpVerify = lazy(() => import("./components/OtpVerify"));
const ChatRoomDemo = lazy(() => import("./demo/ChatRoomDemo"));

const Spinner = () => (
  <div className="flex justify-center items-center h-screen bg-black/60 backdrop-blur-md">
    <div className="w-14 h-14 border-4 border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>
  </div>
);

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
      <Suspense fallback={<Spinner />}>
        {token && <Navbar />}
        <PersistentPlayer />
        <main className={`${token && "pt-16"}`}>
          <Routes>
            <Route path="/" element={token ? <Home /> : <Login />} />
            <Route
              path="/otp"
              element={!userData.isVerified ? <OtpVerify /> : <Profile />}
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
            <Route
              path="/testing"
              element={memo(() => (
                <div>
                  <h1 className="testing">testing</h1>
                </div>
              ))}
            />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </Suspense>
    </>
  );
};

export default App;
