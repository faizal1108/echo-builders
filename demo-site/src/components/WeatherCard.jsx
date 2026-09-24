import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import StatusBadge from "./StatusBadge";
import { formatNumber } from "../utils/formatters";
import { formatIndiaDayTick } from "../utils/indiaTime";

export default function WeatherCard({ t, weatherResult }) {
  const weather = weatherResult?.data;
  const current = weather?.current;
  const chartData = (weather?.daily || []).map((d) => ({
    day: formatIndiaDayTick(d.date),
    dateLabel: d.dateLabel,
    max: d.tempMax,
    min: d.tempMin,
    rain: d.precipitation,
  }));

  return (
    <section id="weather" className="echo-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="echo-label">{t.weather}</p>
          <p className="mt-1 text-xs text-forest-600">
            Source: Open-Meteo · Indian Standard Time (IST, UTC+05:30) · ~16-day horizon
          </p>
        </div>
        <StatusBadge status={weatherResult?.status || "idle"} />
      </div>
      {!weather && <p className="mt-4 text-sm text-forest-700">{weatherResult?.message || "Weather service unavailable."}</p>}
      {current && (
        <>
          <p className="mt-3 text-xs font-medium text-forest-700">Observed: {current.timeLabel || "IST"}</p>
          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-5">
            <Stat label="Temperature" value={formatNumber(current.temperature, 1, "°C")} />
            <Stat label="Humidity" value={formatNumber(current.humidity, 0, "%")} />
            <Stat label="Rain" value={formatNumber(current.rain ?? current.precipitation, 1, " mm")} />
            <Stat label="Wind" value={formatNumber(current.wind, 1, " km/h")} />
            <Stat label="Condition" value={current.condition || "—"} />
          </div>
        </>
      )}
      {chartData.length > 0 && (
        <div className="mt-6 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dcece1" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} interval={1} />
              <YAxis yAxisId="temp" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="rain" orientation="right" tick={{ fontSize: 11 }} />
              <Tooltip
                labelFormatter={(_, payload) => payload?.[0]?.payload?.dateLabel || ""}
                formatter={(value, name) => [value, name]}
              />
              <Legend />
              <Line yAxisId="temp" type="monotone" dataKey="max" name="Temp max °C" stroke="#1b4332" strokeWidth={2} dot={false} />
              <Line yAxisId="temp" type="monotone" dataKey="min" name="Temp min °C" stroke="#54986f" strokeWidth={2} dot={false} />
              <Line yAxisId="rain" type="monotone" dataKey="rain" name="Rain mm" stroke="#d4a373" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {(weather?.daily || []).length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-xs text-forest-800">
            <thead>
              <tr className="border-b border-forest-100 text-[10px] uppercase tracking-wide text-forest-500">
                <th className="py-2 pr-3">Date (IST)</th>
                <th className="py-2 pr-3">Max °C</th>
                <th className="py-2 pr-3">Min °C</th>
                <th className="py-2">Rain mm</th>
              </tr>
            </thead>
            <tbody>
              {weather.daily.slice(0, 8).map((d) => (
                <tr key={d.date} className="border-b border-forest-50">
                  <td className="py-1.5 pr-3 font-medium">{d.dateLabel}</td>
                  <td className="py-1.5 pr-3">{formatNumber(d.tempMax, 1)}</td>
                  <td className="py-1.5 pr-3">{formatNumber(d.tempMin, 1)}</td>
                  <td className="py-1.5">{formatNumber(d.precipitation, 1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-3 text-xs text-forest-600">
        Forecast days follow the Indian calendar date, not UTC. This is a short-range forecast, not a 3–4 month climate
        prediction.
      </p>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-forest-50 bg-wheat-50 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-forest-500">{label}</p>
      <p className="text-sm font-semibold text-forest-900">{value}</p>
    </div>
  );
}
