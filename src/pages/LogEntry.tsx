import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

function LogEntry() {
  const [vibeTag, setVibeTag] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [label, setLabel] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { error } = await supabase
          .from("entries")
          .insert({ amount, label, vibe_tag: vibeTag, note, user_id: user.id })
          .select();
        if (error) console.error(error);
        else alert("Entry logged");
        setAmount(0);
        setLabel("");
        setVibeTag("");
        setNote("");
        navigate("/log");
      }
    });
  };

  return (
    <>
      <h1>Log Entry</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <input
          type="text"
          placeholder="Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <button type="button" onClick={() => setVibeTag("Necessary")}>
          Necessary
        </button>
        <button type="button" onClick={() => setVibeTag("Impulse")}>
          Impulse
        </button>
        <button type="button" onClick={() => setVibeTag("Investment")}>
          Investment
        </button>
        <button type="button" onClick={() => setVibeTag("Experience")}>
          Experience
        </button>
        <textarea
          placeholder="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default LogEntry;
