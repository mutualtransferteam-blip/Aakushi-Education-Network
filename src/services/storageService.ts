import { Product, CoachingEnquiry } from '../types';
import { initialSampleProducts } from '../data/sampleProducts';

const STORAGE_KEY_PRODUCTS = 'aakushi_central_products_v1';
const STORAGE_KEY_ENQUIRIES = 'aakushi_coaching_enquiries_v1';
const STORAGE_KEY_ADMIN_PIN = 'aakushi_admin_pin_v1';

export const storageService = {
  // Products
  getProducts(): Product[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (!raw) {
        // Initialize with sample products
        localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(initialSampleProducts));
        return initialSampleProducts;
      }
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error loading products from localStorage:', e);
      return initialSampleProducts;
    }
  },

  saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products to localStorage:', e);
    }
  },

  resetToSampleProducts(): Product[] {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(initialSampleProducts));
      return initialSampleProducts;
    } catch (e) {
      console.error('Error resetting sample products:', e);
      return initialSampleProducts;
    }
  },

  clearAllSampleProducts(): Product[] {
    const current = this.getProducts();
    const userOnly = current.filter((p) => !p.isSampleProduct);
    this.saveProducts(userOnly);
    return userOnly;
  },

  // Coaching Enquiries
  getEnquiries(): CoachingEnquiry[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ENQUIRIES);
      if (!raw) {
        const initialEnquiries: CoachingEnquiry[] = [
          {
            id: 'ENQ-2026-001',
            studentName: 'Aarav Sharma',
            parentName: 'Ramesh Sharma',
            email: 'ramesh.sharma@example.com',
            phone: '+91 98765 43210',
            classLevel: 'Class 10',
            targetExamOrGoal: 'CBSE Board Exams 2027 (Scoring 95%+ in Standard Math)',
            currentStruggleTopics: 'Quadratic Equations word problems, Trigonometric identities',
            preferredBatchTiming: 'Weekday Evening (6:00 PM - 7:30 PM)',
            additionalNotes: 'Looking for conceptual clarity and step-by-step paper presentation guidance.',
            submittedAt: new Date(Date.now() - 24 * 3600 * 1000 * 2).toISOString(),
            status: 'New',
          },
        ];
        localStorage.setItem(STORAGE_KEY_ENQUIRIES, JSON.stringify(initialEnquiries));
        return initialEnquiries;
      }
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error loading enquiries:', e);
      return [];
    }
  },

  saveEnquiry(enquiry: Omit<CoachingEnquiry, 'id' | 'submittedAt' | 'status'>): CoachingEnquiry {
    const enquiries = this.getEnquiries();
    const newEnquiry: CoachingEnquiry = {
      ...enquiry,
      id: `ENQ-${Date.now().toString().slice(-6)}`,
      submittedAt: new Date().toISOString(),
      status: 'New',
    };
    enquiries.unshift(newEnquiry);
    try {
      localStorage.setItem(STORAGE_KEY_ENQUIRIES, JSON.stringify(enquiries));
    } catch (e) {
      console.error('Error saving enquiry:', e);
    }
    return newEnquiry;
  },

  updateEnquiryStatus(id: string, status: CoachingEnquiry['status']): CoachingEnquiry[] {
    const enquiries = this.getEnquiries();
    const updated = enquiries.map((enq) => (enq.id === id ? { ...enq, status } : enq));
    try {
      localStorage.setItem(STORAGE_KEY_ENQUIRIES, JSON.stringify(updated));
    } catch (e) {
      console.error('Error updating enquiry status:', e);
    }
    return updated;
  },

  // Export Catalogue as CSV
  exportCatalogueToCsv(products: Product[]): void {
    const headers = [
      'Product ID',
      'Title',
      'Class',
      'Subject',
      'Chapter',
      'Product Type',
      'Difficulty',
      'Language',
      'Questions Count',
      'Has Answer Key',
      'Price (INR)',
      'Is Free',
      'Instamojo URL',
      'Preview File URL',
      'Private Storage Ref',
      'File Classification',
      'Visible on Classes',
      'Visible on Store',
      'Visible on Library',
      'Publication Status',
      'Created At',
      'Updated At',
      'Version',
      'Tags',
      'Short Description',
    ];

    const escapeCsv = (str: string | number | boolean | undefined | null) => {
      if (str === undefined || str === null) return '""';
      const clean = String(str).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = products.map((p) => [
      escapeCsv(p.id),
      escapeCsv(p.title),
      escapeCsv(p.classLevel),
      escapeCsv(p.subject),
      escapeCsv(p.chapter),
      escapeCsv(p.productType),
      escapeCsv(p.difficulty),
      escapeCsv(p.language),
      escapeCsv(p.numberOfQuestions),
      escapeCsv(p.hasAnswerKey ? 'Yes' : 'No'),
      escapeCsv(p.price),
      escapeCsv(p.isFree ? 'Yes' : 'No'),
      escapeCsv(p.instamojoUrl),
      escapeCsv(p.previewUrl),
      escapeCsv(p.fullStorageRef),
      escapeCsv(p.fileClassification),
      escapeCsv(p.visibility.classes ? 'Yes' : 'No'),
      escapeCsv(p.visibility.store ? 'Yes' : 'No'),
      escapeCsv(p.visibility.library ? 'Yes' : 'No'),
      escapeCsv(p.publicationStatus),
      escapeCsv(p.createdAt),
      escapeCsv(p.updatedAt),
      escapeCsv(p.versionNumber),
      escapeCsv(p.tags?.join('; ') || ''),
      escapeCsv(p.shortDescription),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `aakushi_catalogue_backup_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Export as Full JSON Backup
  exportCatalogueToJson(products: Product[]): void {
    const dataStr = JSON.stringify(products, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `aakushi_products_full_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Admin PIN Protection (Prototype Security)
  getAdminPin(): string {
    return localStorage.getItem(STORAGE_KEY_ADMIN_PIN) || '1234';
  },

  setAdminPin(newPin: string): void {
    localStorage.setItem(STORAGE_KEY_ADMIN_PIN, newPin);
  },
};
