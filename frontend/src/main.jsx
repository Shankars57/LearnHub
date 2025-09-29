import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import LearnContextProvider from "../context/LearnContextProvider.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <LearnContextProvider>
        <App />
      </LearnContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
