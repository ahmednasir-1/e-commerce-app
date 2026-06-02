import { useEffect, useState } from 'react';
const CATEGORIES = ['Fiction','Non-Fiction','Science','History','Technology','Biography','Children','Other'];

export default function SearchAndFilter({ filters, setFilters }) {
  const [search, setSearch] = useState(filters.search || '');
  useEffect(() => {
    const t = setTimeout(() => setFilters((f) => ({ ...f, search, page: 1 })), 400);
    return () => clearTimeout(t);
  }, [search]);
  return (
    <aside className="bg-white p-4 rounded-lg shadow space-y-4 md:sticky md:top-20 self-start">
      <div>
        <label className="text-sm font-semibold">Search</label>
        <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Title or author" className="w-full border rounded px-3 py-2 mt-1" />
      </div>
      <div>
        <label className="text-sm font-semibold">Category</label>
        <select value={filters.category||''} onChange={(e)=>setFilters({...filters, category: e.target.value, page:1})} className="w-full border rounded px-3 py-2 mt-1">
          <option value="">All</option>
          {CATEGORIES.map(c=><option key={c}>{c}</option>)}
        </select>
      </div>
      <button onClick={()=>{setSearch('');setFilters({page:1, limit:12});}} className="w-full text-sm text-indigo-600 hover:underline">Clear filters</button>
    </aside>
  );
}
