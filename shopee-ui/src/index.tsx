import React from "react";
import ReactDOM from "react-dom/client";
import "normalize.css";
import "./i18n";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import GlobalStyles from "./assets/Globalstyle/index";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalStyles>
      <App />
    </GlobalStyles>
  </React.StrictMode>,
);

reportWebVitals();
