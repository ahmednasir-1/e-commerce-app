import { useEffect, useState } from 'react';
const CATEGORIES = ['Fiction','Non-Fiction','Science','History','Technology','Biography','Children','Other'];

export default function SearchAndFilter({ filters, setFilters }) {
  const [search, setSearch] = useState(filters.search || '');

  useEffect(() => {
    const t = setTimeout(() => setFilters(f => ({ ...f, search, page: 1 })), 400);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <aside style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="bg-white rounded-xl border border-amber-100 p-4 space-y-4 md:sticky md:top-20 self-start">

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
          Search
        </label>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Title or author…"
          className="w-full border border-amber-100 rounded-lg px-3 py-2 text-sm bg-amber-50/40
            focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
          Category
        </label>
        <select
          value={filters.category || ''}
          onChange={e => setFilters({ ...filters, category: e.target.value, page: 1 })}
          className="w-full border border-amber-100 rounded-lg px-3 py-2 text-sm bg-amber-50/40
            focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all">
          <option value="">All categories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <button
        onClick={() => { setSearch(''); setFilters({ page: 1, limit: 12 }); }}
        className="text-xs font-medium text-amber-600 hover:underline flex items-center gap-1">
        ✕ Clear filters
      </button>
    </aside>
  );
}