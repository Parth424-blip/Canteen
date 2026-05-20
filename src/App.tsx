import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LogEntry from "./pages/LogEntry";
import History from "./pages/History";
import Insights from "./pages/Insights";
import Auth from "./pages/Auth";
import { useState } from "react";
import "./App.css";
import { useEffect } from "react";
import { supabase } from "./lib/supabase";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
  }, []);

  function ProtectedRoute({ children }) {
    if (!isAuthenticated) {
      return <Navigate to="/auth" />
    }
    return children
  }
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/log" element={<ProtectedRoute><LogEntry /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
      <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
