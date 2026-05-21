export interface Entry {
  id: string;
  user_id: string;
  amount: number;
  label: string;
  vibe_tag?: "Necessary" | "Impulse" | "Investment" | "Experience";
  note?: string;
  created_at: string;
}
