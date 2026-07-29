import type { Stats } from "../types";

interface Props {
  stats: Stats | null;
}

export function SummaryCards({ stats }: Props) {
  const cards = [
    { label: "Total Schemes", value: stats?.total ?? "—" },
    { label: "Active", value: stats?.active ?? "—", accent: "active" },
    { label: "Upcoming", value: stats?.upcoming ?? "—", accent: "upcoming" },
    { label: "Closed", value: stats?.closed ?? "—", accent: "closed" },
    { label: "Categories", value: stats?.categories ?? "—" },
  ];

  return (
    <div className="summary-cards">
      {cards.map((c) => (
        <div key={c.label} className={`summary-card ${c.accent ?? ""}`}>
          <div className="summary-value">{c.value}</div>
          <div className="summary-label">{c.label}</div>
        </div>
      ))}
    </div>
  );
}
