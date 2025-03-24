import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserProvider } from "./New Authentication 2.0/UserContext"; // Import UserProvider

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <UserProvider> {/* Wrap App with UserProvider */}
    <App />
  </UserProvider>
);
