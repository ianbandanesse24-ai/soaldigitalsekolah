import React, { useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Download,
  Eye,
  EyeOff,
  FileCheck2,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  MappedExamField,
  ReferenceColumnDef,
  UploadedFormatAcuan,
} from '../types/exam';
import { parseFormatAcuanFile } from '../utils/fileFormatParser';

interface FormatAcuanUploaderProps {
  title: string;
  description: string;
  itemLabel: string;
  acuan: UploadedFormatAcuan | null;
  columns: ReferenceColumnDef[];
  defaultColumns: ReferenceColumnDef[];
  onApplyAcuan: (acuan: UploadedFormatAcuan | null, nextColumns: ReferenceColumnDef[]) => void;
  onUpdateColumns: (nextColumns: ReferenceColumnDef[]) => void;
  onDownloadSampleTemplate: () => void;
  onSmartFill?: () => void;
  smartFillNotice?: string | null;
}

const FIELD_MAPPING_OPTIONS: { value: MappedExamField; label: string }[] = [
  { value: 'nomor', label: 'Nomor Soal / Urut' },
  { value: 'kdCp', label: 'Capaian Pembelajaran / KD' },
  { value: 'tujuanPembelajaran', label: 'Tujuan Pembelajaran (TP / ATP)' },
  { value: 'materi', label: 'Materi Pokok / Bab' },
  { value: 'kelasSemester', label: 'Kelas / Fase / Semester' },
  { value: 'indikator', label: 'Indikator Soal' },
  { value: 'levelKognitif', label: 'Level Kognitif (C1–C6)' },
  { value: 'tingkatanSoal', label: 'Tingkatan Soal (LOTS/MOTS/HOTS)' },
  { value: 'type', label: 'Bentuk Soal' },
  { value: 'bobot', label: 'Bobot Skor' },
  { value: 'sumberBuku', label: 'Buku Sumber / Referensi' },
  { value: 'rumusanSoal', label: 'Rumusan Butir Soal' },
  { value: 'kunci', label: 'Kunci Jawaban / Pedoman' },
  { value: 'pembahasan', label: 'Pembahasan / Penyelesaian' },
  { value: 'catatanTelaah', label: 'Catatan Telaah / Keterangan' },
  { value: 'mataPelajaran', label: 'Mata Pelajaran (Otomatis)' },
  { value: 'kurikulum', label: 'Kurikulum (Otomatis)' },
  { value: 'namaSekolah', label: 'Satuan Pendidikan / Sekolah' },
  { value: 'penyusun', label: 'Penyusun / Guru' },
  { value: 'tahunAjaran', label: 'Tahun Ajaran' },
  { value: 'alokasiWaktu', label: 'Alokasi Waktu' },
  { value: 'custom', label: 'Isi Otomatis / Kustom Sesuai Label' },
];

export const FormatAcuanUploader: React.FC<FormatAcuanUploaderProps> = ({
  title,
  description,
  itemLabel,
  acuan,
  columns,
  defaultColumns,
  onApplyAcuan,
  onUpdateColumns,
  onDownloadSampleTemplate,
  onSmartFill,
  smartFillNotice,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showMapper, setShowMapper] = useState(false);

  const handleFile = async (file: File) => {
    setErrorMsg(null);
    setIsParsing(true);
    try {
      const parsed = await parseFormatAcuanFile(file, defaultColumns);
      onApplyAcuan(parsed, parsed.columns);
      setShowMapper(true);
      if (parsed.previewRows.length > 0 || parsed.dataUrl || parsed.rawHtml) {
        setShowPreview(true);
      }
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Gagal memproses berkas format acuan. Pastikan format berkas valid.'
      );
    } finally {
      setIsParsing(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleMoveColumn = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= columns.length) return;
    const copy = [...columns];
    const [removed] = copy.splice(idx, 1);
    copy.splice(target, 0, removed);
    onUpdateColumns(copy);
  };

  const handleAddColumn = () => {
    onUpdateColumns([
      ...columns,
      {
        id: `col_${Date.now()}`,
        headerLabel: `${itemLabel} Baru`,
        mappedField: 'custom',
        customValue: '-',
      },
    ]);
  };

  return (
    <section className="no-print rounded-xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {onSmartFill && (
            <button
              type="button"
              onClick={onSmartFill}
              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-700 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-800 hover:bg-blue-100 transition-colors whitespace-nowrap"
            >
              <Sparkles className="h-3.5 w-3.5 text-blue-700" />
              Isi Cerdas Semua Sesuai Acuan
            </button>
          )}
          <button
            type="button"
            onClick={onDownloadSampleTemplate}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            Unduh Contoh Acuan (.xlsx)
          </button>
          <button
            type="button"
            onClick={() => setShowMapper((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
              showMapper
                ? 'border-blue-700 bg-blue-50 text-blue-800'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Atur {itemLabel} ({columns.length})
          </button>
        </div>
      </div>

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        className={`mt-4 flex flex-col items-center justify-between gap-4 rounded-lg border border-dashed px-4 py-4 sm:flex-row transition-colors ${
          isDragging
            ? 'border-blue-600 bg-blue-50/70'
            : 'border-slate-300 bg-slate-50/70'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv,.docx,.html,.htm,.txt,.md,.pdf,.png,.jpg,.jpeg,.webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = '';
          }}
        />

        {acuan ? (
          <div className="flex items-start gap-3 min-w-0">
            <FileCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {acuan.fileName}
              </p>
              <p className="mt-0.5 text-xs text-slate-600">
                {acuan.fileType} · {formatBytes(acuan.fileSize)} ·{' '}
                {acuan.detectedHeaders.length > 0
                  ? `${acuan.detectedHeaders.length} kolom/field terdeteksi & diisi cerdas ke seluruh soal`
                  : 'Acuan visual aktif · Seluruh field terstruktur disiapkan cerdas'}
              </p>
              {acuan.detectedHeaders.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {acuan.detectedHeaders.slice(0, 10).map((h, i) => (
                    <span
                      key={i}
                      className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-slate-700"
                    >
                      {h}
                    </span>
                  ))}
                  {acuan.detectedHeaders.length > 10 && (
                    <span className="px-1.5 py-0.5 text-[11px] text-slate-500">
                      +{acuan.detectedHeaders.length - 10} lainnya
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Upload className="h-5 w-5 shrink-0 text-slate-400" />
            <div>
              <p className="text-sm font-medium text-slate-800">
                Seret & lepas berkas Format Acuan di sini, atau pilih berkas
              </p>
              <p className="text-xs text-slate-500">
                Mendukung Excel (.xlsx, .xls, .csv), Word (.docx), PDF, HTML, Teks (.txt), atau Gambar (.png, .jpg)
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {acuan && (
            <>
              <button
                type="button"
                onClick={() => setShowPreview((p) => !p)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 whitespace-nowrap"
              >
                {showPreview ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5" />
                    Tutup Pratinjau Acuan
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5" />
                    Lihat Pratinjau Acuan
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  onApplyAcuan(null, defaultColumns);
                  setShowPreview(false);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 whitespace-nowrap"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Hapus Acuan
              </button>
            </>
          )}
          <button
            type="button"
            disabled={isParsing}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-800 disabled:opacity-60 transition-colors whitespace-nowrap"
          >
            <Upload className="h-3.5 w-3.5" />
            {isParsing ? 'Memproses...' : acuan ? 'Ganti Format Acuan' : 'Unggah Format Acuan'}
          </button>
        </div>
      </div>

      {smartFillNotice && (
        <p className="mt-3 flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          <span>{smartFillNotice}</span>
        </p>
      )}

      {errorMsg && (
        <p className="mt-3 text-xs font-medium text-red-700" role="alert">
          Terjadi kendala: {errorMsg}
        </p>
      )}

      {/* Preview Dokumen Acuan */}
      {acuan && showPreview && (
        <div className="mt-4 border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-slate-700">
              Pratinjau Dokumen Acuan: {acuan.fileName}
            </h3>
            <span className="text-xs text-slate-500">
              Gunakan sebagai referensi langsung saat menyusun struktur
            </span>
          </div>

          {acuan.dataUrl && acuan.fileType === 'PDF' ? (
            <iframe
              src={acuan.dataUrl}
              title={`Pratinjau ${acuan.fileName}`}
              className="h-80 w-full rounded border border-slate-200 bg-slate-100"
            />
          ) : acuan.dataUrl ? (
            <div className="max-h-96 overflow-auto rounded border border-slate-200 bg-slate-100 p-3">
              <img
                src={acuan.dataUrl}
                alt={`Pratinjau format acuan ${acuan.fileName}`}
                referrerPolicy="no-referrer"
                className="mx-auto max-h-80 object-contain"
              />
            </div>
          ) : acuan.rawHtml ? (
            <div
              className="max-h-72 overflow-auto rounded border border-slate-200 bg-white p-4 text-xs text-slate-800 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-slate-300 [&_td]:p-1.5 [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100 [&_th]:p-1.5"
              dangerouslySetInnerHTML={{ __html: acuan.rawHtml }}
            />
          ) : acuan.previewRows.length > 0 || acuan.detectedHeaders.length > 0 ? (
            <div className="overflow-x-auto rounded border border-slate-200">
              <table className="min-w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-800">
                    {acuan.detectedHeaders.map((h, i) => (
                      <th
                        key={i}
                        className="border-b border-r border-slate-200 px-3 py-2 text-left font-semibold last:border-r-0"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {acuan.previewRows.map((row, rIdx) => (
                    <tr key={rIdx} className="border-b border-slate-100 last:border-b-0">
                      {acuan.detectedHeaders.map((_, cIdx) => (
                        <td
                          key={cIdx}
                          className="border-r border-slate-100 px-3 py-1.5 text-slate-700 last:border-r-0"
                        >
                          {row[cIdx] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <pre className="max-h-60 overflow-auto rounded border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-700 whitespace-pre-wrap">
              {acuan.rawText || 'Tidak ada pratinjau teks yang tersedia untuk berkas ini.'}
            </pre>
          )}
        </div>
      )}

      {/* Pemetaan Kolom / Field Format Acuan */}
      {showMapper && (
        <div className="mt-4 border-t border-slate-200 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Pemetaan {itemLabel} Format Acuan
              </h3>
              <p className="text-xs text-slate-500">
                Sesuaikan nama {itemLabel.toLowerCase()} dan data sumbernya agar hasil ekspor mengikuti format acuan yang diunggah.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onUpdateColumns(defaultColumns)}
                className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <RotateCcw className="h-3 w-3" />
                Standar Baku
              </button>
              <button
                type="button"
                onClick={handleAddColumn}
                className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
              >
                <Plus className="h-3.5 w-3.5" />
                Tambah {itemLabel}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded border border-slate-200">
            <table className="min-w-full border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700">
                  <th className="border-b border-slate-200 px-3 py-2 text-left font-semibold w-14">
                    Urut
                  </th>
                  <th className="border-b border-slate-200 px-3 py-2 text-left font-semibold">
                    Label {itemLabel} pada Dokumen
                  </th>
                  <th className="border-b border-slate-200 px-3 py-2 text-left font-semibold">
                    Sumber Data Soal
                  </th>
                  <th className="border-b border-slate-200 px-3 py-2 text-right font-semibold w-28">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {columns.map((col, idx) => (
                  <tr key={col.id} className="bg-white">
                    <td className="px-3 py-2 font-mono text-slate-500 tabular-nums">
                      {idx + 1}
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={col.headerLabel}
                        onChange={(e) => {
                          const next = columns.map((c) =>
                            c.id === col.id ? { ...c, headerLabel: e.target.value } : c
                          );
                          onUpdateColumns(next);
                        }}
                        className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-col gap-1.5 sm:flex-row">
                        <select
                          value={col.mappedField}
                          onChange={(e) => {
                            const mappedField = e.target.value as MappedExamField;
                            const next = columns.map((c) =>
                              c.id === col.id ? { ...c, mappedField } : c
                            );
                            onUpdateColumns(next);
                          }}
                          className="rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                        >
                          {FIELD_MAPPING_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        {col.mappedField === 'custom' && (
                          <input
                            type="text"
                            placeholder="Kosongkan untuk isi otomatis sesuai label..."
                            value={col.customValue && col.customValue !== '-' ? col.customValue : ''}
                            onChange={(e) => {
                              const next = columns.map((c) =>
                                c.id === col.id
                                  ? { ...c, customValue: e.target.value }
                                  : c
                              );
                              onUpdateColumns(next);
                            }}
                            className="flex-1 rounded border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveColumn(idx, -1)}
                          title="Geser naik"
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === columns.length - 1}
                          onClick={() => handleMoveColumn(idx, 1)}
                          title="Geser turun"
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={columns.length <= 1}
                          onClick={() =>
                            onUpdateColumns(columns.filter((c) => c.id !== col.id))
                          }
                          title="Hapus kolom"
                          className="rounded p-1 text-red-600 hover:bg-red-50 disabled:opacity-30"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};
