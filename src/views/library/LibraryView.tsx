import React, { useState } from 'react';
import { LibraryPage, Product, FilterState } from '../../types';
import { ProductCard } from '../../components/ProductCard';
import { ProductFilters } from '../../components/ProductFilters';
import {
  Library,
  BookOpen,
  FolderArchive,
  Search,
  ShieldCheck,
  Lock,
  Layers,
  Clock,
  Tag,
  CheckCircle2,
  FileText,
  Bookmark,
  FileKey2,
} from 'lucide-react';

interface LibraryViewProps {
  currentPage: LibraryPage;
  onNavigate: (page: LibraryPage) => void;
  products: Product[];
  onPreviewProduct: (product: Product) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  currentPage,
  onNavigate,
  products,
  onPreviewProduct,
}) => {
  // STRICT ARCHIVE ACCESS RULE:
  // Only items explicitly marked visible for the public library AND published are shown here.
  // Private drafts or items hidden from library are never exposed.
  const publicLibraryProducts = products.filter(
    (p) => p.visibility.library && p.publicationStatus === 'published'
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

  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedChapter, setSelectedChapter] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');

  // Filter application
  const getFilteredLibraryProducts = () => {
    let list = publicLibraryProducts;

    if (currentPage === 'by-class' && selectedClass !== 'All') {
      list = list.filter((p) => p.classLevel === selectedClass);
    } else if (currentPage === 'by-subject' && selectedSubject !== 'All') {
      list = list.filter((p) => p.subject === selectedSubject);
    } else if (currentPage === 'by-chapter' && selectedChapter !== 'All') {
      list = list.filter((p) => p.chapter === selectedChapter);
    } else if (currentPage === 'by-type' && selectedType !== 'All') {
      list = list.filter((p) => p.productType === selectedType);
    } else if (currentPage === 'recent') {
      // Sort descending by creation date
      list = [...list].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    // Filter bar constraints
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.chapter.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q)) ||
          p.id.toLowerCase().includes(q)
      );
    }

    if (filters.classLevel) {
      list = list.filter((p) => p.classLevel === filters.classLevel);
    }
    if (filters.subject) {
      list = list.filter((p) => p.subject === filters.subject);
    }
    if (filters.chapter) {
      list = list.filter((p) => p.chapter === filters.chapter);
    }
    if (filters.productType) {
      list = list.filter((p) => p.productType === filters.productType);
    }
    if (filters.difficulty) {
      list = list.filter((p) => p.difficulty === filters.difficulty);
    }
    if (filters.priceType === 'free') {
      list = list.filter((p) => p.isFree);
    } else if (filters.priceType === 'paid') {
      list = list.filter((p) => !p.isFree);
    }

    return list;
  };

  const displayedProducts = getFilteredLibraryProducts();

  const allClasses = Array.from(new Set(publicLibraryProducts.map((p) => p.classLevel))).sort();
  const allSubjects = Array.from(new Set(publicLibraryProducts.map((p) => p.subject))).sort();
  const allChapters = Array.from(new Set(publicLibraryProducts.map((p) => p.chapter))).sort();
  const allTypes = Array.from(new Set(publicLibraryProducts.map((p) => p.productType))).sort();

  return (
    <div className="space-y-8 pb-16">
      {/* Library Identity Header */}
      <div className="bg-gradient-to-r from-violet-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-10 shadow-md">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-200 text-xs font-medium">
            <Library className="w-3.5 h-3.5" />
            <span>Aakushi Resource Library • Pedagogical Archive & Taxonomy</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Curated Mathematics Repository & Resource Archive
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            A systematically classified index of original worksheets, revision notes, diagnostic papers, and chapter tests. Materials marked for public display are indexed below with syllabus tags, question counts, and difficulty grading.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 text-violet-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-violet-400" />
              Public Catalog Index ({publicLibraryProducts.length} items)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-amber-300">
              <Lock className="w-3.5 h-3.5" />
              Private Master PDFs Protected
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Continuous Curriculum Updates
            </span>
          </div>
        </div>
      </div>

      {/* PAGE: LIBRARY HOME */}
      {currentPage === 'home' && (
        <div className="space-y-8">
          {/* Quick Index Taxonomy Nav */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button
              onClick={() => onNavigate('by-class')}
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-violet-500 hover:shadow-sm text-left transition-all cursor-pointer group"
            >
              <Bookmark className="w-6 h-6 text-violet-600 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-slate-900 text-sm">Browse by Class</h4>
              <p className="text-xs text-slate-500 mt-0.5">Classes 9, 10, 11 & 12</p>
            </button>

            <button
              onClick={() => onNavigate('by-subject')}
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-violet-500 hover:shadow-sm text-left transition-all cursor-pointer group"
            >
              <BookOpen className="w-6 h-6 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-slate-900 text-sm">Browse by Subject</h4>
              <p className="text-xs text-slate-500 mt-0.5">Core & Applied Mathematics</p>
            </button>

            <button
              onClick={() => onNavigate('by-chapter')}
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-violet-500 hover:shadow-sm text-left transition-all cursor-pointer group"
            >
              <FolderArchive className="w-6 h-6 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-slate-900 text-sm">Browse by Chapter</h4>
              <p className="text-xs text-slate-500 mt-0.5">Algebra, Trigonometry, Calculus</p>
            </button>

            <button
              onClick={() => onNavigate('by-type')}
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-violet-500 hover:shadow-sm text-left transition-all cursor-pointer group"
            >
              <Layers className="w-6 h-6 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-slate-900 text-sm">By Material Type</h4>
              <p className="text-xs text-slate-500 mt-0.5">Worksheet, Diagnostic, Test, Notes</p>
            </button>
          </div>

          {/* Security & Access Policy Banner */}
          <div className="bg-slate-900 text-white rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl text-xs">
              <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
                <FileKey2 className="w-4 h-4" />
                <span>Zero-Exposure Educational Vault Architecture</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Only materials marked for public repository visibility appear in this library. Editable LaTeX/DOCX master sources and unwatermarked evaluation sheets are stored in private cloud storage and never exposed to the public browser without authorization.
              </p>
            </div>
            <button
              onClick={() => onNavigate('archive-info')}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shrink-0 transition-colors cursor-pointer"
            >
              Read Archive Policy
            </button>
          </div>

          {/* Library Search & Filter Bar */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Public Archive Repository</h3>
            <ProductFilters
              filters={filters}
              onFilterChange={setFilters}
              products={publicLibraryProducts}
              totalResults={displayedProducts.length}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPreview={onPreviewProduct}
                  variant="library"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAXONOMY TABS (When browsing by Class, Subject, Chapter, or Type) */}
      {currentPage === 'by-class' && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
          <h3 className="text-sm font-bold text-slate-800">Archive Index: Select Class</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedClass('All')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedClass === 'All' ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Classes ({publicLibraryProducts.length})
            </button>
            {allClasses.map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  selectedClass === cls ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
          <h3 className="text-sm font-bold text-slate-800">Archive Index: Select Subject</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSubject('All')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedSubject === 'All' ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Subjects
            </button>
            {allSubjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  selectedSubject === sub ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
          <h3 className="text-sm font-bold text-slate-800">Archive Index: Select Chapter / Topic</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedChapter('All')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedChapter === 'All' ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Chapters
            </button>
            {allChapters.map((ch) => (
              <button
                key={ch}
                onClick={() => setSelectedChapter(ch)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  selectedChapter === ch ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>
      )}

      {currentPage === 'by-type' && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
          <h3 className="text-sm font-bold text-slate-800">Archive Index: Select Material Type</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType('All')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedType === 'All' ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Material Types
            </button>
            {allTypes.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  selectedType === t ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FILTER & PRODUCT DISPLAY FOR OTHER PAGES */}
      {currentPage !== 'home' && currentPage !== 'archive-info' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {currentPage === 'by-class' && `Archive Materials: ${selectedClass}`}
                {currentPage === 'by-subject' && `Archive Materials: ${selectedSubject}`}
                {currentPage === 'by-chapter' && `Archive Materials: ${selectedChapter}`}
                {currentPage === 'by-type' && `Archive Materials: ${selectedType}`}
                {currentPage === 'search' && 'Search Entire Public Pedagogical Archive'}
                {currentPage === 'recent' && 'Recently Added to Central Library (Chronological)'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Central educational library resources marked for public repository visibility
              </p>
            </div>
          </div>

          <ProductFilters
            filters={filters}
            onFilterChange={setFilters}
            products={publicLibraryProducts}
            totalResults={displayedProducts.length}
          />

          {displayedProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FolderArchive className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">No public resources in this index category</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Items may be currently under draft review or designated exclusively for store or private coaching access.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPreview={onPreviewProduct}
                  variant="library"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* PAGE: ARCHIVE INFORMATION & SECURITY */}
      {currentPage === 'archive-info' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600">
              Security & Repository Architecture
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Central Educational Archive Information
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              How educational materials are stored, classified, and protected across the network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Public vs Private Separation
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  The complete repository contains master documents, editable source files, unpublished exam keys, and diagnostic question banks. To maintain integrity:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 pt-1">
                  <li>Only records with <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">visibility.library = true</code> and <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">publicationStatus = published</code> are indexed here.</li>
                  <li>Internal cloud storage references (e.g. Google Drive IDs) are filtered on the client and never rendered in public browser HTML.</li>
                  <li>Paid resources link exclusively to authorized purchase pathways.</li>
                </ul>
              </div>

              <div className="p-4 bg-violet-50/60 rounded-xl border border-violet-100 space-y-2">
                <h4 className="font-bold text-violet-900 text-sm">Classification Taxonomy</h4>
                <p className="text-violet-950 leading-relaxed">
                  Every product is tagged with its Class level, Subject, Chapter topic, Difficulty grading (Basic, Standard, Advanced, Exemplar), and Question count to ensure fast retrieval during teaching sessions and exam preparation.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-600" />
                  Resource Reusability Workflow
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  As the teacher creates worksheets throughout the academic term:
                </p>
                <ol className="list-decimal pl-4 space-y-1 text-slate-600 pt-1">
                  <li>A worksheet is authored once and saved to the central library.</li>
                  <li>Details and solutions are attached in the private Admin console.</li>
                  <li>Visibility checkboxes determine whether it is published to Aakushi Classes, Aakushi Store, or this public Library.</li>
                  <li>The same item can later be combined into multi-chapter Bundles without recreating content.</li>
                </ol>
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => onNavigate('home')}
                  className="px-5 py-2 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-lg transition-colors cursor-pointer"
                >
                  ← Return to Repository Home
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
