import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import DeviceSection from "./components/DeviceSection";
import TraceSection from "./components/TraceSection";
import QuerySection from "./components/QuerySection";
import ConfigSection from "./components/ConfigSection";
import GraphSection from "./components/GraphSection";
import { Box } from "@mui/material";

export default function App() {
  const [section, setSection] = useState("Device");
  return (
    <Box sx={{
      bgcolor: "linear-gradient(120deg, #e0e8ff 0%, #f5fafe 100%)",
      minHeight: "100vh",
      display: "flex"
    }}>
      <Sidebar section={section} setSection={setSection} />
      <Box sx={{
        flexGrow: 1,
        p: 4,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        borderRadius: 4,
        boxShadow: "0 4px 24px rgba(34, 100, 250, 0.12)",
        background: "rgba(255,255,255,0.5)",
        backdropFilter: "blur(10px)"
      }}>
        {section === "Device" && <DeviceSection />}
        {section === "Trace" && <TraceSection />}
        {section === "Query" && <QuerySection />}
        {section === "Config" && <ConfigSection />}
        {section === "Graph" && <GraphSection />}
      </Box>
    </Box>
  );
}
