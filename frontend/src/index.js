import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import "../src/Assets/assets/css/style.min.css";
import "../src/Assets/assets/css/custom.css";
import "../src/Assets/lib/remixicon/fonts/remixicon.css";

// import "../src/Assets/lib/jquery/jquery.min.js"
// import "../src/Assets/lib/perfect-scrollbar/perfect-scrollbar.min.js"
// import "../src/Assets/assets/js/script.js"

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
