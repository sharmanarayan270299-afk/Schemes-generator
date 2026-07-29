import type { CategoryCount, SchemeLevel, SchemeStatus } from "../types";

interface Props {
  categories: CategoryCount[];
  category: string;
  status: string;
  level: string;
  search: string;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

const STATUSES: SchemeStatus[] = ["Active", "Upcoming", "Closed"];
const LEVELS: SchemeLevel[] = ["Central", "State", "Central & State"];

export function FilterBar({
  categories,
  category,
  status,
  level,
  search,
  onCategoryChange,
  onStatusChange,
  onLevelChange,
  onSearchChange,
}: Props) {
  return (
    <div className="filter-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Search schemes by name, department, or tag…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c.category} value={c.category}>
            {c.category} ({c.count})
          </option>
        ))}
      </select>

      <select value={status} onChange={(e) => onStatusChange(e.target.value)}>
        <option value="">All Statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select value={level} onChange={(e) => onLevelChange(e.target.value)}>
        <option value="">All Levels</option>
        {LEVELS.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
    </div>
  );
}
