import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar({ units = "C", onChangeUnits }) {
  const auth = useAuth();

  return (
    <header className="w-full py-6 px-6 bg-transparent">
      <div className="max-w-[1100px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="bg-orange-500 rounded-full p-1 shadow-md"
          >
            <circle cx="12" cy="12" r="5" fill="#FFB547" />
            <g stroke="#FFB547" strokeWidth="1">
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="M4.2 4.2l1.4 1.4" />
              <path d="M18.4 18.4l1.4 1.4" />
              <path d="M4.2 19.8l1.4-1.4" />
              <path d="M18.4 5.6l1.4-1.4" />
            </g>
          </svg>
          <h1 className="text-2xl font-bold text-white display-font">
            <Link to="/">Weather Now</Link>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm text-neutral300">Units</label>
            <select
              aria-label="Units"
              value={units}
              onChange={(e) => onChangeUnits && onChangeUnits(e.target.value)}
              className="small-btn text-white"
            >
              <option value="C">°C</option>
              <option value="F">°F</option>
            </select>
          </div>

          <div>
            {auth?.user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-neutral300">
                  {auth.user.username}
                </span>
                <button className="small-btn" onClick={() => auth.signOut()}>
                  Sign out
                </button>
              </div>
            ) : (
              <Link to="/signin" className="small-btn">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
