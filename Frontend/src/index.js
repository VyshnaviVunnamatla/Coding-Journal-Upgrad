import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";  // ✅ Add this import

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>   {/* ✅ Wrap App inside AuthProvider */}
    <App />
  </AuthProvider>
);

