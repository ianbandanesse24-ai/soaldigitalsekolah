import React, { useState } from 'react';
import { Calculator, Sparkles } from 'lucide-react';
import { MATH_SYMBOL_CATEGORIES, SymbolCategory } from '../utils/mathSymbols';

interface MathSymbolBarProps {
  activeFieldLabel?: string | null;
  onInsertSymbol: (snippet: string) => void;
  onConvertActiveNotation?: () => void;
  compact?: boolean;
}

export const MathSymbolBar: React.FC<MathSymbolBarProps> = ({
  activeFieldLabel,
  onInsertSymbol,
  onConvertActiveNotation,
  compact = false,
}) => {
  const [activeTab, setActiveTab] = useState<SymbolCategory['id']>('operasi');
  const currentCategory =
    MATH_SYMBOL_CATEGORIES.find((c) => c.id === activeTab) ||
    MATH_SYMBOL_CATEGORIES[0];

  return (
    <div className="no-print rounded-2xl border border-indigo-200/80 bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-slate-50 p-4 shadow-sm space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-2xs">
            <Calculator className="h-4 w-4" />
          </div>
          <span className="text-xs font-bold text-slate-900">
            Sisip Simbol, Angka Khusus &amp; Rumus Berhitung
          </span>
          {activeFieldLabel && (
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-full">
              Target: {activeFieldLabel}
            </span>
          )}
        </div>

        {onConvertActiveNotation && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onConvertActiveNotation}
            title="Ubah ketikan x^2, H_2O, <=, >=, !=, ->, <->, \sqrt, \pi menjadi simbol Unicode"
            className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-white px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer whitespace-nowrap shadow-2xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Konversi ^/_ ke Simbol
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5 border-b border-indigo-100 pb-2.5">
        {MATH_SYMBOL_CATEGORIES.map((cat) => {
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setActiveTab(cat.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-indigo-50/70 hover:text-indigo-800'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {currentCategory.items.map((item) => (
          <button
            key={`${currentCategory.id}_${item.label}`}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onInsertSymbol(item.value)}
            title={item.title}
            className={`rounded-md border border-slate-200 bg-white font-mono text-slate-900 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-800 active:scale-[0.98] transition-all cursor-pointer ${
              currentCategory.id === 'rumus'
                ? 'px-2.5 py-1 text-xs'
                : compact
                ? 'min-w-[30px] px-2 py-1 text-xs font-semibold'
                : 'min-w-[34px] px-2.5 py-1.5 text-sm font-semibold'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {!activeFieldLabel && (
        <p className="text-[11px] text-slate-500">
          Klik kolom teks/soal/opsi terlebih dahulu, lalu tekan simbol atau rumus di atas untuk menyisipkan di posisi kursor (atau ketik <span className="font-mono font-semibold text-slate-700">x^2</span>, <span className="font-mono font-semibold text-slate-700">H_2O</span>, <span className="font-mono font-semibold text-slate-700">&lt;-&gt;</span> lalu klik Konversi).
        </p>
      )}
    </div>
  );
};
