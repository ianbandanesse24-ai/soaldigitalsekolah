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
    <div className="no-print rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Calculator className="h-4 w-4 text-blue-700 shrink-0" />
          <span className="text-xs font-semibold text-slate-900">
            Sisip Simbol, Angka Khusus & Rumus Berhitung
          </span>
          {activeFieldLabel && (
            <span className="text-xs text-blue-700 font-medium">
              · Target: {activeFieldLabel}
            </span>
          )}
        </div>

        {onConvertActiveNotation && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onConvertActiveNotation}
            title="Ubah ketikan x^2, H_2O, <=, >=, !=, ->, <->, \\sqrt, \\pi menjadi simbol Unicode"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-blue-600 hover:text-blue-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-700" />
            Konversi ^/_ ke Simbol
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 pb-2">
        {MATH_SYMBOL_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setActiveTab(cat.id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === cat.id
                ? 'bg-blue-700 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {cat.label}
          </button>
        ))}
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
