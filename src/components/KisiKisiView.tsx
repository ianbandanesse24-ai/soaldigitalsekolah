import React, { useState } from 'react';
import {
  Calculator,
  FileDown,
  FileSpreadsheet,
  FileText,
  Printer,
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
  DEFAULT_KISI_KISI_COLUMNS,
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
  downloadKisiKisiExcel,
  downloadKisiKisiPdf,
  downloadTemplateAcuanKisiKisi,
  downloadWordDocument,
  escapeHtml,
  resolveQuestionFieldValue,
} from '../utils/exportHelpers';
import { useMathFieldEditor } from '../hooks/useMathFieldEditor';
import { FormatAcuanUploader } from './FormatAcuanUploader';
import { MathSymbolBar } from './MathSymbolBar';

interface KisiKisiViewProps {
  metadata: ExamMetadata;
  questions: QuestionItem[];
  columns: ReferenceColumnDef[];
  acuan: UploadedFormatAcuan | null;
  onUpdateMetadata: (next: ExamMetadata) => void;
  onUpdateQuestions: (next: QuestionItem[]) => void;
  onApplyAcuan: (
    acuan: UploadedFormatAcuan | null,
    nextColumns: ReferenceColumnDef[]
  ) => void;
  onUpdateColumns: (nextColumns: ReferenceColumnDef[]) => void;
  onSmartFill?: () => void;
  smartFillNotice?: string | null;
}

export const KisiKisiView: React.FC<KisiKisiViewProps> = ({
  metadata,
  questions,
  columns,
  acuan,
  onUpdateMetadata,
  onUpdateQuestions,
  onApplyAcuan,
  onUpdateColumns,
  onSmartFill,
  smartFillNotice,
}) => {
  const [showMathBar, setShowMathBar] = useState(true);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const {
    activeFieldLabel,
    bindMathField,
    insertAtCursor,
    convertActiveNotation,
  } = useMathFieldEditor();

  const totalBobot =
    Math.round(
      questions.reduce((sum, q) => sum + (Number(q.bobot) || 0), 0) * 100
    ) / 100;

  const updateQuestionField = (
    id: string,
    patch: Partial<QuestionItem>
  ) => {
    const updated = questions.map((q) => {
      if (q.id !== id) return q;
      const merged = { ...q, ...patch };
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

  const cpReg =
    metadata.cpAcuanRegulasi ||
    analyzeCpForSubjectAndPhase(metadata.mataPelajaran, metadata.fase)
      .regulationFull;

  const handleExportPdf = async () => {
    setExportError(null);
    setIsExportingPdf(true);
    try {
      await downloadKisiKisiPdf(metadata, questions, columns);
    } catch (err) {
      setExportError(
        err instanceof Error ? err.message : 'Gagal membuat berkas PDF Kisi-Kisi.'
      );
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExportWord = () => {
    const thead = columns
      .map((c) => `<th>${escapeHtml(c.headerLabel)}</th>`)
      .join('');
    const tbody = questions
      .map((q) => {
        const tds = columns
          .map(
            (col) =>
              `<td>${escapeHtml(resolveQuestionFieldValue(q, metadata, col))}</td>`
          )
          .join('');
        return `<tr>${tds}</tr>`;
      })
      .join('');

    const htmlBody = `
      <h2 style="text-align:center;">KISI-KISI PENULISAN SOAL</h2>
      <p style="text-align:center; margin-bottom:14pt;"><strong>${escapeHtml(
        metadata.judulUjian
      )}</strong></p>
      <table class="no-border" style="margin-bottom:12pt;">
        <tr>
          <td style="width:22%;"><strong>Satuan Pendidikan</strong></td>
          <td style="width:28%;">: ${escapeHtml(metadata.namaSekolah)}</td>
          <td style="width:20%;"><strong>Kurikulum</strong></td>
          <td style="width:30%;">: ${escapeHtml(metadata.kurikulum)}</td>
        </tr>
        <tr>
          <td><strong>Mata Pelajaran</strong></td>
          <td>: ${escapeHtml(metadata.mataPelajaran)}</td>
          <td><strong>Acuan CP</strong></td>
          <td>: ${escapeHtml(cpReg)}</td>
        </tr>
        <tr>
          <td><strong>Kelas / Fase</strong></td>
          <td>: ${escapeHtml(metadata.kelas)} / ${escapeHtml(metadata.fase)}</td>
          <td><strong>Jumlah Soal</strong></td>
          <td>: ${questions.length} Butir</td>
        </tr>
      </table>
      <table>
        <thead><tr>${thead}</tr></thead>
        <tbody>${tbody}</tbody>
      </table>
      <table class="no-border" style="margin-top:20pt;">
        <tr>
          <td style="width:65%;"></td>
          <td>
            Penyusun,<br/><br/><br/><br/>
            <strong>${escapeHtml(metadata.penyusun)}</strong>
          </td>
        </tr>
      </table>
    `;

    const safeSubject = metadata.mataPelajaran.replace(/[^a-zA-Z0-9]+/g, '_');
    downloadWordDocument(
      `Kisi_Kisi_${safeSubject}.doc`,
      `Kisi-Kisi ${metadata.mataPelajaran}`,
      htmlBody
    );
  };

  const renderEditableCell = (q: QuestionItem, col: ReferenceColumnDef) => {
    switch (col.mappedField) {
      case 'nomor':
        return (
          <span className="font-mono font-semibold text-slate-900 tabular-nums">
            {q.nomor}
          </span>
        );
      case 'kelasSemester':
        return (
          <span className="text-slate-700">
            {metadata.kelas} / {metadata.fase}
          </span>
        );
      case 'kdCp':
        return (
          <textarea
            rows={2}
            value={q.kdCp}
            onFocus={bindMathField(`Soal #${q.nomor} · Capaian Pembelajaran`, (next) =>
              updateQuestionField(q.id, { kdCp: next })
            )}
            onChange={(e) => updateQuestionField(q.id, { kdCp: e.target.value })}
            className="w-full min-w-[180px] rounded border border-transparent bg-transparent px-1.5 py-1 text-xs text-slate-800 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:border-none print:p-0 print:resize-none"
          />
        );
      case 'materi':
        return (
          <input
            type="text"
            value={q.materi}
            onFocus={bindMathField(`Soal #${q.nomor} · Materi`, (next) =>
              updateQuestionField(q.id, { materi: next })
            )}
            onChange={(e) =>
              updateQuestionField(q.id, { materi: e.target.value })
            }
            className="w-full min-w-[140px] rounded border border-transparent bg-transparent px-1.5 py-1 text-xs text-slate-900 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:border-none print:p-0"
          />
        );
      case 'indikator':
        return (
          <textarea
            rows={2}
            value={q.indikator}
            onFocus={bindMathField(`Soal #${q.nomor} · Indikator Soal`, (next) =>
              updateQuestionField(q.id, { indikator: next })
            )}
            onChange={(e) =>
              updateQuestionField(q.id, { indikator: e.target.value })
            }
            className="w-full min-w-[200px] rounded border border-transparent bg-transparent px-1.5 py-1 text-xs text-slate-800 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:border-none print:p-0 print:resize-none"
          />
        );
      case 'levelKognitif':
        return (
          <select
            value={q.levelKognitif}
            onChange={(e) => {
              const nextLevel = e.target.value as CognitiveLevel;
              updateQuestionField(q.id, {
                levelKognitif: nextLevel,
                tingkatanSoal: tierFromCognitiveLevel(nextLevel),
              });
            }}
            className="rounded border border-transparent bg-transparent px-1.5 py-1 font-mono text-xs font-semibold text-slate-800 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:appearance-none print:border-none print:p-0"
          >
            {LEVEL_KOGNITIF_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.value}
              </option>
            ))}
          </select>
        );
      case 'tingkatanSoal': {
        const currentTier =
          q.tingkatanSoal || tierFromCognitiveLevel(q.levelKognitif);
        return (
          <select
            value={currentTier}
            onChange={(e) => {
              const nextTier = e.target.value as QuestionTier;
              const levelFromTier =
                tierFromCognitiveLevel(q.levelKognitif) === nextTier
                  ? q.levelKognitif
                  : cognitiveLevelForTier(nextTier);
              updateQuestionField(q.id, {
                tingkatanSoal: nextTier,
                levelKognitif: levelFromTier,
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
      case 'type':
        return (
          <select
            value={q.type}
            onChange={(e) =>
              updateQuestionField(q.id, {
                type: e.target.value as QuestionType,
              })
            }
            className="rounded border border-transparent bg-transparent px-1.5 py-1 text-xs text-slate-800 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:appearance-none print:border-none print:p-0"
          >
            {(Object.keys(SHORT_LABEL_JENIS_SOAL) as QuestionType[]).map((t) => (
              <option key={t} value={t}>
                {SHORT_LABEL_JENIS_SOAL[t]}
              </option>
            ))}
          </select>
        );
      case 'bobot':
        return (
          <span className="font-mono text-xs font-semibold text-slate-900 tabular-nums">
            {q.bobot}
          </span>
        );
      case 'sumberBuku':
        return (
          <input
            type="text"
            value={q.sumberBuku}
            onFocus={bindMathField(`Soal #${q.nomor} · Buku Sumber`, (next) =>
              updateQuestionField(q.id, { sumberBuku: next })
            )}
            onChange={(e) =>
              updateQuestionField(q.id, { sumberBuku: e.target.value })
            }
            className="w-full min-w-[140px] rounded border border-transparent bg-transparent px-1.5 py-1 text-xs text-slate-800 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:border-none print:p-0"
          />
        );
      case 'rumusanSoal':
        return (
          <textarea
            rows={2}
            value={q.rumusanSoal}
            onFocus={bindMathField(`Soal #${q.nomor} · Rumusan Soal`, (next) =>
              updateQuestionField(q.id, { rumusanSoal: next })
            )}
            onChange={(e) =>
              updateQuestionField(q.id, { rumusanSoal: e.target.value })
            }
            className="w-full min-w-[210px] rounded border border-transparent bg-transparent px-1.5 py-1 text-xs text-slate-800 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:border-none print:p-0 print:resize-none"
          />
        );
      case 'kunci':
        if (q.type === 'PG') {
          const keys = (['A', 'B', 'C', 'D', ...(q.useOptionE ? ['E'] : [])] as const);
          return (
            <select
              value={q.kunciPg}
              onChange={(e) =>
                updateQuestionField(q.id, {
                  kunciPg: e.target.value as 'A' | 'B' | 'C' | 'D' | 'E',
                })
              }
              className="rounded border border-transparent bg-transparent px-1.5 py-1 font-mono text-xs font-semibold text-emerald-700 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:appearance-none print:border-none print:p-0"
            >
              {keys.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          );
        }
        if (q.type === 'JAWABAN_SINGKAT') {
          return (
            <input
              type="text"
              value={q.kunciSingkat}
              onFocus={bindMathField(`Soal #${q.nomor} · Kunci Jawaban`, (next) =>
                updateQuestionField(q.id, { kunciSingkat: next })
              )}
              onChange={(e) =>
                updateQuestionField(q.id, { kunciSingkat: e.target.value })
              }
              className="w-full min-w-[140px] rounded border border-transparent bg-transparent px-1.5 py-1 text-xs text-slate-900 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:border-none print:p-0"
            />
          );
        }
        if (q.type === 'ESAY') {
          return (
            <textarea
              rows={2}
              value={q.kunciEsai}
              onFocus={bindMathField(`Soal #${q.nomor} · Kunci Esai`, (next) =>
                updateQuestionField(q.id, { kunciEsai: next })
              )}
              onChange={(e) =>
                updateQuestionField(q.id, { kunciEsai: e.target.value })
              }
              className="w-full min-w-[180px] rounded border border-transparent bg-transparent px-1.5 py-1 text-xs text-slate-800 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:border-none print:p-0 print:resize-none"
            />
          );
        }
        return (
          <span className="whitespace-pre-line text-xs text-slate-800">
            {resolveQuestionFieldValue(q, metadata, col)}
          </span>
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
              `Soal #${q.nomor} · Tujuan Pembelajaran`,
              (next) => updateQuestionField(q.id, { tujuanPembelajaran: next })
            )}
            onChange={(e) =>
              updateQuestionField(q.id, { tujuanPembelajaran: e.target.value })
            }
            className="w-full min-w-[200px] rounded border border-transparent bg-transparent px-1.5 py-1 text-xs text-slate-800 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:border-none print:p-0 print:resize-none"
          />
        );
      }
      case 'pembahasan': {
        const pembVal =
          q.pembahasan || generateDefaultPembahasan(q, metadata);
        return (
          <textarea
            rows={2}
            value={pembVal}
            onFocus={bindMathField(`Soal #${q.nomor} · Pembahasan`, (next) =>
              updateQuestionField(q.id, { pembahasan: next })
            )}
            onChange={(e) =>
              updateQuestionField(q.id, { pembahasan: e.target.value })
            }
            className="w-full min-w-[180px] rounded border border-transparent bg-transparent px-1.5 py-1 text-xs text-slate-800 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:border-none print:p-0 print:resize-none"
          />
        );
      }
      case 'catatanTelaah':
        return (
          <input
            type="text"
            value={q.catatanTelaah}
            onFocus={bindMathField(`Soal #${q.nomor} · Catatan Telaah`, (next) =>
              updateQuestionField(q.id, { catatanTelaah: next })
            )}
            onChange={(e) =>
              updateQuestionField(q.id, { catatanTelaah: e.target.value })
            }
            className="w-full min-w-[150px] rounded border border-transparent bg-transparent px-1.5 py-1 text-xs text-slate-800 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:border-none print:p-0"
          />
        );
      case 'mataPelajaran':
        return <span className="text-xs text-slate-800">{metadata.mataPelajaran}</span>;
      case 'kurikulum':
        return <span className="text-xs text-slate-800">{metadata.kurikulum}</span>;
      case 'namaSekolah':
        return (
          <input
            type="text"
            value={metadata.namaSekolah}
            onChange={(e) =>
              onUpdateMetadata({ ...metadata, namaSekolah: e.target.value })
            }
            className="w-full min-w-[150px] rounded border border-transparent bg-transparent px-1.5 py-1 text-xs text-slate-800 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:border-none print:p-0"
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
            className="w-full min-w-[140px] rounded border border-transparent bg-transparent px-1.5 py-1 text-xs text-slate-800 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:border-none print:p-0"
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
            className="w-full min-w-[110px] rounded border border-transparent bg-transparent px-1.5 py-1 text-xs text-slate-800 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:border-none print:p-0"
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
            className="w-full min-w-[110px] rounded border border-transparent bg-transparent px-1.5 py-1 text-xs text-slate-800 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:border-none print:p-0"
          />
        );
      case 'custom':
      default: {
        const normKey = normalizeCustomFieldKey(col.headerLabel);
        const currentVal =
          q.customFields?.[normKey] ||
          (col.customValue && col.customValue !== '-' ? col.customValue : '') ||
          generateAutoCustomFieldValue(col.headerLabel, q, metadata);
        return (
          <textarea
            rows={2}
            value={currentVal}
            onFocus={bindMathField(
              `Soal #${q.nomor} · ${col.headerLabel}`,
              (next) =>
                updateQuestionField(q.id, {
                  customFields: { ...(q.customFields || {}), [normKey]: next },
                })
            )}
            onChange={(e) =>
              updateQuestionField(q.id, {
                customFields: {
                  ...(q.customFields || {}),
                  [normKey]: e.target.value,
                },
              })
            }
            className="w-full min-w-[170px] rounded border border-transparent bg-transparent px-1.5 py-1 text-xs text-slate-800 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none print:border-none print:p-0 print:resize-none"
          />
        );
      }
    }
  };

  return (
    <div className="space-y-6">
      <FormatAcuanUploader
        title="2. Kisi-Kisi Soal — Unggah Format Acuan"
        description="Unggah berkas format acuan Kisi-Kisi dari sekolah atau dinas (.xlsx, .csv, .docx, .pdf, atau gambar). Kolom tabel dan isian Tujuan Pembelajaran, Indikator, hingga kolom kustom akan terisi cerdas otomatis."
        itemLabel="Kolom"
        acuan={acuan}
        columns={columns}
        defaultColumns={DEFAULT_KISI_KISI_COLUMNS}
        onApplyAcuan={onApplyAcuan}
        onUpdateColumns={onUpdateColumns}
        onDownloadSampleTemplate={downloadTemplateAcuanKisiKisi}
        onSmartFill={onSmartFill}
        smartFillNotice={smartFillNotice}
      />

      {/* Dokumen Tabel Kisi-Kisi */}
      <section className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.03)] print:border-none print:p-0 print:shadow-none">
        <div className="no-print flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 mb-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Tabel Kisi-Kisi Penulisan Soal
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Klik langsung pada sel untuk menyunting CP, materi, indikator, rumus, tingkatan, atau kunci jawaban.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowMathBar((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                showMathBar
                  ? 'border-blue-700 bg-blue-50 text-blue-800'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Calculator className="h-3.5 w-3.5 text-blue-700" />
              {showMathBar ? 'Sembunyikan Simbol' : 'Simbol & Rumus'}
            </button>
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
              onClick={() => downloadKisiKisiExcel(metadata, questions, columns)}
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
            className="no-print mb-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-medium text-red-800"
          >
            {exportError}
          </p>
        )}

        {showMathBar && (
          <div className="mb-5">
            <MathSymbolBar
              compact
              activeFieldLabel={activeFieldLabel}
              onInsertSymbol={insertAtCursor}
              onConvertActiveNotation={convertActiveNotation}
            />
          </div>
        )}

        {/* Kop Kisi-Kisi */}
        <div className="mb-5 text-center">
          <h3 className="text-base font-bold tracking-tight text-slate-900 uppercase">
            Kisi-Kisi Penulisan Soal
          </h3>
          <p className="text-sm font-medium text-slate-700">
            {metadata.judulUjian} · {metadata.kurikulum}
          </p>
          <p className="mt-0.5 text-xs font-medium text-blue-700">
            Acuan: {cpReg}
          </p>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-x-8 gap-y-1.5 rounded-lg border border-slate-200 bg-slate-50/50 p-4 text-xs sm:grid-cols-2 print:rounded-none print:bg-white">
          <div className="flex gap-2">
            <span className="w-36 font-semibold text-slate-700 shrink-0">
              Satuan Pendidikan
            </span>
            <span className="text-slate-900">: {metadata.namaSekolah}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-32 font-semibold text-slate-700 shrink-0">
              Kurikulum
            </span>
            <span className="text-slate-900">: {metadata.kurikulum}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-36 font-semibold text-slate-700 shrink-0">
              Mata Pelajaran
            </span>
            <span className="text-slate-900">: {metadata.mataPelajaran}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-32 font-semibold text-slate-700 shrink-0">
              Alokasi Waktu
            </span>
            <span className="text-slate-900">: {metadata.alokasiWaktu}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-36 font-semibold text-slate-700 shrink-0">
              Kelas / Fase
            </span>
            <span className="text-slate-900">
              : {metadata.kelas} / {metadata.fase}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-32 font-semibold text-slate-700 shrink-0">
              Jumlah & Bobot
            </span>
            <span className="font-mono text-slate-900 tabular-nums">
              : {questions.length} Butir · Total Bobot {totalBobot}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-300">
          <table className="min-w-full border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-900">
                {columns.map((col) => (
                  <th
                    key={col.id}
                    className="border-b border-r border-slate-300 px-3 py-2.5 text-left font-semibold last:border-r-0"
                  >
                    {col.headerLabel}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {questions.map((q) => (
                <tr
                  key={q.id}
                  className="bg-white hover:bg-slate-50/70 align-top print-break-inside-avoid"
                >
                  {columns.map((col) => (
                    <td
                      key={col.id}
                      className="border-r border-slate-200 px-2.5 py-2 last:border-r-0"
                    >
                      {renderEditableCell(q, col)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end text-xs text-slate-800">
          <div className="w-64">
            <p>Penyusun Soal,</p>
            <div className="h-14" />
            <p className="font-semibold underline underline-offset-4">
              {metadata.penyusun}
            </p>
            {metadata.nipPenyusun && (
              <p className="mt-0.5 font-mono text-slate-600 tabular-nums">
                NIP. {metadata.nipPenyusun}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
