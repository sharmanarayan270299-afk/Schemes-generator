import type { Scheme } from "../types";

interface Props {
  scheme: Scheme | null;
  onClose: () => void;
}

export function SchemeDetailPanel({ scheme, onClose }: Props) {
  if (!scheme) {
    return (
      <aside className="detail-panel detail-panel-empty">
        <p>Select a scheme from the grid to see full details.</p>
      </aside>
    );
  }

  return (
    <aside className="detail-panel">
      <button className="detail-close" onClick={onClose} aria-label="Close details">
        ×
      </button>
      <h2>{scheme.name}</h2>
      <p className="detail-category">
        {scheme.category} · {scheme.level}
        {scheme.state ? ` (${scheme.state})` : ""}
      </p>

      <dl className="detail-list">
        <dt>Department</dt>
        <dd>{scheme.department}</dd>

        <dt>Benefit Type</dt>
        <dd>{scheme.benefitType}</dd>

        <dt>Status</dt>
        <dd>{scheme.status}</dd>

        <dt>Deadline</dt>
        <dd>{scheme.deadline}</dd>

        <dt>Launched</dt>
        <dd>{scheme.launchYear}</dd>

        <dt>Eligibility</dt>
        <dd>{scheme.eligibility}</dd>

        <dt>Description</dt>
        <dd>{scheme.description}</dd>
      </dl>

      <div className="detail-tags">
        {scheme.tags.map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>

      <a href={scheme.website} target="_blank" rel="noreferrer" className="detail-link">
        Official website ↗
      </a>
    </aside>
  );
}
