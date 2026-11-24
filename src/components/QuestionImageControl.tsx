import React, { useRef, useState } from 'react';
import { ClipboardPaste, ImagePlus, Trash2 } from 'lucide-react';
import { readAndCompressImageFile } from '../utils/imageHelpers';

interface QuestionImageControlProps {
  questionNumber: number;
  gambarUrl?: string;
  gambarKeterangan?: string;
  gambarPosisi?: 'atas' | 'bawah';
  onChange: (patch: {
    gambarUrl?: string;
    gambarKeterangan?: string;
    gambarPosisi?: 'atas' | 'bawah';
  }) => void;
  compact?: boolean;
}

export const QuestionImageControl: React.FC<QuestionImageControlProps> = ({
  questionNumber,
  gambarUrl,
  gambarKeterangan,
  gambarPosisi = 'atas',
  onChange,
  compact = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFile = async (file: File) => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const dataUrl = await readAndCompressImageFile(file);
      onChange({
        gambarUrl: dataUrl,
        gambarKeterangan:
          gambarKeterangan?.trim() || `Gambar stimulus soal no. ${questionNumber}`,
      });
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Gagal memproses gambar.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasteEvent = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          await handleFile(file);
        }
        return;
      }
    }
  };

  const handleClipboardButton = async () => {
    setErrorMsg(null);
    if (!navigator.clipboard || !navigator.clipboard.read) {
      setErrorMsg(
        'Klik area kotak gambar ini lalu tekan Ctrl+V (atau Cmd+V) untuk menempelkan gambar.'
      );
      return;
    }
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const imgType = item.types.find((t) => t.startsWith('image/'));
        if (imgType) {
          const blob = await item.getType(imgType);
          const file = new File([blob], 'clipboard-image.png', {
            type: imgType,
          });
          await handleFile(file);
          return;
        }
      }
      setErrorMsg(
        'Tidak ada gambar di clipboard. Salin gambar/tangkapan layar terlebih dahulu, lalu coba lagi.'
      );
    } catch {
      setErrorMsg(
        'Izin clipboard dibatasi browser. Klik area kotak gambar ini lalu tekan Ctrl+V.'
      );
    }
  };

  return (
    <div
      tabIndex={0}
      onPaste={handlePasteEvent}
      className="no-print rounded-lg border border-slate-200 bg-slate-50/70 p-3 space-y-2.5 focus:border-blue-600 focus:outline-none"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <ImagePlus className="h-3.5 w-3.5 text-blue-700 shrink-0" />
          <span className="text-xs font-semibold text-slate-800">
            Gambar / Grafik / Ilustrasi Stimulus (Opsional)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            disabled={isLoading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
          >
            <ImagePlus className="h-3.5 w-3.5 text-blue-700" />
            {isLoading ? 'Memuat...' : gambarUrl ? 'Ganti Gambar' : 'Unggah Gambar'}
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={handleClipboardButton}
            title="Tempel gambar dari clipboard (atau tekan Ctrl+V di kotak ini)"
            className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
          >
            <ClipboardPaste className="h-3.5 w-3.5 text-slate-600" />
            Tempel Gambar
          </button>

          {gambarUrl && (
            <button
              type="button"
              onClick={() =>
                onChange({
                  gambarUrl: '',
                  gambarKeterangan: '',
                })
              }
              className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-white px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Hapus
            </button>
          )}
        </div>
      </div>

      {errorMsg && (
        <p className="rounded border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[11px] font-medium text-amber-800">
          {errorMsg}
        </p>
      )}

      {gambarUrl ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 items-start">
          <div className="sm:col-span-5 rounded-md border border-slate-200 bg-white p-2 flex items-center justify-center">
            <img
              src={gambarUrl}
              alt={gambarKeterangan || `Gambar soal ${questionNumber}`}
              className={`${
                compact ? 'max-h-36' : 'max-h-48'
              } w-auto max-w-full object-contain`}
            />
          </div>

          <div className="sm:col-span-7 space-y-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">
                Keterangan / Judul Gambar (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: Gambar 1. Grafik kecepatan terhadap waktu"
                value={gambarKeterangan || ''}
                onChange={(e) => onChange({ gambarKeterangan: e.target.value })}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">
                Letak Gambar pada Naskah Soal
              </label>
              <select
                value={gambarPosisi}
                onChange={(e) =>
                  onChange({
                    gambarPosisi: e.target.value as 'atas' | 'bawah',
                  })
                }
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-700 focus:outline-none"
              >
                <option value="atas">
                  Di Atas Teks Soal (Stimulus Pembuka)
                </option>
                <option value="bawah">
                  Di Bawah Teks Soal (Sebelum Pilihan Jawaban)
                </option>
              </select>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-[11px] text-slate-500">
          Mendukung PNG, JPG, WebP, atau SVG (diagram, grafik, peta, ilustrasi rumus, tabel bergambar). Klik kotak ini lalu tekan <span className="font-mono font-semibold text-slate-700">Ctrl+V</span> untuk menempel tangkapan layar secara langsung.
        </p>
      )}
    </div>
  );
};
