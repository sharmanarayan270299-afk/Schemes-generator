import { useMemo, useState } from "react";
import type { Scheme, SchemeStatus } from "../types";

interface Props {
  schemes: Scheme[];
  loading: boolean;
  onSelect: (scheme: Scheme) => void;
  selectedId?: string;
}

type SortKey = "name" | "category" | "level" | "status" | "launchYear" | "deadline";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "name", label: "Scheme" },
  { key: "category", label: "Category" },
  { key: "level", label: "Level" },
  { key: "status", label: "Status" },
  { key: "launchYear", label: "Launched" },
  { key: "deadline", label: "Deadline" },
];

function statusClass(status: SchemeStatus): string {
  return `status-badge status-${status.toLowerCase()}`;
}

export function SchemeGrid({ schemes, loading, onSelect, selectedId }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);

  const sorted = useMemo(() => {
    const copy = [...schemes];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sortAsc ? cmp : -cmp;
    });
    return copy;
  }, [schemes, sortKey, sortAsc]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  if (loading) {
    return <div className="grid-empty">Loading schemes…</div>;
  }

  if (schemes.length === 0) {
    return <div className="grid-empty">No schemes match the current filters.</div>;
  }

  return (
    <div className="grid-wrapper">
      <table className="scheme-grid">
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th key={col.key} onClick={() => toggleSort(col.key)}>
                {col.label}
                {sortKey === col.key ? (sortAsc ? " ▲" : " ▼") : ""}
              </th>
            ))}
            <th>Benefit Type</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((s) => (
            <tr
              key={s.id}
              className={s.id === selectedId ? "row-selected" : ""}
              onClick={() => onSelect(s)}
            >
              <td className="scheme-name">{s.name}</td>
              <td>{s.category}</td>
              <td>{s.level}</td>
              <td>
                <span className={statusClass(s.status)}>{s.status}</span>
              </td>
              <td>{s.launchYear}</td>
              <td>{s.deadline}</td>
              <td>{s.benefitType}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
