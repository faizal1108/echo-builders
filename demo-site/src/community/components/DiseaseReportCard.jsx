export default function DiseaseReportCard({ detection }) {
  if (!detection || detection.kind !== "disease") return null;
  return (
    <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-950">
      🦠 Possible disease-related detection: {detection.label}. Please verify with an agricultural expert.
    </div>
  );
}
