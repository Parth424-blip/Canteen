import { useState } from "react";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { Entry } from "../types/index";
import type { PostgrestResponse } from "@supabase/supabase-js";

function History() {
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
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Spending History</h1>
        <p className="text-sm text-neutral-400 mt-1">A complete log of your canteen entries</p>
      </div>

      {entries.length === 0 ? (
        <div className="bg-[#121212]/40 border border-neutral-900 backdrop-blur-md p-12 rounded-2xl shadow-xl text-center text-neutral-500 text-sm">
          No entries logged yet. Go to Log Entry to add one.
        </div>
      ) : (
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-[#121212]/40 border border-neutral-900 backdrop-blur-sm p-5 rounded-xl shadow-md hover:border-neutral-850 transition-all duration-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                  <h3 className="text-sm font-semibold text-white truncate">{entry.label}</h3>
                  {getVibeTagBadge(entry.vibe_tag)}
                </div>
                {entry.note ? (
                  <p className="text-xs text-neutral-400 mt-1">{entry.note}</p>
                ) : (
                  <p className="text-xs text-neutral-600 italic mt-1">No note provided</p>
                )}
                <p className="text-[10px] text-neutral-500 mt-2">
                  {new Date(entry.created_at).toLocaleDateString(undefined, {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <span className="text-lg font-extrabold text-white">${entry.amount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;
