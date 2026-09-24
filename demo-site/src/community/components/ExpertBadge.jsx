export default function ExpertBadge({ role, title }) {
  if (role === "officer") {
    return (
      <div className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-950">
        <p className="font-bold">✓ AGRICULTURE OFFICER</p>
        {title ? <p className="mt-0.5">{title}</p> : null}
        <p className="mt-1 text-[10px] font-normal text-sky-800">An official role badge is not automatic confirmation that advice is correct.</p>
      </div>
    );
  }
  if (role === "expert") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-950">
        <p className="font-bold">✓ VERIFIED AGRICULTURAL EXPERT</p>
        {title ? <p className="mt-0.5">{title}</p> : null}
        <p className="mt-1 text-[10px] font-normal text-emerald-800">Please still verify before high-impact farm actions.</p>
      </div>
    );
  }
  return null;
}
