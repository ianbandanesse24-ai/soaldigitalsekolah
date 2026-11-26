import React, { useState } from 'react';
import {
  Calculator,
  ChevronLeft,
  ChevronRight,
  FileDown,
  FileSpreadsheet,
  FileText,
  Plus,
  Printer,
  Trash2,
} from 'lucide-react';
import {
  CognitiveLevel,
  ExamMetadata,
  QuestionItem,
  QuestionTier,
  QuestionType,
  ReferenceColumnDef,
  UploadedFormatAcuan,
} from '../types/exam';
import { analyzeCpForSubjectAndPhase } from '../data/cpReferences';
import {
  cognitiveLevelForTier,
  DEFAULT_KARTU_SOAL_FIELDS,
  LEVEL_KOGNITIF_OPTIONS,
  redistributeBobotTotal100,
  SHORT_LABEL_JENIS_SOAL,
  tierFromCognitiveLevel,
} from '../data/defaultExamData';
import {
  generateAutoCustomFieldValue,
  generateDefaultPembahasan,
  generateDefaultTujuanPembelajaran,
  generateSmartDraftContentForQuestion,
  normalizeCustomFieldKey,
} from '../utils/autoFillAcuan';
import {
  buildDocumentSignatureHtml,
  downloadKartuSoalExcel,
  downloadKartuSoalPdf,
  downloadTemplateAcuanKartuSoal,
  downloadWordDocument,
  escapeHtml,
  resolveQuestionFieldValue,
} from '../utils/exportHelpers';
import { useMathFieldEditor } from '../hooks/useMathFieldEditor';
import { DocumentSignatureBlock } from './DocumentSignatureBlock';
import { FormatAcuanUploader } from './FormatAcuanUploader';
import { MathSymbolBar } from './MathSymbolBar';
import { QuestionImageControl } from './QuestionImageControl';

interface KartuSoalViewProps {
  metadata: ExamMetadata;
  questions: QuestionItem[];
  fields: ReferenceColumnDef[];
  acuan: UploadedFormatAcuan | null;
  onUpdateMetadata: (next: ExamMetadata) => void;
  onUpdateQuestions: (next: QuestionItem[]) => void;
  onApplyAcuan: (
    acuan: UploadedFormatAcuan | null,
    nextFields: ReferenceColumnDef[]
  ) => void;
  onUpdateFields: (nextFields: ReferenceColumnDef[]) => void;
  onSmartFill?: () => void;
  smartFillNotice?: string | null;
}

export const KartuSoalView: React.FC<KartuSoalViewProps> = ({
  metadata,
  questions,
  fields,
  acuan,
  onUpdateMetadata,
  onUpdateQuestions,
  onApplyAcuan,
  onUpdateFields,
  onSmartFill,
  smartFillNotice,
}) => {
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');
  const [activeIndex, setActiveIndex] = useState(0);
  const [showMathBar, setShowMathBar] = useState(true);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const {
    activeFieldLabel,
    bindMathField,
    insertAtCursor,
    convertActiveNotation,
  } = useMathFieldEditor();

  const safeIndex = Math.min(activeIndex, Math.max(0, questions.length - 1));
  const displayedQuestions =
    viewMode === 'all'
      ? questions
      : questions[safeIndex]
      ? [questions[safeIndex]]
      : [];

  const updateQuestion = (id: string, patch: Partial<QuestionItem>) => {
    const updated = questions.map((q) => {
      if (q.id !== id) return q;

      const nextManualFields = { ...(q.manualFields || {}) };
      if (patch.kdCp !== undefined) nextManualFields.kdCp = true;
      if (patch.tujuanPembelajaran !== undefined) nextManualFields.tujuanPembelajaran = true;
      if (patch.indikator !== undefined) nextManualFields.indikator = true;
      if (patch.pembahasan !== undefined) nextManualFields.pembahasan = true;
      if (patch.sumberBuku !== undefined) nextManualFields.sumberBuku = true;
      if (patch.customFields !== undefined) {
        const prevCustom = q.customFields || {};
        const changedKeys = Object.keys(patch.customFields).filter(
          (k) => patch.customFields![k] !== prevCustom[k]
        );
        if (changedKeys.length > 0) {
          nextManualFields.customKeys = Array.from(
            new Set([...(nextManualFields.customKeys || []), ...changedKeys])
          );
        }
      }

      const editedDraftContent =
        patch.rumusanSoal !== undefined ||
        patch.opsiPg !== undefined ||
        patch.kunciPg !== undefined ||
        patch.kunciSingkat !== undefined ||
        patch.kunciEsai !== undefined ||
        patch.pasanganMenjodohkan !== undefined;

      const merged: QuestionItem = {
        ...q,
        ...patch,
        manualFields: nextManualFields,
        ...(editedDraftContent ? { isAutoDraft: false } : {}),
      };

      if (patch.type !== undefined) {
        return generateSmartDraftContentForQuestion(
          {
            ...merged,
            useOptionE: merged.type === 'PG' ? true : merged.useOptionE,
          },
          metadata,
          merged.tujuanPembelajaran ||
            generateDefaultTujuanPembelajaran(merged, metadata),
          true,
          false
        );
      }
      return merged;
    });
    onUpdateQuestions(
      patch.type !== undefined ? redistributeBobotTotal100(updated) : updated
    );
  };

  const handleToggleOptionE = (q: QuestionItem) => {
    const nextUseE = !q.useOptionE;
    updateQuestion(q.id, {
      useOptionE: nextUseE,
      kunciPg: !nextUseE && q.kunciPg === 'E' ? 'A' : q.kunciPg,
    });
  };

  const handleAddMatchingPair = (q: QuestionItem) => {
    const nextIdx = q.pasanganMenjodohkan.length + 1;
    updateQuestion(q.id, {
      pasanganMenjodohkan: [
        ...q.pasanganMenjodohkan,
        {
          id: `pair_${Date.now()}_${nextIdx}`,
          premise: `Pernyataan ${nextIdx}`,
          match: `Pasangan ${nextIdx}`,
        },
      ],
    });
  };

  const handleRemoveMatchingPair = (q: QuestionItem, pairId: string) => {
    if (q.pasanganMenjodohkan.length <= 1) return;
    updateQuestion(q.id, {
      pasanganMenjodohkan: q.pasanganMenjodohkan.filter((p) => p.id !== pairId),
    });
  };

  const renderRumusanHtml = (q: QuestionItem) => {
    let extra = '';
    if (q.type === 'PG') {
      const keys = (['A', 'B', 'C', 'D', ...(q.useOptionE ? ['E'] : [])] as const);
      extra = `<div style="margin-top:6pt;">${keys
        .map(
          (k) =>
            `<div>${k}. ${escapeHtml(q.opsiPg[k as 'A' | 'B' | 'C' | 'D' | 'E'])}</div>`
        )
        .join('')}</div>`;
    } else if (q.type === 'MENJODOHKAN') {
      extra = `<table style="margin-top:6pt;"><thead><tr><th>Kolom A (Premis)</th><th>Kolom B (Pasangan)</th></tr></thead><tbody>${q.pasanganMenjodohkan
        .map(
          (p, i) =>
            `<tr><td>${i + 1}. ${escapeHtml(p.premise)}</td><td>${escapeHtml(
              p.match
            )}</td></tr>`
        )
        .join('')}</tbody></table>`;
    }
    return `<p>${escapeHtml(q.rumusanSoal)}</p>${extra}`;
  };

  const handleExportPdf = async () => {
    setExportError(null);
    setIsExportingPdf(true);
    try {
      await downloadKartuSoalPdf(metadata, questions, fields);
    } catch (err) {
      setExportError(
        err instanceof Error ? err.message : 'Gagal membuat berkas PDF Kartu Soal.'
      );
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExportWord = () => {
    const cardsHtml = questions
      .map((q, idx) => {
        const mappedRows = fields
          .map(
            (f) =>
              `<tr><td style="width:32%; font-weight:bold; background:#f8fafc;">${escapeHtml(
                f.headerLabel
              )}</td><td>${escapeHtml(
                resolveQuestionFieldValue(q, metadata, f)
              )}</td></tr>`
          )
          .join('');

        const kunciText = resolveQuestionFieldValue(q, metadata, {
          id: 'k',
          headerLabel: 'Kunci',
          mappedField: 'kunci',
        });

        const cpReg =
          metadata.cpAcuanRegulasi ||
          analyzeCpForSubjectAndPhase(metadata.mataPelajaran, metadata.fase)
            .regulationShort;

        return `
          <div class="${idx > 0 ? 'page-break' : ''}">
            <h3 style="text-align:center;">KARTU SOAL NOMOR ${q.nomor}</h3>
            <p style="text-align:center; margin-bottom:10pt;">${escapeHtml(
              metadata.namaSekolah
            )} — ${escapeHtml(metadata.kurikulum)} · ${escapeHtml(cpReg)}</p>
            <table>
              <tr>
                <td style="width:24%;"><strong>Mata Pelajaran</strong></td>
                <td style="width:26%;">: ${escapeHtml(metadata.mataPelajaran)}</td>
                <td style="width:22%;"><strong>Kurikulum</strong></td>
                <td style="width:28%;">: ${escapeHtml(metadata.kurikulum)}</td>
              </tr>
              <tr>
                <td><strong>Kelas / Fase</strong></td>
                <td>: ${escapeHtml(metadata.kelas)} / ${escapeHtml(metadata.fase)}</td>
                <td><strong>Tahun Ajaran</strong></td>
                <td>: ${escapeHtml(metadata.tahunAjaran)}</td>
              </tr>
              <tr>
                <td><strong>Bentuk Soal</strong></td>
                <td>: ${escapeHtml(SHORT_LABEL_JENIS_SOAL[q.type])}</td>
                <td><strong>Penyusun</strong></td>
                <td>: ${escapeHtml(metadata.penyusun)}</td>
              </tr>
              <tr>
                <td><strong>Tingkatan Soal</strong></td>
                <td>: ${escapeHtml(
                  q.tingkatanSoal || tierFromCognitiveLevel(q.levelKognitif)
                )} (${escapeHtml(q.levelKognitif)})</td>
                <td><strong>Bobot Skor</strong></td>
                <td>: ${q.bobot}</td>
              </tr>
            </table>
            <table>
              ${mappedRows}
              <tr>
                <td colspan="2" style="background:#f1f5f9; font-weight:bold;">RUMUSAN BUTIR SOAL (Nomor ${q.nomor})</td>
              </tr>
              <tr>
                <td colspan="2">${renderRumusanHtml(q)}</td>
              </tr>
              <tr>
                <td style="font-weight:bold; background:#f8fafc;">Kunci Jawaban / Pedoman Penskoran</td>
                <td>${escapeHtml(kunciText)}</td>
              </tr>
              <tr>
                <td style="font-weight:bold; background:#f8fafc;">Pembahasan</td>
                <td>${escapeHtml(q.pembahasan || '-')}</td>
              </tr>
              <tr>
                <td style="font-weight:bold; background:#f8fafc;">Catatan Telaah</td>
                <td>${escapeHtml(q.catatanTelaah || '-')}</td>
              </tr>
            </table>
          </div>
        `;
      })
      .join('');

    const safeSubject = metadata.mataPelajaran.replace(/[^a-zA-Z0-9]+/g, '_');
    downloadWordDocument(
      `Kartu_Soal_${safeSubject}.doc`,
      `Kartu Soal ${metadata.mataPelajaran}`,
      `${cardsHtml}${buildDocumentSignatureHtml(metadata)}`
    );
  };

  const renderFieldValueControl = (q: QuestionItem, f: ReferenceColumnDef) => {
    switch (f.mappedField) {
      case 'kdCp':
        return (
          <textarea
            rows={2}
            value={q.kdCp}
            onFocus={bindMathField(`Kartu #${q.nomor} · ${f.headerLabel}`, (next) =>
              updateQuestion(q.id, { kdCp: next })
            )}
            onChange={(e) => updateQuestion(q.id, { kdCp: e.target.value })}
            className="w-full rounded border border-transparent bg-transparent px-1.5 py-1 text-xs text-slate-900 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:border-none print:p-0 print:resize-none"
          />
        );
      case 'tujuanPembelajaran': {
        const tpVal =
          q.tujuanPembelajaran ||
          generateDefaultTujuanPembelajaran(q, metadata);
        return (
          <textarea
            rows={2}
            value={tpVal}
            onFocus={bindMathField(
              `Kartu #${q.nomor} · ${f.headerLabel}`,
              (next) => updateQuestion(q.id, { tujuanPembelajaran: next })
            )}
            onChange={(e) =>
              updateQuestion(q.id, { tujuanPembelajaran: e.target.value })
            }
            className="w-full rounded border border-transparent bg-transparent px-1.5 py-1 text-xs text-slate-900 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:border-none print:p-0 print:resize-none"
          />
        );
      }
      case 'materi':
        return (
          <input
            type="text"
            value={q.materi}
            onFocus={bindMathField(`Kartu #${q.nomor} · ${f.headerLabel}`, (next) =>
              updateQuestion(q.id, { materi: next })
            )}
            onChange={(e) => updateQuestion(q.id, { materi: e.target.value })}
            className="w-full rounded border border-transparent bg-transparent px-1.5 py-1 text-xs text-slate-900 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:border-none print:p-0"
          />
        );
      case 'indikator':
        return (
          <textarea
            rows={2}
            value={q.indikator}
            onFocus={bindMathField(`Kartu #${q.nomor} · ${f.headerLabel}`, (next) =>
              updateQuestion(q.id, { indikator: next })
            )}
            onChange={(e) => updateQuestion(q.id, { indikator: e.target.value })}
            className="w-full rounded border border-transparent bg-transparent px-1.5 py-1 text-xs text-slate-900 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:border-none print:p-0 print:resize-none"
          />
        );
      case 'tingkatanSoal': {
        const currentTier =
          q.tingkatanSoal || tierFromCognitiveLevel(q.levelKognitif);
        return (
          <select
            value={currentTier}
            onChange={(e) => {
              const nextTier = e.target.value as QuestionTier;
              const nextLevel =
                tierFromCognitiveLevel(q.levelKognitif) === nextTier
                  ? q.levelKognitif
                  : cognitiveLevelForTier(nextTier);
              updateQuestion(q.id, {
                tingkatanSoal: nextTier,
                levelKognitif: nextLevel,
              });
            }}
            className="rounded border border-transparent bg-transparent px-1.5 py-1 font-mono text-xs font-semibold text-blue-700 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:appearance-none print:border-none print:p-0"
          >
            <option value="LOTS">LOTS</option>
            <option value="MOTS">MOTS</option>
            <option value="HOTS">HOTS</option>
          </select>
        );
      }
      case 'levelKognitif':
        return (
          <select
            value={q.levelKognitif}
            onChange={(e) => {
              const nextLevel = e.target.value as CognitiveLevel;
              updateQuestion(q.id, {
                levelKognitif: nextLevel,
                tingkatanSoal: tierFromCognitiveLevel(nextLevel),
              });
            }}
            className="rounded border border-transparent bg-transparent px-1.5 py-1 font-mono text-xs font-semibold text-slate-900 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:appearance-none print:border-none print:p-0"
          >
            {LEVEL_KOGNITIF_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      case 'type':
        return (
          <select
            value={q.type}
            onChange={(e) =>
              updateQuestion(q.id, { type: e.target.value as QuestionType })
            }
            className="rounded border border-transparent bg-transparent px-1.5 py-1 text-xs text-slate-900 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:appearance-none print:border-none print:p-0"
          >
            {(Object.keys(SHORT_LABEL_JENIS_SOAL) as QuestionType[]).map((t) => (
              <option key={t} value={t}>
                {SHORT_LABEL_JENIS_SOAL[t]}
              </option>
            ))}
          </select>
        );
      case 'sumberBuku':
        return (
          <input
            type="text"
            value={q.sumberBuku}
            onFocus={bindMathField(`Kartu #${q.nomor} · ${f.headerLabel}`, (next) =>
              updateQuestion(q.id, { sumberBuku: next })
            )}
            onChange={(e) => updateQuestion(q.id, { sumberBuku: e.target.value })}
            className="w-full rounded border border-transparent bg-transparent px-1.5 py-1 text-xs text-slate-900 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:border-none print:p-0"
          />
        );
      case 'pembahasan': {
        const pembVal =
          q.pembahasan || generateDefaultPembahasan(q, metadata);
        return (
          <textarea
            rows={2}
            value={pembVal}
            onFocus={bindMathField(`Kartu #${q.nomor} · ${f.headerLabel}`, (next) =>
              updateQuestion(q.id, { pembahasan: next })
            )}
            onChange={(e) => updateQuestion(q.id, { pembahasan: e.target.value })}
            className="w-full rounded border border-transparent bg-transparent px-1.5 py-1 text-xs text-slate-900 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:border-none print:p-0 print:resize-none"
          />
        );
      }
      case 'namaSekolah':
        return (
          <input
            type="text"
            value={metadata.namaSekolah}
            onChange={(e) =>
              onUpdateMetadata({ ...metadata, namaSekolah: e.target.value })
            }
            className="w-full rounded border border-transparent bg-transparent px-1.5 py-1 text-xs text-slate-900 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:border-none print:p-0"
          />
        );
      case 'penyusun':
        return (
          <input
            type="text"
            value={metadata.penyusun}
            onChange={(e) =>
              onUpdateMetadata({ ...metadata, penyusun: e.target.value })
            }
            className="w-full rounded border border-transparent bg-transparent px-1.5 py-1 text-xs text-slate-900 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:border-none print:p-0"
          />
        );
      case 'tahunAjaran':
        return (
          <input
            type="text"
            value={metadata.tahunAjaran}
            onChange={(e) =>
              onUpdateMetadata({ ...metadata, tahunAjaran: e.target.value })
            }
            className="w-full rounded border border-transparent bg-transparent px-1.5 py-1 text-xs text-slate-900 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:border-none print:p-0"
          />
        );
      case 'alokasiWaktu':
        return (
          <input
            type="text"
            value={metadata.alokasiWaktu}
            onChange={(e) =>
              onUpdateMetadata({ ...metadata, alokasiWaktu: e.target.value })
            }
            className="w-full rounded border border-transparent bg-transparent px-1.5 py-1 text-xs text-slate-900 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:border-none print:p-0"
          />
        );
      case 'custom': {
        const normKey = normalizeCustomFieldKey(f.headerLabel);
        const currentVal =
          q.customFields?.[normKey] ||
          (f.customValue && f.customValue !== '-' ? f.customValue : '') ||
          generateAutoCustomFieldValue(f.headerLabel, q, metadata);
        return (
          <textarea
            rows={2}
            value={currentVal}
            onFocus={bindMathField(
              `Kartu #${q.nomor} · ${f.headerLabel}`,
              (next) =>
                updateQuestion(q.id, {
                  customFields: { ...(q.customFields || {}), [normKey]: next },
                })
            )}
            onChange={(e) =>
              updateQuestion(q.id, {
                customFields: {
                  ...(q.customFields || {}),
                  [normKey]: e.target.value,
                },
              })
            }
            className="w-full rounded border border-transparent bg-transparent px-1.5 py-1 text-xs text-slate-900 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:border-none print:p-0 print:resize-none"
          />
        );
      }
      default:
        return (
          <span className="whitespace-pre-line text-slate-900">
            {resolveQuestionFieldValue(q, metadata, f)}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <FormatAcuanUploader
        title="3. Kartu Soal — Unggah Format Acuan"
        description="Unggah format acuan Kartu Soal (.docx, .xlsx, .csv, .pdf, atau gambar). Susunan field dan seluruh isian Kartu Soal, Rumusan, Kunci, serta Pembahasan akan terisi cerdas mengikuti acuan Anda."
        itemLabel="Field Kartu"
        acuan={acuan}
        columns={fields}
        defaultColumns={DEFAULT_KARTU_SOAL_FIELDS}
        onApplyAcuan={onApplyAcuan}
        onUpdateColumns={onUpdateFields}
        onDownloadSampleTemplate={downloadTemplateAcuanKartuSoal}
        onSmartFill={onSmartFill}
        smartFillNotice={smartFillNotice}
      />

      {/* Toolbar Navigasi, Simbol Matematika & Download Kartu Soal */}
      <section className="no-print rounded-2xl border-t-4 border-t-amber-500 border-x border-b border-slate-200/90 bg-white px-5 py-4 shadow-sm space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setViewMode('single')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                  viewMode === 'single'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Satu Kartu
              </button>
              <button
                type="button"
                onClick={() => setViewMode('all')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                  viewMode === 'all'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua Kartu ({questions.length})
              </button>
            </div>

            {viewMode === 'single' && questions.length > 0 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={safeIndex <= 0}
                  onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                  aria-label="Kartu sebelumnya"
                  className="rounded-xl border border-slate-300 bg-white p-1.5 text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-2xs"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <select
                  value={safeIndex}
                  onChange={(e) => setActiveIndex(Number(e.target.value))}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 font-mono text-xs font-bold text-slate-900 focus:border-amber-600 focus:outline-none shadow-2xs"
                >
                  {questions.map((q, idx) => (
                    <option key={q.id} value={idx}>
                      Kartu #{q.nomor} — {SHORT_LABEL_JENIS_SOAL[q.type]} ({q.tingkatanSoal || tierFromCognitiveLevel(q.levelKognitif)})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={safeIndex >= questions.length - 1}
                  onClick={() =>
                    setActiveIndex((i) => Math.min(questions.length - 1, i + 1))
                  }
                  aria-label="Kartu berikutnya"
                  className="rounded-xl border border-slate-300 bg-white p-1.5 text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-2xs"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowMathBar((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all whitespace-nowrap shadow-2xs ${
                showMathBar
                  ? 'border-amber-600 bg-amber-600 text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-amber-50/70 hover:text-amber-800 hover:border-amber-300'
              }`}
            >
              <Calculator className="h-3.5 w-3.5" />
              {showMathBar ? 'Tutup Simbol' : 'Simbol & Rumus'}
            </button>
            <button
              type="button"
              disabled={isExportingPdf}
              onClick={handleExportPdf}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/80 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 hover:border-rose-300 disabled:opacity-60 whitespace-nowrap transition-all shadow-2xs"
            >
              <FileDown className="h-3.5 w-3.5 text-rose-600" />
              {isExportingPdf ? 'Menyiapkan PDF...' : 'Download PDF'}
            </button>
            <button
              type="button"
              onClick={handleExportWord}
              className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/80 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 hover:border-blue-300 whitespace-nowrap transition-all shadow-2xs"
            >
              <FileText className="h-3.5 w-3.5 text-blue-600" />
              Download Word
            </button>
            <button
              type="button"
              onClick={() => downloadKartuSoalExcel(metadata, questions, fields)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 whitespace-nowrap transition-all shadow-2xs"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
              Download Excel
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:shadow whitespace-nowrap transition-all"
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

        {showMathBar && (
          <MathSymbolBar
            activeFieldLabel={activeFieldLabel}
            onInsertSymbol={insertAtCursor}
            onConvertActiveNotation={convertActiveNotation}
          />
        )}
      </section>

      {/* Lembar Kartu Soal */}
      <div className="space-y-8">
        {displayedQuestions.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-xs">
            <p className="text-sm font-semibold text-slate-700">
              Belum ada Kartu Soal aktif.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Tambahkan Bab &amp; Lingkup Materi pada menu <strong className="text-slate-700">Data Soal</strong> untuk membuat Kartu Soal secara otomatis.
            </p>
          </div>
        )}
        {displayedQuestions.map((q, cardIdx) => {
          const kunciText = resolveQuestionFieldValue(q, metadata, {
            id: 'kunci_preview',
            headerLabel: 'Kunci',
            mappedField: 'kunci',
          });

          return (
            <article
              key={q.id}
              className={`rounded-xl border border-slate-300 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.03)] print:rounded-none print:border-slate-800 print:p-5 print:shadow-none print-break-inside-avoid ${
                viewMode === 'all' && cardIdx < displayedQuestions.length - 1
                  ? 'print-break-after'
                  : ''
              }`}
            >
              {/* Kop Kartu Soal */}
              <div className="border-b-2 border-slate-800 pb-3 text-center">
                <h3 className="text-base font-bold tracking-wide text-slate-900 uppercase">
                  Kartu Soal {SHORT_LABEL_JENIS_SOAL[q.type]}
                </h3>
                <p className="text-xs font-medium text-slate-700">
                  {metadata.namaSekolah} · {metadata.kurikulum} · Tahun Ajaran{' '}
                  {metadata.tahunAjaran}
                </p>
                <p className="mt-0.5 text-xs font-medium text-blue-700">
                  {metadata.cpAcuanRegulasi ||
                    analyzeCpForSubjectAndPhase(
                      metadata.mataPelajaran,
                      metadata.fase
                    ).regulationFull}
                </p>
              </div>

              {/* Identitas Kartu */}
              <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-1.5 rounded-lg border border-slate-300 bg-slate-50/70 p-3 text-xs sm:grid-cols-2 print:rounded-none print:bg-white">
                <div className="flex gap-2">
                  <span className="w-32 font-semibold text-slate-700 shrink-0">
                    Mata Pelajaran
                  </span>
                  <span className="text-slate-900">: {metadata.mataPelajaran}</span>
                </div>
                <div className="flex gap-2">
                  <span className="w-32 font-semibold text-slate-700 shrink-0">
                    Kurikulum
                  </span>
                  <span className="text-slate-900">: {metadata.kurikulum}</span>
                </div>
                <div className="flex gap-2">
                  <span className="w-32 font-semibold text-slate-700 shrink-0">
                    Kelas / Fase
                  </span>
                  <span className="text-slate-900">
                    : {metadata.kelas} / {metadata.fase}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-32 font-semibold text-slate-700 shrink-0">
                    Nomor Soal
                  </span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    : {q.nomor}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-32 font-semibold text-slate-700 shrink-0">
                    Penyusun
                  </span>
                  <span className="text-slate-900">: {metadata.penyusun}</span>
                </div>
                <div className="flex gap-2">
                  <span className="w-32 font-semibold text-slate-700 shrink-0">
                    Bentuk Soal
                  </span>
                  <span className="text-slate-900">
                    : {SHORT_LABEL_JENIS_SOAL[q.type]}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-32 font-semibold text-slate-700 shrink-0">
                    Tingkatan Soal
                  </span>
                  <span className="font-mono font-semibold text-blue-700">
                    : {q.tingkatanSoal || tierFromCognitiveLevel(q.levelKognitif)}
                  </span>
                </div>
              </div>

              {/* Tabel Field Acuan Kartu Soal */}
              <table className="mt-4 w-full border-collapse border border-slate-300 text-xs">
                <tbody>
                  {fields.map((f) => (
                    <tr key={f.id} className="border-b border-slate-300 align-top">
                      <th className="w-1/3 border-r border-slate-300 bg-slate-50 px-3 py-2 text-left font-semibold text-slate-800 print:bg-white">
                        {f.headerLabel}
                      </th>
                      <td className="px-2.5 py-1.5 text-slate-900">
                        {renderFieldValueControl(q, f)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Kotak Rumusan Butir Soal */}
              <div className="mt-4 rounded-lg border border-slate-300 overflow-hidden print:rounded-none">
                <div className="flex items-center justify-between border-b border-slate-300 bg-slate-100 px-3.5 py-2 print:bg-slate-50">
                  <span className="text-xs font-bold text-slate-900 uppercase">
                    Rumusan Butir Soal (Nomor {q.nomor})
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-700 tabular-nums">
                    Tingkatan {q.tingkatanSoal || tierFromCognitiveLevel(q.levelKognitif)} · Level {q.levelKognitif} · Bobot {q.bobot}
                  </span>
                </div>
                <div className="p-4 text-sm text-slate-900 space-y-3">
                  {q.gambarUrl && q.gambarPosisi !== 'bawah' && (
                    <div className="my-2 max-w-sm rounded-lg border border-slate-200 bg-white p-2">
                      <img src={q.gambarUrl} alt={q.gambarKeterangan || `Gambar soal ${q.nomor}`} className="max-h-48 w-auto rounded object-contain mx-auto" />
                      {q.gambarKeterangan && (
                        <p className="mt-1 text-center text-xs text-slate-500 italic">{q.gambarKeterangan}</p>
                      )}
                    </div>
                  )}

                  <textarea
                    rows={3}
                    value={q.rumusanSoal}
                    onFocus={bindMathField(
                      `Kartu #${q.nomor} · Rumusan Soal`,
                      (next) => updateQuestion(q.id, { rumusanSoal: next })
                    )}
                    onChange={(e) =>
                      updateQuestion(q.id, { rumusanSoal: e.target.value })
                    }
                    className="w-full rounded-md border border-slate-200/80 p-2 text-sm text-slate-900 hover:border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 focus:outline-none print:border-none print:p-0 print:resize-none"
                  />

                  {q.gambarUrl && q.gambarPosisi === 'bawah' && (
                    <div className="my-2 max-w-sm rounded-lg border border-slate-200 bg-white p-2">
                      <img src={q.gambarUrl} alt={q.gambarKeterangan || `Gambar soal ${q.nomor}`} className="max-h-48 w-auto rounded object-contain mx-auto" />
                      {q.gambarKeterangan && (
                        <p className="mt-1 text-center text-xs text-slate-500 italic">{q.gambarKeterangan}</p>
                      )}
                    </div>
                  )}

                  <div className="no-print pt-2 border-t border-slate-200">
                    <QuestionImageControl
                      questionNumber={q.nomor}
                      gambarUrl={q.gambarUrl}
                      gambarKeterangan={q.gambarKeterangan}
                      gambarPosisi={q.gambarPosisi}
                      onChange={(patch) => updateQuestion(q.id, patch)}
                    />
                  </div>

                  {q.type === 'PG' && (
                    <div className="space-y-2 pl-1 text-sm">
                      {(['A', 'B', 'C', 'D', ...(q.useOptionE ? ['E'] : [])] as const).map(
                        (optKey) => (
                          <div key={optKey} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`ks-kunci-${q.id}`}
                              checked={q.kunciPg === optKey}
                              onChange={() =>
                                updateQuestion(q.id, {
                                  kunciPg: optKey as 'A' | 'B' | 'C' | 'D' | 'E',
                                })
                              }
                              title={`Jadikan ${optKey} sebagai kunci`}
                              className="no-print text-blue-700"
                            />
                            <span className="font-mono font-semibold text-slate-800">
                              {optKey}.
                            </span>
                            <input
                              type="text"
                              value={q.opsiPg[optKey as 'A' | 'B' | 'C' | 'D' | 'E']}
                              onFocus={bindMathField(
                                `Kartu #${q.nomor} · Opsi ${optKey}`,
                                (next) =>
                                  updateQuestion(q.id, {
                                    opsiPg: {
                                      ...q.opsiPg,
                                      [optKey]: next,
                                    },
                                  })
                              )}
                              onChange={(e) =>
                                updateQuestion(q.id, {
                                  opsiPg: {
                                    ...q.opsiPg,
                                    [optKey]: e.target.value,
                                  },
                                })
                              }
                              className="flex-1 rounded-md border border-slate-200/80 px-2 py-1 text-sm text-slate-900 hover:border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 focus:outline-none print:border-none print:p-0"
                            />
                          </div>
                        )
                      )}

                      <div className="no-print pt-1">
                        <button
                          type="button"
                          onClick={() => handleToggleOptionE(q)}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          {q.useOptionE ? 'Hapus Opsi E' : '+ Tambah Opsi E'}
                        </button>
                      </div>
                    </div>
                  )}

                  {q.type === 'JAWABAN_SINGKAT' && (
                    <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                      Area Jawaban Siswa: ........................................................................
                    </div>
                  )}

                  {q.type === 'MENJODOHKAN' && (
                    <div className="space-y-2">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-slate-300 text-xs">
                          <thead>
                            <tr className="bg-slate-50">
                              <th className="border border-slate-300 px-3 py-1.5 text-left">
                                Premis / Pernyataan (Kolom A)
                              </th>
                              <th className="border border-slate-300 px-3 py-1.5 text-left">
                                Pasangan Benar (Kolom B)
                              </th>
                              <th className="no-print w-12 border border-slate-300 px-2 py-1.5 text-center">
                                Hapus
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {q.pasanganMenjodohkan.map((pair, idx) => (
                              <tr key={pair.id}>
                                <td className="border border-slate-300 px-2 py-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono text-slate-500">
                                      {idx + 1}.
                                    </span>
                                    <input
                                      type="text"
                                      value={pair.premise}
                                      onFocus={bindMathField(
                                        `Kartu #${q.nomor} · Premis ${idx + 1}`,
                                        (next) =>
                                          updateQuestion(q.id, {
                                            pasanganMenjodohkan:
                                              q.pasanganMenjodohkan.map((p) =>
                                                p.id === pair.id
                                                  ? { ...p, premise: next }
                                                  : p
                                              ),
                                          })
                                      )}
                                      onChange={(e) =>
                                        updateQuestion(q.id, {
                                          pasanganMenjodohkan:
                                            q.pasanganMenjodohkan.map((p) =>
                                              p.id === pair.id
                                                ? { ...p, premise: e.target.value }
                                                : p
                                            ),
                                        })
                                      }
                                      className="w-full rounded border border-transparent px-1 py-0.5 text-xs text-slate-900 hover:border-slate-300 focus:border-blue-600 focus:outline-none print:border-none print:p-0"
                                    />
                                  </div>
                                </td>
                                <td className="border border-slate-300 px-2 py-1">
                                  <input
                                    type="text"
                                    value={pair.match}
                                    onFocus={bindMathField(
                                      `Kartu #${q.nomor} · Pasangan ${idx + 1}`,
                                      (next) =>
                                        updateQuestion(q.id, {
                                          pasanganMenjodohkan:
                                            q.pasanganMenjodohkan.map((p) =>
                                              p.id === pair.id
                                                ? { ...p, match: next }
                                                : p
                                            ),
                                        })
                                    )}
                                    onChange={(e) =>
                                      updateQuestion(q.id, {
                                        pasanganMenjodohkan:
                                          q.pasanganMenjodohkan.map((p) =>
                                            p.id === pair.id
                                              ? { ...p, match: e.target.value }
                                              : p
                                          ),
                                      })
                                    }
                                    className="w-full rounded border border-transparent px-1 py-0.5 text-xs text-slate-900 hover:border-slate-300 focus:border-blue-600 focus:outline-none print:border-none print:p-0"
                                  />
                                </td>
                                <td className="no-print border border-slate-300 px-2 py-1 text-center">
                                  <button
                                    type="button"
                                    disabled={q.pasanganMenjodohkan.length <= 1}
                                    onClick={() =>
                                      handleRemoveMatchingPair(q, pair.id)
                                    }
                                    title="Hapus pasangan"
                                    className="rounded p-1 text-red-600 hover:bg-red-50 disabled:opacity-30"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="no-print">
                        <button
                          type="button"
                          onClick={() => handleAddMatchingPair(q)}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Tambah Pasangan
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Kunci, Pembahasan & Catatan Telaah */}
              <div className="mt-4 grid grid-cols-1 rounded-lg border border-slate-300 sm:grid-cols-2 overflow-hidden print:rounded-none">
                <div className="border-b border-slate-300 p-3.5 sm:border-b-0 sm:border-r space-y-2.5">
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Kunci Jawaban / Pedoman Penskoran
                    </p>
                    {q.type === 'JAWABAN_SINGKAT' ? (
                      <input
                        type="text"
                        value={q.kunciSingkat}
                        onFocus={bindMathField(
                          `Kartu #${q.nomor} · Kunci Jawaban Singkat`,
                          (next) => updateQuestion(q.id, { kunciSingkat: next })
                        )}
                        onChange={(e) =>
                          updateQuestion(q.id, { kunciSingkat: e.target.value })
                        }
                        className="mt-1.5 w-full rounded-md border border-slate-200 bg-slate-50/70 p-2 text-xs text-slate-900 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:border-none print:bg-white print:p-0"
                      />
                    ) : q.type === 'ESAY' ? (
                      <textarea
                        rows={3}
                        value={q.kunciEsai}
                        onFocus={bindMathField(
                          `Kartu #${q.nomor} · Pedoman Jawaban Esai`,
                          (next) => updateQuestion(q.id, { kunciEsai: next })
                        )}
                        onChange={(e) =>
                          updateQuestion(q.id, { kunciEsai: e.target.value })
                        }
                        className="mt-1.5 w-full rounded-md border border-slate-200 bg-slate-50/70 p-2 text-xs text-slate-900 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:border-none print:bg-white print:p-0 print:resize-none"
                      />
                    ) : (
                      <p className="mt-1.5 whitespace-pre-line text-xs text-slate-900">
                        {kunciText}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Pembahasan / Langkah Penyelesaian
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Tulis langkah perhitungan, rumus, atau pembahasan singkat..."
                      value={q.pembahasan || ''}
                      onFocus={bindMathField(
                        `Kartu #${q.nomor} · Pembahasan`,
                        (next) => updateQuestion(q.id, { pembahasan: next })
                      )}
                      onChange={(e) =>
                        updateQuestion(q.id, { pembahasan: e.target.value })
                      }
                      className="mt-1 w-full rounded-md border border-slate-200 bg-slate-50/70 p-2 text-xs text-slate-900 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:border-none print:bg-white print:p-0 print:resize-none"
                    />
                  </div>
                </div>

                <div className="p-3.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Catatan Telaah & Keputusan
                  </label>
                  <textarea
                    rows={5}
                    value={q.catatanTelaah}
                    onFocus={bindMathField(
                      `Kartu #${q.nomor} · Catatan Telaah`,
                      (next) => updateQuestion(q.id, { catatanTelaah: next })
                    )}
                    onChange={(e) =>
                      updateQuestion(q.id, { catatanTelaah: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-md border border-slate-200 bg-slate-50/70 p-2 text-xs text-slate-900 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:border-none print:bg-white print:p-0 print:resize-none"
                  />
                </div>
              </div>
            </article>
          );
        })}

        {questions.length > 0 && (
          <section className="rounded-xl border border-slate-200/90 bg-white px-6 pb-6 pt-2 shadow-[0_1px_2px_rgba(15,23,42,0.03)] print:rounded-none print:border-0 print:px-0 print:shadow-none">
            <DocumentSignatureBlock
              metadata={metadata}
              className="mt-2 border-t-0 pt-4"
            />
          </section>
        )}
      </div>
    </div>
  );
};
