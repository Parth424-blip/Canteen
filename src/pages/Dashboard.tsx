import { useState } from "react";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { Entry } from "../types/index";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    supabase
      .from("entries")
      .select("*")
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setEntries(data as Entry[]);
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
  const vibeTagCounter = entries.reduce((vibeTagCounter, entry) => {
    if (entry.vibe_tag) {
      if (vibeTagCounter[entry.vibe_tag]) {
        vibeTagCounter[entry.vibe_tag] += 1;
      } else {
        vibeTagCounter[entry.vibe_tag] = 1;
      }
    }
    return vibeTagCounter;
  }, {});
  const highestVibeTag = Object.keys(vibeTagCounter).reduce((a, b) =>
    vibeTagCounter[a] > vibeTagCounter[b] ? a : b,
  );

  return (
    <>
      <p>Today's Amount: {todayAmount}</p>
      <p>Weekly Amount: {weeklyAmount}</p>
      <p>Recent Entries:</p>
      {recentEntries.map((entry) => (
        <div key={entry.id}>
          <p>{entry.label}</p>
          <p>{entry.amount}</p>
          <p>{entry.vibe_tag}</p>
          <p>{entry.note}</p>
          <p>{entry.created_at}</p>
        </div>
      ))}
      <button onClick={() => navigate("/log")}>Add Entry</button>
      <p>{getPersonality(highestVibeTag)}</p>
    </>
  );
}

export default Dashboard;
