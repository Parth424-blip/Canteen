import { useState } from "react";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { Entry } from "../types/index";
import { useNavigate } from "react-router-dom";
import type { PostgrestResponse } from "@supabase/supabase-js";

function Dashboard() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    supabase
      .from("entries")
      .select("*")
      .then((res: PostgrestResponse<Entry>) => {
        if (res.error) console.error(res.error);
        else if (res.data) setEntries(res.data as Entry[]);
      });
  }, []);

  function getPersonality(tag: string) {
    if (tag === "Impulse") return "You're an Impulse Spender 🔥";
    if (tag === "Investment") return "You're a Strategic Investor 📈";
    if (tag === "Experience") return "You're an Experience Seeker 🌍";
    if (tag === "Necessary") return "You're a Mindful Spender 🧘";
    return "Start logging to discover your personality";
  }

  const todayAmount = entries.reduce((acc, entry) => {
    if (
      entry.created_at.split("T")[0] === new Date().toISOString().split("T")[0]
    ) {
      acc += entry.amount;
    }
    return acc;
  }, 0);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const weeklyAmount = entries.reduce((acc, entry) => {
    if (entry.created_at >= sevenDaysAgo.toISOString()) {
      acc += entry.amount;
    }
    return acc;
  }, 0);

  const recentEntries = entries.slice(-5);
  const vibeTagCounter = entries.reduce((acc, entry) => {
    if (entry.vibe_tag) {
      acc[entry.vibe_tag] = (acc[entry.vibe_tag] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const keys = Object.keys(vibeTagCounter);
  const highestVibeTag = keys.length > 0
    ? keys.reduce((a, b) => (vibeTagCounter[a] > vibeTagCounter[b] ? a : b))
    : "";

  function getVibeTagBadge(vibe: string | undefined) {
    if (!vibe) return null;
    const classes: Record<string, string> = {
      Necessary: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      Impulse: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      Investment: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      Experience: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${classes[vibe] || "bg-neutral-800 text-neutral-400 border-neutral-700"}`}>
        {vibe}
      </span>
    );
  }

  return (
    <div className="space-y-8">
      {/* Greeting and Personality Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Dashboard</h1>
          <p className="text-sm text-neutral-400 mt-1">Welcome back. Here is your budget status.</p>
        </div>
        {highestVibeTag && (
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold self-start md:self-auto shadow-md">
            {getPersonality(highestVibeTag)}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#121212]/40 border border-neutral-900 backdrop-blur-md p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Today's Spend</span>
            <h2 className="text-4xl font-extrabold text-white mt-2">${todayAmount.toFixed(2)}</h2>
          </div>
          <div className="text-xs text-neutral-400 mt-6 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Live tracking active
          </div>
        </div>
        <div className="bg-[#121212]/40 border border-neutral-900 backdrop-blur-md p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Weekly Spend (7 Days)</span>
            <h2 className="text-4xl font-extrabold text-white mt-2">${weeklyAmount.toFixed(2)}</h2>
          </div>
          <div className="text-xs text-neutral-400 mt-6 flex items-center gap-1">
            <span>📅</span> Rolling 7-day period
          </div>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="bg-[#121212]/40 border border-neutral-900 backdrop-blur-md p-6 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Recent Entries</h3>
          <button
            onClick={() => navigate("/history")}
            className="text-xs font-bold text-amber-500 hover:text-amber-400 transition-colors cursor-pointer"
          >
            View Full History →
          </button>
        </div>

        {recentEntries.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 text-sm">
            No entries logged yet. Click below to add one.
          </div>
        ) : (
          <div className="divide-y divide-neutral-900/60">
            {recentEntries.map((entry) => (
              <div key={entry.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                    <p className="text-sm font-semibold text-white truncate">{entry.label}</p>
                    {getVibeTagBadge(entry.vibe_tag)}
                  </div>
                  {entry.note ? (
                    <p className="text-xs text-neutral-400 truncate">{entry.note}</p>
                  ) : (
                    <p className="text-xs text-neutral-600 italic">No notes added</p>
                  )}
                  <p className="text-[10px] text-neutral-500 mt-1.5">
                    {new Date(entry.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-white">${entry.amount.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating/Bottom Action Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => navigate("/log")}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-black bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/25 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
        >
          <span>➕</span> Log New Entry
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
