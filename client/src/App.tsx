import { useEffect, useMemo, useState } from "react";
import { fetchCategories, fetchSchemes, fetchStats } from "./api/schemes";
import { FilterBar } from "./components/FilterBar";
import { LiveUpdatesPanel } from "./components/LiveUpdatesPanel";
import { SchemeDetailPanel } from "./components/SchemeDetailPanel";
import { SchemeGrid } from "./components/SchemeGrid";
import { SummaryCards } from "./components/SummaryCards";
import type { CategoryCount, Scheme, Stats } from "./types";

function useDebounced<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(handle);
  }, [value, delayMs]);
  return debounced;
}

function App() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [categories, setCategories] = useState<CategoryCount[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [level, setLevel] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search, 250);

  const [selected, setSelected] = useState<Scheme | null>(null);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
    fetchStats().then(setStats).catch(() => setStats(null));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchSchemes({ category, status, level, search: debouncedSearch })
      .then((res) => setSchemes(res.schemes))
      .catch(() => setError("Could not reach the schemes API. Is the server running?"))
      .finally(() => setLoading(false));
  }, [category, status, level, debouncedSearch]);

  const subtitle = useMemo(() => {
    if (loading) return "Loading…";
    return `${schemes.length} scheme${schemes.length === 1 ? "" : "s"} found`;
  }, [loading, schemes.length]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Scheme Grid</h1>
        <p className="app-subtitle">
          Live dashboard of Government Subsidies, Taxation, Production Incentives, Customs
          Schemes, Investment Schemes, Central &amp; State Schemes, GST and MSME Schemes.
        </p>
      </header>

      <SummaryCards stats={stats} />

      <FilterBar
        categories={categories}
        category={category}
        status={status}
        level={level}
        search={search}
        onCategoryChange={setCategory}
        onStatusChange={setStatus}
        onLevelChange={setLevel}
        onSearchChange={setSearch}
      />

      <div className="results-meta">{subtitle}</div>

      {error ? (
        <div className="grid-empty error">{error}</div>
      ) : (
        <div className="main-layout">
          <SchemeGrid
            schemes={schemes}
            loading={loading}
            onSelect={setSelected}
            selectedId={selected?.id}
          />
          <SchemeDetailPanel scheme={selected} onClose={() => setSelected(null)} />
        </div>
      )}

      <LiveUpdatesPanel />
    </div>
  );
}

export default App;
