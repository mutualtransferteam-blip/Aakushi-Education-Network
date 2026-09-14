import React, { useState } from 'react';
import {
  Product,
  AdminTab,
  CoachingEnquiry,
  ProductType,
  DifficultyLevel,
  LanguageOption,
  FileClassification,
  PublicationStatus,
} from '../../types';
import { storageService } from '../../services/storageService';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Archive,
  Trash2,
  Download,
  Upload,
  Layers,
  Link,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Calendar,
  Lock,
  Unlock,
  Eye,
  ExternalLink,
  BookOpen,
  ShoppingBag,
  GraduationCap,
  Library,
  FileSpreadsheet,
} from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  enquiries: CoachingEnquiry[];
  onUpdateEnquiries: (enquiries: CoachingEnquiry[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  onUpdateProducts,
  currentTab,
  onSelectTab,
  enquiries,
  onUpdateEnquiries,
}) => {
  // Prototype Security: PIN unlock state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Default unlocked for easy review, with lock toggle
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Search & Filters in Admin
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterVisibility, setFilterVisibility] = useState('');

  // Editing & Creating Form State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorError, setEditorError] = useState<string | null>(null);

  // Bundle Builder State
  const [isBundleBuilderOpen, setIsBundleBuilderOpen] = useState(false);
  const [bundleTitle, setBundleTitle] = useState('');
  const [bundleClass, setBundleClass] = useState('Class 10');
  const [selectedBundleProductIds, setSelectedBundleProductIds] = useState<string[]>([]);
  const [bundleDiscountedPrice, setBundleDiscountedPrice] = useState<number>(149);
  const [bundleError, setBundleError] = useState<string | null>(null);

  // CSV error
  const [csvError, setCsvError] = useState<string | null>(null);

  // Success notifications
  const [flashMessage, setFlashMessage] = useState<string | null>(null);

  const showFlash = (msg: string) => {
    setFlashMessage(msg);
    setTimeout(() => setFlashMessage(null), 4000);
  };

  // Auth unlock
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === storageService.getAdminPin()) {
      setIsAuthenticated(true);
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  // Filtered products
  const filteredProducts = products.filter((p) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        p.title.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.chapter.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (filterClass && p.classLevel !== filterClass) return false;
    if (filterType && p.productType !== filterType) return false;
    if (filterStatus && p.publicationStatus !== filterStatus) return false;
    if (filterVisibility) {
      if (filterVisibility === 'classes' && !p.visibility.classes) return false;
      if (filterVisibility === 'store' && !p.visibility.store) return false;
      if (filterVisibility === 'library' && !p.visibility.library) return false;
    }
    return true;
  });

  // Open Editor for new or existing
  const handleOpenNewProduct = () => {
    const newId = `PROD-${Math.floor(100 + Math.random() * 900)}`;
    setEditingProduct({
      id: newId,
      title: '',
      shortDescription: '',
      detailedDescription: '',
      classLevel: 'Class 10',
      subject: 'Mathematics',
      chapter: '',
      productType: 'Worksheet',
      difficulty: 'Standard',
      language: 'English',
      numberOfQuestions: 20,
      hasAnswerKey: true,
      learningObjective: '',
      price: 49,
      isFree: false,
      instamojoUrl: '',
      previewUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
      fullStorageRef: 'gdrive://aakushi-vault/master.pdf',
      fileClassification: 'private_paid',
      visibility: {
        classes: true,
        store: true,
        library: true,
      },
      publicationStatus: 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      versionNumber: '1.0',
      tags: ['Mathematics'],
      relatedProductIds: [],
      isSampleProduct: false,
    });
    setIsEditorOpen(true);
  };

  const handleEditProduct = (prod: Product) => {
    setEditingProduct({ ...prod });
    setIsEditorOpen(true);
  };

  // Save Product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (!editingProduct.title.trim() || !editingProduct.chapter.trim()) {
      setEditorError('Please provide both a product title and chapter topic.');
      return;
    }
    setEditorError(null);

    const exists = products.some((p) => p.id === editingProduct.id);
    let updatedList: Product[];

    const productWithUpdatedTime: Product = {
      ...editingProduct,
      updatedAt: new Date().toISOString(),
      price: editingProduct.isFree ? 0 : Number(editingProduct.price) || 0,
      fileClassification: editingProduct.isFree ? 'public_free' : 'private_paid',
    };

    if (exists) {
      updatedList = products.map((p) =>
        p.id === productWithUpdatedTime.id ? productWithUpdatedTime : p
      );
      showFlash(`Product "${productWithUpdatedTime.title}" updated successfully.`);
    } else {
      updatedList = [productWithUpdatedTime, ...products];
      showFlash(`New product "${productWithUpdatedTime.title}" added to central library.`);
    }

    onUpdateProducts(updatedList);
    storageService.saveProducts(updatedList);
    setIsEditorOpen(false);
    setEditingProduct(null);
  };

  // Archive Product
  const handleArchiveProduct = (id: string) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, publicationStatus: 'archived' as PublicationStatus, updatedAt: new Date().toISOString() } : p
    );
    onUpdateProducts(updated);
    storageService.saveProducts(updated);
    showFlash(`Product ${id} marked as archived (hidden from all public websites).`);
  };

  // Un-archive or toggle status
  const handleToggleStatus = (id: string, newStatus: PublicationStatus) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, publicationStatus: newStatus, updatedAt: new Date().toISOString() } : p
    );
    onUpdateProducts(updated);
    storageService.saveProducts(updated);
    showFlash(`Product status updated to "${newStatus}".`);
  };

  // Delete product permanently
  const handleDeleteProduct = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      const updated = products.filter((p) => p.id !== id);
      onUpdateProducts(updated);
      storageService.saveProducts(updated);
      showFlash(`Product "${title}" removed from catalog.`);
    }
  };

  // Quick Instamojo link update
  const handleUpdateInstamojo = (id: string, newUrl: string) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, instamojoUrl: newUrl.trim(), updatedAt: new Date().toISOString() } : p
    );
    onUpdateProducts(updated);
    storageService.saveProducts(updated);
    showFlash(`Instamojo URL updated for ${id}.`);
  };

  // Bundle creation
  const handleCreateBundle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bundleTitle.trim() || selectedBundleProductIds.length < 2) {
      setBundleError('Please enter a bundle title and select at least 2 products to bundle.');
      return;
    }
    setBundleError(null);

    const includedItems = products.filter((p) => selectedBundleProductIds.includes(p.id));
    const originalSum = includedItems.reduce((acc, curr) => acc + curr.price, 0);

    const newBundleId = `BUNDLE-${Date.now().toString().slice(-4)}`;
    const newBundleProduct: Product = {
      id: newBundleId,
      title: bundleTitle.trim(),
      shortDescription: `Curated bundle containing ${includedItems.length} core resources: ${includedItems.map((i) => i.chapter).join(', ')}.`,
      detailedDescription: `Mastery pack combining:\n${includedItems.map((i, idx) => `${idx + 1}. ${i.title} (${i.numberOfQuestions} questions)`).join('\n')}\nIncludes verified answer keys and complete step-by-step solutions.`,
      classLevel: bundleClass,
      subject: 'Mathematics',
      chapter: 'Multiple Chapters Bundle',
      productType: 'Bundle',
      difficulty: 'Standard',
      language: 'English',
      numberOfQuestions: includedItems.reduce((acc, curr) => acc + curr.numberOfQuestions, 0),
      hasAnswerKey: true,
      learningObjective: `Comprehensive revision across multiple chapters with 30%+ combined discount savings.`,
      price: bundleDiscountedPrice,
      isFree: false,
      instamojoUrl: '',
      previewUrl: includedItems[0]?.previewUrl || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
      fullStorageRef: `gdrive://aakushi-vault/bundles/${newBundleId}.pdf`,
      fileClassification: 'private_paid',
      visibility: {
        classes: true,
        store: true,
        library: true,
      },
      publicationStatus: 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      versionNumber: '1.0',
      tags: [bundleClass, 'Bundle', 'Revision Pack', 'Complete Mastery'],
      relatedProductIds: selectedBundleProductIds,
      bundleInfo: {
        isBundle: true,
        includedProductIds: selectedBundleProductIds,
        originalCombinedPrice: originalSum,
        discountedPrice: bundleDiscountedPrice,
        totalWorksheetsCount: selectedBundleProductIds.length,
      },
    };

    const updated = [newBundleProduct, ...products];
    onUpdateProducts(updated);
    storageService.saveProducts(updated);
    setIsBundleBuilderOpen(false);
    setBundleTitle('');
    setSelectedBundleProductIds([]);
    showFlash(`Bundle "${newBundleProduct.title}" created successfully.`);
  };

  // Reset & Clear sample data
  const handleResetSampleData = () => {
    if (window.confirm('Reset catalog to the default sample educational products? Any unsaved custom items will be overwritten.')) {
      const samples = storageService.resetToSampleProducts();
      onUpdateProducts(samples);
      showFlash('Catalog reset to standard sample products.');
    }
  };

  const handleClearSampleData = () => {
    if (window.confirm('Remove all sample products (tagged [SAMPLE])? This allows you to start clean with only your original materials.')) {
      const clean = storageService.clearAllSampleProducts();
      onUpdateProducts(clean);
      showFlash('Sample products removed. Catalog is ready for your own materials.');
    }
  };

  // CSV Import file handler
  const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        setCsvError(null);
        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
        if (lines.length <= 1) {
          setCsvError('CSV file appears empty or missing data rows.');
          return;
        }

        // Parse simple CSV rows
        const importedItems: Product[] = [];
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i];
          // Simple regex splitting respecting quotes
          const match = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
          if (!match || match.length < 5) continue;

          const cleanCell = (val: string) => (val || '').replace(/^"|"$/g, '').trim();

          const id = cleanCell(match[0]) || `PROD-IMP-${Date.now()}-${i}`;
          const title = cleanCell(match[1]) || `Imported Item ${i}`;
          const classLevel = cleanCell(match[2]) || 'Class 10';
          const subject = cleanCell(match[3]) || 'Mathematics';
          const chapter = cleanCell(match[4]) || 'General';
          const productType = (cleanCell(match[5]) as ProductType) || 'Worksheet';
          const price = Number(cleanCell(match[10])) || 0;
          const isFree = cleanCell(match[11]).toLowerCase() === 'yes' || price === 0;

          importedItems.push({
            id,
            title,
            classLevel,
            subject,
            chapter,
            productType,
            difficulty: 'Standard',
            language: 'English',
            numberOfQuestions: Number(cleanCell(match[8])) || 20,
            hasAnswerKey: true,
            learningObjective: 'Imported curriculum material.',
            price,
            isFree,
            instamojoUrl: cleanCell(match[12]),
            previewUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
            fullStorageRef: cleanCell(match[14]) || 'gdrive://master.pdf',
            fileClassification: isFree ? 'public_free' : 'private_paid',
            visibility: {
              classes: true,
              store: true,
              library: true,
            },
            publicationStatus: 'published',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            versionNumber: '1.0',
            tags: [classLevel, subject],
            relatedProductIds: [],
            shortDescription: cleanCell(match[24]) || 'Educational practice material.',
            detailedDescription: 'Curated curriculum worksheet imported from external spreadsheet records.',
          });
        }

        if (importedItems.length > 0) {
          const combined = [...importedItems, ...products];
          onUpdateProducts(combined);
          storageService.saveProducts(combined);
          showFlash(`Successfully imported ${importedItems.length} products from CSV.`);
        } else {
          setCsvError('Could not parse valid product rows from CSV. Please check column formatting.');
        }
      } catch (err) {
        console.error('Import error:', err);
        setCsvError('Failed to parse CSV file. Ensure standard formatting.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-200 shadow-lg text-center space-y-5">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Teacher Admin Authentication</h2>
          <p className="text-xs text-slate-500 mt-1">
            Stage 1 prototype security layer. Enter the teacher PIN to access the central product management console.
          </p>
          <p className="text-[11px] font-mono text-indigo-600 bg-indigo-50 py-1 px-2 rounded mt-2 inline-block">
            Default Prototype PIN: <strong>1234</strong>
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-3">
          <input
            type="password"
            value={pinInput}
            onChange={(e) => {
              setPinInput(e.target.value);
              setPinError(false);
            }}
            placeholder="Enter 4-digit PIN..."
            className="w-full text-center tracking-widest text-lg font-mono px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
          {pinError && (
            <p className="text-xs text-rose-600 font-medium">Incorrect PIN. Try 1234.</p>
          )}
          <button
            type="submit"
            className="w-full py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Unlock Admin Console
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Admin Header with Top Metrics & Quick Controls */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-bold text-[10px] uppercase tracking-wider">
              Teacher Central Console
            </span>
            <span className="text-xs text-slate-400 font-mono">Stage 1 Prototype</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Central Educational Product Library Management
          </h1>
          <p className="text-xs text-slate-300">
            Create material once → distribute across Aakushi Classes, Learning Store, and Resource Library.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="admin-btn-add-product"
            onClick={handleOpenNewProduct}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
          <button
            onClick={() => setIsBundleBuilderOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>Create Bundle</span>
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Lock Admin Console"
          >
            <Unlock className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Flash Notification */}
      {flashMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 shadow-xs transition-all">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{flashMessage}</span>
        </div>
      )}

      {/* Admin Secondary Bar: Stats & Quick Presets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-0.5">
          <span className="text-slate-400 text-[11px]">Total Catalog Items</span>
          <p className="text-xl font-extrabold text-slate-900">{products.length}</p>
          <span className="text-[10px] text-slate-500">
            {products.filter((p) => p.isFree).length} Free • {products.filter((p) => !p.isFree).length} Paid
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-0.5">
          <span className="text-slate-400 text-[11px]">Aakushi Classes</span>
          <p className="text-xl font-extrabold text-indigo-700">
            {products.filter((p) => p.visibility.classes && p.publicationStatus === 'published').length}
          </p>
          <span className="text-[10px] text-slate-500">Resources visible on coaching site</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-0.5">
          <span className="text-slate-400 text-[11px]">Aakushi Store</span>
          <p className="text-xl font-extrabold text-emerald-700">
            {products.filter((p) => p.visibility.store && p.publicationStatus === 'published').length}
          </p>
          <span className="text-[10px] text-slate-500">Products with Instamojo checkout</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-0.5">
          <span className="text-slate-400 text-[11px]">Coaching Enquiries</span>
          <p className="text-xl font-extrabold text-amber-600">
            {enquiries.filter((e) => e.status === 'New').length} New
          </p>
          <span className="text-[10px] text-slate-500">{enquiries.length} total received</span>
        </div>
      </div>

      {/* TAB 1: ALL PRODUCTS MANAGEMENT (The main control view) */}
      {(currentTab === 'products' || currentTab === 'add-product') && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-4 sm:p-5">
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by title, ID, chapter, tags..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700"
              >
                <option value="">All Classes</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700"
              >
                <option value="">All Types</option>
                <option value="Worksheet">Worksheet</option>
                <option value="Practice Paper">Practice Paper</option>
                <option value="Question Paper">Question Paper</option>
                <option value="Diagnostic Test">Diagnostic Test</option>
                <option value="Chapter Test">Chapter Test</option>
                <option value="Concept Notes">Concept Notes</option>
                <option value="Bundle">Bundle</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700"
              >
                <option value="">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>

              <select
                value={filterVisibility}
                onChange={(e) => setFilterVisibility(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700"
              >
                <option value="">All Visibility</option>
                <option value="classes">Visible on Classes</option>
                <option value="store">Visible on Store</option>
                <option value="library">Visible on Library</option>
              </select>
            </div>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Product / ID</th>
                  <th className="py-2.5 px-3">Class & Topic</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Pricing</th>
                  <th className="py-2.5 px-3">Distribution Visibility</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No matching products in the central catalogue.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900 leading-snug line-clamp-1">
                          {p.title}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-400">
                          <span className="font-mono">{p.id}</span>
                          <span>•</span>
                          <span>Updated {new Date(p.updatedAt).toLocaleDateString()}</span>
                          {p.isSampleProduct && (
                            <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                              SAMPLE
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-800">{p.classLevel}</span>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{p.chapter}</div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700">
                          {p.productType}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        {p.isFree ? (
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                            FREE
                          </span>
                        ) : (
                          <span className="font-bold text-slate-900">₹{p.price}</span>
                        )}
                        {!p.isFree && !p.instamojoUrl && (
                          <div className="text-[10px] text-amber-600 flex items-center gap-1 mt-0.5">
                            <AlertTriangle className="w-2.5 h-2.5" /> No link
                          </div>
                        )}
                      </td>

                      {/* 3 Websites Visibility Checkboxes Indicators */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1 text-[11px]">
                          <span
                            className={`px-1.5 py-0.5 rounded font-medium ${
                              p.visibility.classes
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-slate-100 text-slate-300'
                            }`}
                            title="Aakushi Classes visibility"
                          >
                            Classes
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded font-medium ${
                              p.visibility.store
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-300'
                            }`}
                            title="Aakushi Store visibility"
                          >
                            Store
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded font-medium ${
                              p.visibility.library
                                ? 'bg-violet-100 text-violet-800'
                                : 'bg-slate-100 text-slate-300'
                            }`}
                            title="Aakushi Library visibility"
                          >
                            Library
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                            p.publicationStatus === 'published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : p.publicationStatus === 'draft'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {p.publicationStatus}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleEditProduct(p)}
                            className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                            title="Edit product details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {p.publicationStatus !== 'archived' ? (
                            <button
                              onClick={() => handleArchiveProduct(p.id)}
                              className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded transition-colors cursor-pointer"
                              title="Archive product (hide from all websites)"
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleStatus(p.id, 'published')}
                              className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                              title="Restore to Published"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteProduct(p.id, p.title)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title="Permanently remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Quick sample reset & cleanup helpers */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              Total Products in Central Storage: <strong>{products.length}</strong>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearSampleData}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
              >
                Clear [SAMPLE] Products Only
              </button>
              <button
                onClick={handleResetSampleData}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
              >
                Reset Default Samples
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INSTAMOJO CONFIGURATION TABLE */}
      {currentTab === 'instamojo-config' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-xs">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Link className="w-5 h-5 text-indigo-600" />
              Instamojo Product Links Configuration
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Easily connect or update the direct Instamojo checkout URL for each paid product. No coding or backend recompilation needed.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
            <h5 className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              Zero-Credential Safe Integration Method
            </h5>
            <p className="leading-relaxed">
              In this Stage 1 architecture, payments are processed directly by Instamojo. When customers click "Buy Now", they are redirected to your exact Instamojo checkout link. This guarantees zero card data touches your website and requires zero paid API plugins.
            </p>
          </div>

          <div className="space-y-3">
            {products
              .filter((p) => !p.isFree)
              .map((product) => (
                <div
                  key={product.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 max-w-sm">
                    <span className="font-semibold text-slate-900 text-sm block">{product.title}</span>
                    <div className="text-slate-500">
                      {product.classLevel} • {product.chapter} • <strong className="text-slate-800">₹{product.price}</strong>
                    </div>
                  </div>

                  <div className="flex-1 w-full sm:w-auto max-w-md flex items-center gap-2">
                    <input
                      type="url"
                      defaultValue={product.instamojoUrl}
                      placeholder="e.g. https://www.instamojo.com/@aakushi/product-name"
                      onBlur={(e) => {
                        if (e.target.value !== product.instamojoUrl) {
                          handleUpdateInstamojo(product.id, e.target.value);
                        }
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-indigo-500"
                    />
                    {product.instamojoUrl && (
                      <a
                        href={product.instamojoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-indigo-600 hover:text-indigo-800"
                        title="Test link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 3: BUNDLES MANAGEMENT */}
      {currentTab === 'bundles' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                Educational Bundles Manager
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Combine existing worksheets and chapter tests into high-value discounted packages without re-authoring content.
              </p>
            </div>
            <button
              onClick={() => setIsBundleBuilderOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Bundle</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products
              .filter((p) => p.productType === 'Bundle' || p.bundleInfo?.isBundle)
              .map((bundle) => (
                <div key={bundle.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{bundle.title}</span>
                    <span className="font-bold text-indigo-700 text-sm">₹{bundle.price}</span>
                  </div>
                  <p className="text-slate-600">{bundle.shortDescription}</p>

                  <div className="space-y-1 pt-1 border-t border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-500">Bundled Products:</span>
                    <div className="space-y-1">
                      {bundle.bundleInfo?.includedProductIds.map((id) => {
                        const item = products.find((p) => p.id === id);
                        return (
                          <div key={id} className="flex items-center justify-between text-slate-700 bg-white px-2 py-1 rounded border border-slate-100">
                            <span>{item ? item.title : id}</span>
                            <span className="text-slate-400">₹{item?.price || 0}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => handleEditProduct(bundle)}
                      className="px-3 py-1 text-slate-700 hover:bg-slate-200 rounded cursor-pointer"
                    >
                      Edit Bundle
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(bundle.id, bundle.title)}
                      className="px-3 py-1 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 4: COACHING ENQUIRIES */}
      {currentTab === 'enquiries' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-xs">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              Student Coaching Enquiries
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Enquiries submitted through Website 1 (Aakushi Classes). All parent and student contact details are stored securely.
            </p>
          </div>

          <div className="space-y-3">
            {enquiries.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">No enquiries received yet.</p>
            ) : (
              enquiries.map((enq) => (
                <div key={enq.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">
                        {enq.studentName} ({enq.classLevel})
                      </span>
                      <span className="text-slate-400 ml-2">Parent: {enq.parentName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">
                        {new Date(enq.submittedAt).toLocaleString()}
                      </span>
                      <select
                        value={enq.status}
                        onChange={(e) => {
                          const updated = storageService.updateEnquiryStatus(
                            enq.id,
                            e.target.value as CoachingEnquiry['status']
                          );
                          onUpdateEnquiries(updated);
                          showFlash(`Enquiry marked as ${e.target.value}.`);
                        }}
                        className="bg-white border border-slate-300 rounded px-2 py-0.5 text-xs font-semibold"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Enrolled">Enrolled</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 pt-1">
                    <div>
                      <strong>Contact:</strong> {enq.phone} • {enq.email || 'No email'}
                    </div>
                    <div>
                      <strong>Goal:</strong> {enq.targetExamOrGoal}
                    </div>
                    <div>
                      <strong>Struggle Topics:</strong> {enq.currentStruggleTopics}
                    </div>
                    <div>
                      <strong>Preferred Batch:</strong> {enq.preferredBatchTiming}
                    </div>
                  </div>

                  {enq.additionalNotes && (
                    <div className="text-[11px] text-slate-500 bg-white p-2 rounded border border-slate-100">
                      <strong>Notes:</strong> {enq.additionalNotes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 5: BACKUP & DATA OWNERSHIP */}
      {currentTab === 'data-backup' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-xs text-xs">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              Backup, Export & Data Ownership
            </h3>
            <p className="text-slate-500 mt-1">
              You own 100% of your educational materials data. Export records at any time without platform lock-in.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-5 rounded-xl border border-slate-200 space-y-3 bg-slate-50/50">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Download className="w-4 h-4 text-indigo-600" />
                Export Product Catalogue (CSV)
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Download a clean comma-separated values (.csv) spreadsheet compatible with Microsoft Excel, Google Sheets, or LibreOffice Calc.
              </p>
              <button
                onClick={() => storageService.exportCatalogueToCsv(products)}
                className="px-4 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV Spreadsheet</span>
              </button>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 space-y-3 bg-slate-50/50">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-600" />
                Full System JSON Snapshot
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Download the complete raw structured JSON file with all visibility flags, metadata, and timestamps for developer restore.
              </p>
              <button
                onClick={() => storageService.exportCatalogueToJson(products)}
                className="px-4 py-2 font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Complete JSON</span>
              </button>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-600" />
              Import Records from CSV
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Upload a previously exported CSV file or formatted batch sheet to populate products into the central library.
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvImport}
              className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
            />
            {csvError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs font-medium">
                ⚠️ {csvError}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: TECHNICAL ARCHITECTURE & ROADMAP */}
      {currentTab === 'architecture-guide' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs text-xs">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">
              System Architecture, Free-Tier Services & Launch Roadmap
            </h3>
            <p className="text-slate-500 mt-1">
              Technical documentation explaining zero-cost maintenance, security boundaries, and next stages.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">1. Proposed Zero-Cost Architecture</h4>
              <p className="text-slate-600 leading-relaxed">
                The entire Aakushi Education Network is built as a single responsive React application delivering three distinct website identities powered by one unified central data library.
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li><strong>Website Hosting:</strong> Static SPA deployable to GitHub Pages, Cloudflare Pages, Vercel, or Netlify with 100% free hosting tiers (unlimited bandwidth for text and static assets).</li>
                <li><strong>Domain Name:</strong> Free subdomains (e.g. <code>aakushi.pages.dev</code>) or an optional ₹600-800/year custom .in/.com domain later when desired.</li>
                <li><strong>Payment Gateway:</strong> Instamojo requires zero monthly fixed fees. Instamojo charges standard per-transaction fees (typically 2% + ₹3) only when a sale happens.</li>
                <li><strong>PDF File Storage:</strong> Google Drive with read-only shared links for public items and private folders for masters. Free Google accounts provide 15 GB storage.</li>
              </ul>
            </div>

            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
              <h4 className="font-bold text-amber-900 text-sm">2. Free-Tier Limitations & Security Cautions</h4>
              <p className="text-amber-950 leading-relaxed">
                Stage 1 provides high maintainability and zero hosting fees. However, be aware of:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-amber-900">
                <li><strong>Browser LocalStorage:</strong> In Stage 1, products and enquiries persist in your browser storage. If you clear your browser cache, you must re-import from your CSV backup. (Stage 2 adds cloud database persistence).</li>
                <li><strong>Private PDF Links:</strong> Never paste confidential Google Drive viewable links into the "Preview URL" field. Only use safe watermarked preview images or preview excerpts.</li>
              </ul>
            </div>

            <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-2">
              <h4 className="font-bold text-indigo-900 text-sm">3. Launch Checklist</h4>
              <div className="space-y-1.5 text-indigo-950">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Replace placeholder contact details with your real teaching email/WhatsApp.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Create products on your Instamojo dashboard and paste their links into the Instamojo tab.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Export a CSV backup of your catalogue after adding initial real worksheets.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT EDITOR MODAL (Capability 1, 2, 6, 7, 8, 9, 10, 11, 12) */}
      {isEditorOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8 flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-indigo-300 uppercase">
                  {editingProduct.id}
                </span>
                <h3 className="text-base font-bold">
                  {products.some((p) => p.id === editingProduct.id)
                    ? 'Edit Central Product'
                    : 'Add New Product to Central Library'}
                </h3>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4 text-xs">
              {editorError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs font-medium">
                  ⚠️ {editorError}
                </div>
              )}
              {/* Basic Fields */}
              <div className="space-y-1">
                <label className="block font-medium text-slate-700">
                  Product Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.title}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, title: e.target.value })
                  }
                  placeholder="e.g. Class 10 Trigonometry: Height & Distance Problem Solving Kit"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700">Class Level</label>
                  <select
                    value={editingProduct.classLevel}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, classLevel: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700">Subject</label>
                  <input
                    type="text"
                    value={editingProduct.subject}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, subject: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700">Chapter / Topic <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={editingProduct.chapter}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, chapter: e.target.value })
                    }
                    placeholder="e.g. Quadratic Equations"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700">Product Type</label>
                  <select
                    value={editingProduct.productType}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        productType: e.target.value as ProductType,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Worksheet">Worksheet</option>
                    <option value="Practice Paper">Practice Paper</option>
                    <option value="Question Paper">Question Paper</option>
                    <option value="Diagnostic Test">Diagnostic Test</option>
                    <option value="Chapter Test">Chapter Test</option>
                    <option value="Concept Notes">Concept Notes</option>
                    <option value="Bundle">Bundle</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700">Difficulty</label>
                  <select
                    value={editingProduct.difficulty}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        difficulty: e.target.value as DifficultyLevel,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Basic">Basic (Foundations)</option>
                    <option value="Standard">Standard (CBSE/ICSE)</option>
                    <option value="Advanced">Advanced (HOTS)</option>
                    <option value="Exemplar/Competitive">Exemplar/Competitive</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700">Questions Count</label>
                  <input
                    type="number"
                    min="1"
                    value={editingProduct.numberOfQuestions}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        numberOfQuestions: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Pricing & Free Toggle */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isFree}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          isFree: e.target.checked,
                          price: e.target.checked ? 0 : editingProduct.price || 49,
                        })
                      }
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span className="font-semibold text-slate-800">
                      Mark as Free Educational Resource
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.hasAnswerKey}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          hasAnswerKey: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span className="font-semibold text-slate-800">
                      Includes Answer Key / Detailed Solutions
                    </span>
                  </label>
                </div>

                {!editingProduct.isFree && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block font-medium text-slate-700">Price (in INR ₹)</label>
                      <input
                        type="number"
                        min="1"
                        value={editingProduct.price}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            price: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700">
                        Instamojo Purchase URL
                      </label>
                      <input
                        type="url"
                        value={editingProduct.instamojoUrl}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            instamojoUrl: e.target.value,
                          })
                        }
                        placeholder="https://imjo.in/xxxx"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Website Visibility (Aakushi Classes, Store, Library) */}
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-2">
                <span className="font-bold text-indigo-900 block">
                  Website Visibility & Distribution
                </span>
                <p className="text-indigo-800 text-[11px]">
                  Select which of the three website views will display this product:
                </p>
                <div className="flex flex-wrap gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.visibility.classes}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          visibility: {
                            ...editingProduct.visibility,
                            classes: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span className="font-medium text-slate-800">Aakushi Classes</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.visibility.store}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          visibility: {
                            ...editingProduct.visibility,
                            store: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span className="font-medium text-slate-800">Aakushi Learning Store</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.visibility.library}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          visibility: {
                            ...editingProduct.visibility,
                            library: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-violet-600 rounded"
                    />
                    <span className="font-medium text-slate-800">Aakushi Resource Library</span>
                  </label>
                </div>
              </div>

              {/* Publication Status */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">Publication Status</label>
                <select
                  value={editingProduct.publicationStatus}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      publicationStatus: e.target.value as PublicationStatus,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                >
                  <option value="published">Published (Visible per selected sites)</option>
                  <option value="draft">Draft (Private, invisible on public sites)</option>
                  <option value="archived">Archived (Archived, completely hidden)</option>
                </select>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">Short Description</label>
                <input
                  type="text"
                  value={editingProduct.shortDescription}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, shortDescription: e.target.value })
                  }
                  placeholder="1-2 sentences summarizing topics covered..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Detailed Description / Problem Structure
                </label>
                <textarea
                  rows={4}
                  value={editingProduct.detailedDescription}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, detailedDescription: e.target.value })
                  }
                  placeholder="Detailed breakdown of sections, Level 1 / Level 2 / Level 3 problems, board syllabus match..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Learning Objective */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">Learning Objective</label>
                <input
                  type="text"
                  value={editingProduct.learningObjective}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, learningObjective: e.target.value })
                  }
                  placeholder="What specific skill or conceptual breakthrough will students achieve?"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Private Storage Reference (Explicitly never displayed publicly) */}
              <div className="p-3 bg-slate-100 rounded-xl space-y-1">
                <label className="block font-medium text-slate-700">
                  Private Cloud Storage Reference (Master PDF reference)
                </label>
                <input
                  type="text"
                  value={editingProduct.fullStorageRef}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, fullStorageRef: e.target.value })
                  }
                  placeholder="e.g. gdrive://aakushi-vault/chapter-master.pdf"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-xs"
                />
                <span className="text-[10px] text-slate-500">
                  Security note: This internal storage path is strictly confidential and is never displayed on any public website.
                </span>
              </div>

              {/* Footer */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer shadow-xs"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BUNDLE BUILDER MODAL (Capability 14) */}
      {isBundleBuilderOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-300" />
                <span>Create New Multi-Resource Bundle</span>
              </h3>
              <button
                onClick={() => setIsBundleBuilderOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBundle} className="p-6 overflow-y-auto space-y-4 text-xs">
              {bundleError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs font-medium">
                  ⚠️ {bundleError}
                </div>
              )}
              <div>
                <label className="block font-medium text-slate-700 mb-1">Bundle Title</label>
                <input
                  type="text"
                  required
                  value={bundleTitle}
                  onChange={(e) => setBundleTitle(e.target.value)}
                  placeholder="e.g. Class 10 Term 1 Mathematics Complete Mastery Bundle"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Class Level</label>
                  <select
                    value={bundleClass}
                    onChange={(e) => setBundleClass(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Discounted Bundle Price (INR ₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={bundleDiscountedPrice}
                    onChange={(e) => setBundleDiscountedPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  />
                </div>
              </div>

              {/* Product Selection for Bundle */}
              <div className="space-y-2">
                <label className="block font-medium text-slate-700">
                  Select Standalone Products to Include (Min 2):
                </label>
                <div className="max-h-52 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100 p-1">
                  {products
                    .filter((p) => p.productType !== 'Bundle' && p.classLevel === bundleClass)
                    .map((item) => {
                      const isSelected = selectedBundleProductIds.includes(item.id);
                      return (
                        <label
                          key={item.id}
                          className="flex items-center justify-between p-2 hover:bg-slate-50 rounded cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedBundleProductIds([
                                    ...selectedBundleProductIds,
                                    item.id,
                                  ]);
                                } else {
                                  setSelectedBundleProductIds(
                                    selectedBundleProductIds.filter((id) => id !== item.id)
                                  );
                                }
                              }}
                              className="w-4 h-4 text-indigo-600 rounded"
                            />
                            <div>
                              <span className="font-semibold text-slate-800">{item.title}</span>
                              <div className="text-[11px] text-slate-400">
                                {item.chapter} • {item.productType}
                              </div>
                            </div>
                          </div>
                          <span className="font-bold text-slate-700">
                            {item.isFree ? 'FREE' : `₹${item.price}`}
                          </span>
                        </label>
                      );
                    })}
                </div>
              </div>

              {/* Bundle Pricing Summary */}
              {selectedBundleProductIds.length > 0 && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span>Individual Prices Sum:</span>
                    <span className="font-semibold">
                      ₹
                      {products
                        .filter((p) => selectedBundleProductIds.includes(p.id))
                        .reduce((acc, curr) => acc + curr.price, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-amber-900 font-bold">
                    <span>Bundle Price:</span>
                    <span>₹{bundleDiscountedPrice}</span>
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsBundleBuilderOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer shadow-xs"
                >
                  Create & Publish Bundle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
