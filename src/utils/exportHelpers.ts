import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  ExamMetadata,
  ExamProjectState,
  QuestionItem,
  QuestionType,
  ReferenceColumnDef,
} from '../types/exam';
import {
  SHORT_LABEL_JENIS_SOAL,
  tierFromCognitiveLevel,
} from '../data/defaultExamData';
import {
  generateAutoCustomFieldValue,
  generateDefaultPembahasan,
  generateDefaultTujuanPembelajaran,
  normalizeCustomFieldKey,
} from './autoFillAcuan';
import { measureImageForPdf } from './imageHelpers';

export function resolveQuestionFieldValue(
  question: QuestionItem,
  metadata: ExamMetadata,
  col: ReferenceColumnDef
): string {
  switch (col.mappedField) {
    case 'nomor':
      return String(question.nomor);
    case 'kdCp':
      return question.kdCp || '-';
    case 'tujuanPembelajaran':
      return (
        question.tujuanPembelajaran ||
        generateDefaultTujuanPembelajaran(question, metadata)
      );
    case 'materi':
      return question.materi || '-';
    case 'kelasSemester':
      return `${metadata.kelas} / ${metadata.fase}`;
    case 'indikator':
      return question.indikator || '-';
    case 'levelKognitif':
      return question.levelKognitif;
    case 'tingkatanSoal':
      return question.tingkatanSoal || tierFromCognitiveLevel(question.levelKognitif);
    case 'type':
      return SHORT_LABEL_JENIS_SOAL[question.type];
    case 'bobot':
      return String(question.bobot);
    case 'sumberBuku':
      return question.sumberBuku || '-';
    case 'rumusanSoal':
      return question.rumusanSoal || '-';
    case 'kunci':
      if (question.type === 'PG') return question.kunciPg;
      if (question.type === 'JAWABAN_SINGKAT') return question.kunciSingkat;
      if (question.type === 'MENJODOHKAN') {
        return question.pasanganMenjodohkan
          .map((p) => `${p.premise} -> ${p.match}`)
          .join('; ');
      }
      return question.kunciEsai;
    case 'pembahasan':
      return question.pembahasan || generateDefaultPembahasan(question, metadata);
    case 'catatanTelaah':
      return question.catatanTelaah || '-';
    case 'mataPelajaran':
      return metadata.mataPelajaran || '-';
    case 'kurikulum':
      return metadata.kurikulum || '-';
    case 'namaSekolah':
      return metadata.namaSekolah || '-';
    case 'penyusun':
      return metadata.penyusun || '-';
    case 'tahunAjaran':
      return metadata.tahunAjaran || '-';
    case 'alokasiWaktu':
      return metadata.alokasiWaktu || '-';
    case 'custom':
    default: {
      const key = normalizeCustomFieldKey(col.headerLabel);
      const saved = question.customFields?.[key];
      if (saved && saved.trim() !== '-' && saved.trim().length > 0) {
        return saved;
      }
      if (col.customValue && col.customValue !== '-' && col.customValue.trim().length > 0) {
        return col.customValue;
      }
      return generateAutoCustomFieldValue(col.headerLabel, question, metadata);
    }
  }
}

let cachedRegularFontBase64: string | null = null;
let cachedBoldFontBase64: string | null = null;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = '';
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

async function ensurePdfUnicodeFont(doc: jsPDF): Promise<'DejaVuSans' | 'helvetica'> {
  try {
    if (!cachedRegularFontBase64) {
      const res = await fetch('/fonts/DejaVuSans.ttf');
      if (!res.ok) throw new Error('Font reguler gagal dimuat');
      cachedRegularFontBase64 = arrayBufferToBase64(await res.arrayBuffer());
    }
    if (!cachedBoldFontBase64) {
      const resBold = await fetch('/fonts/DejaVuSans-Bold.ttf');
      if (!resBold.ok) throw new Error('Font tebal gagal dimuat');
      cachedBoldFontBase64 = arrayBufferToBase64(await resBold.arrayBuffer());
    }

    doc.addFileToVFS('DejaVuSans.ttf', cachedRegularFontBase64);
    doc.addFont('DejaVuSans.ttf', 'DejaVuSans', 'normal');
    doc.addFileToVFS('DejaVuSans-Bold.ttf', cachedBoldFontBase64);
    doc.addFont('DejaVuSans-Bold.ttf', 'DejaVuSans', 'bold');
    return 'DejaVuSans';
  } catch {
    return 'helvetica';
  }
}

export function sanitizePdfText(text: string, allowUnicode = false): string {
  const raw = String(text || '').replace(/\r/g, '');
  if (allowUnicode) {
    return raw;
  }
  return raw
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/×/g, 'x')
    .replace(/÷/g, '/')
    .replace(/√/g, 'akar ')
    .replace(/°/g, ' derajat')
    .replace(/→/g, '->')
    .replace(/·/g, '-')
    .replace(/[–—]/g, '-');
}

export function getShuffledRightColumn(q: QuestionItem): {
  letter: string;
  match: string;
  originalIndex: number;
}[] {
  const indexed = q.pasanganMenjodohkan.map((p, idx) => ({
    match: p.match,
    originalIndex: idx,
  }));
  if (indexed.length > 1) {
    const shifted = [...indexed.slice(1), indexed[0]];
    if (shifted.length > 3) {
      const tmp = shifted[1];
      shifted[1] = shifted[2];
      shifted[2] = tmp;
    }
    return shifted.map((item, i) => ({
      letter: String.fromCharCode(65 + i),
      ...item,
    }));
  }
  return indexed.map((item, i) => ({
    letter: String.fromCharCode(65 + i),
    ...item,
  }));
}

function getSafeFileSubject(metadata: ExamMetadata): string {
  return (metadata.mataPelajaran || 'Paket_Soal').replace(/[^a-zA-Z0-9]+/g, '_');
}

function getSignatureOfficials(metadata: ExamMetadata) {
  return {
    wakasekNama:
      metadata.namaWakasekKurikulum?.trim() ||
      '........................................',
    wakasekNip: metadata.nipWakasekKurikulum?.trim() || '',
    ketuaNama:
      metadata.namaKetuaTimPenyusun?.trim() ||
      metadata.penyusun?.trim() ||
      '........................................',
    ketuaNip:
      metadata.nipKetuaTimPenyusun?.trim() ||
      metadata.nipPenyusun?.trim() ||
      '',
    kepsekNama:
      metadata.namaKepalaSekolah?.trim() ||
      '........................................',
    kepsekNip: metadata.nipKepalaSekolah?.trim() || '',
  };
}

export function buildDocumentSignatureHtml(metadata: ExamMetadata): string {
  const sig = getSignatureOfficials(metadata);
  return `
    <table class="no-border" style="margin-top:22pt; width:100%; page-break-inside:avoid;">
      <tr>
        <td style="width:50%; vertical-align:top; padding-left:12pt;">
          Mengetahui,<br/>
          <strong>Wakasek Kurikulum,</strong><br/><br/><br/><br/>
          <u><strong>${escapeHtml(sig.wakasekNama)}</strong></u>${
    sig.wakasekNip ? `<br/>NIP. ${escapeHtml(sig.wakasekNip)}` : ''
  }
        </td>
        <td style="width:50%; vertical-align:top; padding-left:16%;">
          &nbsp;<br/>
          <strong>Ketua Tim Penyusun,</strong><br/><br/><br/><br/>
          <u><strong>${escapeHtml(sig.ketuaNama)}</strong></u>${
    sig.ketuaNip ? `<br/>NIP. ${escapeHtml(sig.ketuaNip)}` : ''
  }
        </td>
      </tr>
      <tr>
        <td colspan="2" style="text-align:center; padding-top:18pt; vertical-align:top;">
          Menyetujui,<br/>
          <strong>Kepala Sekolah,</strong><br/><br/><br/><br/>
          <u><strong>${escapeHtml(sig.kepsekNama)}</strong></u>${
    sig.kepsekNip ? `<br/>NIP. ${escapeHtml(sig.kepsekNip)}` : ''
  }
        </td>
      </tr>
    </table>
  `;
}

function appendSignatureRowsToSheet(
  rows: (string | number)[][],
  metadata: ExamMetadata,
  rightColIdx: number
): void {
  const sig = getSignatureOfficials(metadata);
  const safeRight = Math.max(1, rightColIdx);
  const centerCol = Math.max(0, Math.floor(safeRight / 2));

  const makeRow = (entries: [number, string][]): string[] => {
    const arr = new Array<string>(safeRight + 1).fill('');
    for (const [col, val] of entries) {
      arr[col] = val;
    }
    return arr;
  };

  rows.push([]);
  rows.push(makeRow([[0, 'Mengetahui,']]));
  rows.push(
    makeRow([
      [0, 'Wakasek Kurikulum,'],
      [safeRight, 'Ketua Tim Penyusun,'],
    ])
  );
  rows.push([]);
  rows.push([]);
  rows.push([]);
  rows.push(
    makeRow([
      [0, sig.wakasekNama],
      [safeRight, sig.ketuaNama],
    ])
  );
  if (sig.wakasekNip || sig.ketuaNip) {
    rows.push(
      makeRow([
        [0, sig.wakasekNip ? `NIP. ${sig.wakasekNip}` : ''],
        [safeRight, sig.ketuaNip ? `NIP. ${sig.ketuaNip}` : ''],
      ])
    );
  }
  rows.push([]);
  rows.push(makeRow([[centerCol, 'Menyetujui,']]));
  rows.push(makeRow([[centerCol, 'Kepala Sekolah,']]));
  rows.push([]);
  rows.push([]);
  rows.push([]);
  rows.push(makeRow([[centerCol, sig.kepsekNama]]));
  if (sig.kepsekNip) {
    rows.push(makeRow([[centerCol, `NIP. ${sig.kepsekNip}`]]));
  }
}

function appendSignatureBlockToPdf(
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number,
  fontName: 'DejaVuSans' | 'helvetica',
  unicodeReady: boolean,
  metadata: ExamMetadata
): void {
  const sig = getSignatureOfficials(metadata);
  let y = startY;
  const neededHeight = 68;
  if (y + neededHeight > pageHeight - 12) {
    doc.addPage();
    y = 18;
  }

  const leftX = margin + 6;
  const rightX = Math.max(pageWidth / 2 + 12, pageWidth - margin - 64);
  const centerX = pageWidth / 2;

  doc.setFontSize(8.5);
  doc.setFont(fontName, 'normal');
  doc.text('Mengetahui,', leftX, y);
  doc.setFont(fontName, 'bold');
  doc.text('Wakasek Kurikulum,', leftX, y + 4.2);
  doc.text('Ketua Tim Penyusun,', rightX, y + 4.2);

  const nameY = y + 20;
  const wakasekText = sanitizePdfText(sig.wakasekNama, unicodeReady);
  const ketuaText = sanitizePdfText(sig.ketuaNama, unicodeReady);
  doc.text(wakasekText, leftX, nameY);
  const wWidth = doc.getTextWidth(wakasekText);
  doc.setLineWidth(0.25);
  doc.line(leftX, nameY + 0.8, leftX + wWidth, nameY + 0.8);

  doc.text(ketuaText, rightX, nameY);
  const kWidth = doc.getTextWidth(ketuaText);
  doc.line(rightX, nameY + 0.8, rightX + kWidth, nameY + 0.8);

  doc.setFont(fontName, 'normal');
  if (sig.wakasekNip) {
    doc.text(sanitizePdfText(`NIP. ${sig.wakasekNip}`, unicodeReady), leftX, nameY + 4.2);
  }
  if (sig.ketuaNip) {
    doc.text(sanitizePdfText(`NIP. ${sig.ketuaNip}`, unicodeReady), rightX, nameY + 4.2);
  }

  // Baris Bawah Tengah: Menyetujui, Kepala Sekolah
  const kepsekTopY = nameY + 12;
  doc.setFont(fontName, 'normal');
  doc.text('Menyetujui,', centerX, kepsekTopY, { align: 'center' });
  doc.setFont(fontName, 'bold');
  doc.text('Kepala Sekolah,', centerX, kepsekTopY + 4.2, { align: 'center' });

  const kepsekNameY = kepsekTopY + 20;
  const kepsekText = sanitizePdfText(sig.kepsekNama, unicodeReady);
  doc.text(kepsekText, centerX, kepsekNameY, { align: 'center' });
  const ksWidth = doc.getTextWidth(kepsekText);
  doc.line(centerX - ksWidth / 2, kepsekNameY + 0.8, centerX + ksWidth / 2, kepsekNameY + 0.8);

  if (sig.kepsekNip) {
    doc.setFont(fontName, 'normal');
    doc.text(sanitizePdfText(`NIP. ${sig.kepsekNip}`, unicodeReady), centerX, kepsekNameY + 4.2, {
      align: 'center',
    });
  }
}

// ==========================================
// 1. KISI-KISI SOAL (PDF, WORD, EXCEL)
// ==========================================

export function downloadKisiKisiExcel(
  metadata: ExamMetadata,
  questions: QuestionItem[],
  columns: ReferenceColumnDef[]
): void {
  const headerMeta: (string | number)[][] = [
    ['KISI-KISI PENULISAN SOAL'],
    ['Satuan Pendidikan', `: ${metadata.namaSekolah}`],
    ['Judul Penilaian', `: ${metadata.judulUjian}`],
    ['Mata Pelajaran', `: ${metadata.mataPelajaran}`],
    ['Kelas / Fase', `: ${metadata.kelas} / ${metadata.fase}`],
    ['Kurikulum', `: ${metadata.kurikulum}`],
    ['Tahun Ajaran', `: ${metadata.tahunAjaran}`],
    ['Penyusun', `: ${metadata.penyusun}`],
    [],
    columns.map((c) => c.headerLabel),
  ];

  const dataRows = questions.map((q) =>
    columns.map((col) => resolveQuestionFieldValue(q, metadata, col))
  );

  const allRows: (string | number)[][] = [...headerMeta, ...dataRows];
  appendSignatureRowsToSheet(
    allRows,
    metadata,
    Math.max(1, columns.length - 2)
  );

  const ws = XLSX.utils.aoa_to_sheet(allRows);
  ws['!cols'] = columns.map((c) => ({
    wch:
      c.mappedField === 'nomor' ||
      c.mappedField === 'levelKognitif' ||
      c.mappedField === 'bobot'
        ? 12
        : c.mappedField === 'indikator' || c.mappedField === 'kdCp'
        ? 38
        : 24,
  }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Kisi-Kisi Soal');
  XLSX.writeFile(wb, `Kisi_Kisi_${getSafeFileSubject(metadata)}.xlsx`);
}

export async function downloadKisiKisiPdf(
  metadata: ExamMetadata,
  questions: QuestionItem[],
  columns: ReferenceColumnDef[]
): Promise<void> {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const fontName = await ensurePdfUnicodeFont(doc);
  const unicodeReady = fontName === 'DejaVuSans';

  doc.setFontSize(13);
  doc.setFont(fontName, 'bold');
  doc.text('KISI-KISI PENULISAN SOAL', 148.5, 14, { align: 'center' });

  doc.setFontSize(9.5);
  doc.setFont(fontName, 'normal');
  doc.text(
    sanitizePdfText(`${metadata.judulUjian} - ${metadata.kurikulum}`, unicodeReady),
    148.5,
    20,
    { align: 'center' }
  );

  doc.setFontSize(8.5);
  doc.text(
    sanitizePdfText(`Satuan Pendidikan : ${metadata.namaSekolah}`, unicodeReady),
    14,
    28
  );
  doc.text(
    sanitizePdfText(`Mata Pelajaran     : ${metadata.mataPelajaran}`, unicodeReady),
    14,
    33
  );
  doc.text(
    sanitizePdfText(`Kelas / Fase       : ${metadata.kelas} / ${metadata.fase}`, unicodeReady),
    155,
    28
  );
  doc.text(
    sanitizePdfText(`Jumlah Soal        : ${questions.length} Butir`, unicodeReady),
    155,
    33
  );

  autoTable(doc, {
    startY: 38,
    head: [columns.map((c) => sanitizePdfText(c.headerLabel, unicodeReady))],
    body: questions.map((q) =>
      columns.map((col) =>
        sanitizePdfText(resolveQuestionFieldValue(q, metadata, col), unicodeReady)
      )
    ),
    styles: {
      font: fontName,
      fontSize: 8,
      cellPadding: 2.2,
      valign: 'top',
      lineColor: [203, 213, 225],
      lineWidth: 0.2,
    },
    headStyles: {
      font: fontName,
      fillColor: [241, 245, 249],
      textColor: [15, 23, 42],
      fontStyle: 'bold',
    },
    margin: { left: 14, right: 14 },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalY = ((doc as any).lastAutoTable?.finalY || 120) + 10;
  appendSignatureBlockToPdf(
    doc,
    finalY,
    14,
    doc.internal.pageSize.getWidth(),
    doc.internal.pageSize.getHeight(),
    fontName,
    unicodeReady,
    metadata
  );

  doc.save(`Kisi_Kisi_${getSafeFileSubject(metadata)}.pdf`);
}

// ==========================================
// 2. KARTU SOAL (PDF, WORD, EXCEL)
// ==========================================

export function downloadKartuSoalExcel(
  metadata: ExamMetadata,
  questions: QuestionItem[],
  fields: ReferenceColumnDef[]
): void {
  const rows: (string | number)[][] = [
    ['KARTU SOAL - ' + metadata.kurikulum.toUpperCase()],
    ['Satuan Pendidikan', metadata.namaSekolah],
    ['Mata Pelajaran', metadata.mataPelajaran],
    ['Kelas / Fase', `${metadata.kelas} / ${metadata.fase}`],
    [],
  ];

  questions.forEach((q) => {
    rows.push([`KARTU SOAL NOMOR ${q.nomor}`, SHORT_LABEL_JENIS_SOAL[q.type]]);
    fields.forEach((f) => {
      rows.push([f.headerLabel, resolveQuestionFieldValue(q, metadata, f)]);
    });
    rows.push(['Rumusan Butir Soal', q.rumusanSoal]);
    if (q.gambarUrl) {
      rows.push([
        'Lampiran Gambar',
        q.gambarKeterangan?.trim()
          ? `[Terlampir Gambar: ${q.gambarKeterangan.trim()}]`
          : '[Terlampir Gambar Stimulus]',
      ]);
    }
    if (q.type === 'PG') {
      const keys = (['A', 'B', 'C', 'D', ...(q.useOptionE ? ['E'] : [])] as const);
      keys.forEach((k) => {
        rows.push([`Opsi ${k}`, q.opsiPg[k as 'A' | 'B' | 'C' | 'D' | 'E']]);
      });
    } else if (q.type === 'MENJODOHKAN') {
      q.pasanganMenjodohkan.forEach((p, idx) => {
        rows.push([`Pasangan ${idx + 1}`, `${p.premise} -> ${p.match}`]);
      });
    }
    rows.push([
      'Kunci Jawaban / Pedoman',
      resolveQuestionFieldValue(q, metadata, {
        id: 'k',
        headerLabel: 'Kunci',
        mappedField: 'kunci',
      }),
    ]);
    rows.push(['Catatan Telaah', q.catatanTelaah || '-']);
    rows.push([]);
  });

  appendSignatureRowsToSheet(rows, metadata, 1);

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 36 }, { wch: 76 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Kartu Soal');
  XLSX.writeFile(wb, `Kartu_Soal_${getSafeFileSubject(metadata)}.xlsx`);
}

export async function downloadKartuSoalPdf(
  metadata: ExamMetadata,
  questions: QuestionItem[],
  fields: ReferenceColumnDef[]
): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const fontName = await ensurePdfUnicodeFont(doc);
  const unicodeReady = fontName === 'DejaVuSans';

  for (let idx = 0; idx < questions.length; idx++) {
    const q = questions[idx];
    if (idx > 0) doc.addPage();

    doc.setFontSize(12);
    doc.setFont(fontName, 'bold');
    doc.text(
      sanitizePdfText(
        `KARTU SOAL NOMOR ${q.nomor} (${SHORT_LABEL_JENIS_SOAL[q.type].toUpperCase()})`,
        unicodeReady
      ),
      105,
      15,
      { align: 'center' }
    );

    doc.setFontSize(9);
    doc.setFont(fontName, 'normal');
    doc.text(
      sanitizePdfText(`${metadata.namaSekolah} - ${metadata.kurikulum}`, unicodeReady),
      105,
      21,
      { align: 'center' }
    );

    let rumusanBlock = q.rumusanSoal;
    if (q.type === 'PG') {
      const keys = (['A', 'B', 'C', 'D', ...(q.useOptionE ? ['E'] : [])] as const);
      rumusanBlock +=
        '\n' +
        keys
          .map((k) => `${k}. ${q.opsiPg[k as 'A' | 'B' | 'C' | 'D' | 'E']}`)
          .join('\n');
    } else if (q.type === 'MENJODOHKAN') {
      rumusanBlock +=
        '\n' +
        q.pasanganMenjodohkan
          .map((p, i) => `${i + 1}. ${p.premise}  →  ${p.match}`)
          .join('\n');
    }

    const kunciText = resolveQuestionFieldValue(q, metadata, {
      id: 'k',
      headerLabel: 'Kunci',
      mappedField: 'kunci',
    });

    const bodyRows: [string, string][] = [
      ['Mata Pelajaran', metadata.mataPelajaran],
      ['Kelas / Fase', `${metadata.kelas} / ${metadata.fase}`],
      ['Kurikulum', metadata.kurikulum],
      ...fields.map(
        (f): [string, string] => [
          f.headerLabel,
          resolveQuestionFieldValue(q, metadata, f),
        ]
      ),
      ['Rumusan Butir Soal', rumusanBlock],
      ['Kunci Jawaban / Pedoman', kunciText],
      ['Pembahasan', q.pembahasan || '-'],
      ['Catatan Telaah', q.catatanTelaah || '-'],
    ];

    autoTable(doc, {
      startY: 26,
      body: bodyRows.map(([k, v]) => [
        sanitizePdfText(k, unicodeReady),
        sanitizePdfText(v, unicodeReady),
      ]),
      columnStyles: {
        0: { cellWidth: 58, fontStyle: 'bold', fillColor: [248, 250, 252] },
        1: { cellWidth: 124 },
      },
      styles: {
        font: fontName,
        fontSize: 8.5,
        cellPadding: 2.5,
        textColor: [15, 23, 42],
        lineColor: [203, 213, 225],
        lineWidth: 0.25,
        valign: 'top',
      },
      margin: { left: 14, right: 14 },
    });

    if (q.gambarUrl) {
      const imgPayload = await measureImageForPdf(q.gambarUrl);
      if (imgPayload) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let imgY = ((doc as any).lastAutoTable?.finalY || 180) + 6;
        const pageH = doc.internal.pageSize.getHeight();
        const maxImgW = 90;
        const maxImgH = 48;
        const scale = Math.min(maxImgW / imgPayload.width, maxImgH / imgPayload.height, 1);
        const drawW = Math.max(18, imgPayload.width * scale);
        const drawH = Math.max(14, imgPayload.height * scale);

        if (imgY + drawH + 12 > pageH - 15) {
          doc.addPage();
          imgY = 18;
        }

        doc.setFontSize(8);
        doc.setFont(fontName, 'bold');
        doc.text('Lampiran Gambar Stimulus:', 14, imgY);
        imgY += 3;
        doc.addImage(imgPayload.dataUrl, imgPayload.format, 14, imgY, drawW, drawH);
        imgY += drawH + 4;
        if (q.gambarKeterangan?.trim()) {
          doc.setFont(fontName, 'normal');
          doc.text(sanitizePdfText(q.gambarKeterangan.trim(), unicodeReady), 14, imgY);
        }
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lastCardY = ((doc as any).lastAutoTable?.finalY || 180) + 12;
  appendSignatureBlockToPdf(
    doc,
    lastCardY,
    14,
    doc.internal.pageSize.getWidth(),
    doc.internal.pageSize.getHeight(),
    fontName,
    unicodeReady,
    metadata
  );

  doc.save(`Kartu_Soal_${getSafeFileSubject(metadata)}.pdf`);
}

// ==========================================
// 3. KUMPULAN SOAL (PDF, WORD, EXCEL)
// ==========================================

export function downloadKumpulanSoalExcel(
  metadata: ExamMetadata,
  questions: QuestionItem[],
  showAnswerKey: boolean
): void {
  const soalRows: (string | number)[][] = [
    ['KUMPULAN SOAL - ' + metadata.judulUjian.toUpperCase()],
    ['Mata Pelajaran', metadata.mataPelajaran],
    ['Kelas / Fase', `${metadata.kelas} / ${metadata.fase}`],
    ['Kurikulum', metadata.kurikulum],
    [],
    ['No.', 'Tingkatan', 'Jenis Soal', 'Bab / Materi', 'Rumusan Soal', 'Pilihan / Pasangan', 'Bobot'],
  ];

  questions.forEach((q, idx) => {
    let detail = '';
    if (q.type === 'PG') {
      const keys = (['A', 'B', 'C', 'D', ...(q.useOptionE ? ['E'] : [])] as const);
      detail = keys
        .map((k) => `${k}. ${q.opsiPg[k as 'A' | 'B' | 'C' | 'D' | 'E']}`)
        .join(' | ');
    } else if (q.type === 'MENJODOHKAN') {
      detail = q.pasanganMenjodohkan
        .map((p, i) => `${i + 1}. ${p.premise} (${p.match})`)
        .join(' | ');
    } else if (q.type === 'JAWABAN_SINGKAT') {
      detail = 'Isian Singkat';
    } else {
      detail = 'Uraian / Esai';
    }

    const tier = q.tingkatanSoal || tierFromCognitiveLevel(q.levelKognitif);

    const rumusanWithImgNote = q.gambarUrl
      ? `${q.rumusanSoal}\n[Gambar Stimulus: ${q.gambarKeterangan || 'Terlampir'}]`
      : q.rumusanSoal;

    soalRows.push([
      idx + 1,
      tier,
      SHORT_LABEL_JENIS_SOAL[q.type],
      q.materi,
      rumusanWithImgNote,
      detail,
      q.bobot,
    ]);
  });

  appendSignatureRowsToSheet(soalRows, metadata, 5);

  const wb = XLSX.utils.book_new();
  const wsSoal = XLSX.utils.aoa_to_sheet(soalRows);
  wsSoal['!cols'] = [
    { wch: 6 },
    { wch: 12 },
    { wch: 18 },
    { wch: 28 },
    { wch: 48 },
    { wch: 48 },
    { wch: 8 },
  ];
  XLSX.utils.book_append_sheet(wb, wsSoal, 'Kumpulan Soal');

  if (showAnswerKey) {
    const keyRows: (string | number)[][] = [
      ['KUNCI JAWABAN & PEDOMAN PENSKORAN'],
      ['No.', 'Tingkatan', 'Jenis Soal', 'Kunci Jawaban / Pedoman', 'Pembahasan', 'Bobot'],
    ];
    questions.forEach((q, idx) => {
      const tier = q.tingkatanSoal || tierFromCognitiveLevel(q.levelKognitif);
      keyRows.push([
        idx + 1,
        tier,
        SHORT_LABEL_JENIS_SOAL[q.type],
        resolveQuestionFieldValue(q, metadata, {
          id: 'k',
          headerLabel: 'Kunci',
          mappedField: 'kunci',
        }),
        q.pembahasan || '-',
        q.bobot,
      ]);
    });
    const wsKey = XLSX.utils.aoa_to_sheet(keyRows);
    wsKey['!cols'] = [
      { wch: 6 },
      { wch: 12 },
      { wch: 18 },
      { wch: 44 },
      { wch: 40 },
      { wch: 8 },
    ];
    XLSX.utils.book_append_sheet(wb, wsKey, 'Kunci Jawaban');
  }

  XLSX.writeFile(wb, `Kumpulan_Soal_${getSafeFileSubject(metadata)}.xlsx`);
}

export async function downloadKumpulanSoalPdf(
  metadata: ExamMetadata,
  questions: QuestionItem[],
  options: {
    groupByType: boolean;
    showAnswerKey: boolean;
    showStudentHeader: boolean;
    showTierLabel?: boolean;
  }
): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const fontName = await ensurePdfUnicodeFont(doc);
  const unicodeReady = fontName === 'DejaVuSans';

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const maxWidth = pageWidth - margin * 2;
  let y = 15;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - 16) {
      doc.addPage();
      y = 16;
    }
  };

  // Kop Surat
  doc.setFont(fontName, 'bold');
  doc.setFontSize(12);
  doc.text(
    sanitizePdfText(metadata.namaSekolah.toUpperCase(), unicodeReady),
    pageWidth / 2,
    y,
    { align: 'center' }
  );
  y += 5.5;
  doc.setFontSize(11);
  doc.text(
    sanitizePdfText(metadata.judulUjian.toUpperCase(), unicodeReady),
    pageWidth / 2,
    y,
    { align: 'center' }
  );
  y += 5;
  doc.setFont(fontName, 'normal');
  doc.setFontSize(9);
  doc.text(
    sanitizePdfText(`${metadata.kurikulum} - Tahun Ajaran ${metadata.tahunAjaran}`, unicodeReady),
    pageWidth / 2,
    y,
    { align: 'center' }
  );
  y += 3;
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // Identitas
  doc.setFontSize(9);
  doc.text(sanitizePdfText(`Mata Pelajaran : ${metadata.mataPelajaran}`, unicodeReady), margin, y);
  doc.text(sanitizePdfText(`Alokasi Waktu : ${metadata.alokasiWaktu}`, unicodeReady), 115, y);
  y += 4.5;
  doc.text(
    sanitizePdfText(`Kelas / Fase   : ${metadata.kelas} / ${metadata.fase}`, unicodeReady),
    margin,
    y
  );
  doc.text(sanitizePdfText(`Jumlah Soal   : ${questions.length} Butir`, unicodeReady), 115, y);
  y += 6;

  if (options.showStudentHeader) {
    doc.setLineWidth(0.2);
    doc.rect(margin, y, maxWidth, 9);
    doc.text('Nama : ...............................................', margin + 3, y + 5.8);
    doc.text('No. Absen / Kelas : .............................', 115, y + 5.8);
    y += 13;
  }

  // Petunjuk
  doc.setFont(fontName, 'bold');
  doc.text('Petunjuk Pengerjaan:', margin, y);
  y += 4.5;
  doc.setFont(fontName, 'normal');
  const petunjukLines = doc.splitTextToSize(
    sanitizePdfText(metadata.petunjukUmum, unicodeReady),
    maxWidth
  );
  doc.text(petunjukLines, margin, y);
  y += petunjukLines.length * 4.2 + 5;

  const renderQuestionImagePdf = async (q: QuestionItem) => {
    if (!q.gambarUrl) return;
    const imgPayload = await measureImageForPdf(q.gambarUrl);
    if (!imgPayload) return;

    const maxImgW = Math.min(98, maxWidth - 10);
    const maxImgH = 54;
    const scale = Math.min(maxImgW / imgPayload.width, maxImgH / imgPayload.height, 1);
    const drawW = Math.max(20, imgPayload.width * scale);
    const drawH = Math.max(14, imgPayload.height * scale);

    ensureSpace(drawH + (q.gambarKeterangan?.trim() ? 9 : 4));
    doc.addImage(imgPayload.dataUrl, imgPayload.format, margin + 5, y, drawW, drawH);
    y += drawH + 3.5;
    if (q.gambarKeterangan?.trim()) {
      doc.setFont(fontName, 'normal');
      doc.setFontSize(8);
      doc.text(sanitizePdfText(q.gambarKeterangan.trim(), unicodeReady), margin + 5, y);
      y += 4;
    }
  };

  const renderSingleQuestionPdf = async (q: QuestionItem, displayNo: number) => {
    const tier = q.tingkatanSoal || tierFromCognitiveLevel(q.levelKognitif);
    const prefix = options.showTierLabel !== false ? `${displayNo}. [${tier}] ` : `${displayNo}. `;
    const qLines = doc.splitTextToSize(
      sanitizePdfText(`${prefix}${q.rumusanSoal}`, unicodeReady),
      maxWidth
    );
    ensureSpace(qLines.length * 4.5 + 18);

    if (q.gambarUrl && q.gambarPosisi !== 'bawah') {
      await renderQuestionImagePdf(q);
    }

    doc.setFont(fontName, 'normal');
    doc.setFontSize(9.5);
    doc.text(qLines, margin, y);
    y += qLines.length * 4.4 + 1.5;

    if (q.gambarUrl && q.gambarPosisi === 'bawah') {
      await renderQuestionImagePdf(q);
    }

    if (q.type === 'PG') {
      const keys = (['A', 'B', 'C', 'D', ...(q.useOptionE ? ['E'] : [])] as const);
      for (const k of keys) {
        const optLines = doc.splitTextToSize(
          sanitizePdfText(`${k}. ${q.opsiPg[k as 'A' | 'B' | 'C' | 'D' | 'E']}`, unicodeReady),
          maxWidth - 6
        );
        ensureSpace(optLines.length * 4.2 + 2);
        doc.text(optLines, margin + 5, y);
        y += optLines.length * 4.2;
      }
      y += 3;
    } else if (q.type === 'JAWABAN_SINGKAT') {
      ensureSpace(7);
      doc.text('Jawaban: ............................................................', margin + 5, y + 1);
      y += 7;
    } else if (q.type === 'MENJODOHKAN') {
      const rightCol = getShuffledRightColumn(q);
      autoTable(doc, {
        startY: y,
        head: [['Pernyataan (Kolom A)', 'Pasangan', 'Pilihan Jawaban (Kolom B)']],
        body: q.pasanganMenjodohkan.map((p, i) => [
          sanitizePdfText(`${i + 1}. ${p.premise}`, unicodeReady),
          '( .... )',
          rightCol[i]
            ? sanitizePdfText(`${rightCol[i].letter}. ${rightCol[i].match}`, unicodeReady)
            : '',
        ]),
        styles: {
          font: fontName,
          fontSize: 8.5,
          cellPadding: 2,
          lineColor: [203, 213, 225],
          lineWidth: 0.2,
        },
        headStyles: {
          font: fontName,
          fillColor: [241, 245, 249],
          textColor: [15, 23, 42],
        },
        margin: { left: margin + 4, right: margin },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      y = ((doc as any).lastAutoTable?.finalY || y + 20) + 5;
    } else {
      ensureSpace(16);
      doc.setDrawColor(180);
      doc.line(margin + 5, y + 5, pageWidth - margin, y + 5);
      doc.line(margin + 5, y + 11, pageWidth - margin, y + 11);
      y += 15;
    }
  };

  if (options.groupByType) {
    const sections: { type: QuestionType; title: string }[] = [
      { type: 'PG', title: 'BAGIAN I. PILIHAN GANDA' },
      { type: 'JAWABAN_SINGKAT', title: 'BAGIAN II. JAWABAN SINGKAT' },
      { type: 'MENJODOHKAN', title: 'BAGIAN III. MENJODOHKAN' },
      { type: 'ESAY', title: 'BAGIAN IV. URAIAN / ESAI' },
    ];
    let runningNo = 1;
    for (const sec of sections) {
      const items = questions.filter((q) => q.type === sec.type);
      if (items.length === 0) continue;
      ensureSpace(14);
      doc.setFont(fontName, 'bold');
      doc.setFontSize(10);
      doc.text(sec.title, margin, y);
      y += 5.5;
      for (const item of items) {
        await renderSingleQuestionPdf(item, runningNo++);
      }
      y += 2;
    }
  } else {
    for (let idx = 0; idx < questions.length; idx++) {
      await renderSingleQuestionPdf(questions[idx], idx + 1);
    }
  }

  if (options.showAnswerKey && questions.length > 0) {
    doc.addPage();
    doc.setFont(fontName, 'bold');
    doc.setFontSize(11);
    doc.text('KUNCI JAWABAN & PEDOMAN PENSKORAN', pageWidth / 2, 16, {
      align: 'center',
    });

    autoTable(doc, {
      startY: 22,
      head: [['No.', 'Tingkatan', 'Jenis Soal', 'Kunci Jawaban / Pedoman', 'Bobot']],
      body: questions.map((q, idx) => [
        String(idx + 1),
        q.tingkatanSoal || tierFromCognitiveLevel(q.levelKognitif),
        SHORT_LABEL_JENIS_SOAL[q.type],
        sanitizePdfText(
          resolveQuestionFieldValue(q, metadata, {
            id: 'k',
            headerLabel: 'Kunci',
            mappedField: 'kunci',
          }),
          unicodeReady
        ),
        String(q.bobot),
      ]),
      styles: { font: fontName, fontSize: 8.5, cellPadding: 2.2, valign: 'top' },
      headStyles: {
        font: fontName,
        fillColor: [241, 245, 249],
        textColor: [15, 23, 42],
      },
      margin: { left: margin, right: margin },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = ((doc as any).lastAutoTable?.finalY || y + 40) + 10;
  } else {
    y += 8;
  }

  appendSignatureBlockToPdf(
    doc,
    y,
    margin,
    pageWidth,
    pageHeight,
    fontName,
    unicodeReady,
    metadata
  );

  doc.save(`Kumpulan_Soal_${getSafeFileSubject(metadata)}.pdf`);
}

// ==========================================
// 4. TEMPLATE ACUAN & WORD & JSON HELPERS
// ==========================================

export function downloadTemplateAcuanKisiKisi(): void {
  const rows = [
    ['FORMAT ACUAN KISI-KISI PENULISAN SOAL'],
    ['Kurikulum', ': Kurikulum Deep Learning'],
    ['Mata Pelajaran', ': (Isi Mata Pelajaran)'],
    ['Kelas / Fase', ': (Isi Kelas / Fase)'],
    [],
    [
      'No.',
      'Capaian Pembelajaran (Deep Learning)',
      'Tujuan Pembelajaran',
      'Bab / Lingkup Materi',
      'Kelas / Fase',
      'Indikator Soal',
      'Level Kognitif',
      'Tingkatan (LOTS/MOTS/HOTS)',
      'Bentuk Soal',
      'Nomor Soal',
    ],
    [
      1,
      'Contoh: Menganalisis konsep eksponen secara bermakna',
      'Contoh: Peserta didik mampu menyederhanakan sifat bilangan berpangkat',
      'Bab 1: Eksponen',
      'Kelas X (10) / Fase E',
      'Peserta didik dapat menyederhanakan bilangan berpangkat.',
      'C2',
      'LOTS',
      'Pilihan Ganda',
      '1',
    ],
  ];

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [
    { wch: 6 },
    { wch: 38 },
    { wch: 38 },
    { wch: 26 },
    { wch: 20 },
    { wch: 40 },
    { wch: 15 },
    { wch: 24 },
    { wch: 18 },
    { wch: 12 },
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Format Acuan Kisi-Kisi');
  XLSX.writeFile(wb, 'Contoh_Format_Acuan_Kisi_Kisi.xlsx');
}

export function downloadTemplateAcuanKartuSoal(): void {
  const rows = [
    ['FORMAT ACUAN KARTU SOAL'],
    ['Field Kartu Soal', 'Isian Contoh'],
    ['Capaian Pembelajaran (Deep Learning)', 'Menggeneralisasi sifat-sifat bilangan berpangkat'],
    ['Tujuan Pembelajaran', 'Peserta didik mampu menjelaskan dan menghitung operasi bilangan berpangkat'],
    ['Bab / Lingkup Materi', 'Bab 1: Eksponen'],
    ['Indikator Soal', 'Peserta didik dapat menghitung hasil operasi eksponen'],
    ['Tingkatan Soal', 'LOTS'],
    ['Level Kognitif', 'C2'],
    ['Bentuk Soal', 'Pilihan Ganda'],
    ['Bobot Skor', '5'],
    ['Buku Sumber', 'Buku Panduan Kurikulum Deep Learning'],
    ['Rumusan Butir Soal', 'Tuliskan naskah soal'],
    ['Kunci Jawaban', 'B'],
    ['Catatan Telaah', 'Layak pakai'],
  ];

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 36 }, { wch: 52 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Format Acuan Kartu Soal');
  XLSX.writeFile(wb, 'Contoh_Format_Acuan_Kartu_Soal.xlsx');
}

export function downloadWordDocument(
  filename: string,
  documentTitle: string,
  bodyHtml: string
): void {
  const html = `
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8" />
  <title>${documentTitle}</title>
  <style>
    @page { size: A4; margin: 1.8cm 1.6cm; }
    body { font-family: 'Cambria Math', 'DejaVu Sans', 'Segoe UI', 'Times New Roman', serif; font-size: 11pt; color: #111827; line-height: 1.45; }
    h1, h2, h3 { margin: 0 0 6pt 0; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 12pt; }
    th, td { border: 1px solid #1f2937; padding: 5pt 7pt; vertical-align: top; text-align: left; }
    th { background-color: #f1f5f9; font-weight: bold; }
    .no-border td, .no-border th { border: none; padding: 2pt 4pt; }
    .page-break { page-break-before: always; }
  </style>
</head>
<body>
  ${bodyHtml}
</body>
</html>`;

  const blob = new Blob(['\ufeff', html], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.doc') ? filename : `${filename}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadExamJson(project: ExamProjectState): void {
  const blob = new Blob([JSON.stringify(project, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Paket_Soal_${getSafeFileSubject(project.metadata)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br/>');
}
