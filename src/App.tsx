import { Routes, Route, Navigate, Link, useLocation, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LogEntry from "./pages/LogEntry";
import History from "./pages/History";
import Insights from "./pages/Insights";
import Auth from "./pages/Auth";
import { useState, useEffect } from "react";
import "./App.css";
import { supabase } from "./lib/supabase";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
          <span className="text-sm text-gray-400 font-medium tracking-wide">Loading Canteen...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/auth" />;
  return <Layout>{children}</Layout>;
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Log Entry", path: "/log" },
    { name: "History", path: "/history" },
    { name: "Insights", path: "/insights" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex flex-col">
      {/* Top Navbar */}
      <nav className="border-b border-neutral-900 bg-[#0d0d0d]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-xl font-bold tracking-wider text-amber-500 flex items-center gap-2">
                <span className="text-xl">🪙</span> CANTEEN
              </Link>
              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "text-amber-400 bg-amber-500/10"
                          : "text-gray-400 hover:text-gray-200 hover:bg-neutral-900"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleSignOut}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-neutral-800 hover:border-red-500/25 transition-all duration-200 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar at bottom or sub-navbar */}
        <div className="md:hidden border-t border-neutral-900 bg-[#0d0d0d] px-2 py-2 flex justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "text-amber-400 bg-amber-500/10"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/log"
        element={
          <ProtectedRoute>
            <LogEntry />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
      <Route
        path="/insights"
        element={
          <ProtectedRoute>
            <Insights />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
