import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";

const Dashboard = lazy(() => import("./components/Dashboard"));
const Users = lazy(() => import("./components/Users"));
const Materials = lazy(() => import("./components/Materials"));
const ChatRoom = lazy(() => import("./components/ChatRoom"));
const Setting = lazy(() => import("./components/Setting"));

const Spinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
  </div>
);

const App = () => {
  return (
    <div>
      <Toaster />
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="materials" element={<Materials />} />
            <Route path="chatroom" element={<ChatRoom />} />
            <Route path="settings" element={<Setting />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
