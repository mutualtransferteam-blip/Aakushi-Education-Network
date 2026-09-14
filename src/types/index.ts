export type ProductType =
  | 'Worksheet'
  | 'Practice Paper'
  | 'Question Paper'
  | 'Diagnostic Test'
  | 'Revision Paper'
  | 'Answer Key'
  | 'Chapter Test'
  | 'Concept Notes'
  | 'Bundle'
  | 'Other';

export type DifficultyLevel = 'Basic' | 'Standard' | 'Advanced' | 'Exemplar/Competitive';

export type LanguageOption = 'English' | 'Bilingual (English/Hindi)';

export type PublicationStatus = 'draft' | 'published' | 'archived';

export type FileClassification =
  | 'editable_master'
  | 'sale_ready_pdf'
  | 'preview_file'
  | 'public_free'
  | 'private_paid';

export interface WebsiteVisibility {
  classes: boolean;
  store: boolean;
  library: boolean;
}

export interface BundleInfo {
  isBundle: boolean;
  includedProductIds: string[];
  originalCombinedPrice: number;
  discountedPrice: number;
  totalWorksheetsCount?: number;
}

export interface Product {
  id: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  classLevel: string; // e.g., 'Class 9', 'Class 10', 'Class 11', 'Class 12'
  subject: string; // e.g., 'Mathematics', 'Applied Mathematics'
  chapter: string; // e.g., 'Quadratic Equations', 'Trigonometry'
  productType: ProductType;
  difficulty: DifficultyLevel;
  language: LanguageOption;
  numberOfQuestions: number;
  hasAnswerKey: boolean;
  learningObjective: string;
  price: number; // in INR ₹
  isFree: boolean;
  instamojoUrl: string; // e.g. https://imjo.in/xxxx
  previewUrl: string; // Safe public preview image or preview PDF link
  fullStorageRef: string; // PRIVATE Google Drive / cloud reference - never exposed to public
  fileClassification: FileClassification;
  visibility: WebsiteVisibility;
  publicationStatus: PublicationStatus;
  createdAt: string;
  updatedAt: string;
  versionNumber: string;
  tags: string[];
  relatedProductIds: string[];
  bundleInfo?: BundleInfo;
  isSampleProduct?: boolean;
}

export interface CoachingEnquiry {
  id: string;
  studentName: string;
  parentName: string;
  email: string;
  phone: string;
  classLevel: string;
  targetExamOrGoal: string;
  currentStruggleTopics: string;
  preferredBatchTiming: string;
  additionalNotes?: string;
  submittedAt: string;
  status: 'New' | 'Contacted' | 'Enrolled' | 'Archived';
}

export type NetworkSite = 'classes' | 'store' | 'library' | 'admin';

export type ClassesPage =
  | 'home'
  | 'about'
  | 'approach'
  | 'coaching'
  | 'support'
  | 'resources'
  | 'contact';

export type StorePage =
  | 'home'
  | 'all'
  | 'by-class'
  | 'by-subject'
  | 'by-chapter'
  | 'worksheets'
  | 'tests'
  | 'bundles'
  | 'free'
  | 'details'
  | 'contact';

export type LibraryPage =
  | 'home'
  | 'by-class'
  | 'by-subject'
  | 'by-chapter'
  | 'by-type'
  | 'search'
  | 'recent'
  | 'archive-info';

export type AdminTab =
  | 'products'
  | 'add-product'
  | 'bundles'
  | 'enquiries'
  | 'instamojo-config'
  | 'data-backup'
  | 'architecture-guide';

export interface FilterState {
  searchQuery: string;
  classLevel: string;
  subject: string;
  chapter: string;
  productType: string;
  difficulty: string;
  language: string;
  priceType: 'all' | 'free' | 'paid';
}
