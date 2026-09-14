import React, { useState } from 'react';
import { NetworkSite, ClassesPage, StorePage, LibraryPage, AdminTab } from '../types';
import {
  GraduationCap,
  ShoppingBag,
  Library,
  ShieldAlert,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  BookMarked,
  Sparkles,
} from 'lucide-react';

interface NetworkHeaderProps {
  currentSite: NetworkSite;
  onSelectSite: (site: NetworkSite) => void;
  // Page states
  classesPage: ClassesPage;
  onSelectClassesPage: (page: ClassesPage) => void;
  storePage: StorePage;
  onSelectStorePage: (page: StorePage) => void;
  libraryPage: LibraryPage;
  onSelectLibraryPage: (page: LibraryPage) => void;
  adminTab: AdminTab;
  onSelectAdminTab: (tab: AdminTab) => void;
  // Quick action
  onOpenEnquiry: () => void;
  totalProductsCount: number;
}

export const NetworkHeader: React.FC<NetworkHeaderProps> = ({
  currentSite,
  onSelectSite,
  classesPage,
  onSelectClassesPage,
  storePage,
  onSelectStorePage,
  libraryPage,
  onSelectLibraryPage,
  adminTab,
  onSelectAdminTab,
  onOpenEnquiry,
  totalProductsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Network Identities configuration
  const identities = [
    {
      id: 'classes' as NetworkSite,
      name: 'Aakushi Classes',
      subtitle: 'Online Mathematics Coaching & Teacher Profile',
      icon: GraduationCap,
      accent: 'border-b-2 border-indigo-600 text-indigo-600',
      badge: 'bg-indigo-50 text-indigo-700',
    },
    {
      id: 'store' as NetworkSite,
      name: 'Aakushi Learning Store',
      subtitle: 'Digital Worksheets, Tests & Bundles',
      icon: ShoppingBag,
      accent: 'border-b-2 border-emerald-600 text-emerald-600',
      badge: 'bg-emerald-50 text-emerald-700',
    },
    {
      id: 'library' as NetworkSite,
      name: 'Aakushi Resource Library',
      subtitle: 'Public Pedagogical Archive & Taxonomy',
      icon: Library,
      accent: 'border-b-2 border-violet-600 text-violet-600',
      badge: 'bg-violet-50 text-violet-700',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
      {/* Network Brand Top Bar */}
      <div className="bg-slate-900 text-white px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-wider text-indigo-400 uppercase text-[11px]">
              Aakushi Education Network
            </span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-400 text-[11px]">
              One Central Educational Product Library • Three Public Website Identities
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400 hidden md:inline">
              Central Catalog: <strong className="text-white font-medium">{totalProductsCount} items</strong>
            </span>
            <button
              id="header-admin-toggle"
              onClick={() => onSelectSite('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                currentSite === 'admin'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
              }`}
              title="Private Central Admin Console for the Teacher"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Teacher Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Website Identity Switcher Tabs */}
      <div className="bg-slate-50/80 border-b border-slate-200 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-1 sm:space-x-4 py-1">
            {identities.map((item) => {
              const Icon = item.icon;
              const isActive = currentSite === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-site-switch-${item.id}`}
                  onClick={() => {
                    onSelectSite(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span className="whitespace-nowrap">{item.name}</span>
                </button>
              );
            })}
          </div>

          {currentSite === 'classes' && (
            <button
              onClick={onOpenEnquiry}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition-colors shrink-0 cursor-pointer"
            >
              <span>Enquire for Coaching</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Sub-Navigation Bar for each site's specific pages */}
      <div className="bg-white px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Site 1: Classes Navigation */}
          {currentSite === 'classes' && (
            <nav className="flex items-center space-x-1 sm:space-x-3 overflow-x-auto text-xs font-medium text-slate-600 no-scrollbar">
              {[
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About Teacher' },
                { id: 'approach', label: 'Teaching Approach' },
                { id: 'coaching', label: 'Online Mathematics Coaching' },
                { id: 'support', label: 'Student Learning Support' },
                { id: 'resources', label: 'Selected Resources' },
                { id: 'contact', label: 'Contact' },
              ].map((page) => (
                <button
                  key={page.id}
                  id={`classes-nav-${page.id}`}
                  onClick={() => onSelectClassesPage(page.id as ClassesPage)}
                  className={`px-2.5 py-1.5 rounded-md whitespace-nowrap cursor-pointer transition-colors ${
                    classesPage === page.id
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {page.label}
                </button>
              ))}
            </nav>
          )}

          {/* Site 2: Store Navigation */}
          {currentSite === 'store' && (
            <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto text-xs font-medium text-slate-600 no-scrollbar">
              {[
                { id: 'home', label: 'Store Home' },
                { id: 'all', label: 'All Products' },
                { id: 'by-class', label: 'By Class' },
                { id: 'by-subject', label: 'By Subject' },
                { id: 'by-chapter', label: 'By Chapter' },
                { id: 'worksheets', label: 'Worksheets' },
                { id: 'tests', label: 'Tests & Papers' },
                { id: 'bundles', label: 'Bundles' },
                { id: 'free', label: 'Free Resources' },
                { id: 'contact', label: 'Contact' },
              ].map((page) => (
                <button
                  key={page.id}
                  id={`store-nav-${page.id}`}
                  onClick={() => onSelectStorePage(page.id as StorePage)}
                  className={`px-2.5 py-1.5 rounded-md whitespace-nowrap cursor-pointer transition-colors ${
                    storePage === page.id
                      ? 'bg-emerald-50 text-emerald-700 font-semibold'
                      : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {page.label}
                </button>
              ))}
            </nav>
          )}

          {/* Site 3: Resource Library Navigation */}
          {currentSite === 'library' && (
            <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto text-xs font-medium text-slate-600 no-scrollbar">
              {[
                { id: 'home', label: 'Library Home' },
                { id: 'by-class', label: 'Browse by Class' },
                { id: 'by-subject', label: 'Browse by Subject' },
                { id: 'by-chapter', label: 'Browse by Chapter' },
                { id: 'by-type', label: 'By Material Type' },
                { id: 'search', label: 'Search Archive' },
                { id: 'recent', label: 'Recently Added' },
                { id: 'archive-info', label: 'Archive Security & Access' },
              ].map((page) => (
                <button
                  key={page.id}
                  id={`library-nav-${page.id}`}
                  onClick={() => onSelectLibraryPage(page.id as LibraryPage)}
                  className={`px-2.5 py-1.5 rounded-md whitespace-nowrap cursor-pointer transition-colors ${
                    libraryPage === page.id
                      ? 'bg-violet-50 text-violet-700 font-semibold'
                      : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {page.label}
                </button>
              ))}
            </nav>
          )}

          {/* Admin Navigation */}
          {currentSite === 'admin' && (
            <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto text-xs font-medium text-slate-600 no-scrollbar">
              {[
                { id: 'products', label: 'All Products (Central Catalog)' },
                { id: 'add-product', label: '+ Add New Product' },
                { id: 'bundles', label: 'Bundle Manager' },
                { id: 'enquiries', label: 'Coaching Enquiries' },
                { id: 'instamojo-config', label: 'Instamojo Links' },
                { id: 'data-backup', label: 'CSV/JSON Backup' },
                { id: 'architecture-guide', label: 'Technical Guide & Roadmap' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  id={`admin-nav-${tab.id}`}
                  onClick={() => onSelectAdminTab(tab.id as AdminTab)}
                  className={`px-2.5 py-1.5 rounded-md whitespace-nowrap cursor-pointer transition-colors ${
                    adminTab === tab.id
                      ? 'bg-amber-100 text-amber-900 font-semibold'
                      : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          )}

          {/* Identity Tag Badge */}
          <div className="hidden md:flex items-center gap-1.5 text-[11px] font-medium text-slate-400 pl-3 shrink-0">
            <span>Current Identity:</span>
            <span className="font-semibold text-slate-700">
              {currentSite === 'classes' && 'Aakushi Classes'}
              {currentSite === 'store' && 'Aakushi Learning Store'}
              {currentSite === 'library' && 'Aakushi Resource Library'}
              {currentSite === 'admin' && 'Central Admin Console'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
