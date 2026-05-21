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
    </>
  );
}

export default Dashboard;
