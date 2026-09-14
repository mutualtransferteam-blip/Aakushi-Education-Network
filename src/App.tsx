import React, { useState, useEffect } from 'react';
import {
  NetworkSite,
  ClassesPage,
  StorePage,
  LibraryPage,
  AdminTab,
  Product,
  CoachingEnquiry,
} from './types';
import { storageService } from './services/storageService';
import { NetworkHeader } from './components/NetworkHeader';
import { ProductPreviewModal } from './components/ProductPreviewModal';
import { EnquiryModal } from './components/EnquiryModal';
import { ClassesView } from './views/classes/ClassesView';
import { StoreView } from './views/store/StoreView';
import { LibraryView } from './views/library/LibraryView';
import { AdminDashboard } from './views/admin/AdminDashboard';
import {
  GraduationCap,
  ShoppingBag,
  Library,
  ShieldCheck,
  HeartHandshake,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

export default function App() {
  // Navigation State across the 3 public websites and private admin
  const [currentSite, setCurrentSite] = useState<NetworkSite>('classes');
  const [classesPage, setClassesPage] = useState<ClassesPage>('home');
  const [storePage, setStorePage] = useState<StorePage>('home');
  const [libraryPage, setLibraryPage] = useState<LibraryPage>('home');
  const [adminTab, setAdminTab] = useState<AdminTab>('products');

  // Central Catalog State & Enquiries State
  const [products, setProducts] = useState<Product[]>([]);
  const [enquiries, setEnquiries] = useState<CoachingEnquiry[]>([]);

  // Modals
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  // Initialize data from central storage on mount
  useEffect(() => {
    const loadedProducts = storageService.getProducts();
    const loadedEnquiries = storageService.getEnquiries();
    setProducts(loadedProducts);
    setEnquiries(loadedEnquiries);
  }, []);

  // Update handlers
  const handleUpdateProducts = (updated: Product[]) => {
    setProducts(updated);
  };

  const handleUpdateEnquiries = (updated: CoachingEnquiry[]) => {
    setEnquiries(updated);
  };

  // Quick jump between sites and specific pages
  const handleSelectSite = (site: NetworkSite) => {
    setCurrentSite(site);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col font-sans antialiased">
      {/* Network Header & Identity Switcher */}
      <NetworkHeader
        currentSite={currentSite}
        onSelectSite={handleSelectSite}
        classesPage={classesPage}
        onSelectClassesPage={(page) => {
          setClassesPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        storePage={storePage}
        onSelectStorePage={(page) => {
          setStorePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        libraryPage={libraryPage}
        onSelectLibraryPage={(page) => {
          setLibraryPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        adminTab={adminTab}
        onSelectAdminTab={(tab) => {
          setAdminTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenEnquiry={() => setIsEnquiryModalOpen(true)}
        totalProductsCount={products.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 pb-12">
        {currentSite === 'classes' && (
          <ClassesView
            currentPage={classesPage}
            onNavigate={(page) => {
              setClassesPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            products={products}
            onPreviewProduct={setPreviewProduct}
            onOpenEnquiry={() => setIsEnquiryModalOpen(true)}
          />
        )}

        {currentSite === 'store' && (
          <StoreView
            currentPage={storePage}
            onNavigate={(page) => {
              setStorePage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            products={products}
            onPreviewProduct={setPreviewProduct}
          />
        )}

        {currentSite === 'library' && (
          <LibraryView
            currentPage={libraryPage}
            onNavigate={(page) => {
              setLibraryPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            products={products}
            onPreviewProduct={setPreviewProduct}
          />
        )}

        {currentSite === 'admin' && (
          <AdminDashboard
            products={products}
            onUpdateProducts={handleUpdateProducts}
            currentTab={adminTab}
            onSelectTab={setAdminTab}
            enquiries={enquiries}
            onUpdateEnquiries={handleUpdateEnquiries}
          />
        )}
      </main>

      {/* Network Universal Footer */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Network Branding */}
            <div className="space-y-3 md:col-span-1">
              <span className="font-extrabold text-sm tracking-wider text-indigo-400 uppercase">
                Aakushi Education Network
              </span>
              <p className="text-slate-400 leading-relaxed text-xs">
                A unified educational platform connecting personalized online mathematics coaching, digital self-study worksheets, and a curated pedagogical resource archive.
              </p>
              <div className="pt-1 flex items-center gap-1.5 text-[11px] text-amber-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero-Hosting Cost Architecture</span>
              </div>
            </div>

            {/* Column 2: Website 1 Links */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                <span>Aakushi Classes</span>
              </h4>
              <ul className="space-y-1.5 text-slate-400">
                <li>
                  <button
                    onClick={() => {
                      handleSelectSite('classes');
                      setClassesPage('about');
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Teacher Profile & Philosophy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleSelectSite('classes');
                      setClassesPage('coaching');
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Online Coaching Batches
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleSelectSite('classes');
                      setClassesPage('support');
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Student Learning Support
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsEnquiryModalOpen(true)}
                    className="text-amber-400 hover:text-amber-300 font-semibold transition-colors cursor-pointer"
                  >
                    Submit Coaching Enquiry →
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Website 2 Links */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                <span>Aakushi Learning Store</span>
              </h4>
              <ul className="space-y-1.5 text-slate-400">
                <li>
                  <button
                    onClick={() => {
                      handleSelectSite('store');
                      setStorePage('worksheets');
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Graded Worksheets
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleSelectSite('store');
                      setStorePage('tests');
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Chapter Tests & Question Papers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleSelectSite('store');
                      setStorePage('bundles');
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Curated Revision Bundles
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleSelectSite('store');
                      setStorePage('free');
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Free Concept Handouts
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Website 3 & Teacher Access */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                <Library className="w-4 h-4 text-violet-400" />
                <span>Aakushi Resource Library</span>
              </h4>
              <ul className="space-y-1.5 text-slate-400">
                <li>
                  <button
                    onClick={() => {
                      handleSelectSite('library');
                      setLibraryPage('by-class');
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Archive by Class
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleSelectSite('library');
                      setLibraryPage('by-chapter');
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Archive by Chapter
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleSelectSite('library');
                      setLibraryPage('archive-info');
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Repository Access Policy
                  </button>
                </li>
                <li className="pt-2">
                  <button
                    onClick={() => handleSelectSite('admin')}
                    className="px-2.5 py-1 rounded bg-slate-800 text-amber-300 hover:bg-slate-700 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Teacher Admin Console</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
            <p>
              © {new Date().getFullYear()} Aakushi Education Network. All original mathematics worksheets and question papers copyright of the author.
            </p>
            <p>
              Fulfillments routed via Instamojo Gateway • No financial credentials stored on site
            </p>
          </div>
        </div>
      </footer>

      {/* Global Product Preview Modal */}
      <ProductPreviewModal
        product={previewProduct}
        onClose={() => setPreviewProduct(null)}
        allProducts={products}
        onSelectRelated={(p) => setPreviewProduct(p)}
      />

      {/* Global Coaching Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        onSubmitted={(newEnq) => {
          setEnquiries((prev) => [newEnq, ...prev]);
        }}
      />
    </div>
  );
}
