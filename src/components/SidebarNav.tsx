import React, { useRef } from 'react';
import {
  BookOpen,
  ClipboardList,
  Download,
  FileSpreadsheet,
  FileText,
  Layers,
  RotateCcw,
  ShieldCheck,
  Upload,
  X,
} from 'lucide-react';
import { ActiveModule, ExamMetadata, QuestionItem } from '../types/exam';
import { analyzeCpForSubjectAndPhase } from '../data/cpReferences';
import { tierFromCognitiveLevel } from '../data/defaultExamData';

interface SidebarNavProps {
  activeModule: ActiveModule;
  onSelectModule: (mod: ActiveModule) => void;
  metadata: ExamMetadata;
  questions: QuestionItem[];
  onExportJson: () => void;
  onImportJson: (file: File) => void;
  onResetDefault: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS: {
  id: ActiveModule;
  index: string;
  label: string;
  subtitle: string;
  color: string;
  activeBg: string;
  iconBg: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'data_soal',
    index: '01',
    label: 'Data Soal',
    subtitle: 'Mapel, jumlah & jenis soal',
    color: 'text-emerald-700',
    activeBg: 'bg-emerald-50/80 border-emerald-300 text-emerald-950',
    iconBg: 'bg-emerald-500/15 text-emerald-700 border-emerald-200/60',
    icon: ClipboardList,
  },
  {
    id: 'kisi_kisi',
    index: '02',
    label: 'Kisi-Kisi Soal',
    subtitle: 'Tabel & unggah format acuan',
    color: 'text-indigo-700',
    activeBg: 'bg-indigo-50/80 border-indigo-300 text-indigo-950',
    iconBg: 'bg-indigo-500/15 text-indigo-700 border-indigo-200/60',
    icon: FileSpreadsheet,
  },
  {
    id: 'kartu_soal',
    index: '03',
    label: 'Kartu Soal',
    subtitle: 'Kartu butir & unggah acuan',
    color: 'text-amber-700',
    activeBg: 'bg-amber-50/80 border-amber-300 text-amber-950',
    iconBg: 'bg-amber-500/15 text-amber-700 border-amber-200/60',
    icon: Layers,
  },
  {
    id: 'kumpulan_soal',
    index: '04',
    label: 'Kumpulan Soal',
    subtitle: 'Naskah uji & kunci jawaban',
    color: 'text-sky-700',
    activeBg: 'bg-sky-50/80 border-sky-300 text-sky-950',
    iconBg: 'bg-sky-500/15 text-sky-700 border-sky-200/60',
    icon: FileText,
  },
];

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeModule,
  onSelectModule,
  metadata,
  questions,
  onExportJson,
  onImportJson,
  onResetDefault,
  mobileOpen,
  onCloseMobile,
}) => {
  const jsonInputRef = useRef<HTMLInputElement>(null);

  const countByType = {
    PG: questions.filter((q) => q.type === 'PG').length,
    ESAY: questions.filter((q) => q.type === 'ESAY').length,
    JAWABAN_SINGKAT: questions.filter((q) => q.type === 'JAWABAN_SINGKAT').length,
    MENJODOHKAN: questions.filter((q) => q.type === 'MENJODOHKAN').length,
  };

  const countByTier = {
    LOTS: questions.filter(
      (q) => (q.tingkatanSoal || tierFromCognitiveLevel(q.levelKognitif)) === 'LOTS'
    ).length,
    MOTS: questions.filter(
      (q) => (q.tingkatanSoal || tierFromCognitiveLevel(q.levelKognitif)) === 'MOTS'
    ).length,
    HOTS: questions.filter(
      (q) => (q.tingkatanSoal || tierFromCognitiveLevel(q.levelKognitif)) === 'HOTS'
    ).length,
  };

  const totalBobot =
    Math.round(
      questions.reduce((acc, q) => acc + (Number(q.bobot) || 0), 0) * 100
    ) / 100;

  const content = (
    <div className="flex h-full flex-col justify-between bg-white/95 backdrop-blur-sm">
      <div>
        {/* Header Branding */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200/80 px-5 bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white shadow-sm">
              <BookOpen className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <span className="block text-sm font-bold tracking-tight text-white leading-tight truncate">
                Soal Digital Sekolah
              </span>
              <span className="mt-0.5 block text-[11px] font-medium text-blue-100 leading-none truncate">
                SMA Fase E & F · Deep Learning
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Tutup menu"
            className="rounded-lg p-1.5 text-blue-100 hover:bg-white/20 hover:text-white lg:hidden transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs with Color-coded Badges */}
        <nav className="p-3 space-y-1.5" aria-label="Menu modul penyusunan soal">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectModule(item.id);
                  onCloseMobile();
                }}
                className={`group flex w-full items-start gap-3 rounded-xl border p-2.5 text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-blue-700 ${
                  isActive
                    ? `${item.activeBg} shadow-sm font-medium`
                    : 'border-transparent text-slate-700 hover:bg-slate-100/70 hover:text-slate-900'
                }`}
              >
                <div
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                    isActive ? item.iconBg : 'bg-slate-100 border-slate-200 text-slate-500 group-hover:bg-slate-200/70'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-bold tracking-tight whitespace-nowrap truncate">
                      {item.index}. {item.label}
                    </span>
                    {isActive && (
                      <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500 truncate">
                    {item.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Ringkasan Paket Aktif (Colorful Card) */}
        <div className="mx-3 my-2 rounded-xl border border-blue-100 bg-gradient-to-b from-blue-50/50 via-indigo-50/30 to-white p-3.5 shadow-sm">
          <div className="flex items-center justify-between border-b border-blue-100/80 pb-2">
            <p className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Ringkasan Paket
            </p>
            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {questions.length} Butir Soal
            </span>
          </div>

          <p className="mt-2 text-sm font-bold text-slate-900 truncate" title={metadata.mataPelajaran}>
            {metadata.mataPelajaran}
          </p>
          <div className="mt-1 flex flex-wrap gap-1.5 text-[11px]">
            <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-medium">
              {metadata.kelas}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium">
              {metadata.fase}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium">
              {(metadata.babMateriList || []).length} Bab
            </span>
          </div>

          {/* Visual Bar Distribusi Tingkatan (LOTS / MOTS / HOTS) */}
          <div className="mt-3.5 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
              <span>Distribusi Kognitif:</span>
              <span className="font-mono text-slate-900">
                <span className="text-emerald-700 font-bold">{countByTier.LOTS}</span> /{' '}
                <span className="text-amber-700 font-bold">{countByTier.MOTS}</span> /{' '}
                <span className="text-rose-700 font-bold">{countByTier.HOTS}</span>
              </span>
            </div>
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                style={{ width: `${(countByTier.LOTS / (questions.length || 1)) * 100}%` }}
                className="bg-emerald-500 transition-all"
                title={`LOTS: ${countByTier.LOTS} soal`}
              />
              <div
                style={{ width: `${(countByTier.MOTS / (questions.length || 1)) * 100}%` }}
                className="bg-amber-500 transition-all"
                title={`MOTS: ${countByTier.MOTS} soal`}
              />
              <div
                style={{ width: `${(countByTier.HOTS / (questions.length || 1)) * 100}%` }}
                className="bg-rose-500 transition-all"
                title={`HOTS: ${countByTier.HOTS} soal`}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span className="text-emerald-700 font-semibold">LOTS (30%)</span>
              <span className="text-amber-700 font-semibold">MOTS (40%)</span>
              <span className="text-rose-700 font-semibold">HOTS (30%)</span>
            </div>
          </div>

          {/* Skor Total */}
          <div className="mt-3 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/70 px-2.5 py-1.5 text-xs">
            <span className="font-semibold text-emerald-900">Total Bobot:</span>
            <span className="font-mono font-bold text-emerald-700 tabular-nums">
              {totalBobot} / 100
            </span>
          </div>
        </div>
      </div>

      {/* Footer Sidebar Actions & Admin Card */}
      <div className="border-t border-slate-200/90 p-3 space-y-2 bg-slate-50/50">
        <input
          ref={jsonInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImportJson(file);
            e.target.value = '';
          }}
        />

        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={onExportJson}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-2 px-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-xs"
          >
            <Download className="h-3 w-3 text-blue-600" />
            <span>Cadangkan</span>
          </button>
          <button
            type="button"
            onClick={() => jsonInputRef.current?.click()}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-2 px-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-xs"
          >
            <Upload className="h-3 w-3 text-emerald-600" />
            <span>Buka File</span>
          </button>
        </div>

        {/* Admin Master Badge */}
        <div className="rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50/90 via-amber-50/40 to-blue-50/50 p-2.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-800 uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            <span>Admin Master</span>
          </div>
          <p className="mt-0.5 text-xs font-bold text-slate-900 leading-tight">
            Aspian La Ode Madimu, S.Pd .Gr
          </p>
        </div>

        <button
          type="button"
          onClick={onResetDefault}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Muat Ulang Data Contoh</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="no-print hidden lg:block w-64 shrink-0 border-r border-slate-200 bg-white">
        <div className="sticky top-0 h-screen overflow-y-auto">{content}</div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="no-print fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-10 w-72 max-w-[85vw] border-r border-slate-200 bg-white shadow-xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
