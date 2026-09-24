export default function VillageCard({ village, posts }) {
  return (
    <div className="echo-card p-5">
      <p className="echo-label">📍 {village} Village</p>
      <p className="mt-2 text-sm text-forest-700">{posts.length} local posts (demo + your session)</p>
      <ul className="mt-3 space-y-2 text-sm">
        {posts.slice(0, 5).map((p) => (
          <li key={p.id} className="truncate text-forest-800">
            {p.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
