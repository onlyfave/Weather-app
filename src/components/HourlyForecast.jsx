import { motion } from "framer-motion";

function HourItem({ item }) {
  const time = new Date(item.dt * 1000).toLocaleTimeString([], {
    hour: "numeric",
    hour12: true,
  });
  const temp = Math.round(item.main.temp);
  const icon = item.weather?.[0]?.icon;
  return (
    <div className="flex items-center justify-between p-4 rounded-lg card">
      <div className="flex items-center gap-4">
        {icon && (
          <img
            src={`https://openweathermap.org/img/wn/${icon}.png`}
            alt=""
            className="w-9 h-9"
          />
        )}
        <div>
          <p className="text-sm">{time}</p>
          <p className="text-xs text-neutral300">
            {item.weather?.[0]?.description}
          </p>
        </div>
      </div>
      <div className="text-sm font-semibold">{temp}°</div>
    </div>
  );
}

export default function HourlyForecast({ list }) {
  if (!list) return null;

  // pick 8 upcoming items (3-hourly intervals from /forecast)
  const items = list.slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-sm mx-auto px-4 sm:max-w-md md:max-w-lg"
    >
      <h3 className="text-sm font-semibold mb-4">Hourly forecast</h3>
      <div className="flex flex-col gap-4 overflow-auto hourly-scroll max-h-[480px]">
        {items.map((it) => (
          <HourItem key={it.dt} item={it} />
        ))}
      </div>
    </motion.div>
  );
}
