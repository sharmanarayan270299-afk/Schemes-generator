import { useEffect, useState } from "react";
import { fetchLiveSources, fetchLiveUpdates, type LiveUpdate, type SourceInfo } from "../api/liveUpdates";

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function LiveUpdatesPanel() {
  const [updates, setUpdates] = useState<LiveUpdate[]>([]);
  const [sources, setSources] = useState<SourceInfo[]>([]);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ sourceId: string; message: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  function load(forceRefresh: boolean) {
    const setBusy = forceRefresh ? setRefreshing : setLoading;
    setBusy(true);
    fetchLiveUpdates(forceRefresh)
      .then((res) => {
        setUpdates(res.updates);
        setErrors(res.errors);
        setFetchedAt(res.fetchedAt);
      })
      .finally(() => setBusy(false));
  }

  useEffect(() => {
    load(false);
    fetchLiveSources().then(setSources).catch(() => setSources([]));
  }, []);

  return (
    <section className="live-updates">
      <div className="live-updates-header">
        <div>
          <h2>Live Government Updates</h2>
          <p className="live-updates-subtitle">
            Proof-of-concept feed from {sources.length || "…"} live sources
            {fetchedAt ? ` · refreshed ${timeAgo(fetchedAt)}` : ""}
          </p>
        </div>
        <button className="refresh-btn" onClick={() => load(true)} disabled={refreshing}>
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {sources.length > 0 && (
        <div className="source-chips">
          {sources.map((s) => (
            <a key={s.id} className="source-chip" href={s.url} target="_blank" rel="noreferrer">
              {s.name} · {s.checkFrequency}
            </a>
          ))}
        </div>
      )}

      {errors.length > 0 && (
        <div className="live-updates-error">
          {errors.map((e) => (
            <div key={e.sourceId}>
              Couldn't reach {e.sourceId}: {e.message}
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid-empty">Loading live updates…</div>
      ) : updates.length === 0 ? (
        <div className="grid-empty">No live updates available right now.</div>
      ) : (
        <ul className="update-list">
          {updates.map((u) => (
            <li key={u.id} className="update-item">
              <span className="status-badge update-category">{u.category}</span>
              <a href={u.link} target="_blank" rel="noreferrer" className="update-title">
                {u.title}
              </a>
              <span className="update-meta">
                {u.sourceName} · {timeAgo(u.fetchedAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
