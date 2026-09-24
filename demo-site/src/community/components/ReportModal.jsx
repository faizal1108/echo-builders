const REASONS = ["Spam", "Incorrect information", "Harassment", "Fraud", "Unsafe advice", "Inappropriate content", "Other"];

export default function ReportModal({ open, onClose, onSubmit }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest-900/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5">
        <h3 className="font-display text-xl text-forest-900">Report</h3>
        <div className="mt-3 space-y-2">
          {REASONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                onSubmit(r);
                onClose();
              }}
              className="block w-full rounded-xl border border-forest-100 px-3 py-2 text-left text-sm hover:bg-forest-50"
            >
              {r}
            </button>
          ))}
        </div>
        <button type="button" onClick={onClose} className="mt-4 text-sm text-forest-600">
          Cancel
        </button>
      </div>
    </div>
  );
}
