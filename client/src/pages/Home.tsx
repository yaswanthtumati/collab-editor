import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

function Home() {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const currentUser = localStorage.getItem("username");

  const createNewRoom = () => {
    if (!username) {
      alert("Enter username");
      return;
    }

    const id = uuidV4();

    navigate(`/room/${id}`, {
      state: {
        username,
      },
    });
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      alert("Username and Room ID required");
      return;
    }

    navigate(`/room/${roomId}`, {
      state: {
        username,
      },
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    navigate("/login");
  };

  return (
    <div className="h-screen bg-[#0f0f0f] flex items-center justify-center">
      <div className="bg-[#1c1c1c] p-10 rounded-2xl w-[400px] shadow-2xl">
        <h1 className="text-white text-4xl font-bold text-center mb-4">
          Collab Editor
        </h1>

        <p className="text-gray-400 text-center mb-6">
          Logged in as{" "}
          <span className="text-white font-semibold">
            {currentUser}
          </span>
        </p>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-[#2a2a2a] text-white p-3 rounded-lg outline-none"
          />

          <input
            type="text"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="bg-[#2a2a2a] text-white p-3 rounded-lg outline-none"
          />

          <button
            onClick={joinRoom}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition"
          >
            Join Room
          </button>

          <button
            onClick={createNewRoom}
            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg transition"
          >
            Create New Room
          </button>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;