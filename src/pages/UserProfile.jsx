import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function UserProfile() {
  const { username: routeUsername } = useParams();
  const auth = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState(auth?.user?.username || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (auth?.user?.username) setUsername(auth.user.username);
  }, [auth?.user?.username]);

  async function handleSave(e) {
    e.preventDefault();
    if (!username) return;
    setSaving(true);
    try {
      // update user in context (persisted to localStorage by context)
      auth.updateUser({ username });
      // navigate to new profile URL
      navigate(`/user/${encodeURIComponent(username)}`, { replace: true });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-semibold mb-4">User profile</h2>

      <div className="mb-6 text-sm text-neutral300">
        Logged in as: {auth?.user?.email || auth?.user?.username}
      </div>

      <form onSubmit={handleSave} className="max-w-md space-y-4">
        <label className="block text-sm">Username</label>
        <input
          className="w-full p-2 rounded bg-white/5"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="flex gap-3">
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white"
            disabled={saving}
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded bg-white/5"
            onClick={() => {
              setUsername(auth?.user?.username || "");
              navigate(-1);
            }}
          >
            Cancel
          </button>
        </div>
      </form>

      <div className="mt-8 text-sm text-neutral300">
        Route username: {routeUsername}
      </div>
    </div>
  );
}
