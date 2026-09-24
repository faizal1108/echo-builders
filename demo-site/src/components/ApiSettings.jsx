import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function ApiSettings({ open, onClose, settings, onSave }) {
  const [form, setForm] = useState(settings);

  useEffect(() => {
    if (open) setForm(settings);
  }, [open, settings]);

  if (!open) return null;

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end bg-forest-900/30 sm:items-stretch">
      <button className="h-full flex-1" aria-label="Close settings" onClick={onClose} />
      <aside className="h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:h-full sm:rounded-none">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-forest-900">Settings</h2>
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-forest-50">
            <X size={18} />
          </button>
        </div>
        <p className="mt-2 text-sm text-amber-800">
          This is a frontend demo. Keys stored in the browser can be extracted. Do not use unrestricted production keys.
        </p>

        <label className="mt-6 block text-xs font-semibold text-forest-700">
          Gemini API Key
          <input
            type="password"
            value={form.geminiKey}
            onChange={set("geminiKey")}
            className="mt-1 w-full rounded-xl border border-forest-100 px-3 py-2 text-sm"
            autoComplete="off"
          />
        </label>
        <p className="mt-1 text-[11px] text-forest-500">
          Saved locally in this browser only. Sent only to Google Gemini as <code>x-goog-api-key</code> (supports
          AIza and AQ. keys). Restart <code>npm run dev</code> after changing <code>.env</code>.
        </p>

        <label className="mt-5 block text-xs font-semibold text-forest-700">
          Bhuvan API URL
          <input
            value={form.bhuvanUrl}
            onChange={set("bhuvanUrl")}
            placeholder="Paste URL from official Bhuvan API docs"
            className="mt-1 w-full rounded-xl border border-forest-100 px-3 py-2 text-sm"
          />
        </label>
        <label className="mt-4 block text-xs font-semibold text-forest-700">
          Bhuvan API Token
          <input
            type="password"
            value={form.bhuvanToken}
            onChange={set("bhuvanToken")}
            className="mt-1 w-full rounded-xl border border-forest-100 px-3 py-2 text-sm"
            autoComplete="off"
          />
        </label>
        <p className="mt-2 text-xs text-forest-600">
          Official catalog:{" "}
          <a className="underline" href="https://bhuvan-app1.nrsc.gov.in/api/" target="_blank" rel="noreferrer">
            bhuvan-app1.nrsc.gov.in/api
          </a>
          . ECHO does not invent undocumented endpoints. LULC statistics require a Bhuvan access token.
        </p>

        <button
          type="button"
          onClick={() => {
            onSave(form);
            onClose();
          }}
          className="mt-6 w-full rounded-full bg-forest-700 py-2.5 text-sm font-semibold text-white"
        >
          Save Key
        </button>
      </aside>
    </div>
  );
}
