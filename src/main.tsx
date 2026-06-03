import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n";

import App from "./App";
import { AppProviders } from "./providers/AppProviders";

import "./styles/main.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
);
