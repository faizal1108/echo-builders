export default function CommunitySearch({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-forest-100 bg-white px-4 py-3 text-sm outline-none focus:border-forest-400"
    />
  );
}
