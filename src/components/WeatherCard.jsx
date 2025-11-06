import { motion } from "framer-motion";

function tempForUnits(tempC, units) {
  if (tempC == null) return "—";
  if (units === "F") return `${Math.round((tempC * 9) / 5 + 32)}°`;
  return `${Math.round(tempC)}°`;
}

function codeToEmoji(code) {
  if (code == null) return "☀️";
  const c = Number(code);
  if ([0, 1].includes(c)) return "☀️";
  if ([2, 3, 45, 48].includes(c)) return "⛅";
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(c)) return "🌧️";
  if ([71, 73, 75, 85, 86, 77].includes(c)) return "❄️";
  if ([95, 96, 99].includes(c)) return "⛈️";
  return "🌤️";
}

export default function WeatherCard({ data, units = "C" }) {
  if (!data) return null;
  const { name, main, weather, dt } = data;
  const icon = weather?.[0]?.icon;
  const desc = weather?.[0]?.description;
  const code = weather?.[0]?.id;

  const date = new Date(dt * 1000).toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
  className="w-full max-w-5xl rounded-3xl p-10 md:p-16 bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-800 text-white shadow-2xl relative overflow-hidden min-h-[200px] md:min-h-[260px]"
    >
      {/* decorative SVG sparkles */}
      <svg
        className="hero-sparkles"
        width="100%"
        height="100%"
        viewBox="0 0 600 200"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <g fill="#FFD966" opacity="0.06">
          <circle cx="520" cy="30" r="4" />
          <circle cx="480" cy="80" r="3" />
          <circle cx="540" cy="120" r="5" />
          <circle cx="300" cy="40" r="2" />
          <circle cx="60" cy="90" r="3" />
        </g>
      </svg>

      <div className="flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="text-left">
          <p className="text-lg font-semibold">{name}</p>
          <p className="text-sm opacity-90">{date}</p>
        </div>

        <div className="flex items-center gap-8">
          <div>
            <h1 className="text-7xl md:text-8xl font-bold leading-none">
              {tempForUnits(main.temp, units)}
            </h1>
            <p className="text-base opacity-90 capitalize">{desc}</p>
          </div>
          {icon ? (
            <img
              src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
              alt={desc}
              className="w-36 h-36 md:w-44 md:h-44"
            />
          ) : (
            <div className="text-7xl md:text-8xl">{codeToEmoji(code)}</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
