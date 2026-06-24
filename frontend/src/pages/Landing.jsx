import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import BookCard from '../components/BookCard.jsx';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Package } from 'lucide-react';

const CATEGORIES = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Technology', 'Biography', 'Children'];

export default function Landing() {
  const { data } = useQuery({
    queryKey: ['featured'],
    queryFn: () => api.get('/books?limit=8').then(r => r.data),
  });

  return (
    <div className="min-h-screen bg-amber-50/40">

      {/* ── HERO ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[88vh]">

        {/* Left */}
        <div className="flex flex-col justify-center px-10 md:px-16 py-16 relative">

          {/* bg orb */}
          <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-amber-200 opacity-20 pointer-events-none -translate-x-1/3 -translate-y-1/3" />

          <div className="flex items-center gap-2 mb-5">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-widest">
              Curated for curious minds
            </span>
          </div>

          <h1 className="font-serif text-5xl md:text-6xl font-black leading-tight text-stone-900 mb-5">
            Where great stories<br />
            find their{' '}
            <em className="text-amber-600 not-italic">readers</em>
          </h1>

          <p className="text-stone-500 text-lg leading-relaxed max-w-md mb-8 font-light">
            Explore thousands of titles across every genre from timeless classics to today's most talked-about releases.
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <Link to="/books"
              className="bg-stone-900 text-amber-50 px-7 py-3 rounded-full font-medium hover:bg-amber-700 transition-colors no-underline">
              Browse All Books
            </Link>
            <Link to="/books"
              className="text-stone-900 font-medium flex items-center gap-1 hover:text-amber-600 transition-colors no-underline">
              View Categories <ArrowRight size={15}/>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-10 mt-12 pt-8 border-t border-amber-200">
            {[['1K+', 'Titles in stock'], ['10+', 'Genres'], ['4.9★', 'Avg. rating']].map(([num, label]) => (
              <div key={label}>
                <div className="font-serif text-3xl font-bold text-stone-900">{num}</div>
                <div className="text-xs text-stone-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — decorative */}
        <div className="hidden md:flex items-center justify-center bg-amber-100/60 relative overflow-hidden">

          {/* diagonal pattern */}
          <div className="absolute inset-0 opacity-30"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(200,132,58,0.1) 40px, rgba(200,132,58,0.1) 80px)' }} />

          {/* Floating badge */}
          <div className="absolute top-8 right-8 bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg z-10 animate-bounce">
            <Package size={15}/>
            Free delivery over Rs. 2000
          </div>

          {/* Book stack */}
          <div className="relative w-64 h-80">
            <div className="absolute bottom-0 left-4 w-44 h-60 rounded-r-xl shadow-xl -rotate-[8deg] bg-gradient-to-br from-emerald-900 to-emerald-950" />
            <div className="absolute bottom-4 left-12 w-40 h-56 rounded-r-xl shadow-xl -rotate-[2deg] bg-gradient-to-br from-red-900 to-red-950" />
            <div className="absolute bottom-2 left-20 w-40 h-56 rounded-r-xl shadow-xl rotate-[6deg] bg-gradient-to-br from-amber-700 to-amber-900" />
          </div>
        </div>
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div className="bg-stone-900 py-3 overflow-hidden">
        <div className="flex gap-12 w-max animate-marquee">
          {[...Array(2)].map((_, ri) =>
            ['Fiction','Non-Fiction','Science','Biography','Technology','History','Children','Self-Help'].map((c, i) => (
              <span key={`${ri}-${i}`} className="text-amber-50 text-xs font-semibold tracking-widest uppercase whitespace-nowrap">
                {c} <span className="text-amber-500 mx-1">✦</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <section className="px-10 md:px-16 py-12">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-serif text-3xl font-bold text-stone-900">Browse by Genre</h2>
          <Link to="/books" className="text-amber-600 text-sm font-medium hover:underline no-underline">
            View all 
            <ChevronRight size={14}/>
          </Link>
        </div>

        <div className="flex flex-wrap gap-3">
          {['All', ...CATEGORIES].map((cat) => (
            <Link key={cat}
              to={cat === 'All' ? '/books' : `/books?category=${cat}`}
              className="px-4 py-2 rounded-full border border-amber-200 bg-white text-sm font-medium
                text-stone-900 hover:bg-stone-900 hover:text-amber-50 hover:border-stone-900 transition-all no-underline">
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED BOOKS ── */}
      <section className="px-10 md:px-16 pb-16">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-serif text-3xl font-bold text-stone-900">Featured Books</h2>
          <Link to="/books" className="text-amber-600 text-sm font-medium hover:underline no-underline">
            See all 
            <ChevronRight size={14}/>
          </Link>
        </div>

        {data?.books?.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {data.books.map(b => <BookCard key={b._id} book={b} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-stone-400">Loading books…</div>
        )}
      </section>

      {/* ── BOTTOM BANNER ── */}
      <div className="mx-10 md:mx-16 mb-16 bg-stone-900 rounded-2xl px-10 py-10
        flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-amber-600 opacity-10 pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div>
          <h2 className="font-serif text-2xl font-bold text-amber-50 mb-1">
            Start reading something new today
          </h2>
          <p className="text-amber-50/60 text-sm">
            Free delivery on orders over Rs. 2000 · Easy returns · Verified reviews
          </p>
        </div>
        <Link to="/books"
          className="bg-amber-500 flex gap-2 items-center hover:bg-amber-400 text-white px-7 py-3 rounded-full font-semibold whitespace-nowrap transition-colors relative z-10 no-underline">
          Shop Now 
          <ArrowRight size={15}/>
        </Link>
      </div>

    </div>
  );
}