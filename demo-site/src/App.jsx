import { BrowserRouter, Route, Routes } from "react-router-dom";
import FieldIntelligence from "./FieldIntelligence.jsx";
import CommunityApp from "./community/CommunityApp.jsx";
import GrowApp from "./grow/GrowApp.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GrowApp />} />
        <Route path="/field" element={<FieldIntelligence />} />
        <Route path="/community/*" element={<CommunityApp />} />
      </Routes>
    </BrowserRouter>
  );
}
