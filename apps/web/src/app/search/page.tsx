'use client';

import { useState } from 'react';

export default function SearchPage() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function runSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: '1rem' }}>Search</h2>
      <form onSubmit={runSearch}>
        <input
          className="search-box"
          placeholder='Try "calm Nigerian music for studying" or artist name'
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </form>
      {loading && <p style={{ marginTop: '1rem', color: 'var(--muted)' }}>Searching…</p>}
      {results && (
        <div style={{ marginTop: '2rem' }}>
          {results.semantic && (
            <p style={{ color: 'var(--accent-2)', marginBottom: '1rem' }}>
              Semantic interpretation applied
            </p>
          )}
          {(results.tracks || []).map((t: any) => (
            <div key={t.id} className="card">
              <strong>{t.title}</strong>
              <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                {(t.artists || []).map((a: any) => a.artist?.name).filter(Boolean).join(', ')}
                {t.intelligence?.genres?.[0] && (
                  <> · {t.intelligence.genres[0].value}</>
                )}
              </div>
            </div>
          ))}
          {!results.tracks?.length && (
            <p style={{ color: 'var(--muted)' }}>No tracks found yet — upload some music!</p>
          )}
        </div>
      )}
    </div>
  );
}
