import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Main from "./pages/Main";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Apply theme to root
  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("light", "dark", "sepia");
    root.classList.add(theme);

    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen transition-colors duration-300">
      {token ? (
        <Main setToken={setToken} theme={theme} setTheme={setTheme} />
      ) : (
        <Login setToken={setToken} />
      )}
    </div>
  );
}

export default App;