import React, { useState } from 'react';
import { Product } from '../types';
import { X, CheckCircle2, ShieldCheck, ShoppingCart, Download, BookOpen, Layers, Info, ExternalLink } from 'lucide-react';

interface ProductPreviewModalProps {
  product: Product | null;
  onClose: () => void;
  allProducts?: Product[];
  onSelectRelated?: (product: Product) => void;
}

export const ProductPreviewModal: React.FC<ProductPreviewModalProps> = ({
  product,
  onClose,
  allProducts = [],
  onSelectRelated,
}) => {
  const [notice, setNotice] = useState<string | null>(null);

  if (!product) return null;

  const handleBuy = () => {
    if (product.isFree) {
      if (product.fullStorageRef && product.fullStorageRef.startsWith('http')) {
        window.open(product.fullStorageRef, '_blank', 'noopener,noreferrer');
      } else {
        setNotice(`Sample Worksheet: In production, this opens your direct public PDF link from Google Drive or CDN.`);
      }
      return;
    }
    if (product.instamojoUrl && product.instamojoUrl.startsWith('http')) {
      window.open(product.instamojoUrl, '_blank', 'noopener,noreferrer');
    } else {
      setNotice(`This product's direct Instamojo link is being configured in the Teacher Admin Console. (Go to Admin → Instamojo Links to set this item's checkout URL).`);
    }
  };

  const relatedProducts = allProducts.filter((p) =>
    product.relatedProductIds?.includes(p.id)
  );

  return (
    <div
      id="product-preview-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="product-preview-dialog"
        className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              {product.productType}
            </span>
            <span className="text-xs font-mono text-slate-300">ID: {product.id}</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Info */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
              <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded">
                {product.classLevel}
              </span>
              <span className="text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
                {product.subject}
              </span>
              <span className="text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
                {product.chapter}
              </span>
              <span className="text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded font-medium">
                Difficulty: {product.difficulty}
              </span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 leading-snug">{product.title}</h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">{product.shortDescription}</p>
          </div>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block">Questions Count</span>
              <span className="font-semibold text-slate-800 text-sm">{product.numberOfQuestions} Problems</span>
            </div>
            <div>
              <span className="text-slate-400 block">Solutions / Key</span>
              <span className="font-semibold text-slate-800 text-sm flex items-center gap-1">
                {product.hasAnswerKey ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Detailed Key
                  </>
                ) : (
                  'Questions Only'
                )}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Language</span>
              <span className="font-semibold text-slate-800 text-sm">{product.language}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Version</span>
              <span className="font-semibold text-slate-800 text-sm">v{product.versionNumber}</span>
            </div>
          </div>

          {/* Learning Objective */}
          {product.learningObjective && (
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs space-y-1">
              <span className="font-bold text-indigo-900 block flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Target Pedagogical Learning Objective
              </span>
              <p className="text-indigo-950 leading-relaxed">{product.learningObjective}</p>
            </div>
          )}

          {/* Detailed Syllabus & Content Scope */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Detailed Content Scope & Problem Structure
            </h4>
            <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {product.detailedDescription}
            </div>
          </div>

          {/* Bundle Composition if Bundle */}
          {product.bundleInfo?.isBundle && (
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <Layers className="w-4 h-4 text-amber-700" />
                <span>Bundle Contents & Combined Savings</span>
              </div>
              <p className="text-amber-800">
                This bundle aggregates multiple standalone worksheets and tests from the central library into one comprehensive revision kit.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <span className="text-slate-500">Individual Value: <span className="line-through">₹{product.bundleInfo.originalCombinedPrice}</span></span>
                <span className="font-bold text-amber-900">Bundle Price: ₹{product.price}</span>
                <span className="text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded">
                  Save ₹{product.bundleInfo.originalCombinedPrice - product.price}
                </span>
              </div>
            </div>
          )}

          {/* Safe Educational Preview Notice */}
          <div className="p-3.5 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">Direct Delivery & Data Safety</p>
              <p className="mt-0.5 text-[11px] text-slate-500 leading-relaxed">
                Full-resolution printable PDF masters with complete step-by-step marking rubrics are securely dispatched upon purchase via the Instamojo link or shared in live coaching batches. No card information is collected on this site.
              </p>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Related Resources from Central Library
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {relatedProducts.map((rel) => (
                  <button
                    key={rel.id}
                    onClick={() => onSelectRelated && onSelectRelated(rel)}
                    className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors text-xs space-y-1 cursor-pointer"
                  >
                    <span className="font-semibold text-slate-800 line-clamp-1">{rel.title}</span>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{rel.classLevel} • {rel.productType}</span>
                      <span className="font-bold text-slate-700">{rel.isFree ? 'FREE' : `₹${rel.price}`}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Notice banner if payment link or resource url needs attention */}
          {notice && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <span className="font-bold shrink-0">ℹ️ Notice:</span>
              <p className="flex-1">{notice}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div>
            <span className="text-xs text-slate-500 block">Pricing & Access</span>
            {product.isFree ? (
              <span className="text-lg font-bold text-emerald-600">Free Open Resource</span>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900">₹{product.price}</span>
                <span className="text-xs text-slate-500">one-time payment via Instamojo</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Close
            </button>
            {product.isFree ? (
              <button
                onClick={handleBuy}
                className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Open Free Resource</span>
              </button>
            ) : (
              <button
                onClick={handleBuy}
                className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Proceed to Instamojo Buy Link</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
