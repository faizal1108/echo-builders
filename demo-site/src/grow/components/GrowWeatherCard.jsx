export default function GrowWeatherCard({ weather, stage, pestActive }) {
  const current = weather?.data?.current;
  const rain = (current?.rain ?? current?.precipitation ?? 0) > 0.2 || /rain|drizzle|thunder/i.test(current?.condition || "");
  const humidity = current?.humidity ?? 82;
  const temp = current?.temperature ?? 29;
  const live = weather?.status === "live";

  return (
    <article className="echo-card p-5">
      <p className="echo-label">Current Conditions</p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
        <p className="rounded-2xl bg-forest-50 p-3">
          🌡<br />
          <strong>{temp}°C</strong>
        </p>
        <p className="rounded-2xl bg-forest-50 p-3">
          💧<br />
          <strong>{humidity}% Humidity</strong>
        </p>
        <p className="rounded-2xl bg-forest-50 p-3">
          🌧<br />
          <strong>{rain ? "Rainfall Expected" : current?.condition || "Watch sky"}</strong>
        </p>
      </div>
      <dl className="mt-4 space-y-1 text-sm">
        <p>
          Crop: <strong>Paddy</strong>
        </p>
        <p>
          Growth Stage: <strong>{stage.name}</strong>
        </p>
        <p>
          Risk: <strong>{pestActive || stage.pestRisk === "moderate" ? "Moderate Pest Risk" : "Lower pest pressure"}</strong>
        </p>
      </dl>
      <p className="mt-3 rounded-xl bg-wheat-50 px-3 py-2 text-sm text-forest-800">
        High humidity may increase the need for crop monitoring.
      </p>
      <p className="mt-2 text-[10px] text-forest-500">
        {live ? weather.message : "Weather API unavailable — using realistic demo values for Coimbatore."}
      </p>
    </article>
  );
}
