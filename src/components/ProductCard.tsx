import React from 'react';
import { Product } from '../types';
import { FileText, Eye, ShoppingCart, CheckCircle2, BookOpen, Layers } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onPreview: (product: Product) => void;
  variant?: 'classes' | 'store' | 'library';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPreview,
  variant = 'store',
}) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Basic':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Standard':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Advanced':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Exemplar/Competitive':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'Worksheet':
        return 'bg-sky-100 text-sky-800';
      case 'Bundle':
        return 'bg-violet-100 text-violet-800 font-semibold';
      case 'Diagnostic Test':
      case 'Chapter Test':
        return 'bg-rose-100 text-rose-800';
      case 'Concept Notes':
        return 'bg-teal-100 text-teal-800';
      case 'Practice Paper':
      case 'Question Paper':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.isFree) {
      onPreview(product);
      return;
    }
    if (product.instamojoUrl && product.instamojoUrl.startsWith('http')) {
      window.open(product.instamojoUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Open preview modal which provides clear status and syllabus details
      onPreview(product);
    }
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden group"
    >
      {/* Card Header & Preview Image */}
      <div>
        <div className="relative h-40 bg-slate-100 overflow-hidden">
          <img
            src={product.previewUrl || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80'}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />

          {/* Type Badge & Free/Paid Badge */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium shadow-xs ${getTypeBadgeColor(product.productType)}`}>
              {product.productType}
            </span>
            {product.isSampleProduct && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 shadow-xs">
                Sample
              </span>
            )}
          </div>

          <div className="absolute top-2.5 right-2.5 z-10">
            {product.isFree ? (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
                FREE
              </span>
            ) : (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 shadow-xs">
                ₹{product.price}
              </span>
            )}
          </div>

          {/* Class & Subject overlay */}
          <div className="absolute bottom-2 left-2.5 right-2.5 text-white flex items-center justify-between text-xs">
            <span className="font-semibold tracking-wide bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded">
              {product.classLevel} • {product.subject}
            </span>
            <span className="text-[11px] bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded">
              {product.numberOfQuestions} Qs
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[11px] px-2 py-0.5 rounded border ${getDifficultyColor(product.difficulty)}`}>
              {product.difficulty}
            </span>
            <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {product.chapter}
            </span>
            {product.hasAnswerKey && (
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> With Answer Key
              </span>
            )}
          </div>

          <h3 className="font-semibold text-slate-900 text-base leading-snug line-clamp-2 hover:text-indigo-600 transition-colors">
            {product.title}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Bundle Extra Notice if applicable */}
          {product.bundleInfo?.isBundle && (
            <div className="p-2 rounded bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>Includes {product.bundleInfo.includedProductIds?.length || 2} curated materials (Save ₹{(product.bundleInfo.originalCombinedPrice || 250) - product.price})</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Actions & Pricing Footer */}
      <div className="p-4 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 block">Pricing</span>
            {product.isFree ? (
              <span className="text-sm font-bold text-emerald-600">Free Download</span>
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-extrabold text-slate-900">₹{product.price}</span>
                {product.bundleInfo?.isBundle && (
                  <span className="text-xs text-slate-400 line-through">
                    ₹{product.bundleInfo.originalCombinedPrice}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              id={`btn-preview-${product.id}`}
              onClick={() => onPreview(product)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
              title="Preview learning objectives and sample questions"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Preview</span>
            </button>

            {product.isFree ? (
              <button
                id={`btn-free-access-${product.id}`}
                onClick={handleBuyClick}
                className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open Notes</span>
              </button>
            ) : (
              <button
                id={`btn-buy-${product.id}`}
                onClick={handleBuyClick}
                className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
                title="Purchase directly via secure Instamojo gateway"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Buy Now</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
