import { useState } from "react";
import type { FormEvent } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

function LogEntry() {
  const [vibeTag, setVibeTag] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [label, setLabel] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setErrorMsg("You are not logged in. Please sign in first.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("entries")
      .insert({
        amount,
        label,
        vibe_tag: vibeTag || null,
        note: note || null,
        user_id: session.user.id,
      });

    setLoading(false);

    if (error) {
      console.error("Insert error:", error);
      setErrorMsg(`Failed to save entry: ${error.message}`);
      return;
    }

    setAmount(0);
    setLabel("");
    setVibeTag("");
    setNote("");
    navigate("/");
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-[#121212]/40 border border-neutral-900 backdrop-blur-md p-8 rounded-2xl shadow-xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>📝</span> Log Entry
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Record your spending details below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Amount Input */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Amount ($)
              </label>
              <input
                type="number"
                step="any"
                required
                placeholder="0.00"
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="appearance-none block w-full px-4 py-3 border border-neutral-800 placeholder-neutral-600 text-white rounded-xl bg-neutral-950/80 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 sm:text-sm transition-all duration-200"
              />
            </div>

            {/* Label Input */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Label / Expense Name
              </label>
              <input
                type="text"
                required
                placeholder="Canteen lunch, groceries, etc."
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-neutral-800 placeholder-neutral-600 text-white rounded-xl bg-neutral-950/80 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 sm:text-sm transition-all duration-200"
              />
            </div>

            {/* Vibe Tags selectable chips */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Vibe / Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  {
                    tag: "Necessary",
                    active:
                      "bg-blue-500/10 border-blue-500/50 text-blue-400 shadow-blue-500/5",
                    inactive:
                      "bg-neutral-950/60 border-neutral-900 text-neutral-400 hover:text-blue-400 hover:bg-blue-500/5",
                  },
                  {
                    tag: "Impulse",
                    active:
                      "bg-rose-500/10 border-rose-500/50 text-rose-400 shadow-rose-500/5",
                    inactive:
                      "bg-neutral-950/60 border-neutral-900 text-neutral-400 hover:text-rose-400 hover:bg-rose-500/5",
                  },
                  {
                    tag: "Investment",
                    active:
                      "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-emerald-500/5",
                    inactive:
                      "bg-neutral-950/60 border-neutral-900 text-neutral-400 hover:text-emerald-400 hover:bg-emerald-500/5",
                  },
                  {
                    tag: "Experience",
                    active:
                      "bg-purple-500/10 border-purple-500/50 text-purple-400 shadow-purple-500/5",
                    inactive:
                      "bg-neutral-950/60 border-neutral-900 text-neutral-400 hover:text-purple-400 hover:bg-purple-500/5",
                  },
                ].map((item) => {
                  const isSelected = vibeTag === item.tag;
                  return (
                    <button
                      key={item.tag}
                      type="button"
                      onClick={() => setVibeTag(item.tag)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        isSelected ? item.active : item.inactive
                      }`}
                    >
                      {item.tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Note text area */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                placeholder="Write a brief note..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="appearance-none block w-full px-4 py-3 border border-neutral-800 placeholder-neutral-600 text-white rounded-xl bg-neutral-950/80 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 sm:text-sm transition-all duration-200 resize-none"
              />
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold text-black bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/25 transition-all duration-200 cursor-pointer text-center text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin inline-block" />
                Saving...
              </>
            ) : "Submit Entry"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LogEntry;
