import React from "react";

function codeToEmoji(code) {
  if (code == null) return "☀️";
  const c = Number(code);
  if ([0, 1].includes(c)) return "🌤️";
  if ([2, 3, 45, 48].includes(c)) return "🌥️";
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(c)) return "🌧️";
  if ([71, 73, 75, 85, 86, 77].includes(c)) return "❄️";
  if ([95, 96, 99].includes(c)) return "⛈️";
  return "🌤️";
}

function dayLabel(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

function tempForUnits(t, units) {
  if (t == null) return "—";
  if (units === "F") return `${Math.round((t * 9) / 5 + 32)}°`;
  return `${Math.round(t)}°`;
}

export default function DailyForecast({ days = [], units = "C" }) {
  if (!days || days.length === 0) return null;

  // `days` use ISO date keys like '2025-11-06'. Compare with today's ISO date.
  const todayKey = new Date().toISOString().slice(0, 10);

  return (
    <section className="w-full max-w-4xl mx-auto px-4">
      <h3 className="text-lg font-semibold mb-3">Daily forecast</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 md:gap-4 lg:gap-6 py-2 md:py-3 justify-center justify-items-center">
        {days.map((d) => {
          const isToday = d.date === todayKey;
          return (
            <div
              key={d.date}
              className={`max-w-[160px] w-full sm:w-auto p-3 sm:p-4 md:p-5 rounded-lg text-center shadow-sm flex flex-col items-center ${
                isToday ? "daily-card--today" : "daily-card"
              }`}
              aria-current={isToday ? "date" : undefined}
              aria-label={`Forecast for ${dayLabel(
                d.date
              )} - high ${tempForUnits(d.max, units)}, low ${tempForUnits(
                d.min,
                units
              )}`}
            >
              <div className="text-sm sm:text-base text-neutral300 mb-2 sm:mb-3 flex items-center gap-2">
                <span className="font-medium">{dayLabel(d.date)}</span>
                {isToday && <span className="daily-badge">Today</span>}
              </div>

              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg flex items-center justify-center mb-3 ${
                  isToday
                    ? "bg-gradient-to-br from-purple-600 to-indigo-600"
                    : "bg-[rgba(255,255,255,0.03)]"
                }`}
              >
                <span
                  className={`text-3xl sm:text-4xl md:text-5xl ${
                    isToday ? "scale-110" : ""
                  }`}
                  aria-hidden
                >
                  {codeToEmoji(d.code)}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm sm:text-base w-full">
                <span
                  className={`${
                    isToday ? "text-white font-semibold" : "text-neutral200"
                  }`}
                >
                  {tempForUnits(d.max, units)}
                </span>
                <span className="text-neutral300 text-right">
                  {tempForUnits(d.min, units)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
