import React, { useState, useEffect, useMemo } from 'react';
import { Company } from './types';
import { categorizeCompany, getDistanceToHda, getFoundedYear } from './utils';
import CompanyCard from './components/CompanyCard';
import CompanyListItem from './components/CompanyListItem';
import CompanyModal from './components/CompanyModal';
import { Search, Loader2, Trash2, Filter, LayoutGrid, List, Check } from 'lucide-react';

const API_URL = 'https://managi.infdl.fbi.h-da.de/infdl/api/institution/partner/all';

type SortOption = 'name' | 'distance' | 'founded';
type ViewMode = 'grid' | 'list';

// Extend Company type internally for performance optimization during sort
type ExtendedCompany = Company & {
  _distance: number | null;
  _foundedYear: number | null;
  categories: string[];
};

// Fixed filter categories as requested
const FIXED_FILTERS = ['KoSI', 'KITS', 'Data Science', 'Finanz', 'IT'];

const App: React.FC = () => {
  const [companies, setCompanies] = useState<ExtendedCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  // Persist viewed IDs
  const [viewedIds, setViewedIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('viewedCompanies');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Persist Applied IDs (Application Status)
  const [appliedIds, setAppliedIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('appliedCompanies');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Persist Notes
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem('companyNotes');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Fetch Data
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        const data = await res.json();
        
        // Process data
        const processed = data.map((c: any) => {
          // Generate a stable ID if the API doesn't provide one to persist 'viewed' state correctly
          const stableId = c.id || c.institutionId || (c.name 
            ? c.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') 
            : Math.random().toString(36).substr(2, 9));

          return {
            ...c,
            id: stableId,
            categories: categorizeCompany(c),
            _distance: getDistanceToHda(c),
            _foundedYear: getFoundedYear(c)
          };
        });
        
        setCompanies(processed);
      } catch (err: any) {
        setError(err.message || 'Fehler beim Laden');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Persist Viewed IDs Effect
  useEffect(() => {
    localStorage.setItem('viewedCompanies', JSON.stringify([...viewedIds]));
  }, [viewedIds]);

  // Persist Applied IDs Effect
  useEffect(() => {
    localStorage.setItem('appliedCompanies', JSON.stringify([...appliedIds]));
  }, [appliedIds]);

  // Persist Notes Effect
  useEffect(() => {
    localStorage.setItem('companyNotes', JSON.stringify(notes));
  }, [notes]);

  // Handle View
  const handleViewCompany = (company: Company) => {
    setViewedIds(prev => new Set(prev).add(company.id));
    setSelectedCompany(company);
  };

  const handleToggleApplied = (id: string) => {
    setAppliedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleUpdateNote = (id: string, text: string) => {
    setNotes(prev => ({
      ...prev,
      [id]: text
    }));
  };

  const resetViewed = () => {
    if (confirm('Möchten Sie wirklich alle Ansichts-Einträge löschen?')) {
      setViewedIds(new Set());
    }
  };

  // Compute Categories Counts (Logic kept for counts, but UI restricted to FIXED_FILTERS)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    companies.forEach(c => {
      c.categories?.forEach(cat => {
        counts[cat] = (counts[cat] || 0) + 1;
      });
    });
    return counts;
  }, [companies]);

  // Filter and Sort Logic
  const filteredAndSortedCompanies = useMemo(() => {
    const term = search.toLowerCase();
    
    // 1. Filter
    const filtered = companies.filter(c => {
      const matchesSearch = !term || 
        c.name?.toLowerCase().includes(term) ||
        c.city?.toLowerCase().includes(term) ||
        c.categories?.some(cat => cat.toLowerCase().includes(term));
      
      const matchesCategory = selectedCategory === 'all' || 
        c.categories?.includes(selectedCategory);

      return matchesSearch && matchesCategory;
    });

    // 2. Sort
    return filtered.sort((a, b) => {
      // Prioritize applied status if needed? For now standard sorting.
      switch (sortBy) {
        case 'distance':
          // Sort by distance (asc). Null values go last.
          if (a._distance === null && b._distance === null) return 0;
          if (a._distance === null) return 1;
          if (b._distance === null) return -1;
          return a._distance - b._distance;
        
        case 'founded':
          // Sort by founded year (oldest first / asc). Null values go last.
          if (a._foundedYear === null && b._foundedYear === null) return 0;
          if (a._foundedYear === null) return 1;
          if (b._foundedYear === null) return -1;
          return a._foundedYear - b._foundedYear;

        case 'name':
        default:
           return (a.name || '').localeCompare(b.name || '');
      }
    });
  }, [companies, search, selectedCategory, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-primary-600 gap-4">
        <Loader2 size={48} className="animate-spin" />
        <p className="font-heading font-medium text-lg text-slate-600">Lade Partnerunternehmen...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 text-red-600 p-8 rounded-2xl max-w-md text-center">
          <h2 className="font-heading text-2xl font-bold mb-2">Fehler beim Laden</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 px-6 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg transition-colors"
          >
            Neu laden
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <header className="mb-12 animate-slide-up">
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary-700 tracking-tight mb-4">
          Partner·innen
        </h1>
        <p className="font-sans text-lg sm:text-xl text-slate-500 max-w-2xl font-light">
          Entdecke Kooperationsunternehmen im Überblick. Finde deinen nächsten Arbeitgeber oder Praktikumsplatz.
        </p>
        <p className="mt-2 text-sm text-primary-500/80 font-medium">
          💡 Firmenlogos werden automatisch recherchiert
        </p>
      </header>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 animate-fade-in sticky top-4 z-30">
        
        {/* Search Bar (Grow) */}
        <div className="relative flex-1 group shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Firma, Stadt oder Stichwort..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-[56px] pl-12 pr-4 bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all font-sans text-lg"
          />
        </div>

        <div className="flex gap-3 shrink-0">
          {/* View Toggle */}
          <div className="flex bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-1 shadow-sm h-[56px] items-center">
            <button
              onClick={() => setViewMode('grid')}
              className={`h-full aspect-square flex items-center justify-center rounded-xl transition-all ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              title="Rasteransicht"
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`h-full aspect-square flex items-center justify-center rounded-xl transition-all ${viewMode === 'list' ? 'bg-primary-100 text-primary-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              title="Listenansicht"
            >
              <List size={20} />
            </button>
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => {
              setShowFilters(!showFilters);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`
              h-[56px] px-6 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 shadow-sm border font-medium
              ${showFilters || selectedCategory !== 'all'
                ? 'bg-primary-600 border-primary-600 text-white shadow-primary-500/25' 
                : 'bg-white/80 backdrop-blur-xl border-white/60 text-slate-600 hover:bg-white hover:text-primary-600 hover:border-primary-200'
              }
            `}
          >
            <Filter size={18} />
            <span className="hidden sm:inline">Filter & Sortierung</span>
          </button>
        </div>
      </div>

      {/* Expanded Filter Drawer */}
      <div className={`
        overflow-hidden transition-all duration-500 ease-in-out
        ${showFilters ? 'max-h-[500px] opacity-100 mb-8' : 'max-h-0 opacity-0 mb-0'}
      `}>
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-sm space-y-6">
          
          {/* Section: Sort */}
          <div>
            <h3 className="text-xs font-heading font-bold text-slate-400 uppercase tracking-wider mb-3">Sortierung</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'name', label: 'Name (A-Z)' },
                { id: 'distance', label: 'Entfernung zur h_da' },
                { id: 'founded', label: 'Gründungsjahr' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSortBy(opt.id as SortOption)}
                  className={`
                    px-4 py-2.5 rounded-xl text-sm font-medium transition-all border flex items-center gap-2
                    ${sortBy === opt.id
                      ? 'bg-white text-primary-600 border-primary-200 ring-2 ring-primary-100 shadow-sm'
                      : 'bg-white/40 text-slate-600 border-transparent hover:bg-white hover:border-slate-200'
                    }
                  `}
                >
                  {sortBy === opt.id && <Check size={14} strokeWidth={3} />}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-200/50 w-full" />

          {/* Section: Categories */}
          <div>
            <h3 className="text-xs font-heading font-bold text-slate-400 uppercase tracking-wider mb-3">Kategorien</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border flex items-center gap-2 ${
                  selectedCategory === 'all'
                    ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                    : 'bg-white/50 text-slate-600 border-transparent hover:bg-white hover:border-slate-200'
                }`}
              >
                Alle 
                <span className={`px-1.5 py-0.5 rounded text-[10px] ${selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {companies.length}
                </span>
              </button>
              
              {FIXED_FILTERS.map((cat) => {
                const count = categoryCounts[cat] || 0;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border flex items-center gap-2 ${
                      selectedCategory === cat
                        ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                        : 'bg-white/50 text-slate-600 border-transparent hover:bg-white hover:border-slate-200'
                    }`}
                  >
                    {cat}
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${selectedCategory === cat ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Stats & Tools Bar */}
      <div className="flex justify-between items-end mb-4 px-2">
        <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading font-bold text-slate-700">{filteredAndSortedCompanies.length}</span>
            <span className="text-slate-500 font-medium">Ergebnisse</span>
        </div>
        
        {viewedIds.size > 0 && (
          <button 
            onClick={resetViewed} 
            className="text-xs flex items-center gap-1.5 text-red-500 hover:text-red-600 px-3 py-1.5 rounded-lg transition-colors font-medium hover:bg-red-50"
          >
            <Trash2 size={14} />
            Verlauf ({viewedIds.size}) löschen
          </button>
        )}
      </div>

      {/* Content Area */}
      {filteredAndSortedCompanies.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pb-20 animate-slide-up" style={{ animationDelay: '200ms' }}>
            {filteredAndSortedCompanies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                viewed={viewedIds.has(company.id)}
                isApplied={appliedIds.has(company.id)}
                showFounded={sortBy === 'founded'}
                onClick={() => handleViewCompany(company)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3 pb-20 animate-slide-up" style={{ animationDelay: '200ms' }}>
            {filteredAndSortedCompanies.map((company) => (
              <CompanyListItem
                key={company.id}
                company={company}
                viewed={viewedIds.has(company.id)}
                isApplied={appliedIds.has(company.id)}
                showFounded={sortBy === 'founded'}
                onClick={() => handleViewCompany(company)}
              />
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-20 text-slate-400">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="font-heading text-xl font-semibold mb-2">Keine Treffer</h3>
          <p>Versuche es mit einem anderen Suchbegriff oder Kategorie.</p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedCompany && (
        <CompanyModal 
          company={selectedCompany} 
          isApplied={appliedIds.has(selectedCompany.id)}
          onToggleApplied={() => handleToggleApplied(selectedCompany.id)}
          note={notes[selectedCompany.id] || ''}
          onUpdateNote={(text) => handleUpdateNote(selectedCompany.id, text)}
          onClose={() => setSelectedCompany(null)} 
        />
      )}
    </div>
  );
};

export default App;