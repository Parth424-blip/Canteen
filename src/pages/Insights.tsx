import { useState } from "react";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { Entry } from "../types/index";

function Insights() {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      const { data, error } = await supabase
        .from("entries")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
      if (error) console.error(error);
      else if (data) setEntries(data as Entry[]);
    });
  }, []);

  const totalAmount = entries.reduce((acc, entry) => acc + entry.amount, 0);

  const vibeTagCounter = entries.reduce((acc, entry) => {
    if (entry.vibe_tag) {
      acc[entry.vibe_tag] = (acc[entry.vibe_tag] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const vibeKeys = Object.keys(vibeTagCounter);
  const highestVibeTag = vibeKeys.length > 0
    ? vibeKeys.reduce((a, b) => (vibeTagCounter[a] > vibeTagCounter[b] ? a : b))
    : "None";

  const amountByTag = entries.reduce((acc, entry) => {
    if (entry.vibe_tag) {
      acc[entry.vibe_tag] = (acc[entry.vibe_tag] || 0) + entry.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const amountKeys = Object.keys(amountByTag);
  const highestAmountByTag = amountKeys.length > 0
    ? amountKeys.reduce((a, b) => (amountByTag[a] > amountByTag[b] ? a : b))
    : "None";

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Insights</h1>
        <p className="text-sm text-neutral-400 mt-1">Deep analysis of your canteen spending vibes</p>
      </div>

      {entries.length === 0 ? (
        <div className="bg-[#121212]/40 border border-neutral-900 backdrop-blur-md p-12 rounded-2xl shadow-xl text-center text-neutral-500 text-sm">
          Not enough data to generate insights. Start logging entries to see details!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Total Amount */}
          <div className="bg-[#121212]/40 border border-neutral-900 backdrop-blur-md p-6 rounded-2xl shadow-xl flex flex-col justify-between hover:border-neutral-850 transition-all duration-200 animate-fade-in">
            <div>
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total Amount Spent</span>
              <h2 className="text-3xl font-extrabold text-amber-500 mt-3">${totalAmount.toFixed(2)}</h2>
            </div>
            <div className="text-xs text-neutral-400 mt-6 flex items-center gap-1.5">
              <span>💳</span> Across all categories
            </div>
          </div>

          {/* Card 2: Highest Vibe Tag */}
          <div className="bg-[#121212]/40 border border-neutral-900 backdrop-blur-md p-6 rounded-2xl shadow-xl flex flex-col justify-between hover:border-neutral-850 transition-all duration-200 animate-fade-in">
            <div>
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Most Frequent Vibe</span>
              <h2 className="text-3xl font-extrabold text-white mt-3 truncate">{highestVibeTag}</h2>
            </div>
            <div className="text-xs text-neutral-400 mt-6 flex items-center gap-1.5">
              <span>🔥</span> Highest vibe tag count
            </div>
          </div>

          {/* Card 3: Highest Amount Tag */}
          <div className="bg-[#121212]/40 border border-neutral-900 backdrop-blur-md p-6 rounded-2xl shadow-xl flex flex-col justify-between hover:border-neutral-850 transition-all duration-200 animate-fade-in">
            <div>
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Highest Spending Category</span>
              <h2 className="text-3xl font-extrabold text-white mt-3 truncate">{highestAmountByTag}</h2>
            </div>
            <div className="text-xs text-neutral-400 mt-6 flex items-center gap-1.5">
              <span>📈</span> Most expensive vibe category
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Insights;
