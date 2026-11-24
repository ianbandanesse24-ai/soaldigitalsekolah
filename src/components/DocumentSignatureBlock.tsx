import React from 'react';
import { ExamMetadata } from '../types/exam';

interface DocumentSignatureBlockProps {
  metadata: ExamMetadata;
  className?: string;
}

export const DocumentSignatureBlock: React.FC<DocumentSignatureBlockProps> = ({
  metadata,
  className = '',
}) => {
  const wakasekNama =
    metadata.namaWakasekKurikulum?.trim() ||
    '........................................';
  const wakasekNip = metadata.nipWakasekKurikulum?.trim() || '';

  const ketuaNama =
    metadata.namaKetuaTimPenyusun?.trim() ||
    metadata.penyusun?.trim() ||
    '........................................';
  const ketuaNip =
    metadata.nipKetuaTimPenyusun?.trim() ||
    metadata.nipPenyusun?.trim() ||
    '';

  const kepsekNama =
    metadata.namaKepalaSekolah?.trim() ||
    '........................................';
  const kepsekNip = metadata.nipKepalaSekolah?.trim() || '';

  return (
    <div
      className={`mt-8 border-t border-slate-200 pt-6 text-xs text-slate-800 print-break-inside-avoid ${className}`}
    >
      {/* Baris Atas: Kiri (Mengetahui, Wakasek Kurikulum) & Kanan (Ketua Tim Penyusun) */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 print:grid-cols-2">
        <div className="sm:pl-4 print:pl-4">
          <p className="text-slate-700">Mengetahui,</p>
          <p className="font-semibold text-slate-900">Wakasek Kurikulum,</p>
          <div className="h-16" />
          <p className="font-semibold text-slate-900 underline underline-offset-4">
            {wakasekNama}
          </p>
          {wakasekNip && (
            <p className="mt-0.5 font-mono text-slate-600 tabular-nums">
              NIP. {wakasekNip}
            </p>
          )}
        </div>

        <div className="sm:pl-24 print:pl-24">
          <p className="invisible select-none" aria-hidden="true">
            Mengetahui,
          </p>
          <p className="font-semibold text-slate-900">Ketua Tim Penyusun,</p>
          <div className="h-16" />
          <p className="font-semibold text-slate-900 underline underline-offset-4">
            {ketuaNama}
          </p>
          {ketuaNip && (
            <p className="mt-0.5 font-mono text-slate-600 tabular-nums">
              NIP. {ketuaNip}
            </p>
          )}
        </div>
      </div>

      {/* Baris Bawah Tengah: Menyetujui, Kepala Sekolah */}
      <div className="mt-8 flex justify-center">
        <div className="w-72 text-center">
          <p className="text-slate-700">Menyetujui,</p>
          <p className="font-semibold text-slate-900">Kepala Sekolah,</p>
          <div className="h-16" />
          <p className="font-semibold text-slate-900 underline underline-offset-4">
            {kepsekNama}
          </p>
          {kepsekNip && (
            <p className="mt-0.5 font-mono text-slate-600 tabular-nums">
              NIP. {kepsekNip}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
