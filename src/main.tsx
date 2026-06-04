import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n";

import App from "./App";
import { AppProviders } from "./providers/AppProviders";

import "@fontsource/geist-mono/500.css";
import "@fontsource/geist-mono/600.css";
import "@fontsource/geist/400.css";
import "@fontsource/geist/500.css";
import "@fontsource/geist/600.css";
import "@fontsource/geist/700.css";
import "leaflet/dist/leaflet.css";
import "./styles/main.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
);
