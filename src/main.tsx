import React from "react";
import { createRoot } from "react-dom/client";
import Template from "./template";
import { type PortfolioData } from "./template";
import data from "../public/portfolio-data.json";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Template portfolioData={data as PortfolioData} />
  </React.StrictMode>
);
