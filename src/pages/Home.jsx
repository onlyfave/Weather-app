import { useState } from "react";
import SearchBar from "../components/SearchBar";
import WeatherCard from "../components/WeatherCard";
import HourlyForecast from "../components/HourlyForecast";
import DailyForecast from "../components/DailyForecast";
import InfoBox from "../components/InfoBox";
import Loader from "../components/Loader";
import { fetchCurrent, fetchHourly } from "../utils/fetchWeather";
export default function Home({ units = "C" }) {
  // show a default UI before any search — values update when a search occurs
  const defaultDt = Math.floor(
    new Date("2025-11-05T09:00:00").getTime() / 1000
  );
  const defaultCurrent = {
    name: "Lagos, Nigeria",
    dt: defaultDt,
    main: { temp: 20, feels_like: 18, humidity: 46 },
    weather: [{ id: 1, description: "Sunny", icon: null }],
    wind: { speed: 14 },
    coord: { lat: 6.5244, lon: 3.3792 },
  };

  // default placeholder hourly: span 7 days (168 hours) so daily derivation
  // produces a 7-day preview on first load.
  const defaultHourly = Array.from({ length: 24 * 7 }).map((_, i) => {
    const temps = [20, 20, 19, 19, 18, 18, 17, 16, 16, 15, 15, 14];
    const temp = temps[i % temps.length] - Math.floor(i / 48); // slight downward trend over days
    return {
      dt: defaultDt + i * 3600,
      main: { temp },
      weather: [
        {
          id: i % 6 === 0 ? 80 : 1,
          description: i % 6 === 0 ? "Rain" : "Clear",
          icon: null,
        },
      ],
    };
  });

  const [current, setCurrent] = useState(defaultCurrent);
  const [hourly, setHourly] = useState(defaultHourly);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSearch(query) {
    setLoading(true);
    setError(null);
    try {
      // fetch current weather by city name
      const cur = await fetchCurrent(query);
      setCurrent(cur);

      // fetch hourly/forecast using coordinates from current
      const { coord } = cur || {};
      if (coord?.lat != null && coord?.lon != null) {
        const raw = await fetchHourly(coord.lat, coord.lon);
        // the /forecast endpoint returns a `list` array of 3-hour steps
        setHourly(raw.list || hourly);
      }
    } catch (err) {
      setError(err.message || "Could not fetch weather");
    } finally {
      setLoading(false);
    }
  }

  // derive daily summary from hourly list
  const daily = (() => {
    if (!hourly) return null;
    const byDay = {};
    for (const it of hourly) {
      const d = new Date(it.dt * 1000);
      const key = d.toISOString().slice(0, 10);
      if (!byDay[key]) byDay[key] = { temps: [], codes: [] };
      byDay[key].temps.push(it.main.temp);
      byDay[key].codes.push(it.weather?.[0]?.id ?? 0);
    }
    const days = Object.keys(byDay)
      .slice(0, 7)
      .map((k) => {
        const entry = byDay[k];
        const max = Math.max(...entry.temps);
        const min = Math.min(...entry.temps);
        // pick most frequent code
        const freq = {};
        for (const c of entry.codes) freq[c] = (freq[c] || 0) + 1;
        const modeCode = parseInt(
          Object.keys(freq).reduce((a, b) => (freq[a] > freq[b] ? a : b))
        );
        return { date: k, max, min, code: modeCode };
      });
    return days;
  })();

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#061025,_#050314)] text-white">
      <main className="py-12 px-6">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-5xl font-bold display-font text-center mb-6">
            How’s the sky looking today?
          </h2>

          <div className="w-full mb-6">
            <SearchBar onSearch={handleSearch} />
          </div>

          {loading && <Loader />}

          {error && (
            <div className="p-4 rounded-lg bg-red-600 text-white mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-8">
              <div className="mb-8">
                <WeatherCard data={current} units={units} />
              </div>

              <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-6">
                <InfoBox
                  label="Feels Like"
                  value={
                    current
                      ? `${Math.round(current.main.feels_like)}°${units}`
                      : "—"
                  }
                />
                <InfoBox
                  label="Humidity"
                  value={current ? `${current.main.humidity}%` : "—"}
                />
                <InfoBox
                  label="Wind"
                  value={
                    current
                      ? units === "F"
                        ? `${Math.round(current.wind.speed * 0.621371)} mph`
                        : `${Math.round(current.wind.speed)} km/h`
                      : "—"
                  }
                />
                <InfoBox label="Precipitation" value={`0 mm`} />
              </div>

              {daily && <DailyForecast days={daily} units={units} />}
            </div>

            <aside className="lg:col-span-1">
              {hourly && <HourlyForecast list={hourly} />}
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
