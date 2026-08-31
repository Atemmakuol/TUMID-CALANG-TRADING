import React from 'react';
import { 
  Grid, 
  Layers, 
  Square, 
  Mountain, 
  Hammer, 
  Home, 
  Droplet
} from 'lucide-react';
import { ProductCategory } from '../types';

interface CategoryNavProps {
  selectedCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  productCounts: Record<ProductCategory, number>;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
  productCounts,
}) => {
  const categories: Array<{ id: ProductCategory; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'all', label: 'All Materials', icon: Grid },
    { id: 'blocks', label: 'Concrete Blocks', icon: Layers },
    { id: 'pavers', label: 'Paving Stones', icon: Square },
    { id: 'cement-aggregates', label: 'Cement & Aggregates', icon: Mountain },
    { id: 'steel-reinforcement', label: 'Steel & Rebar', icon: Hammer },
    { id: 'roofing-timber', label: 'Roofing & Timber', icon: Home },
    { id: 'plumbing-drainage', label: 'Plumbing & Tanks', icon: Droplet },
  ];

  return (
    <div className="w-full bg-white border-b border-slate-200 sticky top-[84px] lg:top-[96px] z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar scroll-smooth">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            const count = productCounts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                id={`category-btn-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-orange-400 border border-slate-800 shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-orange-400' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                  isSelected ? 'bg-slate-800 text-orange-300' : 'bg-slate-200 text-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
