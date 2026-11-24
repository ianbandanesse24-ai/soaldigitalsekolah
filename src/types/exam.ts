export type QuestionType = 'PG' | 'ESAY' | 'JAWABAN_SINGKAT' | 'MENJODOHKAN';

export type CognitiveLevel = 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6';

export type QuestionTier = 'LOTS' | 'MOTS' | 'HOTS';

export type ActiveModule = 'data_soal' | 'kisi_kisi' | 'kartu_soal' | 'kumpulan_soal';

export interface MatchingPair {
  id: string;
  premise: string;
  match: string;
}

export interface BabMateriConfig {
  id: string;
  namaBab: string;
  lingkupMateri: string;
  tujuanPembelajaranList?: string[];
  elemenCp?: string;
  capaianPembelajaran?: string;
  jumlahSoal: number;
}

export interface QuestionItem {
  id: string;
  nomor: number;
  type: QuestionType;
  babId?: string;
  namaBab?: string;
  kdCp: string;
  tujuanPembelajaran?: string;
  materi: string;
  indikator: string;
  levelKognitif: CognitiveLevel;
  tingkatanSoal: QuestionTier;
  bobot: number;
  sumberBuku: string;
  rumusanSoal: string;
  opsiPg: {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
  };
  useOptionE: boolean;
  kunciPg: 'A' | 'B' | 'C' | 'D' | 'E';
  kunciEsai: string;
  kunciSingkat: string;
  pasanganMenjodohkan: MatchingPair[];
  pembahasan: string;
  catatanTelaah: string;
  customFields?: Record<string, string>;
}

export interface ExamMetadata {
  mataPelajaran: string;
  kelas: string;
  fase: string;
  jenjang: string;
  kelasSemester: string;
  judulUjian: string;
  namaSekolah: string;
  kurikulum: string;
  cpAcuanRegulasi?: string;
  cpAcuanRingkasan?: string;
  tahunAjaran: string;
  alokasiWaktu: string;
  penyusun: string;
  nipPenyusun: string;
  babMateriList: BabMateriConfig[];
  selectedQuestionTypes: Record<QuestionType, boolean>;
  tingkatanPersentase: Record<QuestionTier, number>;
  jumlahTotalSoal: number;
  komposisi: Record<QuestionType, number>;
  petunjukUmum: string;
}

export type MappedExamField =
  | 'nomor'
  | 'kdCp'
  | 'tujuanPembelajaran'
  | 'materi'
  | 'kelasSemester'
  | 'indikator'
  | 'levelKognitif'
  | 'tingkatanSoal'
  | 'type'
  | 'bobot'
  | 'sumberBuku'
  | 'rumusanSoal'
  | 'kunci'
  | 'pembahasan'
  | 'catatanTelaah'
  | 'mataPelajaran'
  | 'kurikulum'
  | 'namaSekolah'
  | 'penyusun'
  | 'tahunAjaran'
  | 'alokasiWaktu'
  | 'custom';

export interface ReferenceColumnDef {
  id: string;
  headerLabel: string;
  mappedField: MappedExamField;
  customValue?: string;
}

export interface UploadedFormatAcuan {
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  detectedHeaders: string[];
  previewRows: string[][];
  rawHtml?: string;
  rawText?: string;
  dataUrl?: string;
  columns: ReferenceColumnDef[];
  detectedSampleValues?: Record<string, string>;
  detectedMetadata?: Partial<
    Pick<
      ExamMetadata,
      | 'namaSekolah'
      | 'judulUjian'
      | 'tahunAjaran'
      | 'alokasiWaktu'
      | 'penyusun'
      | 'mataPelajaran'
      | 'kelas'
      | 'fase'
    >
  >;
}

export interface ExamProjectState {
  metadata: ExamMetadata;
  questions: QuestionItem[];
  kisiKisiColumns: ReferenceColumnDef[];
  kisiKisiAcuan: UploadedFormatAcuan | null;
  kartuSoalFields: ReferenceColumnDef[];
  kartuSoalAcuan: UploadedFormatAcuan | null;
  lastSavedAt: string;
}
