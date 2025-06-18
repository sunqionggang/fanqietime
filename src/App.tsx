import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import TimerPage from "@/pages/TimerPage";
import TasksPage from "@/pages/TasksPage";
import { createContext, useState } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (value: boolean) => {},
  logout: () => {},
});

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout }}
    >
      <Routes>
        <Route path="/" element={<TimerPage />} />
        <Route path="/tasks" element={<TasksPage />} />
      </Routes>
    </AuthContext.Provider>
  );
}
