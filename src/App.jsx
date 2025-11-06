import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import UserProfile from "./pages/UserProfile";
import SignIn from "./pages/SignIn";
import RequireAuth from "./components/RequireAuth";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  const [units, setUnits] = useState("C");

  return (
    <Router>
      <AuthProvider>
        <div>
          <Navbar units={units} onChangeUnits={(u) => setUnits(u)} />
          <div>
            <Routes>
              <Route path="/" element={<Home units={units} />} />
              <Route path="/signin" element={<SignIn />} />
              <Route
                path="/user/:username"
                element={
                  <RequireAuth>
                    <UserProfile />
                  </RequireAuth>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
