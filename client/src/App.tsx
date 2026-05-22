import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EditorPage from "./pages/EditorPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route
  path="/"
  element={
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  }
/>
     <Route
  path="/room/:roomId"
  element={
    <ProtectedRoute>
      <EditorPage />
    </ProtectedRoute>
  }
/>
      <Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;