import { Route, Routes } from "react-router-dom";
import CommunityLayout from "./CommunityLayout";
import CommunityHome from "./pages/CommunityHome";
import PostDetail from "./pages/PostDetail";
import AskPage from "./pages/AskPage";
import ReportPage from "./pages/ReportPage";
import VillagePage from "./pages/VillagePage";
import CropsPage from "./pages/CropsPage";
import CropCommunityPage from "./pages/CropCommunityPage";
import MapPage from "./pages/MapPage";
import SavedPage from "./pages/SavedPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import FarmerTipsPage from "./pages/FarmerTipsPage";

export default function CommunityRoutes({ language, apiKey }) {
  return (
    <Routes>
      <Route element={<CommunityLayout language={language} />}>
        <Route index element={<CommunityHome language={language} apiKey={apiKey} />} />
        <Route path="post/:id" element={<PostDetail language={language} />} />
        <Route path="ask" element={<AskPage language={language} />} />
        <Route path="report" element={<ReportPage language={language} />} />
        <Route path="village" element={<VillagePage language={language} />} />
        <Route path="crops" element={<CropsPage language={language} />} />
        <Route path="crops/:crop" element={<CropCommunityPage language={language} />} />
        <Route path="map" element={<MapPage language={language} />} />
        <Route path="saved" element={<SavedPage language={language} />} />
        <Route path="profile" element={<ProfilePage language={language} />} />
        <Route path="settings" element={<SettingsPage language={language} />} />
        <Route path="tips" element={<FarmerTipsPage language={language} />} />
      </Route>
    </Routes>
  );
}
