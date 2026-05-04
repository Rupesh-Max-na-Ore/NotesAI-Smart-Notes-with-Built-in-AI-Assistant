import { useState } from "react";
import Login from "./pages/Login";
import Main from "./pages/Main";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return <Main />;
}

export default App;