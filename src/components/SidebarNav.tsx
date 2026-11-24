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
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'data_soal',
    index: '01',
    label: 'Data Soal',
    subtitle: 'Mapel, jumlah & jenis soal',
    icon: ClipboardList,
  },
  {
    id: 'kisi_kisi',
    index: '02',
    label: 'Kisi-Kisi Soal',
    subtitle: 'Tabel & unggah format acuan',
    icon: FileSpreadsheet,
  },
  {
    id: 'kartu_soal',
    index: '03',
    label: 'Kartu Soal',
    subtitle: 'Kartu butir & unggah acuan',
    icon: Layers,
  },
  {
    id: 'kumpulan_soal',
    index: '04',
    label: 'Kumpulan Soal',
    subtitle: 'Naskah uji & kunci jawaban',
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
    <div className="flex h-full flex-col justify-between bg-white">
      <div>
        <div className="flex h-16 items-center justify-between border-b border-slate-200/80 px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-700 text-white">
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <span className="block text-sm font-bold tracking-tight text-slate-900 leading-tight truncate">
                Soal Digital Sekolah
              </span>
              <span className="mt-0.5 block text-[11px] font-medium text-slate-500 leading-none truncate">
                Paket Soal SMA
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Tutup menu"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1" aria-label="Menu modul penyusunan soal">
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
                className={`group flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-blue-700 ${
                  isActive
                    ? 'border-blue-200 bg-blue-50/80 text-blue-800'
                    : 'border-transparent text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`mt-0.5 h-4 w-4 shrink-0 ${
                    isActive ? 'text-blue-700' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-semibold whitespace-nowrap truncate">
                      {item.index}. {item.label}
                    </span>
                  </div>
                  <p
                    className={`mt-0.5 text-xs truncate ${
                      isActive ? 'text-blue-700/80' : 'text-slate-500'
                    }`}
                  >
                    {item.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="mx-4 my-3 border-t border-slate-200 pt-4">
          <p className="text-xs font-semibold text-slate-500">Ringkasan Paket Aktif</p>
          <p className="mt-1 text-sm font-semibold text-slate-900 truncate" title={metadata.mataPelajaran}>
            {metadata.mataPelajaran}
          </p>
          <p className="mt-0.5 text-xs text-slate-500 truncate">
            SMA · {metadata.kelas} · {metadata.fase}
          </p>
          <p className="mt-0.5 text-xs text-slate-500 truncate">
            {metadata.kurikulum} · {(metadata.babMateriList || []).length} Bab
          </p>
          <p className="mt-0.5 text-xs font-medium text-blue-700 truncate">
            {analyzeCpForSubjectAndPhase(metadata.mataPelajaran, metadata.fase).smaGroup} ·{' '}
            {analyzeCpForSubjectAndPhase(metadata.mataPelajaran, metadata.fase).regulationShort}
          </p>

          <dl className="mt-3 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <dt>Total Butir Soal</dt>
              <dd className="font-mono font-semibold text-slate-900 tabular-nums">
                {questions.length}
              </dd>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <dt>Pilihan Ganda (PG)</dt>
              <dd className="font-mono text-slate-900 tabular-nums">{countByType.PG}</dd>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <dt>Jawaban Singkat</dt>
              <dd className="font-mono text-slate-900 tabular-nums">
                {countByType.JAWABAN_SINGKAT}
              </dd>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <dt>Menjodohkan</dt>
              <dd className="font-mono text-slate-900 tabular-nums">
                {countByType.MENJODOHKAN}
              </dd>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <dt>Esai / Uraian</dt>
              <dd className="font-mono text-slate-900 tabular-nums">{countByType.ESAY}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-1.5 text-slate-600">
              <dt>LOTS / MOTS / HOTS</dt>
              <dd className="font-mono font-semibold text-blue-700 tabular-nums">
                {countByTier.LOTS} / {countByTier.MOTS} / {countByTier.HOTS}
              </dd>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-1.5 text-slate-700 font-medium">
              <dt>Total Bobot Skor</dt>
              <dd className="font-mono font-semibold text-slate-900 tabular-nums">{totalBobot}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="border-t border-slate-200 p-3 space-y-1.5">
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
        <button
          type="button"
          onClick={onExportJson}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <Download className="h-3.5 w-3.5 text-slate-500" />
          <span className="whitespace-nowrap">Cadangkan Paket (.json)</span>
        </button>
        <button
          type="button"
          onClick={() => jsonInputRef.current?.click()}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <Upload className="h-3.5 w-3.5 text-slate-500" />
          <span className="whitespace-nowrap">Muat Paket (.json)</span>
        </button>
        <div className="mb-2 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2.5">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-700">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            <span>Admin Master</span>
          </div>
          <p className="mt-0.5 text-xs font-semibold text-slate-900 leading-snug">
            Aspian La Ode Madimu, S.Pd .Gr
          </p>
        </div>

        <button
          type="button"
          onClick={onResetDefault}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="whitespace-nowrap">Muat Ulang Data Contoh</span>
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
