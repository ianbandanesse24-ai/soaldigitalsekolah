import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import {
  MappedExamField,
  ReferenceColumnDef,
  UploadedFormatAcuan,
} from '../types/exam';
import { SMA_SUBJECT_CATALOG } from '../data/cpReferences';
import { normalizeCustomFieldKey } from './autoFillAcuan';

export function inferMappedField(headerText: string): MappedExamField {
  const h = headerText
    .toLowerCase()
    .replace(/[:()[\]]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (
    /^(no\.?|nomor)$/.test(h) ||
    h.includes('no. soal') ||
    h.includes('nomor soal') ||
    h.includes('no soal') ||
    h.includes('nomor urut')
  ) {
    return 'nomor';
  }
  if (
    h.includes('tujuan pembelajaran') ||
    h.includes('alur tujuan') ||
    /\batp\b/.test(h) ||
    /\btp\b/.test(h)
  ) {
    return 'tujuanPembelajaran';
  }
  if (
    h.includes('kompetensi dasar') ||
    h.includes('kompetensi inti') ||
    h.includes('kompetensi') ||
    /\bkd\b/.test(h) ||
    h.includes('capaian pembelajaran') ||
    h.includes('capaian') ||
    /\bcp\b/.test(h)
  ) {
    return 'kdCp';
  }
  if (
    h.includes('materi') ||
    h.includes('topik') ||
    h.includes('pokok bahasan') ||
    h.includes('lingkup')
  ) {
    return 'materi';
  }
  if (
    h.includes('kelas') ||
    h.includes('semester') ||
    h.includes('fase') ||
    /\bsmt\b/.test(h)
  ) {
    return 'kelasSemester';
  }
  if (h.includes('indikator')) {
    return 'indikator';
  }
  if (h.includes('tingkatan') || h.includes('lots') || h.includes('mots')) {
    return 'tingkatanSoal';
  }
  if (
    h.includes('level') ||
    h.includes('kognitif') ||
    h.includes('ranah') ||
    h.includes('taksonomi') ||
    h.includes('hots')
  ) {
    return 'levelKognitif';
  }
  if (
    h.includes('bentuk soal') ||
    h.includes('bentuk') ||
    h.includes('jenis soal') ||
    h.includes('tipe soal')
  ) {
    return 'type';
  }
  if (h.includes('bobot') || h.includes('skor') || h.includes('poin')) {
    return 'bobot';
  }
  if (
    h.includes('sumber') ||
    h.includes('buku') ||
    h.includes('referensi')
  ) {
    return 'sumberBuku';
  }
  if (h.includes('pembahasan') || h.includes('penyelesaian')) {
    return 'pembahasan';
  }
  if (
    h.includes('rumusan') ||
    h.includes('butir soal') ||
    h.includes('pertanyaan') ||
    h === 'soal'
  ) {
    return 'rumusanSoal';
  }
  if (h.includes('kunci') || h.includes('jawaban') || h.includes('pedoman')) {
    return 'kunci';
  }
  if (
    h.includes('telaah') ||
    h.includes('keterangan') ||
    h.includes('catatan') ||
    /\bket\b/.test(h)
  ) {
    return 'catatanTelaah';
  }
  if (h.includes('mata pelajaran') || h.includes('mapel')) {
    return 'mataPelajaran';
  }
  if (h.includes('kurikulum')) {
    return 'kurikulum';
  }
  if (
    h.includes('satuan pendidikan') ||
    h.includes('nama sekolah') ||
    h === 'sekolah' ||
    h.includes('madrasah')
  ) {
    return 'namaSekolah';
  }
  if (
    h.includes('penyusun') ||
    h.includes('penulis soal') ||
    h.includes('nama guru')
  ) {
    return 'penyusun';
  }
  if (h.includes('tahun ajaran') || h.includes('tahun pelajaran')) {
    return 'tahunAjaran';
  }
  if (h.includes('alokasi waktu') || h.includes('waktu ujian')) {
    return 'alokasiWaktu';
  }
  return 'custom';
}

function isPlaceholderValue(val: string): boolean {
  const trimmed = val.trim();
  if (!trimmed || trimmed === '-' || trimmed === ':' || /^\.+$/.test(trimmed)) {
    return true;
  }
  if (/^\(.*isi.*\)$/i.test(trimmed) || /^<.*>$/.test(trimmed)) {
    return true;
  }
  return false;
}

function matchCatalogSubject(rawSubject: string): string | undefined {
  const normalized = rawSubject.toLowerCase().replace(/\s+/g, ' ').trim();
  if (!normalized || normalized.length < 3) return undefined;
  const exact = SMA_SUBJECT_CATALOG.find(
    (s) => s.name.toLowerCase() === normalized
  );
  if (exact) return exact.name;
  const partial = SMA_SUBJECT_CATALOG.find(
    (s) =>
      normalized.includes(s.name.toLowerCase()) ||
      s.name.toLowerCase().includes(normalized)
  );
  return partial?.name;
}

function matchSmaKelasAndFase(
  rawText: string
): { kelas?: string; fase?: string } | undefined {
  const low = rawText.toLowerCase();
  if (/\bxii\b|\b12\b/.test(low)) {
    return { kelas: 'Kelas XII (12)', fase: 'Fase F' };
  }
  if (/\bxi\b|\b11\b/.test(low)) {
    return { kelas: 'Kelas XI (11)', fase: 'Fase F' };
  }
  if (/\bx\b|\b10\b/.test(low)) {
    return { kelas: 'Kelas X (10)', fase: 'Fase E' };
  }
  if (low.includes('fase f')) {
    return { kelas: 'Kelas XI (11)', fase: 'Fase F' };
  }
  if (low.includes('fase e')) {
    return { kelas: 'Kelas X (10)', fase: 'Fase E' };
  }
  return undefined;
}

function expandRowPairs(rows: string[][]): [string, string][] {
  const pairs: [string, string][] = [];
  for (const row of rows) {
    for (let i = 0; i < row.length - 1; i += 2) {
      const k = (row[i] || '').trim();
      const v = (row[i + 1] || '').replace(/^[:\s]+/, '').trim();
      if (k && k.length <= 75) {
        pairs.push([k.replace(/:$/, '').trim(), v]);
      }
    }
    if (row.length === 1 && row[0].includes(':')) {
      const idx = row[0].indexOf(':');
      const k = row[0].slice(0, idx).trim();
      const v = row[0].slice(idx + 1).trim();
      if (k && k.length <= 75) {
        pairs.push([k, v]);
      }
    }
  }
  return pairs;
}

function extractMetadataFromKeyValuePairs(
  rows: string[][]
): UploadedFormatAcuan['detectedMetadata'] {
  const meta: NonNullable<UploadedFormatAcuan['detectedMetadata']> = {};
  const pairs = expandRowPairs(rows);

  for (const [rawLabel, rawVal] of pairs) {
    const label = rawLabel.toLowerCase().replace(/[:\s]+/g, ' ').trim();
    if (isPlaceholderValue(rawVal)) continue;

    if (
      (label.includes('satuan pendidikan') || label.includes('nama sekolah')) &&
      !meta.namaSekolah
    ) {
      meta.namaSekolah = rawVal;
    } else if (
      (label.includes('judul') ||
        label.includes('nama ujian') ||
        label.includes('penilaian')) &&
      !meta.judulUjian
    ) {
      meta.judulUjian = rawVal;
    } else if (
      (label.includes('tahun ajaran') || label.includes('tahun pelajaran')) &&
      !meta.tahunAjaran
    ) {
      meta.tahunAjaran = rawVal;
    } else if (label.includes('alokasi waktu') && !meta.alokasiWaktu) {
      meta.alokasiWaktu = rawVal;
    } else if (
      (label.includes('penyusun') || label.includes('nama guru')) &&
      !meta.penyusun
    ) {
      meta.penyusun = rawVal;
    } else if (
      (label.includes('mata pelajaran') || label === 'mapel') &&
      !meta.mataPelajaran
    ) {
      const matchedSubject = matchCatalogSubject(rawVal);
      if (matchedSubject) {
        meta.mataPelajaran = matchedSubject;
      }
    } else if (
      (label.includes('kelas') || label.includes('fase')) &&
      !meta.kelas
    ) {
      const matchedGrade = matchSmaKelasAndFase(rawVal);
      if (matchedGrade?.kelas) meta.kelas = matchedGrade.kelas;
      if (matchedGrade?.fase) meta.fase = matchedGrade.fase;
    }
  }

  return Object.keys(meta).length > 0 ? meta : undefined;
}

function buildColumnsFromHeaders(headers: string[]): ReferenceColumnDef[] {
  const seen = new Set<string>();
  return headers
    .map((h) => h.replace(/:$/, '').replace(/\s+/g, ' ').trim())
    .filter((h) => {
      if (h.length === 0 || h.length > 85) return false;
      const low = h.toLowerCase();
      if (
        low === 'field kartu soal' ||
        low === 'isian contoh' ||
        low === 'isian' ||
        low === 'nilai' ||
        low === ':'
      ) {
        return false;
      }
      if (seen.has(low)) return false;
      seen.add(low);
      return true;
    })
    .map((headerLabel, index) => ({
      id: `acuan_col_${Date.now()}_${index}`,
      headerLabel,
      mappedField: inferMappedField(headerLabel),
    }));
}

function scoreHeaderRow(row: string[]): number {
  const keywords = [
    'no',
    'kompetensi',
    'capaian',
    'tujuan',
    'tp',
    'atp',
    'kd',
    'cp',
    'materi',
    'indikator',
    'level',
    'kognitif',
    'tingkatan',
    'bentuk',
    'jenis',
    'soal',
    'kelas',
    'kunci',
    'sumber',
    'bobot',
    'skor',
    'pembahasan',
    'dimensi',
    'profil',
    'stimulus',
    'kktp',
  ];
  const nonEmpty = row.filter((cell) => cell.trim().length > 0);
  if (nonEmpty.length < 2) return 0;

  let score = nonEmpty.length;
  for (const cell of nonEmpty) {
    const low = cell.toLowerCase();
    if (keywords.some((kw) => low.includes(kw))) {
      score += 4;
    }
  }
  return score;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Gagal membaca berkas.'));
    reader.readAsDataURL(file);
  });
}

function collectSampleValuesFromTable(
  headers: string[],
  rows: string[][]
): Record<string, string> {
  const samples: Record<string, string> = {};
  headers.forEach((header, colIdx) => {
    const key = normalizeCustomFieldKey(header);
    if (!key) return;
    for (const row of rows) {
      const val = (row[colIdx] || '').trim();
      if (!isPlaceholderValue(val) && !/^contoh[:\s]/i.test(val)) {
        samples[key] = val;
        break;
      }
    }
  });
  return samples;
}

function isLikelyVerticalFormTable(rows: string[][]): boolean {
  if (rows.length < 3) return false;
  const twoOrFourColPairs = rows.filter(
    (r) =>
      (r.length === 2 || r.length === 4) &&
      r[0]?.trim().length > 0 &&
      r[0].trim().length <= 65
  );
  return twoOrFourColPairs.length >= Math.ceil(rows.length * 0.6);
}

function analyzeMatrixTable(matrix: string[][]): {
  detectedHeaders: string[];
  previewRows: string[][];
  detectedSampleValues: Record<string, string>;
} {
  let bestHeaderIndex = 0;
  let bestScore = -1;
  const scanLimit = Math.min(matrix.length, 25);
  for (let i = 0; i < scanLimit; i++) {
    const s = scoreHeaderRow(matrix[i]);
    if (s > bestScore) {
      bestScore = s;
      bestHeaderIndex = i;
    }
  }

  const candidateRow = matrix[bestHeaderIndex] || [];
  const nonEmptyCount = candidateRow.filter((c) => c.length > 0).length;

  // Check for Kartu Soal vertical / 4-column key-value grid
  if (nonEmptyCount <= 2 || (bestScore < 10 && isLikelyVerticalFormTable(matrix))) {
    const pairs = expandRowPairs(matrix);
    const detectedHeaders: string[] = [];
    const previewRows: string[][] = [];
    const detectedSampleValues: Record<string, string> = {};

    for (const [label, val] of pairs) {
      const low = label.toLowerCase();
      if (
        low === 'field kartu soal' ||
        low === 'isian contoh' ||
        low === 'kartu soal'
      ) {
        continue;
      }
      detectedHeaders.push(label);
      previewRows.push([label, val]);
      const key = normalizeCustomFieldKey(label);
      if (key && !isPlaceholderValue(val)) {
        detectedSampleValues[key] = val;
      }
    }
    return {
      detectedHeaders: Array.from(new Set(detectedHeaders)).slice(0, 24),
      previewRows: previewRows.slice(0, 12),
      detectedSampleValues,
    };
  }

  // Merge optional second sub-header row if first header row has parent groups and second has short subheaders
  const nextRow = matrix[bestHeaderIndex + 1];
  let effectiveHeaders = candidateRow.filter((c) => c.length > 0);
  let dataStartIdx = bestHeaderIndex + 1;
  if (
    nextRow &&
    scoreHeaderRow(nextRow) >= 8 &&
    nextRow.filter((c) => c.length > 0).length >= effectiveHeaders.length
  ) {
    effectiveHeaders = candidateRow.map((top, cIdx) => {
      const sub = (nextRow[cIdx] || '').trim();
      const t = top.trim();
      if (sub && t && sub.toLowerCase() !== t.toLowerCase()) {
        return `${t} — ${sub}`;
      }
      return sub || t;
    }).filter(Boolean);
    dataStartIdx = bestHeaderIndex + 2;
  }

  const previewRows = matrix.slice(dataStartIdx, dataStartIdx + 8);
  const detectedSampleValues = collectSampleValuesFromTable(
    effectiveHeaders,
    previewRows
  );

  return {
    detectedHeaders: effectiveHeaders,
    previewRows,
    detectedSampleValues,
  };
}

function decodePdfLiteralString(raw: string): string {
  return raw
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, ' ')
    .replace(/\\t/g, ' ')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\\\/g, '\\')
    .replace(/\\([0-7]{1,3})/g, (_, oct) =>
      String.fromCharCode(parseInt(oct, 8))
    )
    .trim();
}

function extractTextOperatorsFromPdfChunk(chunk: string): string[] {
  const lines: string[] = [];
  const btRegex = /BT[\s\S]*?ET/g;
  const blocks = chunk.match(btRegex) || [chunk];

  for (const block of blocks) {
    const tjArrayRegex = /\[([^\]]+)\]\s*TJ/g;
    let mArray: RegExpExecArray | null;
    while ((mArray = tjArrayRegex.exec(block)) !== null) {
      const inner = mArray[1];
      const strParts = inner.match(/\((?:\\.|[^\\()])*\)/g) || [];
      const joined = strParts
        .map((p) => decodePdfLiteralString(p.slice(1, -1)))
        .join('');
      if (joined.trim()) lines.push(joined.trim());
    }

    const singleTjRegex = /\((?:\\.|[^\\()])*\)\s*(?:Tj|'|")/g;
    let mSingle: RegExpExecArray | null;
    while ((mSingle = singleTjRegex.exec(block)) !== null) {
      const innerMatch = mSingle[0].match(/^\(([\s\S]*)\)\s*(?:Tj|'|")$/);
      if (innerMatch) {
        const decoded = decodePdfLiteralString(innerMatch[1]);
        if (decoded) lines.push(decoded);
      }
    }
  }

  return lines;
}

async function tryInflateStream(bytes: Uint8Array): Promise<string | null> {
  if (typeof DecompressionStream === 'undefined') return null;
  for (const format of ['deflate', 'deflate-raw'] as const) {
    try {
      const ds = new DecompressionStream(format);
      const writer = ds.writable.getWriter();
      writer.write(new Uint8Array(bytes));
      writer.close();
      const decompressed = await new Response(ds.readable).arrayBuffer();
      return new TextDecoder('latin1').decode(decompressed);
    } catch {
      // Coba format berikutnya
    }
  }
  return null;
}

async function extractPdfTextLines(buffer: ArrayBuffer): Promise<string[]> {
  const bytes = new Uint8Array(buffer);
  const latin1 = new TextDecoder('latin1').decode(bytes);
  const extractedChunks: string[] = [];

  // 1. Ekstrak dari stream terkompresi maupun tidak terkompresi
  const streamRegex = /stream\r?\n([\s\S]*?)\r?\n?endstream/g;
  let match: RegExpExecArray | null;
  let streamCount = 0;

  while ((match = streamRegex.exec(latin1)) !== null && streamCount < 80) {
    streamCount++;
    const rawBody = match[1];
    if (rawBody.includes('BT') && rawBody.includes('ET')) {
      extractedChunks.push(rawBody);
      continue;
    }
    const startOffset = match.index + match[0].indexOf(rawBody);
    const endOffset = startOffset + rawBody.length;
    const streamBytes = bytes.slice(startOffset, endOffset);
    const inflated = await tryInflateStream(streamBytes);
    if (inflated && (inflated.includes('BT') || inflated.includes('Tj'))) {
      extractedChunks.push(inflated);
    }
  }

  if (extractedChunks.length === 0) {
    extractedChunks.push(latin1);
  }

  const allLines: string[] = [];
  for (const chunk of extractedChunks) {
    allLines.push(...extractTextOperatorsFromPdfChunk(chunk));
  }

  return allLines
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter((l) => l.length > 0 && /[a-zA-Z0-9]/.test(l));
}

function parsePlainTextOrLines(
  lines: string[],
  fallbackColumns: ReferenceColumnDef[]
): {
  detectedHeaders: string[];
  previewRows: string[][];
  detectedSampleValues: Record<string, string>;
  detectedMetadata?: UploadedFormatAcuan['detectedMetadata'];
  columns: ReferenceColumnDef[];
} {
  let detectedHeaders: string[] = [];
  const previewRows: string[][] = [];
  let detectedSampleValues: Record<string, string> = {};
  const pairRows: string[][] = [];

  if (lines.length > 0) {
    const delimiter = lines[0].includes('\t')
      ? '\t'
      : lines[0].includes(';')
      ? ';'
      : lines[0].includes('|')
      ? '|'
      : ',';
    const commaHeaderCells = lines[0].split(delimiter).map((s) => s.trim());

    if (lines[0].includes(delimiter) && commaHeaderCells.length >= 3) {
      detectedHeaders = commaHeaderCells.filter(Boolean);
      for (let i = 1; i < Math.min(lines.length, 9); i++) {
        previewRows.push(lines[i].split(delimiter).map((s) => s.trim()));
      }
      detectedSampleValues = collectSampleValuesFromTable(
        detectedHeaders,
        previewRows
      );
    } else {
      const colonLines = lines.filter((l) => l.includes(':') && l.length < 140);
      detectedHeaders = colonLines
        .map((l) => l.split(':')[0].trim())
        .filter((h) => h.length > 1 && h.length <= 70)
        .slice(0, 20);
      colonLines.forEach((l) => {
        const idx = l.indexOf(':');
        const k = l.slice(0, idx).trim();
        const val = l.slice(idx + 1).trim();
        pairRows.push([k, val]);
        previewRows.push([k, val]);
        const key = normalizeCustomFieldKey(k);
        if (key && !isPlaceholderValue(val)) {
          detectedSampleValues[key] = val;
        }
      });

      // Jika belum ditemukan pola titik dua, deteksi kata kunci kolom yang muncul di PDF/teks
      if (detectedHeaders.length < 2) {
        const headerCandidates = lines.filter(
          (l) =>
            l.length >= 2 &&
            l.length <= 55 &&
            inferMappedField(l) !== 'custom'
        );
        if (headerCandidates.length >= 2) {
          detectedHeaders = headerCandidates.slice(0, 16);
        }
      }
    }
  }

  const columns =
    detectedHeaders.length >= 2
      ? buildColumnsFromHeaders(detectedHeaders)
      : fallbackColumns;

  return {
    detectedHeaders: columns.map((c) => c.headerLabel),
    previewRows: previewRows.slice(0, 10),
    detectedSampleValues,
    detectedMetadata: extractMetadataFromKeyValuePairs(pairRows),
    columns,
  };
}

export async function parseFormatAcuanFile(
  file: File,
  fallbackColumns: ReferenceColumnDef[]
): Promise<UploadedFormatAcuan> {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const uploadedAt = new Date().toISOString();

  // 1. Excel & CSV (scan semua sheet untuk memilih lembar acuan terbaik)
  if (['xlsx', 'xls', 'csv'].includes(ext)) {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });

    let bestMatrix: string[][] = [];
    let bestSheetScore = -1;

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
        header: 1,
        defval: '',
      });
      const matrix = rows
        .map((r) => (Array.isArray(r) ? r.map((c) => String(c ?? '').trim()) : []))
        .filter((r) => r.some((c) => c.length > 0));
      const maxRowScore = matrix
        .slice(0, 20)
        .reduce((best, r) => Math.max(best, scoreHeaderRow(r)), 0);
      const totalScore = maxRowScore + Math.min(matrix.length, 15);
      if (totalScore > bestSheetScore) {
        bestSheetScore = totalScore;
        bestMatrix = matrix;
      }
    }

    const { detectedHeaders, previewRows, detectedSampleValues } =
      analyzeMatrixTable(bestMatrix);

    const detectedMetadata = extractMetadataFromKeyValuePairs(
      bestMatrix.slice(0, 20)
    );

    const columns =
      detectedHeaders.length >= 2
        ? buildColumnsFromHeaders(detectedHeaders)
        : fallbackColumns;

    return {
      fileName: file.name,
      fileType: ext.toUpperCase(),
      fileSize: file.size,
      uploadedAt,
      detectedHeaders: columns.map((c) => c.headerLabel),
      previewRows,
      columns,
      detectedSampleValues,
      detectedMetadata,
    };
  }

  // 2. Word (.docx) atau HTML
  if (ext === 'docx' || ext === 'html' || ext === 'htm') {
    let htmlContent = '';
    let textContent = '';

    if (ext === 'docx') {
      const buffer = await file.arrayBuffer();
      const htmlResult = await mammoth.convertToHtml({ arrayBuffer: buffer });
      const textResult = await mammoth.extractRawText({ arrayBuffer: buffer });
      htmlContent = htmlResult.value;
      textContent = textResult.value;
    } else {
      htmlContent = await file.text();
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    if (!textContent) {
      textContent = doc.body?.textContent || '';
    }
    const tables = Array.from(doc.querySelectorAll('table'));

    let detectedHeaders: string[] = [];
    let previewRows: string[][] = [];
    let detectedSampleValues: Record<string, string> = {};
    const allPairRows: string[][] = [];

    if (tables.length > 0) {
      let bestTable = tables[0];
      let bestTableScore = -1;
      for (const tbl of tables) {
        const rowsInTable = Array.from(tbl.querySelectorAll('tr')).map((tr) =>
          Array.from(tr.querySelectorAll('th, td')).map((td) =>
            (td.textContent || '').replace(/\s+/g, ' ').trim()
          )
        );
        allPairRows.push(...rowsInTable);
        const headerBest = rowsInTable
          .slice(0, 8)
          .reduce((best, r) => Math.max(best, scoreHeaderRow(r)), 0);
        const tblScore = headerBest * 2 + rowsInTable.length;
        if (tblScore > bestTableScore) {
          bestTableScore = tblScore;
          bestTable = tbl;
        }
      }

      const matrix = Array.from(bestTable.querySelectorAll('tr'))
        .map((tr) =>
          Array.from(tr.querySelectorAll('th, td')).map((td) =>
            (td.textContent || '').replace(/\s+/g, ' ').trim()
          )
        )
        .filter((r) => r.some((c) => c.length > 0));

      if (matrix.length > 0) {
        const analyzed = analyzeMatrixTable(matrix);
        detectedHeaders = analyzed.detectedHeaders;
        previewRows = analyzed.previewRows;
        detectedSampleValues = analyzed.detectedSampleValues;
      }
    }

    // Lengkapi metadata dari paragraf teks di atas/luar tabel
    if (textContent) {
      const lines = textContent
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.includes(':') && l.length < 120);
      lines.forEach((l) => {
        const idx = l.indexOf(':');
        const k = l.slice(0, idx).trim();
        const val = l.slice(idx + 1).trim();
        allPairRows.push([k, val]);
        const key = normalizeCustomFieldKey(k);
        if (key && !isPlaceholderValue(val) && !detectedSampleValues[key]) {
          detectedSampleValues[key] = val;
        }
      });
      if (detectedHeaders.length < 2) {
        detectedHeaders = lines
          .map((l) => l.split(':')[0].trim())
          .filter((l) => l.length > 1 && l.length < 65)
          .slice(0, 18);
      }
    }

    const detectedMetadata = extractMetadataFromKeyValuePairs(allPairRows);
    const columns =
      detectedHeaders.length >= 2
        ? buildColumnsFromHeaders(detectedHeaders)
        : fallbackColumns;

    return {
      fileName: file.name,
      fileType: ext.toUpperCase(),
      fileSize: file.size,
      uploadedAt,
      detectedHeaders: columns.map((c) => c.headerLabel),
      previewRows: previewRows.slice(0, 10),
      rawHtml: htmlContent,
      rawText: textContent,
      columns,
      detectedSampleValues,
      detectedMetadata,
    };
  }

  // 3. Text / Markdown / JSON
  if (['txt', 'md', 'json'].includes(ext)) {
    const rawText = await file.text();
    const lines = rawText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const parsed = parsePlainTextOrLines(lines, fallbackColumns);

    return {
      fileName: file.name,
      fileType: ext.toUpperCase(),
      fileSize: file.size,
      uploadedAt,
      detectedHeaders: parsed.detectedHeaders,
      previewRows: parsed.previewRows,
      rawText,
      columns: parsed.columns,
      detectedSampleValues: parsed.detectedSampleValues,
      detectedMetadata: parsed.detectedMetadata,
    };
  }

  // 4. PDF (ekstrak teks & field secara cerdas + tetap simpan dataUrl untuk pratinjau)
  if (ext === 'pdf') {
    const [dataUrl, buffer] = await Promise.all([
      readFileAsDataUrl(file),
      file.arrayBuffer(),
    ]);
    let pdfLines: string[] = [];
    try {
      pdfLines = await extractPdfTextLines(buffer);
    } catch {
      pdfLines = [];
    }

    const parsed = parsePlainTextOrLines(pdfLines, fallbackColumns);
    const hasExtractedCols =
      pdfLines.length > 0 && parsed.detectedHeaders.length >= 2;

    return {
      fileName: file.name,
      fileType: 'PDF',
      fileSize: file.size,
      uploadedAt,
      detectedHeaders: hasExtractedCols ? parsed.detectedHeaders : [],
      previewRows: parsed.previewRows,
      rawText: pdfLines.length > 0 ? pdfLines.join('\n') : undefined,
      dataUrl,
      columns: hasExtractedCols ? parsed.columns : fallbackColumns,
      detectedSampleValues: parsed.detectedSampleValues,
      detectedMetadata: parsed.detectedMetadata,
    };
  }

  // 5. Image Reference (Visual Reference Mode + fallback columns cerdas)
  const dataUrl = await readFileAsDataUrl(file);
  return {
    fileName: file.name,
    fileType: ext.toUpperCase() || 'FILE',
    fileSize: file.size,
    uploadedAt,
    detectedHeaders: [],
    previewRows: [],
    dataUrl,
    columns: fallbackColumns,
  };
}
