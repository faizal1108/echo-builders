import { formatIndiaDateTime } from "../../utils/indiaTime";

export default function NotificationPanel({ items }) {
  return (
    <div className="echo-card p-4">
      <p className="echo-label">Notifications</p>
      <ul className="mt-3 space-y-3">
        {items.map((n) => (
          <li key={n.id} className="border-b border-forest-50 pb-2 text-sm text-forest-800 last:border-0">
            {n.text}
            <p className="mt-1 text-[11px] text-forest-500">{formatIndiaDateTime(n.time)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
