import React, { useMemo, useState } from 'react';
import {
  Eye,
  EyeOff,
  FileDown,
  FileSpreadsheet,
  FileText,
  Printer,
  RotateCcw,
  Settings2,
  Shuffle,
} from 'lucide-react';
import {
  ExamMetadata,
  QuestionItem,
  QuestionType,
} from '../types/exam';
import { analyzeCpForSubjectAndPhase } from '../data/cpReferences';
import {
  SHORT_LABEL_JENIS_SOAL,
  tierFromCognitiveLevel,
} from '../data/defaultExamData';
import {
  downloadKumpulanSoalExcel,
  downloadKumpulanSoalPdf,
  downloadWordDocument,
  escapeHtml,
  getShuffledRightColumn,
  resolveQuestionFieldValue,
} from '../utils/exportHelpers';

interface KumpulanSoalViewProps {
  metadata: ExamMetadata;
  questions: QuestionItem[];
  onUpdateMetadata: (next: ExamMetadata) => void;
  onUpdateQuestions: (next: QuestionItem[]) => void;
}

const SECTION_META: {
  type: QuestionType;
  roman: string;
  title: string;
  instruction: string;
}[] = [
  {
    type: 'PG',
    roman: 'I',
    title: 'PILIHAN GANDA',
    instruction: 'Pilihlah satu jawaban yang paling tepat (A, B, C, D, atau E).',
  },
  {
    type: 'JAWABAN_SINGKAT',
    roman: 'II',
    title: 'JAWABAN SINGKAT',
    instruction: 'Isilah titik-titik di bawah ini dengan jawaban yang singkat dan tepat.',
  },
  {
    type: 'MENJODOHKAN',
    roman: 'III',
    title: 'MENJODOHKAN',
    instruction:
      'Pasangkan pernyataan pada kolom sebelah kiri dengan pilihan jawaban yang tepat pada kolom sebelah kanan.',
  },
  {
    type: 'ESAY',
    roman: 'IV',
    title: 'URAIAN / ESAI',
    instruction: 'Jawablah pertanyaan berikut ini dengan jelas, runtut, dan lengkap.',
  },
];

export const KumpulanSoalView: React.FC<KumpulanSoalViewProps> = ({
  metadata,
  questions,
  onUpdateMetadata,
  onUpdateQuestions,
}) => {
  const [filterType, setFilterType] = useState<'ALL' | QuestionType>('ALL');
  const [groupByType, setGroupByType] = useState(true);
  const [showAnswerKey, setShowAnswerKey] = useState(true);
  const [showStudentHeader, setShowStudentHeader] = useState(true);
  const [showTierLabel, setShowTierLabel] = useState(true);
  const [showKopEditor, setShowKopEditor] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const visibleQuestions = useMemo(() => {
    if (filterType === 'ALL') return questions;
    return questions.filter((q) => q.type === filterType);
  }, [questions, filterType]);

  const handleShuffleQuestions = () => {
    const copy = [...questions];
    const grouped: Record<QuestionType, QuestionItem[]> = {
      PG: [],
      JAWABAN_SINGKAT: [],
      MENJODOHKAN: [],
      ESAY: [],
    };
    copy.forEach((q) => grouped[q.type].push(q));
    (['PG', 'JAWABAN_SINGKAT', 'MENJODOHKAN', 'ESAY'] as QuestionType[]).forEach(
      (t) => {
        const arr = grouped[t];
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
      }
    );

    const reordered = [
      ...grouped.PG,
      ...grouped.JAWABAN_SINGKAT,
      ...grouped.MENJODOHKAN,
      ...grouped.ESAY,
    ].map((q, idx) => ({ ...q, nomor: idx + 1 }));

    onUpdateQuestions(reordered);
  };

  const handleRenumberSequential = () => {
    const renumbered = questions.map((q, idx) => ({ ...q, nomor: idx + 1 }));
    onUpdateQuestions(renumbered);
  };

  const handleExportPdf = async () => {
    setExportError(null);
    setIsExportingPdf(true);
    try {
      await downloadKumpulanSoalPdf(metadata, visibleQuestions, {
        groupByType,
        showAnswerKey,
        showStudentHeader,
        showTierLabel,
      });
    } catch (err) {
      setExportError(
        err instanceof Error
          ? err.message
          : 'Gagal membuat berkas PDF Kumpulan Soal.'
      );
    } finally {
      setIsExportingPdf(false);
    }
  };

  const renderQuestionHtmlForWord = (q: QuestionItem, displayNo: number) => {
    const tier = q.tingkatanSoal || tierFromCognitiveLevel(q.levelKognitif);
    const tierTag = showTierLabel ? `[${tier}] ` : '';

    if (q.type === 'PG') {
      const keys = (['A', 'B', 'C', 'D', ...(q.useOptionE ? ['E'] : [])] as const);
      return `
        <div style="margin-bottom:10pt;">
          <div><strong>${displayNo}.</strong> ${tierTag}${escapeHtml(q.rumusanSoal)}</div>
          <div style="margin-left:18pt; margin-top:4pt;">
            ${keys
              .map(
                (k) =>
                  `<div>${k}. ${escapeHtml(
                    q.opsiPg[k as 'A' | 'B' | 'C' | 'D' | 'E']
                  )}</div>`
              )
              .join('')}
          </div>
        </div>
      `;
    }

    if (q.type === 'JAWABAN_SINGKAT') {
      return `
        <div style="margin-bottom:10pt;">
          <div><strong>${displayNo}.</strong> ${tierTag}${escapeHtml(q.rumusanSoal)}</div>
          <div style="margin-left:18pt; margin-top:4pt;">Jawaban: ............................................................</div>
        </div>
      `;
    }

    if (q.type === 'MENJODOHKAN') {
      const rightCol = getShuffledRightColumn(q);
      const rows = q.pasanganMenjodohkan
        .map((pair, idx) => {
          const r = rightCol[idx];
          return `<tr>
            <td style="width:45%;">${idx + 1}. ${escapeHtml(pair.premise)}</td>
            <td style="width:10%; text-align:center;">( .... )</td>
            <td style="width:45%;">${r ? `${r.letter}. ${escapeHtml(r.match)}` : ''}</td>
          </tr>`;
        })
        .join('');
      return `
        <div style="margin-bottom:12pt;">
          <div style="margin-bottom:4pt;"><strong>${displayNo}.</strong> ${tierTag}${escapeHtml(
        q.rumusanSoal
      )}</div>
          <table>
            <thead><tr><th>Pernyataan</th><th>Jodoh</th><th>Pilihan Jawaban</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `;
    }

    return `
      <div style="margin-bottom:12pt;">
        <div><strong>${displayNo}.</strong> ${tierTag}${escapeHtml(q.rumusanSoal)}</div>
        <div style="height:42pt; border-bottom:1px dotted #94a3b8; margin-left:18pt;"></div>
      </div>
    `;
  };

  const handleExportWord = () => {
    let contentHtml = '';
    if (groupByType) {
      let runningNo = 1;
      for (const sec of SECTION_META) {
        const items = visibleQuestions.filter((q) => q.type === sec.type);
        if (items.length === 0) continue;
        contentHtml += `<h3 style="margin-top:12pt;">BAGIAN ${sec.roman}. ${sec.title}</h3>`;
        contentHtml += `<p style="font-style:italic; margin-bottom:8pt;">${escapeHtml(
          sec.instruction
        )}</p>`;
        for (const item of items) {
          contentHtml += renderQuestionHtmlForWord(item, runningNo++);
        }
      }
    } else {
      visibleQuestions.forEach((item, idx) => {
        contentHtml += renderQuestionHtmlForWord(item, idx + 1);
      });
    }

    const answerKeyRows = visibleQuestions
      .map((q, idx) => {
        const tier = q.tingkatanSoal || tierFromCognitiveLevel(q.levelKognitif);
        const kunci = resolveQuestionFieldValue(q, metadata, {
          id: 'k',
          headerLabel: 'Kunci',
          mappedField: 'kunci',
        });
        return `<tr>
          <td style="text-align:center;">${idx + 1}</td>
          <td style="text-align:center;">${escapeHtml(tier)}</td>
          <td>${escapeHtml(SHORT_LABEL_JENIS_SOAL[q.type])}</td>
          <td>${escapeHtml(kunci)}</td>
          <td style="text-align:center;">${q.bobot}</td>
        </tr>`;
      })
      .join('');

    const htmlBody = `
      <div style="text-align:center; border-bottom:2px solid #000; padding-bottom:8pt; margin-bottom:10pt;">
        <h2 style="margin:0;">${escapeHtml(metadata.namaSekolah.toUpperCase())}</h2>
        <h3 style="margin:2pt 0;">${escapeHtml(metadata.judulUjian.toUpperCase())}</h3>
        <div>${escapeHtml(metadata.kurikulum)} · Tahun Ajaran ${escapeHtml(metadata.tahunAjaran)}</div>
      </div>
      <table class="no-border" style="margin-bottom:10pt;">
        <tr>
          <td style="width:20%;"><strong>Mata Pelajaran</strong></td>
          <td style="width:30%;">: ${escapeHtml(metadata.mataPelajaran)}</td>
          <td style="width:20%;"><strong>Alokasi Waktu</strong></td>
          <td style="width:30%;">: ${escapeHtml(metadata.alokasiWaktu)}</td>
        </tr>
        <tr>
          <td><strong>Kelas / Fase</strong></td>
          <td>: ${escapeHtml(metadata.kelas)} / ${escapeHtml(metadata.fase)}</td>
          <td><strong>Jumlah Soal</strong></td>
          <td>: ${visibleQuestions.length} Butir</td>
        </tr>
      </table>
      ${
        showStudentHeader
          ? `<table style="margin-bottom:10pt;">
              <tr>
                <td style="width:50%;">Nama Siswa : ........................................</td>
                <td style="width:50%;">No. Peserta / Kelas : ............................</td>
              </tr>
            </table>`
          : ''
      }
      <div style="border:1px solid #334155; padding:8pt; margin-bottom:12pt;">
        <strong>Petunjuk Umum:</strong><br/>
        ${escapeHtml(metadata.petunjukUmum)}
      </div>
      ${contentHtml}
      ${
        showAnswerKey
          ? `<div class="page-break">
              <h3 style="text-align:center;">KUNCI JAWABAN & PEDOMAN PENSKORAN</h3>
              <table>
                <thead>
                  <tr>
                    <th style="width:10%;">No.</th>
                    <th style="width:14%;">Tingkatan</th>
                    <th style="width:20%;">Jenis Soal</th>
                    <th>Kunci Jawaban / Pedoman</th>
                    <th style="width:12%;">Bobot</th>
                  </tr>
                </thead>
                <tbody>${answerKeyRows}</tbody>
              </table>
            </div>`
          : ''
      }
    `;

    const safeSubject = metadata.mataPelajaran.replace(/[^a-zA-Z0-9]+/g, '_');
    downloadWordDocument(
      `Kumpulan_Soal_${safeSubject}.doc`,
      `Naskah Soal ${metadata.mataPelajaran}`,
      htmlBody
    );
  };

  const renderQuestionBlock = (q: QuestionItem, displayNumber: number) => {
    const rightCol =
      q.type === 'MENJODOHKAN' ? getShuffledRightColumn(q) : [];
    const tier = q.tingkatanSoal || tierFromCognitiveLevel(q.levelKognitif);

    return (
      <div
        key={q.id}
        className="print-break-inside-avoid border-b border-slate-100 pb-4 last:border-b-0"
      >
        <div className="flex items-start gap-2.5 text-sm text-slate-900">
          <span className="font-mono font-semibold text-slate-900 tabular-nums shrink-0">
            {displayNumber}.
          </span>
          <div className="min-w-0 flex-1 space-y-2.5">
            <p className="whitespace-pre-line leading-relaxed">
              {showTierLabel && (
                <span className="mr-1.5 font-mono text-xs font-semibold text-blue-700">
                  [{tier}]
                </span>
              )}
              {q.rumusanSoal}
            </p>

            {q.type === 'PG' && (
              <div className="grid grid-cols-1 gap-1.5 pl-1 sm:grid-cols-2">
                {(['A', 'B', 'C', 'D', ...(q.useOptionE ? ['E'] : [])] as const).map(
                  (optKey) => (
                    <div key={optKey} className="flex items-start gap-2 text-sm">
                      <span className="font-mono font-semibold text-slate-800">
                        {optKey}.
                      </span>
                      <span
                        className={`whitespace-pre-line ${
                          showAnswerKey && q.kunciPg === optKey
                            ? 'font-semibold text-emerald-800 print:font-normal print:text-slate-900'
                            : 'text-slate-800'
                        }`}
                      >
                        {q.opsiPg[optKey as 'A' | 'B' | 'C' | 'D' | 'E']}
                      </span>
                    </div>
                  )
                )}
              </div>
            )}

            {q.type === 'JAWABAN_SINGKAT' && (
              <div className="pt-1 text-sm text-slate-600">
                Jawaban: ....................................................................................
              </div>
            )}

            {q.type === 'MENJODOHKAN' && (
              <div className="overflow-x-auto pt-1">
                <table className="w-full border-collapse border border-slate-300 text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-800">
                      <th className="border border-slate-300 px-3 py-1.5 text-left font-semibold">
                        Pernyataan (Kolom A)
                      </th>
                      <th className="w-20 border border-slate-300 px-2 py-1.5 text-center font-semibold">
                        Pasangan
                      </th>
                      <th className="border border-slate-300 px-3 py-1.5 text-left font-semibold">
                        Pilihan Jawaban (Kolom B)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {q.pasanganMenjodohkan.map((pair, pIdx) => {
                      const rightItem = rightCol[pIdx];
                      return (
                        <tr key={pair.id}>
                          <td className="border border-slate-300 px-3 py-1.5 whitespace-pre-line text-slate-900">
                            {pIdx + 1}. {pair.premise}
                          </td>
                          <td className="border border-slate-300 px-2 py-1.5 text-center font-mono text-slate-500">
                            ( ...... )
                          </td>
                          <td className="border border-slate-300 px-3 py-1.5 whitespace-pre-line text-slate-900">
                            {rightItem
                              ? `${rightItem.letter}. ${rightItem.match}`
                              : ''}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {q.type === 'ESAY' && (
              <div className="space-y-2 pt-2">
                <div className="h-5 border-b border-dotted border-slate-300" />
                <div className="h-5 border-b border-dotted border-slate-300" />
                <div className="h-5 border-b border-dotted border-slate-300" />
              </div>
            )}

            {showAnswerKey && (
              <div className="no-print mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                <span className="font-semibold text-emerald-800 whitespace-pre-line">
                  Kunci:{' '}
                  {resolveQuestionFieldValue(q, metadata, {
                    id: 'k',
                    headerLabel: 'Kunci',
                    mappedField: 'kunci',
                  })}
                </span>
                {q.pembahasan && (
                  <p className="mt-1 whitespace-pre-line text-slate-600">
                    Pembahasan: {q.pembahasan}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Toolbar Kumpulan Soal */}
      <section className="no-print rounded-xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              4. Kumpulan Soal — Naskah Uji Siap Unduh & Cetak
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Unduh naskah kumpulan soal lengkap dalam format PDF, Word, atau Excel beserta kunci jawaban (simbol & rumus berhitung terjaga utuh).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={isExportingPdf}
              onClick={handleExportPdf}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60 whitespace-nowrap"
            >
              <FileDown className="h-3.5 w-3.5 text-red-700" />
              {isExportingPdf ? 'Menyiapkan PDF...' : 'Download PDF'}
            </button>
            <button
              type="button"
              onClick={handleExportWord}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap"
            >
              <FileText className="h-3.5 w-3.5 text-blue-700" />
              Download Word
            </button>
            <button
              type="button"
              onClick={() =>
                downloadKumpulanSoalExcel(metadata, visibleQuestions, showAnswerKey)
              }
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-700" />
              Download Excel
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-800 whitespace-nowrap"
            >
              <Printer className="h-3.5 w-3.5" />
              Cetak
            </button>
          </div>
        </div>

        {exportError && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-medium text-red-800"
          >
            {exportError}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
          <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1">
            {(
              [
                { id: 'ALL', label: `Semua (${questions.length})` },
                { id: 'PG', label: 'PG' },
                { id: 'JAWABAN_SINGKAT', label: 'Jawaban Singkat' },
                { id: 'MENJODOHKAN', label: 'Menjodohkan' },
                { id: 'ESAY', label: 'Esai' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id)}
                className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  filterType === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowKopEditor((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                showKopEditor
                  ? 'border-blue-700 bg-blue-50 text-blue-800'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Settings2 className="h-3.5 w-3.5" />
              Sunting Kop Naskah
            </button>

            <button
              type="button"
              onClick={() => setGroupByType((v) => !v)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                groupByType
                  ? 'border-blue-700 bg-blue-50 text-blue-800'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {groupByType ? 'Dikelompokkan per Jenis' : 'Urutan Gabungan'}
            </button>

            <button
              type="button"
              onClick={() => setShowStudentHeader((v) => !v)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                showStudentHeader
                  ? 'border-blue-700 bg-blue-50 text-blue-800'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              Identitas Siswa
            </button>

            <button
              type="button"
              onClick={() => setShowTierLabel((v) => !v)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                showTierLabel
                  ? 'border-blue-700 bg-blue-50 text-blue-800'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              Keterangan LOTS/MOTS/HOTS
            </button>

            <button
              type="button"
              onClick={() => setShowAnswerKey((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                showAnswerKey
                  ? 'border-emerald-700 bg-emerald-50 text-emerald-800'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {showAnswerKey ? (
                <>
                  <Eye className="h-3.5 w-3.5" />
                  Kunci Jawaban Aktif
                </>
              ) : (
                <>
                  <EyeOff className="h-3.5 w-3.5" />
                  Kunci Disembunyikan
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleShuffleQuestions}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap"
            >
              <Shuffle className="h-3.5 w-3.5" />
              Acak Soal
            </button>

            <button
              type="button"
              onClick={handleRenumberSequential}
              title="Urutkan ulang nomor 1..N"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Rapikan Nomor
            </button>
          </div>
        </div>

        {showKopEditor && (
          <div className="grid grid-cols-1 gap-3 border-t border-slate-200 pt-4 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Nama Sekolah
              </label>
              <input
                type="text"
                value={metadata.namaSekolah}
                onChange={(e) =>
                  onUpdateMetadata({ ...metadata, namaSekolah: e.target.value })
                }
                className="mt-1 w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-700 focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Judul Ujian
              </label>
              <input
                type="text"
                value={metadata.judulUjian}
                onChange={(e) =>
                  onUpdateMetadata({ ...metadata, judulUjian: e.target.value })
                }
                className="mt-1 w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-700 focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Tahun Ajaran
              </label>
              <input
                type="text"
                value={metadata.tahunAjaran}
                onChange={(e) =>
                  onUpdateMetadata({ ...metadata, tahunAjaran: e.target.value })
                }
                className="mt-1 w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-700 focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Alokasi Waktu
              </label>
              <input
                type="text"
                value={metadata.alokasiWaktu}
                onChange={(e) =>
                  onUpdateMetadata({ ...metadata, alokasiWaktu: e.target.value })
                }
                className="mt-1 w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-700 focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Nama Penyusun
              </label>
              <input
                type="text"
                value={metadata.penyusun}
                onChange={(e) =>
                  onUpdateMetadata({ ...metadata, penyusun: e.target.value })
                }
                className="mt-1 w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-700 focus:ring-2 focus:ring-blue-600/15 focus:outline-none"
              />
            </div>
          </div>
        )}
      </section>

      {/* Lembar Kertas Naskah Soal A4 */}
      <article className="mx-auto max-w-[840px] rounded-xl border border-slate-300 bg-white p-8 shadow-xs print:max-w-none print:rounded-none print:border-none print:p-0 print:shadow-none">
        <header className="border-b-2 border-slate-900 pb-4 text-center">
          <p className="text-xs font-semibold tracking-wider text-slate-700 uppercase">
            {metadata.namaSekolah}
          </p>
          <h3 className="mt-1 text-lg font-bold tracking-tight text-slate-900 uppercase">
            {metadata.judulUjian}
          </h3>
          <p className="mt-0.5 text-xs font-medium text-slate-700">
            {metadata.kurikulum} · Tahun Ajaran {metadata.tahunAjaran}
          </p>
        </header>

        <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-1.5 border-b border-slate-300 pb-4 text-xs sm:grid-cols-2">
          <div className="flex gap-2">
            <span className="w-32 font-semibold text-slate-700">Mata Pelajaran</span>
            <span className="text-slate-900">: {metadata.mataPelajaran}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-32 font-semibold text-slate-700">Alokasi Waktu</span>
            <span className="text-slate-900">: {metadata.alokasiWaktu}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-32 font-semibold text-slate-700">Kelas / Fase</span>
            <span className="text-slate-900">
              : {metadata.kelas} / {metadata.fase}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-32 font-semibold text-slate-700">Jumlah Soal</span>
            <span className="font-mono text-slate-900 tabular-nums">
              : {visibleQuestions.length} Butir
            </span>
          </div>
        </div>

        {showStudentHeader && (
          <div className="mt-4 grid grid-cols-1 gap-3 rounded-lg border border-slate-300 p-3 text-xs sm:grid-cols-2 print:rounded-none">
            <div>Nama Lengkap : .........................................................</div>
            <div>Kelas / No. Absen : .................................................</div>
          </div>
        )}

        <div className="mt-4 rounded-lg border border-slate-300 bg-slate-50/60 p-3.5 print:rounded-none print:bg-white">
          <p className="text-xs font-bold text-slate-900 uppercase">
            Petunjuk Pengerjaan:
          </p>
          <textarea
            rows={4}
            value={metadata.petunjukUmum}
            onChange={(e) =>
              onUpdateMetadata({ ...metadata, petunjukUmum: e.target.value })
            }
            className="mt-1 w-full rounded border border-transparent bg-transparent text-xs leading-relaxed text-slate-800 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:border-none print:p-0 print:resize-none"
          />
        </div>

        <div className="mt-6 space-y-6">
          {visibleQuestions.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-500">
              Belum ada butir soal untuk kategori yang dipilih.
            </p>
          ) : groupByType ? (
            (() => {
              let runningNumber = 1;
              return SECTION_META.map((sec) => {
                const items = visibleQuestions.filter((q) => q.type === sec.type);
                if (items.length === 0) return null;
                return (
                  <div key={sec.type} className="space-y-4">
                    <div className="border-b border-slate-300 pb-1.5">
                      <h4 className="text-sm font-bold text-slate-900">
                        BAGIAN {sec.roman}. {sec.title}
                      </h4>
                      <p className="text-xs italic text-slate-600">
                        {sec.instruction}
                      </p>
                    </div>
                    <div className="space-y-4">
                      {items.map((item) =>
                        renderQuestionBlock(item, runningNumber++)
                      )}
                    </div>
                  </div>
                );
              });
            })()
          ) : (
            <div className="space-y-4">
              {visibleQuestions.map((item, idx) =>
                renderQuestionBlock(item, idx + 1)
              )}
            </div>
          )}
        </div>

        {showAnswerKey && visibleQuestions.length > 0 && (
          <section className="mt-10 border-t-2 border-slate-900 pt-6 print-break-after">
            <h4 className="text-center text-sm font-bold text-slate-900 uppercase">
              Kunci Jawaban & Pedoman Penskoran
            </h4>
            <p className="mt-0.5 text-center text-xs text-slate-600">
              {metadata.mataPelajaran} · {metadata.kelas} ({metadata.fase}) ·{' '}
              {metadata.kurikulum} ·{' '}
              {
                analyzeCpForSubjectAndPhase(
                  metadata.mataPelajaran,
                  metadata.fase
                ).regulationShort
              }
            </p>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-900">
                    <th className="w-12 border border-slate-300 px-2.5 py-2 text-center font-semibold">
                      No.
                    </th>
                    <th className="w-24 border border-slate-300 px-2.5 py-2 text-center font-semibold">
                      Tingkatan
                    </th>
                    <th className="w-36 border border-slate-300 px-3 py-2 text-left font-semibold">
                      Jenis Soal
                    </th>
                    <th className="border border-slate-300 px-3 py-2 text-left font-semibold">
                      Kunci Jawaban / Pedoman
                    </th>
                    <th className="w-16 border border-slate-300 px-2.5 py-2 text-center font-semibold">
                      Bobot
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleQuestions.map((q, idx) => {
                    const tier =
                      q.tingkatanSoal || tierFromCognitiveLevel(q.levelKognitif);
                    const displayNum = groupByType
                      ? (() => {
                          let count = 0;
                          for (const sec of SECTION_META) {
                            const items = visibleQuestions.filter(
                              (x) => x.type === sec.type
                            );
                            for (const it of items) {
                              count++;
                              if (it.id === q.id) return count;
                            }
                          }
                          return idx + 1;
                        })()
                      : idx + 1;

                    return (
                      <tr key={q.id} className="align-top">
                        <td className="border border-slate-300 px-2.5 py-1.5 text-center font-mono font-semibold tabular-nums">
                          {displayNum}
                        </td>
                        <td className="border border-slate-300 px-2.5 py-1.5 text-center font-mono font-semibold text-blue-700">
                          {tier}
                        </td>
                        <td className="border border-slate-300 px-3 py-1.5 text-slate-700">
                          {SHORT_LABEL_JENIS_SOAL[q.type]}
                        </td>
                        <td className="border border-slate-300 px-3 py-1.5 whitespace-pre-line text-slate-900">
                          {resolveQuestionFieldValue(q, metadata, {
                            id: 'key_row',
                            headerLabel: 'Kunci',
                            mappedField: 'kunci',
                          })}
                        </td>
                        <td className="border border-slate-300 px-2.5 py-1.5 text-center font-mono tabular-nums">
                          {q.bobot}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </article>
    </div>
  );
};
