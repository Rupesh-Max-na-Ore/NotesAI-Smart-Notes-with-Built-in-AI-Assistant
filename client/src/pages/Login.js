import { useState } from "react";
import API from "../api";

export default function Login({ setToken }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      const endpoint = isSignup ? "/auth/signup" : "/auth/login";

      const res = await API.post(endpoint, {
        email,
        password,
      });

      // Signup may not return token → auto-login
      if (isSignup) {
        const loginRes = await API.post("/auth/login", {
          email,
          password,
        });
        localStorage.setItem("token", loginRes.data.token);
        setToken(loginRes.data.token);
      } else {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
      }
    } catch (err) {
      alert(isSignup ? "Signup failed" : "Login failed");
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-center">
          {isSignup ? "Sign Up" : "Login"}
        </h2>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className={`w-full p-2 text-white ${
            isSignup ? "bg-green-500" : "bg-blue-500"
          }`}
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <p className="text-sm text-center mt-3">
          {isSignup ? "Already have an account?" : "New user?"}{" "}
          <button
            className="text-blue-500 underline"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Login" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}