import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { socket } from "../socket";

function EditorPage() {
  const { roomId } = useParams();

  const navigate = useNavigate();

  const location = useLocation();

  const username = location.state?.username || "Anonymous";

  const [code, setCode] = useState("// Start coding...");
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    socket.emit("join-room", {
      roomId,
      username,
    });

    socket.on("receive-changes", (newCode) => {
      setCode(newCode);
    });

    socket.on("users-in-room", (usersList) => {
      setUsers(usersList);
    });

    socket.on("load-code", (savedCode) => {
      setCode(savedCode);
    });

    return () => {
      socket.off("receive-changes");
      socket.off("users-in-room");
      socket.off("load-code");
    };
  }, [roomId]);

  const handleEditorChange = (value: string | undefined) => {
    const updatedCode = value || "";

    setCode(updatedCode);

    socket.emit("send-changes", {
      roomId,
      code: updatedCode,
    });
  };

  const copyRoomId = async () => {
    await navigator.clipboard.writeText(window.location.href);

    toast.success("Room link copied!");
  };

  const leaveRoom = () => {
    navigate("/");
  };

  return (
    <div className="h-screen flex bg-[#0f0f0f]">
      <div className="w-[280px] bg-[#1c1c1c] text-white flex flex-col p-5">
        <h1 className="text-3xl font-bold mb-10">Collab IDE</h1>

        <div className="mb-6">
          <h2 className="text-sm text-gray-400 mb-2">Room ID</h2>

          <div className="bg-[#2a2a2a] p-3 rounded-lg break-all text-sm">
            {roomId}
          </div>
        </div>

        <button
          onClick={copyRoomId}
          className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg mb-3 transition"
        >
          Copy Room ID
        </button>

        <button
          onClick={leaveRoom}
          className="bg-red-600 hover:bg-red-700 p-3 rounded-lg transition"
        >
          Leave Room
        </button>

        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-4">Online Users</h2>

          <div className="flex flex-col gap-3">
            {users.map((user, index) => (
              <div
                key={index}
                className="bg-[#2a2a2a] p-3 rounded-lg"
              >
                {user}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
        />
      </div>
    </div>
  );
}

export default EditorPage;