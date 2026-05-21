import { useState } from "react";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { Entry } from "../types/index";

function History() {
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
  return (
    <>
      <div>
        {entries.map((entry) => (
          <div key={entry.id}>
            <p>{entry.label}</p>
            <p>{entry.amount}</p>
            <p>{entry.vibe_tag}</p>
            <p>{entry.note}</p>
            <p>{entry.created_at}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default History;
