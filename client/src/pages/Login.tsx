import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        {
          username,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);

      localStorage.setItem(
        "username",
        response.data.username
      );

      toast.success("Login successful");

      navigate("/");
    } catch (error: any) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#0f0f0f]">
      <div className="bg-[#1c1c1c] p-10 rounded-2xl w-[400px]">
        <h1 className="text-white text-4xl font-bold mb-8 text-center">
          Login
        </h1>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-[#2a2a2a] text-white p-3 rounded-lg outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#2a2a2a] text-white p-3 rounded-lg outline-none"
          />

          <button
            onClick={handleLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;