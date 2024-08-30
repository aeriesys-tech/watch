// import React from "react";
// import ReactDOM from "react-dom/client";
// import "./index.css";
// import App from "./App";
// import { Provider } from "react-redux";
// import "../src/Assets/assets/css/style.min.css";
// import "../src/Assets/assets/css/custom.css";
// import "../src/Assets/lib/remixicon/fonts/remixicon.css";
// import { store } from "./redux/Store";

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <Provider store={store}>
//     <App />
//   </Provider>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import "../src/Assets/assets/css/style.min.css";
import "../src/Assets/assets/css/custom.css";
import "../src/Assets/lib/remixicon/fonts/remixicon.css";
import { store, persistor } from "./redux/Store"; // Import the persistor
import { PersistGate } from "redux-persist/integration/react"; // Import PersistGate

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {" "}
      {/* Wrap with PersistGate */}
      <App />
    </PersistGate>
  </Provider>
);
