import React, { useState } from 'react';
import { StorePage, Product, FilterState } from '../../types';
import { ProductCard } from '../../components/ProductCard';
import { ProductFilters } from '../../components/ProductFilters';
import {
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Layers,
  FileText,
  FileCheck,
  Gift,
  HelpCircle,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface StoreViewProps {
  currentPage: StorePage;
  onNavigate: (page: StorePage) => void;
  products: Product[];
  onPreviewProduct: (product: Product) => void;
}

export const StoreView: React.FC<StoreViewProps> = ({
  currentPage,
  onNavigate,
  products,
  onPreviewProduct,
}) => {
  // Only published products marked visible on store
  const storeVisibleProducts = products.filter(
    (p) => p.visibility.store && p.publicationStatus === 'published'
  );

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    classLevel: '',
    subject: '',
    chapter: '',
    productType: '',
    difficulty: '',
    language: '',
    priceType: 'all',
  });

  // Selected sub-category filters for taxonomy pages
  const [selectedClassTab, setSelectedClassTab] = useState<string>('Class 10');
  const [selectedSubjectTab, setSelectedSubjectTab] = useState<string>('Mathematics');
  const [selectedChapterTab, setSelectedChapterTab] = useState<string>('All');

  // Filter logic
  const getFilteredProducts = () => {
    let result = storeVisibleProducts;

    // Apply specific page context constraints first
    if (currentPage === 'by-class') {
      result = result.filter((p) => p.classLevel === selectedClassTab);
    } else if (currentPage === 'by-subject') {
      result = result.filter((p) => p.subject === selectedSubjectTab);
    } else if (currentPage === 'by-chapter') {
      if (selectedChapterTab !== 'All') {
        result = result.filter((p) => p.chapter === selectedChapterTab);
      }
    } else if (currentPage === 'worksheets') {
      result = result.filter((p) => p.productType === 'Worksheet');
    } else if (currentPage === 'tests') {
      result = result.filter(
        (p) =>
          p.productType === 'Chapter Test' ||
          p.productType === 'Diagnostic Test' ||
          p.productType === 'Practice Paper' ||
          p.productType === 'Question Paper'
      );
    } else if (currentPage === 'bundles') {
      result = result.filter((p) => p.productType === 'Bundle' || p.bundleInfo?.isBundle);
    } else if (currentPage === 'free') {
      result = result.filter((p) => p.isFree);
    }

    // Then apply general filter bar state
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.chapter.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q)) ||
          p.id.toLowerCase().includes(q)
      );
    }

    if (filters.classLevel) {
      result = result.filter((p) => p.classLevel === filters.classLevel);
    }
    if (filters.subject) {
      result = result.filter((p) => p.subject === filters.subject);
    }
    if (filters.chapter) {
      result = result.filter((p) => p.chapter === filters.chapter);
    }
    if (filters.productType) {
      result = result.filter((p) => p.productType === filters.productType);
    }
    if (filters.difficulty) {
      result = result.filter((p) => p.difficulty === filters.difficulty);
    }
    if (filters.priceType === 'free') {
      result = result.filter((p) => p.isFree);
    } else if (filters.priceType === 'paid') {
      result = result.filter((p) => !p.isFree);
    }

    return result;
  };

  const displayedProducts = getFilteredProducts();

  // Distinct classes and chapters for navigation tabs
  const allClasses = Array.from(new Set(storeVisibleProducts.map((p) => p.classLevel))).sort();
  const allSubjects = Array.from(new Set(storeVisibleProducts.map((p) => p.subject))).sort();
  const allChapters = Array.from(new Set(storeVisibleProducts.map((p) => p.chapter))).sort();

  return (
    <div className="space-y-8 pb-16">
      {/* Store Identity Hero */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white rounded-2xl p-6 sm:p-10 shadow-md">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-medium">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Aakushi Learning Store • Direct Instamojo Digital Products</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Original Mathematics Worksheets, Chapter Tests & Bundles
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Download high-yield, step-by-step verified mathematics resources crafted specifically for Class 9–12 students. Every paid product is fulfilled securely through Instamojo with verified answer keys.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Secure Instamojo Checkout
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-slate-400" />
              Step-by-step Answer Keys
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-amber-300" />
              Free Curriculum Notes
            </span>
          </div>
        </div>
      </div>

      {/* PAGE: STORE HOME */}
      {currentPage === 'home' && (
        <div className="space-y-8">
          {/* Quick Categories Bento */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button
              onClick={() => onNavigate('worksheets')}
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-sm text-left transition-all cursor-pointer group"
            >
              <FileText className="w-6 h-6 text-sky-600 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-slate-900 text-sm">Worksheets</h4>
              <p className="text-xs text-slate-500 mt-0.5">3-tier graded problem sets</p>
            </button>

            <button
              onClick={() => onNavigate('tests')}
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-sm text-left transition-all cursor-pointer group"
            >
              <FileCheck className="w-6 h-6 text-rose-600 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-slate-900 text-sm">Tests & Papers</h4>
              <p className="text-xs text-slate-500 mt-0.5">Timed tests & diagnostic rubrics</p>
            </button>

            <button
              onClick={() => onNavigate('bundles')}
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-sm text-left transition-all cursor-pointer group"
            >
              <Layers className="w-6 h-6 text-violet-600 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-slate-900 text-sm">Bundles</h4>
              <p className="text-xs text-slate-500 mt-0.5">Curated multi-chapter packs</p>
            </button>

            <button
              onClick={() => onNavigate('free')}
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-sm text-left transition-all cursor-pointer group"
            >
              <Gift className="w-6 h-6 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-slate-900 text-sm">Free Resources</h4>
              <p className="text-xs text-slate-500 mt-0.5">Open concept sheets & formula maps</p>
            </button>
          </div>

          {/* Featured In Store Products */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Featured Study Materials</h3>
                <p className="text-xs text-slate-500">Popular worksheets and bundles for the upcoming board exams</p>
              </div>
              <button
                onClick={() => onNavigate('all')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
              >
                Browse All ({storeVisibleProducts.length}) →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {storeVisibleProducts.slice(0, 6).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPreview={onPreviewProduct}
                  variant="store"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAXONOMY TABS HEADER (when browsing by class/subject/chapter) */}
      {currentPage === 'by-class' && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
          <h3 className="text-sm font-bold text-slate-800">Select Class</h3>
          <div className="flex flex-wrap gap-2">
            {allClasses.map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClassTab(cls)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  selectedClassTab === cls
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>
      )}

      {currentPage === 'by-subject' && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
          <h3 className="text-sm font-bold text-slate-800">Select Subject</h3>
          <div className="flex flex-wrap gap-2">
            {allSubjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubjectTab(sub)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  selectedSubjectTab === sub
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {currentPage === 'by-chapter' && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
          <h3 className="text-sm font-bold text-slate-800">Filter by Chapter / Topic</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedChapterTab('All')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedChapterTab === 'All'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Chapters
            </button>
            {allChapters.map((chap) => (
              <button
                key={chap}
                onClick={() => setSelectedChapterTab(chap)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  selectedChapterTab === chap
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {chap}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FILTER & PRODUCT GRID (for All, By-Class, By-Subject, By-Chapter, Worksheets, Tests, Bundles, Free) */}
      {currentPage !== 'home' && currentPage !== 'contact' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 capitalize">
                {currentPage === 'all' && 'All Educational Products'}
                {currentPage === 'by-class' && `Products for ${selectedClassTab}`}
                {currentPage === 'by-subject' && `Products for ${selectedSubjectTab}`}
                {currentPage === 'by-chapter' && `Products for Chapter: ${selectedChapterTab}`}
                {currentPage === 'worksheets' && 'Worksheets & Graded Problem Sets'}
                {currentPage === 'tests' && 'Tests, Diagnostic Rubrics & Practice Papers'}
                {currentPage === 'bundles' && 'Complete Revision Bundles'}
                {currentPage === 'free' && 'Free Public Concept Notes & Mind Maps'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Central educational library resources marked for store availability
              </p>
            </div>
          </div>

          <ProductFilters
            filters={filters}
            onFilterChange={setFilters}
            products={storeVisibleProducts}
            totalResults={displayedProducts.length}
          />

          {displayedProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">No matching products found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your search keywords, class level, or material filters above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPreview={onPreviewProduct}
                  variant="store"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* PAGE: CONTACT (STORE SPECIFIC) */}
      {currentPage === 'contact' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Customer Support
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">Learning Store Help & Delivery</h2>
            <p className="text-xs text-slate-500 mt-1">
              Have questions about worksheet download links, Instamojo receipts, or bundle contents?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  Instamojo Payment & Download Policy
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  All digital sales are processed directly on Instamojo's PCI-DSS certified payment pages. Upon successful completion, Instamojo dispatches your receipt and download instructions directly to your email.
                </p>
                <p className="text-slate-500 text-[11px]">
                  No card numbers, CVVs, or bank logins are ever processed on this website.
                </p>
              </div>

              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-2">
                <h4 className="font-bold text-emerald-900 text-sm">Download Assistance</h4>
                <p className="text-emerald-950 leading-relaxed">
                  If an email receipt fails to arrive within 15 minutes of checkout, simply email your Instamojo Payment ID to the teacher for a direct link re-issue.
                </p>
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Support Channels</h4>
              <p className="text-slate-600">
                Email: <strong className="text-slate-800">store-support@aakushieducation.network</strong> (Placeholder)
              </p>
              <p className="text-slate-600">
                Turnaround: <strong className="text-slate-800">Under 24 hours on working days</strong>
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('all')}
                  className="px-4 py-2 text-xs font-semibold text-emerald-700 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                >
                  ← Return to Browse Products
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
