import { useState } from "react";
import Header from "../components/Header";
import CommunityRoutes from "./CommunityRoutes";
import ApiSettings from "../components/ApiSettings";
import { translations } from "../data/i18n";

function loadSettings() {
  return {
    geminiKey: (localStorage.getItem("echo.geminiKey") || "").trim() || import.meta.env.VITE_GEMINI_API_KEY || "",
    bhuvanUrl: (localStorage.getItem("echo.bhuvanUrl") || "").trim() || import.meta.env.VITE_BHUVAN_API_URL || "",
    bhuvanToken: (localStorage.getItem("echo.bhuvanToken") || "").trim() || import.meta.env.VITE_BHUVAN_API_TOKEN || "",
    demoMode: localStorage.getItem("echo.demoMode") != null ? localStorage.getItem("echo.demoMode") === "true" : true,
  };
}

export default function CommunityApp() {
  const [language, setLanguage] = useState(localStorage.getItem("echo.language") || "en");
  const [settings, setSettings] = useState(loadSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const t = translations[language] || translations.en;

  return (
    <div className="min-h-screen">
      <Header
        t={t}
        language={language}
        onLanguage={(code) => {
          setLanguage(code);
          localStorage.setItem("echo.language", code);
        }}
        onOpenSettings={() => setSettingsOpen(true)}
        demoMode={settings.demoMode}
        onToggleDemo={(value) => {
          const next = { ...settings, demoMode: value };
          setSettings(next);
          localStorage.setItem("echo.demoMode", String(value));
        }}
      />
      <CommunityRoutes language={language} apiKey={settings.geminiKey} />
      <ApiSettings
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSave={(next) => {
          setSettings(next);
          localStorage.setItem("echo.geminiKey", next.geminiKey || "");
          localStorage.setItem("echo.bhuvanUrl", next.bhuvanUrl || "");
          localStorage.setItem("echo.bhuvanToken", next.bhuvanToken || "");
          localStorage.setItem("echo.demoMode", String(next.demoMode));
        }}
      />
    </div>
  );
}
