// Use Open-Meteo (no API key required). We adapt the responses into a
// shape similar to OpenWeather so existing components (WeatherCard,
// HourlyForecast, InfoBox) keep working without changes.

const GEOCODE = "https://geocoding-api.open-meteo.com/v1/search";
const METEO = "https://api.open-meteo.com/v1/forecast";

function weatherCodeToDescription(code) {
  // Simplified mapping from open-meteo weathercode to description.
  // See: https://open-meteo.com/en/docs (weathercode table)
  const map = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  return map[code] || "Unknown";
}

function isDaytime(isoTime, timezone) {
  try {
    const d = new Date(isoTime);
    const hr = d.getHours();
    return hr >= 6 && hr < 19;
  } catch (e) {
    return true;
  }
}

function weatherCodeToIcon(code, isoTime) {
  // Map open-meteo weathercode to an approximate OpenWeather icon id
  // (01 - clear, 02 - few clouds, 03 - scattered, 04 - broken/overcast,
  // 09/10 - rain, 11 - thunder, 13 - snow, 50 - mist)
  const day = isDaytime(isoTime);
  const suffix = day ? "d" : "n";

  if (code === 0) return `01${suffix}`; // clear
  if (code === 1) return `02${suffix}`; // mainly clear
  if (code === 2) return `02${suffix}`; // partly cloudy
  if (code === 3) return `04${suffix}`; // overcast
  if ([45, 48].includes(code)) return `50${suffix}`; // fog
  if ([51, 53, 55].includes(code)) return `09${suffix}`; // drizzle
  if ([61, 63, 65, 80, 81, 82, 66, 67].includes(code)) return `10${suffix}`; // rain
  if ([71, 73, 75, 85, 86, 77].includes(code)) return `13${suffix}`; // snow
  if ([95, 96, 99].includes(code)) return `11${suffix}`; // thunder
  return `01${suffix}`;
}
async function geocode(name) {
  const res = await fetch(
    `${GEOCODE}?name=${encodeURIComponent(name)}&count=1`
  );
  if (!res.ok) throw new Error("Geocoding failed");
  const data = await res.json();
  if (!data.results || data.results.length === 0)
    throw new Error("Location not found");
  return data.results[0];
}

export async function fetchCurrent(city) {
  // geocode city -> lat/lon, name
  const place = await geocode(city);
  const lat = place.latitude;
  const lon = place.longitude;

  // request current weather and a couple hourly fields (for humidity)
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current_weather: "true",
    hourly: "relativehumidity_2m,temperature_2m,weathercode",
    timezone: "auto",
  });

  const res = await fetch(`${METEO}?${params.toString()}`);
  if (!res.ok) throw new Error("Could not fetch weather");
  const data = await res.json();

  const cw = data.current_weather || {};

  // Try to extract humidity from hourly arrays by finding the index of the current hour
  let humidity = null;
  try {
    if (data.hourly && data.hourly.time && data.hourly.relativehumidity_2m) {
      const times = data.hourly.time;
      const idx = times.findIndex(
        (t) => new Date(t).getTime() === new Date(cw.time).getTime()
      );
      if (idx !== -1) humidity = data.hourly.relativehumidity_2m[idx];
    }
  } catch (e) {
    humidity = null;
  }

  return {
    name:
      place.name && place.country
        ? `${place.name}, ${place.country}`
        : place.name || city,
    dt:
      Math.floor(new Date(cw.time).getTime() / 1000) ||
      Math.floor(Date.now() / 1000),
    main: {
      temp: cw.temperature ?? null,
      feels_like: cw.temperature ?? null,
      humidity,
    },
    weather: [
      {
        id: cw.weathercode ?? 0,
        main: weatherCodeToDescription(cw.weathercode),
        description: weatherCodeToDescription(cw.weathercode),
        icon: weatherCodeToIcon(cw.weathercode, cw.time),
      },
    ],
    wind: {
      speed: cw.windspeed ?? null,
    },
    coord: { lat, lon },
  };
}

export async function fetchHourly(lat, lon) {
  // Get hourly arrays: time, temperature_2m, relativehumidity_2m, weathercode
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    hourly: "temperature_2m,relativehumidity_2m,weathercode",
    timezone: "auto",
  });

  const res = await fetch(`${METEO}?${params.toString()}`);
  if (!res.ok) throw new Error("Could not fetch hourly");
  const data = await res.json();

  const times = data.hourly?.time || [];
  const temps = data.hourly?.temperature_2m || [];
  const humid = data.hourly?.relativehumidity_2m || [];
  const codes = data.hourly?.weathercode || [];

  // Convert to a `list` similar to OpenWeather's forecast list (3-hour steps expected by UI)
  const list = times.map((t, i) => ({
    dt: Math.floor(new Date(t).getTime() / 1000),
    main: { temp: temps[i] ?? null },
    weather: [
      {
        id: codes[i] ?? 0,
        description: weatherCodeToDescription(codes[i]),
        icon: weatherCodeToIcon(codes[i], t),
      },
    ],
    humidity: humid[i] ?? null,
  }));

  // Return object with `list` to match previous code expectations
  return { list };
}
