import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import BookCard from '../components/BookCard.jsx';
import SearchAndFilter from '../components/SearchAndFilter.jsx';
import { BookSkeleton } from '../components/Skeleton.jsx';

export default function Books() {

  const [filters, setFilters] = useState({ page: 1, limit: 12 });
  const params = new URLSearchParams(Object.entries(filters).filter(([,v])=>v!==''&&v!=null)).toString();
  
  const { data, isLoading } = useQuery({
    queryKey: ['books', filters],
    queryFn: () => api.get(`/books?${params}`).then(r => r.data),
    keepPreviousData: true,
  });

  return (
    <div className="grid md:grid-cols-[260px_1fr] gap-6">
      <SearchAndFilter filters={filters} setFilters={setFilters} />
      <div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({length:8}).map((_,i)=><BookSkeleton key={i}/>)
            : data?.books?.map(b => <BookCard key={b._id} book={b} />)}
        </div>
        {data && data.pages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({length: data.pages}).map((_,i)=>(
              <button key={i} onClick={()=>setFilters({...filters, page:i+1})} className={`px-3 py-1.5 rounded border ${filters.page===i+1?'bg-indigo-600 text-white':'bg-white'}`}>{i+1}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
