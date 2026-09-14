import React from 'react';
import { FilterState, Product } from '../types';
import { Search, X, RotateCcw } from 'lucide-react';

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  products: Product[];
  totalResults: number;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  products,
  totalResults,
}) => {
  // Extract distinct chapters and classes from existing products
  const classes = Array.from(new Set(products.map((p) => p.classLevel))).filter(Boolean).sort();
  const chapters = Array.from(new Set(products.map((p) => p.chapter))).filter(Boolean).sort();
  const productTypes = Array.from(new Set(products.map((p) => p.productType))).filter(Boolean).sort();

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchQuery: e.target.value });
  };

  const handleSelectChange = (field: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const handleReset = () => {
    onFilterChange({
      searchQuery: '',
      classLevel: '',
      subject: '',
      chapter: '',
      productType: '',
      difficulty: '',
      language: '',
      priceType: 'all',
    });
  };

  const hasActiveFilters =
    Boolean(filters.searchQuery) ||
    Boolean(filters.classLevel) ||
    Boolean(filters.chapter) ||
    Boolean(filters.productType) ||
    Boolean(filters.difficulty) ||
    filters.priceType !== 'all';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
      {/* Top Search Bar & Quick Free/Paid Toggle */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="filter-search-input"
            type="text"
            value={filters.searchQuery}
            onChange={handleTextChange}
            placeholder="Search by topic (e.g., Quadratic Equations, Trigonometry, Calculus, Worksheet)..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => handleSelectChange('searchQuery', '')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Free / Paid Segmented Control */}
        <div className="flex items-center rounded-lg bg-slate-100 p-1 shrink-0 text-xs font-medium text-slate-600">
          <button
            onClick={() => handleSelectChange('priceType', 'all')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              filters.priceType === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => handleSelectChange('priceType', 'paid')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              filters.priceType === 'paid'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Paid (Instamojo)
          </button>
          <button
            onClick={() => handleSelectChange('priceType', 'free')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              filters.priceType === 'free'
                ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Free Resources
          </button>
        </div>
      </div>

      {/* Secondary Dropdowns Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        {/* Class Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">Class</label>
          <select
            id="filter-select-class"
            value={filters.classLevel}
            onChange={(e) => handleSelectChange('classLevel', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Classes</option>
            {classes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Chapter / Topic Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">Chapter / Topic</label>
          <select
            id="filter-select-chapter"
            value={filters.chapter}
            onChange={(e) => handleSelectChange('chapter', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Chapters</option>
            {chapters.map((ch) => (
              <option key={ch} value={ch}>
                {ch}
              </option>
            ))}
          </select>
        </div>

        {/* Product Type Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">Material Type</label>
          <select
            id="filter-select-type"
            value={filters.productType}
            onChange={(e) => handleSelectChange('productType', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Material Types</option>
            {productTypes.map((pt) => (
              <option key={pt} value={pt}>
                {pt}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Level */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">Difficulty</label>
          <select
            id="filter-select-difficulty"
            value={filters.difficulty}
            onChange={(e) => handleSelectChange('difficulty', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Difficulties</option>
            <option value="Basic">Basic (Foundational)</option>
            <option value="Standard">Standard (CBSE/ICSE)</option>
            <option value="Advanced">Advanced (HOTS)</option>
            <option value="Exemplar/Competitive">Exemplar/Competitive</option>
          </select>
        </div>
      </div>

      {/* Results Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>Showing <strong className="text-slate-800 font-semibold">{totalResults}</strong> matching resources</span>
          {hasActiveFilters && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium">
              Filtered
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 font-medium cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear all filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
