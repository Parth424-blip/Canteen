import { useState } from "react";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { Entry } from "../types/index";

function Insights() {
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

  const totalAmount = entries.reduce((acc, entry) => acc + entry.amount, 0);
  const vibeTagCounter = entries.reduce((vibeTagCounter, entry) => {
    if (entry.vibe_tag) {
      if (vibeTagCounter[entry.vibe_tag]) {
        vibeTagCounter[entry.vibe_tag] += 1;
      } else {
        vibeTagCounter[entry.vibe_tag] = 1;
      }
    }
    return vibeTagCounter;
  });
  const highestVibeTag = Object.keys(vibeTagCounter).reduce((a, b) =>
    vibeTagCounter[a] > vibeTagCounter[b] ? a : b,
  );
  const amountByTag = entries.reduce((acc, entry) => {
    if (entry.vibe_tag) {
      if (acc[entry.vibe_tag]) {
        acc[entry.vibe_tag] += entry.amount;
      } else {
        acc[entry.vibe_tag] = entry.amount;
      }
    }
    return acc;
  }, {});
  const highestAmountByTag = Object.keys(amountByTag).reduce((a, b) =>
    amountByTag[a] > amountByTag[b] ? a : b,
  );

  return (
    <>
      <p>Total amount: {totalAmount}</p>
      <p>Highest vibe tag: {highestVibeTag}</p>
      <p>Highest vibe tag count: {highestAmountByTag}</p>
    </>
  );
}

export default Insights;
