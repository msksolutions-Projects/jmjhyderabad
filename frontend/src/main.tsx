import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "@/app/App";
// Google Fonts, self-hosted (no third-party request): Roboto for headings, Inter for text.
import "@fontsource-variable/inter/index.css";
import "@fontsource-variable/roboto/index.css";
import "@fontsource-variable/roboto/wght-italic.css";
// Masthead title font (Latin, bold only) — self-hosted instead of a render-blocking Google Fonts request.
import "@fontsource/playfair-display/latin-700.css";
import "@/styles/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>);
