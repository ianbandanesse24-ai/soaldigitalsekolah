import { QuestionTier, QuestionType } from '../types/exam';

export type CalculationDomain =
  | 'MATEMATIKA'
  | 'FISIKA'
  | 'KIMIA'
  | 'EKONOMI'
  | 'INFORMATIKA';

export interface CalculationBlueprint {
  rumusan: string;
  correctOption?: string;
  distractors?: string[];
  kunciSingkat?: string;
  pairs?: { premise: string; match: string }[];
  kunciEsaiSteps?: [string, string, string];
  pembahasanHint?: string;
}

function pickByIdx<T>(arr: T[], idx: number): T {
  return arr[Math.abs(idx) % arr.length];
}

// ============================================================================
// 1. MATEMATIKA KEUANGAN: ANUITAS & BUNGA MAJEMUK
// ============================================================================

function getAnuitasBlueprint(
  tier: QuestionTier,
  type: QuestionType,
  variantIdx: number
): CalculationBlueprint {
  if (type === 'PG') {
    const lotsItems = [
      {
        rumusan:
          'Suatu pinjaman dilunasi dengan sistem anuitas sebesar Rp2.500.000 per bulan. Jika besar bunga pada bulan ke-3 adalah Rp450.000, besar angsuran pada bulan ke-3 adalah ....',
        correctOption: 'Rp2.050.000',
        distractors: ['Rp2.150.000', 'Rp2.950.000', 'Rp1.950.000', 'Rp2.000.000'],
        pembahasanHint:
          'Anuitas A = aₙ + bₙ, sehingga angsuran a₃ = 2.500.000 − 450.000 = Rp2.050.000.',
      },
      {
        rumusan:
          'Sebuah pinjaman dilunasi dengan anuitas bulanan. Pada bulan ke-2, besar angsuran Rp1.400.000 dan besar bunganya Rp600.000. Besar anuitas pinjaman tersebut adalah ....',
        correctOption: 'Rp2.000.000',
        distractors: ['Rp800.000', 'Rp1.800.000', 'Rp2.200.000', 'Rp2.400.000'],
        pembahasanHint:
          'A = a₂ + b₂ = 1.400.000 + 600.000 = Rp2.000.000.',
      },
      {
        rumusan:
          'Pinjaman sebesar Rp15.000.000 dilunasi dengan anuitas tahunan Rp3.500.000 dan suku bunga 4% per tahun. Besar bunga pada tahun pertama adalah ....',
        correctOption: 'Rp600.000',
        distractors: ['Rp140.000', 'Rp400.000', 'Rp500.000', 'Rp750.000'],
        pembahasanHint: 'Bunga tahun ke-1: b₁ = 4% × 15.000.000 = Rp600.000.',
      },
      {
        rumusan:
          'Suatu pinjaman dilunasi dengan anuitas sebesar Rp1.800.000 per bulan. Jika besar angsuran pada bulan pertama Rp1.350.000, besar bunga pada bulan pertama adalah ....',
        correctOption: 'Rp450.000',
        distractors: ['Rp350.000', 'Rp400.000', 'Rp550.000', 'Rp650.000'],
        pembahasanHint: 'b₁ = A − a₁ = 1.800.000 − 1.350.000 = Rp450.000.',
      },
      {
        rumusan:
          'Besar anuitas sebuah pinjaman adalah Rp3.200.000 per bulan. Jika pada bulan ke-4 besar bunganya Rp320.000, besar angsuran pada bulan ke-4 adalah ....',
        correctOption: 'Rp2.880.000',
        distractors: ['Rp2.780.000', 'Rp2.980.000', 'Rp3.520.000', 'Rp2.800.000'],
        pembahasanHint: 'a₄ = 3.200.000 − 320.000 = Rp2.880.000.',
      },
      {
        rumusan:
          'Pinjaman awal sebesar Rp12.000.000 dilunasi dengan anuitas dan pada bulan pertama membayar angsuran pokok Rp1.500.000. Sisa pinjaman setelah pembayaran bulan pertama adalah ....',
        correctOption: 'Rp10.500.000',
        distractors: ['Rp9.500.000', 'Rp10.000.000', 'Rp11.000.000', 'Rp13.500.000'],
        pembahasanHint: 'Sisa pinjaman S₁ = M − a₁ = 12.000.000 − 1.500.000 = Rp10.500.000.',
      },
      {
        rumusan:
          'Besar anuitas sebuah pinjaman adalah Rp4.000.000 per bulan. Jika besar angsuran pada bulan pertama Rp3.150.000, besar bunga pada bulan pertama adalah ....',
        correctOption: 'Rp850.000',
        distractors: ['Rp750.000', 'Rp800.000', 'Rp900.000', 'Rp950.000'],
        pembahasanHint: 'b₁ = A − a₁ = 4.000.000 − 3.150.000 = Rp850.000.',
      },
      {
        rumusan:
          'Pinjaman sebesar Rp8.000.000 dilunasi dengan sistem anuitas dan suku bunga 2,5% per bulan. Besar bunga pada bulan pertama adalah ....',
        correctOption: 'Rp200.000',
        distractors: ['Rp150.000', 'Rp180.000', 'Rp250.000', 'Rp320.000'],
        pembahasanHint: 'b₁ = 2,5% × 8.000.000 = Rp200.000.',
      },
      {
        rumusan:
          'Pada bulan ke-5 pelunasan sistem anuitas, besar angsuran tercatat Rp2.340.000 dan bunganya Rp260.000. Besar anuitas pinjaman tersebut adalah ....',
        correctOption: 'Rp2.600.000',
        distractors: ['Rp2.080.000', 'Rp2.500.000', 'Rp2.680.000', 'Rp2.800.000'],
        pembahasanHint: 'A = a₅ + b₅ = 2.340.000 + 260.000 = Rp2.600.000.',
      },
      {
        rumusan:
          'Pinjaman awal sebesar Rp18.000.000 dilunasi dengan anuitas. Jika angsuran pokok bulan pertama Rp2.250.000, sisa pinjaman setelah bulan pertama adalah ....',
        correctOption: 'Rp15.750.000',
        distractors: ['Rp14.750.000', 'Rp15.250.000', 'Rp16.250.000', 'Rp16.750.000'],
        pembahasanHint: 'S₁ = 18.000.000 − 2.250.000 = Rp15.750.000.',
      },
    ];

    const motsItems = [
      {
        rumusan:
          'Pinjaman sebesar Rp10.000.000 dilunasi dengan anuitas Rp2.000.000 per bulan dan suku bunga 2% per bulan. Besar angsuran pada bulan pertama adalah ....',
        correctOption: 'Rp1.800.000',
        distractors: ['Rp200.000', 'Rp1.600.000', 'Rp1.960.000', 'Rp2.200.000'],
        pembahasanHint:
          'b₁ = 2% × 10.000.000 = Rp200.000. Angsuran a₁ = 2.000.000 − 200.000 = Rp1.800.000.',
      },
      {
        rumusan:
          'Pinjaman sebesar Rp20.000.000 dilunasi dengan anuitas tahunan Rp5.000.000 dan bunga 5% per tahun. Sisa pinjaman setelah pembayaran anuitas tahun pertama adalah ....',
        correctOption: 'Rp16.000.000',
        distractors: ['Rp15.000.000', 'Rp17.000.000', 'Rp18.000.000', 'Rp19.000.000'],
        pembahasanHint:
          'b₁ = 5% × 20.000.000 = 1.000.000, maka a₁ = 4.000.000. Sisa S₁ = 20.000.000 − 4.000.000 = Rp16.000.000.',
      },
      {
        rumusan:
          'Pada pelunasan pinjaman dengan sistem anuitas, diketahui angsuran bulan pertama a₁ = Rp1.000.000 dengan suku bunga 2% per bulan. Besar angsuran pada bulan ke-3 (a₃) adalah ....',
        correctOption: 'Rp1.040.400',
        distractors: ['Rp1.020.000', 'Rp1.040.000', 'Rp1.060.000', 'Rp1.061.208'],
        pembahasanHint:
          'a₃ = a₁(1 + i)² = 1.000.000 × (1,02)² = 1.000.000 × 1,0404 = Rp1.040.400.',
      },
      {
        rumusan:
          'Suatu pinjaman memiliki anuitas Rp3.000.000 per bulan dan suku bunga 1% per bulan. Jika angsuran bulan pertama Rp2.400.000, besar pokok pinjaman mula-mula adalah ....',
        correctOption: 'Rp60.000.000',
        distractors: ['Rp24.000.000', 'Rp30.000.000', 'Rp48.000.000', 'Rp75.000.000'],
        pembahasanHint:
          'b₁ = A − a₁ = 600.000. Karena b₁ = 1% × M, maka M = 600.000 ÷ 0,01 = Rp60.000.000.',
      },
      {
        rumusan:
          'Pinjaman Rp25.000.000 dilunasi dengan anuitas Rp3.000.000 per bulan dan bunga 2% per bulan. Besar bunga pada bulan kedua (b₂) adalah ....',
        correctOption: 'Rp450.000',
        distractors: ['Rp400.000', 'Rp460.000', 'Rp500.000', 'Rp550.000'],
        pembahasanHint:
          'b₁ = 2% × 25.000.000 = 500.000 → a₁ = 2.500.000 → S₁ = 22.500.000. b₂ = 2% × 22.500.000 = Rp450.000.',
      },
      {
        rumusan:
          'Jika angsuran bulan ke-2 suatu pinjaman anuitas adalah Rp1.545.000 dengan suku bunga 3% per bulan, besar angsuran pada bulan pertama (a₁) adalah ....',
        correctOption: 'Rp1.500.000',
        distractors: ['Rp1.450.000', 'Rp1.498.650', 'Rp1.515.000', 'Rp1.591.350'],
        pembahasanHint: 'a₁ = a₂ ÷ (1 + i) = 1.545.000 ÷ 1,03 = Rp1.500.000.',
      },
      {
        rumusan:
          'Pinjaman sebesar Rp30.000.000 dilunasi dengan anuitas Rp4.200.000 per bulan dan suku bunga 2% per bulan. Sisa pinjaman setelah pembayaran bulan pertama adalah ....',
        correctOption: 'Rp26.400.000',
        distractors: ['Rp25.800.000', 'Rp26.000.000', 'Rp26.800.000', 'Rp27.400.000'],
        pembahasanHint:
          'b₁ = 2% × 30.000.000 = 600.000 → a₁ = 4.200.000 − 600.000 = 3.600.000 → S₁ = Rp26.400.000.',
      },
      {
        rumusan:
          'Pada pelunasan anuitas tahunan, diketahui angsuran tahun pertama a₁ = Rp2.000.000 dan suku bunga 4% per tahun. Besar angsuran tahun kedua (a₂) adalah ....',
        correctOption: 'Rp2.080.000',
        distractors: ['Rp2.008.000', 'Rp2.040.000', 'Rp2.160.000', 'Rp2.400.000'],
        pembahasanHint: 'a₂ = a₁(1 + i) = 2.000.000 × 1,04 = Rp2.080.000.',
      },
      {
        rumusan:
          'Suatu pinjaman memiliki anuitas tahunan Rp5.000.000 dan bunga 5% per tahun. Jika angsuran tahun pertama Rp3.500.000, besar pokok pinjaman mula-mula adalah ....',
        correctOption: 'Rp30.000.000',
        distractors: ['Rp25.000.000', 'Rp28.000.000', 'Rp35.000.000', 'Rp70.000.000'],
        pembahasanHint: 'b₁ = 5.000.000 − 3.500.000 = 1.500.000 → M = 1.500.000 ÷ 0,05 = Rp30.000.000.',
      },
      {
        rumusan:
          'Pinjaman sebesar Rp16.000.000 dilunasi dengan anuitas Rp2.400.000 per bulan dan suku bunga 1,5% per bulan. Besar angsuran pada bulan pertama adalah ....',
        correctOption: 'Rp2.160.000',
        distractors: ['Rp240.000', 'Rp2.040.000', 'Rp2.100.000', 'Rp2.240.000'],
        pembahasanHint: 'b₁ = 1,5% × 16.000.000 = 240.000 → a₁ = 2.400.000 − 240.000 = Rp2.160.000.',
      },
    ];

    const hotsItems = [
      {
        rumusan:
          'Pinjaman sebesar Rp12.000.000 akan dilunasi dalam 6 anuitas tahunan dengan suku bunga 5% per tahun. Jika diketahui (1,05)⁻⁶ ≈ 0,75, besar anuitas per tahun adalah ....',
        correctOption: 'Rp2.400.000',
        distractors: ['Rp2.000.000', 'Rp2.200.000', 'Rp2.600.000', 'Rp3.000.000'],
        pembahasanHint:
          'A = (M · i) / (1 − (1 + i)⁻ⁿ) = (12.000.000 × 0,05) / (1 − 0,75) = 600.000 / 0,25 = Rp2.400.000.',
      },
      {
        rumusan:
          'Suatu pinjaman dilunasi dengan anuitas Rp1.500.000 per bulan dan suku bunga 2% per bulan. Jika angsuran bulan ke-2 sebesar Rp1.020.000, besar pokok pinjaman mula-mula adalah ....',
        correctOption: 'Rp25.000.000',
        distractors: ['Rp20.000.000', 'Rp24.000.000', 'Rp25.500.000', 'Rp30.000.000'],
        pembahasanHint:
          'a₁ = 1.020.000 ÷ 1,02 = 1.000.000 → b₁ = 1.500.000 − 1.000.000 = 500.000 → M = 500.000 ÷ 0,02 = Rp25.000.000.',
      },
      {
        rumusan:
          'Pinjaman sebesar Rp40.000.000 dilunasi dengan anuitas tahunan Rp10.000.000 dan bunga 5% per tahun. Besar sisa pinjaman setelah pembayaran anuitas tahun ke-2 adalah ....',
        correctOption: 'Rp23.600.000',
        distractors: ['Rp20.000.000', 'Rp22.000.000', 'Rp24.000.000', 'Rp32.000.000'],
        pembahasanHint:
          'Th 1: b₁ = 2.000.000, a₁ = 8.000.000, S₁ = 32.000.000. Th 2: b₂ = 5% × 32.000.000 = 1.600.000, a₂ = 8.400.000, S₂ = 32.000.000 − 8.400.000 = Rp23.600.000.',
      },
      {
        rumusan:
          'Seorang pelaku UMKM meminjam modal Rp30.000.000 dengan pelunasan anuitas Rp4.500.000 per bulan dan bunga 2% per bulan. Besar bunga yang harus dibayar pada bulan ke-2 adalah ....',
        correctOption: 'Rp522.000',
        distractors: ['Rp480.000', 'Rp510.000', 'Rp540.000', 'Rp600.000'],
        pembahasanHint:
          'b₁ = 2% × 30.000.000 = 600.000 → a₁ = 3.900.000 → S₁ = 26.100.000. b₂ = 2% × 26.100.000 = Rp522.000.',
      },
      {
        rumusan:
          'Sebuah pinjaman dilunasi dengan 5 kali anuitas dengan faktor anuitas i / (1 − (1 + i)⁻⁵) = 0,25. Jika pinjaman awal sebesar Rp16.000.000 dengan bunga 6% per periode, besar angsuran pada periode pertama adalah ....',
        correctOption: 'Rp3.040.000',
        distractors: ['Rp2.960.000', 'Rp3.200.000', 'Rp3.500.000', 'Rp4.000.000'],
        pembahasanHint:
          'A = 16.000.000 × 0,25 = 4.000.000. b₁ = 6% × 16.000.000 = 960.000. a₁ = 4.000.000 − 960.000 = Rp3.040.000.',
      },
      {
        rumusan:
          'Pinjaman Rp50.000.000 dilunasi dengan anuitas Rp6.000.000 per bulan dan bunga 2% per bulan. Selisih angsuran bulan ke-2 dan bulan ke-1 adalah ....',
        correctOption: 'Rp100.000',
        distractors: ['Rp50.000', 'Rp120.000', 'Rp200.000', 'Rp1.000.000'],
        pembahasanHint:
          'b₁ = 1.000.000 → a₁ = 5.000.000. a₂ = 5.000.000 × 1,02 = 5.100.000. Selisih = Rp100.000.',
      },
      {
        rumusan:
          'Pinjaman sebesar Rp24.000.000 dilunasi dalam 10 periode anuitas dengan suku bunga 4% per periode. Jika diketahui (1,04)⁻¹⁰ ≈ 0,68, besar anuitas per periode adalah ....',
        correctOption: 'Rp3.000.000',
        distractors: ['Rp2.400.000', 'Rp2.800.000', 'Rp3.200.000', 'Rp3.500.000'],
        pembahasanHint:
          'A = (24.000.000 × 0,04) / (1 − 0,68) = 960.000 / 0,32 = Rp3.000.000.',
      },
      {
        rumusan:
          'Pinjaman sebesar Rp20.000.000 dilunasi dengan anuitas tahunan Rp5.000.000 dan suku bunga 10% per tahun. Sisa pinjaman setelah pembayaran anuitas tahun ke-2 adalah ....',
        correctOption: 'Rp13.700.000',
        distractors: ['Rp10.000.000', 'Rp12.000.000', 'Rp13.300.000', 'Rp14.000.000'],
        pembahasanHint:
          'Th 1: b₁ = 2.000.000, a₁ = 3.000.000, S₁ = 17.000.000. Th 2: b₂ = 1.700.000, a₂ = 3.300.000, S₂ = Rp13.700.000.',
      },
      {
        rumusan:
          'Suatu pinjaman dilunasi dengan anuitas Rp2.500.000 per bulan. Jika angsuran bulan ke-1 adalah Rp2.000.000 dan angsuran bulan ke-2 adalah Rp2.100.000, besar pokok pinjaman awal adalah ....',
        correctOption: 'Rp10.000.000',
        distractors: ['Rp8.000.000', 'Rp12.500.000', 'Rp15.000.000', 'Rp20.000.000'],
        pembahasanHint:
          '1 + i = 2.100.000 ÷ 2.000.000 = 1,05 → i = 5%. b₁ = 2.500.000 − 2.000.000 = 500.000 → M = 500.000 ÷ 0,05 = Rp10.000.000.',
      },
      {
        rumusan:
          'Pinjaman Rp30.000.000 dilunasi dengan anuitas tahunan Rp6.000.000 dan suku bunga 5% per tahun. Besar bunga pada tahun ke-2 adalah ....',
        correctOption: 'Rp1.275.000',
        distractors: ['Rp1.200.000', 'Rp1.350.000', 'Rp1.425.000', 'Rp1.500.000'],
        pembahasanHint:
          'b₁ = 1.500.000 → a₁ = 4.500.000 → S₁ = 25.500.000. b₂ = 5% × 25.500.000 = Rp1.275.000.',
      },
    ];

    if (tier === 'LOTS') return pickByIdx(lotsItems, variantIdx);
    if (tier === 'MOTS') return pickByIdx(motsItems, variantIdx);
    return pickByIdx(hotsItems, variantIdx);
  }

  if (type === 'JAWABAN_SINGKAT') {
    const jsItems = [
      {
        rumusan:
          'Suatu pinjaman dilunasi dengan anuitas Rp2.400.000 per bulan. Jika bunga bulan ke-1 sebesar Rp400.000, berapakah besar angsuran bulan ke-1?',
        kunciSingkat: 'Rp2.000.000',
        pembahasanHint: 'a₁ = A − b₁ = 2.400.000 − 400.000 = Rp2.000.000.',
      },
      {
        rumusan:
          'Pinjaman Rp10.000.000 dilunasi dengan anuitas dan suku bunga 3% per bulan. Berapakah besar bunga pada bulan ke-1?',
        kunciSingkat: 'Rp300.000',
        pembahasanHint: 'b₁ = 3% × 10.000.000 = Rp300.000.',
      },
      {
        rumusan:
          'Pada suatu pelunasan anuitas, diketahui angsuran bulan ke-1 Rp1.500.000 dan bunga bulan ke-1 Rp500.000. Berapakah besar anuitasnya?',
        kunciSingkat: 'Rp2.000.000',
        pembahasanHint: 'A = a₁ + b₁ = 1.500.000 + 500.000 = Rp2.000.000.',
      },
      {
        rumusan:
          'Pinjaman sebesar Rp20.000.000 dilunasi dengan anuitas Rp4.000.000 per tahun dan bunga 5% per tahun. Berapakah sisa pinjaman setelah pembayaran tahun ke-1?',
        kunciSingkat: 'Rp17.000.000',
        pembahasanHint:
          'b₁ = 5% × 20.000.000 = 1.000.000 → a₁ = 3.000.000 → S₁ = 20.000.000 − 3.000.000 = Rp17.000.000.',
      },
      {
        rumusan:
          'Diketahui angsuran bulan ke-1 suatu pinjaman anuitas adalah Rp2.000.000 dengan bunga 2% per bulan. Berapakah besar angsuran pada bulan ke-2?',
        kunciSingkat: 'Rp2.040.000',
        pembahasanHint: 'a₂ = a₁(1 + i) = 2.000.000 × 1,02 = Rp2.040.000.',
      },
      {
        rumusan:
          'Sebuah pinjaman Rp15.000.000 dilunasi dengan anuitas Rp3.000.000 per bulan dan bunga 2% per bulan. Berapakah besar angsuran bulan pertama?',
        kunciSingkat: 'Rp2.700.000',
        pembahasanHint:
          'b₁ = 2% × 15.000.000 = 300.000 → a₁ = 3.000.000 − 300.000 = Rp2.700.000.',
      },
      {
        rumusan:
          'Suatu pinjaman memiliki anuitas Rp3.500.000 per bulan. Jika besar bunga pada bulan ke-2 adalah Rp550.000, berapakah besar angsuran pada bulan ke-2?',
        kunciSingkat: 'Rp2.950.000',
        pembahasanHint: 'a₂ = 3.500.000 − 550.000 = Rp2.950.000.',
      },
      {
        rumusan:
          'Pinjaman Rp24.000.000 dilunasi dengan anuitas Rp4.000.000 per tahun dan suku bunga 5% per tahun. Berapakah besar angsuran pada tahun pertama?',
        kunciSingkat: 'Rp2.800.000',
        pembahasanHint: 'b₁ = 5% × 24.000.000 = 1.200.000 → a₁ = 4.000.000 − 1.200.000 = Rp2.800.000.',
      },
    ];
    return pickByIdx(jsItems, variantIdx);
  }

  if (type === 'MENJODOHKAN') {
    const matchVariants = [
      {
        rumusan:
          'Pasangkanlah permasalahan perhitungan anuitas pada kolom kiri dengan hasil perhitungannya yang tepat pada kolom kanan!',
        pairs: [
          {
            premise: 'A = Rp2.500.000, b₁ = Rp500.000 → Angsuran ke-1 (a₁)',
            match: 'Rp2.000.000',
          },
          {
            premise: 'Pinjaman Rp10.000.000, bunga 3%/bulan → Bunga ke-1 (b₁)',
            match: 'Rp300.000',
          },
          {
            premise: 'a₁ = Rp1.000.000, bunga 2%/bulan → Angsuran ke-2 (a₂)',
            match: 'Rp1.020.000',
          },
        ],
        pembahasanHint:
          'Gunakan hubungan A = aₙ + bₙ, b₁ = i × M, dan a₂ = a₁(1 + i).',
      },
      {
        rumusan:
          'Jodohkanlah komponen perhitungan pelunasan anuitas di kolom kiri dengan nilai yang benar di kolom kanan!',
        pairs: [
          {
            premise: 'a₃ = Rp1.800.000, b₃ = Rp400.000 → Besar anuitas (A)',
            match: 'Rp2.200.000',
          },
          {
            premise: 'M = Rp20.000.000, a₁ = Rp3.500.000 → Sisa pinjaman ke-1 (S₁)',
            match: 'Rp16.500.000',
          },
          {
            premise: 'b₁ = Rp600.000 dengan bunga 3%/bulan → Pinjaman awal (M)',
            match: 'Rp20.000.000',
          },
        ],
        pembahasanHint: 'S₁ = M − a₁ dan M = b₁ ÷ i.',
      },
      {
        rumusan:
          'Pasangkanlah soal hitungan angsuran anuitas pada kolom kiri dengan jawabannya yang sesuai pada kolom kanan!',
        pairs: [
          {
            premise: 'Pinjaman Rp12.000.000, A = Rp2.600.000, i = 5% → a₁',
            match: 'Rp2.000.000',
          },
          {
            premise: 'a₁ = Rp2.000.000, i = 5% → Angsuran ke-2 (a₂)',
            match: 'Rp2.100.000',
          },
          {
            premise: 'A = Rp2.600.000, a₂ = Rp2.100.000 → Bunga ke-2 (b₂)',
            match: 'Rp500.000',
          },
        ],
        pembahasanHint: 'b₁ = 600.000 → a₁ = 2.000.000 → a₂ = 2.100.000 → b₂ = 500.000.',
      },
    ];
    return pickByIdx(matchVariants, variantIdx);
  }

  // ESAY Anuitas
  const esayItems = [
    {
      rumusan:
        'Pinjaman sebesar Rp10.000.000 dilunasi dengan sistem anuitas bulanan sebesar Rp1.200.000 dan suku bunga 2% per bulan. Hitunglah: (a) besar bunga bulan ke-1, (b) besar angsuran bulan ke-1, dan (c) sisa pinjaman setelah pembayaran bulan ke-1!',
      kunciEsaiSteps: [
        'Menghitung bunga bulan ke-1: b₁ = 2% × Rp10.000.000 = Rp200.000',
        'Menghitung angsuran bulan ke-1: a₁ = A − b₁ = Rp1.200.000 − Rp200.000 = Rp1.000.000',
        'Menghitung sisa pinjaman bulan ke-1: S₁ = Rp10.000.000 − Rp1.000.000 = Rp9.000.000',
      ] as [string, string, string],
      pembahasanHint:
        'b₁ = Rp200.000, a₁ = Rp1.000.000, dan S₁ = Rp9.000.000.',
    },
    {
      rumusan:
        'Suatu pinjaman sebesar Rp20.000.000 dilunasi dengan anuitas tahunan sebesar Rp5.000.000 dan suku bunga 5% per tahun. Hitunglah besar bunga, angsuran, dan sisa pinjaman pada akhir tahun ke-1 dan akhir tahun ke-2!',
      kunciEsaiSteps: [
        'Tahun ke-1: b₁ = 5% × 20.000.000 = Rp1.000.000; a₁ = Rp4.000.000; S₁ = Rp16.000.000',
        'Tahun ke-2: b₂ = 5% × 16.000.000 = Rp800.000; a₂ = Rp5.000.000 − Rp800.000 = Rp4.200.000',
        'Sisa pinjaman akhir tahun ke-2: S₂ = Rp16.000.000 − Rp4.200.000 = Rp11.800.000',
      ] as [string, string, string],
      pembahasanHint:
        'Akhir tahun ke-1 sisa Rp16.000.000; akhir tahun ke-2 sisa Rp11.800.000.',
    },
    {
      rumusan:
        'Diketahui angsuran pertama sebuah pinjaman anuitas adalah Rp2.000.000 dengan suku bunga 3% per bulan. Jika besar anuitasnya Rp2.600.000 per bulan, hitunglah besar pokok pinjaman awal dan besar angsuran pada bulan ke-2!',
      kunciEsaiSteps: [
        'Menentukan bunga bulan ke-1: b₁ = A − a₁ = Rp2.600.000 − Rp2.000.000 = Rp600.000',
        'Menghitung pokok pinjaman awal: M = b₁ ÷ i = Rp600.000 ÷ 0,03 = Rp20.000.000',
        'Menghitung angsuran bulan ke-2: a₂ = a₁(1 + i) = Rp2.000.000 × 1,03 = Rp2.060.000',
      ] as [string, string, string],
      pembahasanHint: 'M = Rp20.000.000 dan a₂ = Rp2.060.000.',
    },
    {
      rumusan:
        'Pinjaman sebesar Rp12.000.000 dilunasi dalam 6 periode anuitas dengan suku bunga 5% per periode. Jika diketahui (1,05)⁻⁶ ≈ 0,75, hitunglah besar anuitas per periode serta besar angsuran pada periode pertama!',
      kunciEsaiSteps: [
        'Menghitung anuitas: A = (12.000.000 × 0,05) / (1 − 0,75) = 600.000 / 0,25 = Rp2.400.000',
        'Menghitung bunga periode pertama: b₁ = 5% × 12.000.000 = Rp600.000',
        'Menghitung angsuran periode pertama: a₁ = Rp2.400.000 − Rp600.000 = Rp1.800.000',
      ] as [string, string, string],
      pembahasanHint: 'A = Rp2.400.000 dan a₁ = Rp1.800.000.',
    },
    {
      rumusan:
        'Pada pelunasan anuitas bulanan dengan bunga 2% per bulan, besar angsuran bulan ke-1 adalah Rp1.500.000 dan bunga bulan ke-1 adalah Rp500.000. Hitunglah besar anuitas, pokok pinjaman mula-mula, serta besar bunga pada bulan ke-2!',
      kunciEsaiSteps: [
        'Menentukan besar anuitas: A = Rp1.500.000 + Rp500.000 = Rp2.000.000',
        'Menghitung pokok pinjaman awal: M = Rp500.000 ÷ 0,02 = Rp25.000.000',
        'Menghitung a₂ = 1.500.000 × 1,02 = Rp1.530.000, sehingga b₂ = Rp2.000.000 − Rp1.530.000 = Rp470.000',
      ] as [string, string, string],
      pembahasanHint: 'A = Rp2.000.000, M = Rp25.000.000, dan b₂ = Rp470.000.',
    },
    {
      rumusan:
        'Pinjaman sebesar Rp30.000.000 dilunasi dengan sistem anuitas tahunan sebesar Rp6.000.000 dan suku bunga 5% per tahun. Hitunglah besar bunga dan angsuran pada tahun ke-1 serta besar bunga dan angsuran pada tahun ke-2!',
      kunciEsaiSteps: [
        'Tahun ke-1: b₁ = 5% × 30.000.000 = Rp1.500.000; a₁ = Rp6.000.000 − Rp1.500.000 = Rp4.500.000',
        'Sisa pinjaman tahun ke-1: S₁ = Rp30.000.000 − Rp4.500.000 = Rp25.500.000',
        'Tahun ke-2: b₂ = 5% × 25.500.000 = Rp1.275.000; a₂ = Rp6.000.000 − Rp1.275.000 = Rp4.725.000',
      ] as [string, string, string],
      pembahasanHint: 'Tahun ke-1 (b₁ = Rp1.500.000, a₁ = Rp4.500.000); tahun ke-2 (b₂ = Rp1.275.000, a₂ = Rp4.725.000).',
    },
    {
      rumusan:
        'Suatu pinjaman dilunasi dengan anuitas bulanan Rp3.200.000 dan bunga 2% per bulan. Jika angsuran bulan ke-1 adalah Rp2.500.000, hitunglah pokok pinjaman awal, angsuran bulan ke-2, dan bunga bulan ke-2!',
      kunciEsaiSteps: [
        'Menghitung b₁ = Rp3.200.000 − Rp2.500.000 = Rp700.000 → M = 700.000 ÷ 0,02 = Rp35.000.000',
        'Menghitung angsuran bulan ke-2: a₂ = Rp2.500.000 × 1,02 = Rp2.550.000',
        'Menghitung bunga bulan ke-2: b₂ = Rp3.200.000 − Rp2.550.000 = Rp650.000',
      ] as [string, string, string],
      pembahasanHint: 'M = Rp35.000.000, a₂ = Rp2.550.000, dan b₂ = Rp650.000.',
    },
  ];
  return pickByIdx(esayItems, variantIdx);
}

function getBungaMajemukBlueprint(
  tier: QuestionTier,
  type: QuestionType,
  variantIdx: number
): CalculationBlueprint {
  if (type === 'PG') {
    const lotsItems = [
      {
        rumusan:
          'Modal sebesar Rp5.000.000 diinvestasikan dengan bunga majemuk 10% per tahun. Nilai modal setelah 2 tahun adalah ....',
        correctOption: 'Rp6.050.000',
        distractors: ['Rp5.500.000', 'Rp6.000.000', 'Rp6.250.000', 'Rp6.500.000'],
        pembahasanHint: 'M₂ = 5.000.000 × (1 + 0,10)² = 5.000.000 × 1,21 = Rp6.050.000.',
      },
      {
        rumusan:
          'Tabungan sebesar Rp2.000.000 disimpan dengan bunga majemuk 10% per tahun selama 2 tahun. Jumlah tabungan di akhir tahun ke-2 adalah ....',
        correctOption: 'Rp2.420.000',
        distractors: ['Rp2.200.000', 'Rp2.400.000', 'Rp2.500.000', 'Rp2.620.000'],
        pembahasanHint: 'M₂ = 2.000.000 × (1,1)² = 2.000.000 × 1,21 = Rp2.420.000.',
      },
      {
        rumusan:
          'Modal sebesar Rp10.000.000 ditabung dengan bunga majemuk 10% per tahun. Besar modal pada akhir tahun ke-1 adalah ....',
        correctOption: 'Rp11.000.000',
        distractors: ['Rp10.100.000', 'Rp10.500.000', 'Rp11.100.000', 'Rp12.000.000'],
        pembahasanHint: 'M₁ = 10.000.000 × (1 + 0,1)¹ = Rp11.000.000.',
      },
      {
        rumusan:
          'Rumus untuk menentukan nilai akhir modal M₀ setelah n periode dengan suku bunga majemuk i per periode adalah ....',
        correctOption: 'Mₙ = M₀(1 + i)ⁿ',
        distractors: [
          'Mₙ = M₀(1 + n·i)',
          'Mₙ = M₀(1 − i)ⁿ',
          'Mₙ = M₀ · iⁿ',
          'Mₙ = M₀ + n(1 + i)',
        ],
        pembahasanHint: 'Rumus baku bunga majemuk adalah Mₙ = M₀(1 + i)ⁿ.',
      },
      {
        rumusan:
          'Modal sebesar Rp4.000.000 dibungakan dengan bunga majemuk 5% per tahun selama 2 tahun. Nilai akhir modal tersebut adalah ....',
        correctOption: 'Rp4.410.000',
        distractors: ['Rp4.200.000', 'Rp4.400.000', 'Rp4.450.000', 'Rp4.500.000'],
        pembahasanHint: 'M₂ = 4.000.000 × (1,05)² = 4.000.000 × 1,1025 = Rp4.410.000.',
      },
      {
        rumusan:
          'Uang sebesar Rp1.000.000 didepositokan dengan bunga majemuk 10% per tahun selama 3 tahun. Nilai akhirnya adalah ....',
        correctOption: 'Rp1.331.000',
        distractors: ['Rp1.300.000', 'Rp1.310.000', 'Rp1.330.000', 'Rp1.464.100'],
        pembahasanHint: 'M₃ = 1.000.000 × (1,1)³ = 1.000.000 × 1,331 = Rp1.331.000.',
      },
      {
        rumusan:
          'Modal sebesar Rp6.000.000 diinvestasikan dengan bunga majemuk 10% per tahun selama 2 tahun. Nilai akhir modal tersebut adalah ....',
        correctOption: 'Rp7.260.000',
        distractors: ['Rp6.600.000', 'Rp7.200.000', 'Rp7.320.000', 'Rp7.500.000'],
        pembahasanHint: 'M₂ = 6.000.000 × (1,1)² = 6.000.000 × 1,21 = Rp7.260.000.',
      },
      {
        rumusan:
          'Modal sebesar Rp8.000.000 disimpan dengan bunga majemuk 5% per tahun selama 2 tahun. Jumlah modal akhir pada tahun ke-2 adalah ....',
        correctOption: 'Rp8.820.000',
        distractors: ['Rp8.400.000', 'Rp8.800.000', 'Rp8.850.000', 'Rp8.900.000'],
        pembahasanHint: 'M₂ = 8.000.000 × (1,05)² = 8.000.000 × 1,1025 = Rp8.820.000.',
      },
      {
        rumusan:
          'Tabungan awal sebesar Rp3.000.000 mendapat bunga majemuk 10% per tahun. Saldo tabungan setelah 3 tahun adalah ....',
        correctOption: 'Rp3.993.000',
        distractors: ['Rp3.900.000', 'Rp3.930.000', 'Rp3.960.000', 'Rp4.100.000'],
        pembahasanHint: 'M₃ = 3.000.000 × (1,1)³ = 3.000.000 × 1,331 = Rp3.993.000.',
      },
      {
        rumusan:
          'Modal sebesar Rp15.000.000 disimpan di bank dengan bunga majemuk 4% per tahun. Nilai modal pada akhir tahun pertama adalah ....',
        correctOption: 'Rp15.600.000',
        distractors: ['Rp15.040.000', 'Rp15.400.000', 'Rp15.800.000', 'Rp16.200.000'],
        pembahasanHint: 'M₁ = 15.000.000 × 1,04 = Rp15.600.000.',
      },
    ];

    const motsItems = [
      {
        rumusan:
          'Modal sebesar Rp10.000.000 disimpan di bank dengan bunga majemuk 10% per tahun. Besar bunga yang diperoleh selama 3 tahun adalah ....',
        correctOption: 'Rp3.310.000',
        distractors: ['Rp3.000.000', 'Rp3.100.000', 'Rp3.300.000', 'Rp13.310.000'],
        pembahasanHint:
          'M₃ = 10.000.000 × 1,331 = 13.310.000. Bunga = 13.310.000 − 10.000.000 = Rp3.310.000.',
      },
      {
        rumusan:
          'Setelah 2 tahun ditabung dengan bunga majemuk 10% per tahun, saldo tabungan Budi menjadi Rp12.100.000. Modal awal yang ditabung Budi adalah ....',
        correctOption: 'Rp10.000.000',
        distractors: ['Rp9.900.000', 'Rp10.100.000', 'Rp10.500.000', 'Rp11.000.000'],
        pembahasanHint: 'M₀ = 12.100.000 ÷ (1,1)² = 12.100.000 ÷ 1,21 = Rp10.000.000.',
      },
      {
        rumusan:
          'Seseorang menabung Rp8.000.000 dengan bunga majemuk 2% per bulan. Jika diketahui (1,02)³ = 1,0612, jumlah tabungan setelah 3 bulan adalah ....',
        correctOption: 'Rp8.489.600',
        distractors: ['Rp8.480.000', 'Rp8.496.000', 'Rp8.500.000', 'Rp8.612.000'],
        pembahasanHint: 'M₃ = 8.000.000 × 1,0612 = Rp8.489.600.',
      },
      {
        rumusan:
          'Modal Rp6.000.000 didepositokan dengan bunga majemuk 8% per tahun yang dihitung setiap semester selama 2 tahun. Suku bunga per periode dan banyak periode berturut-turut adalah ....',
        correctOption: '4% dan 4 periode',
        distractors: ['8% dan 2 periode', '4% dan 2 periode', '2% dan 4 periode', '8% dan 4 periode'],
        pembahasanHint:
          'Bunga per semester = 8% ÷ 2 = 4%, dan selama 2 tahun terdapat 2 × 2 = 4 periode.',
      },
      {
        rumusan:
          'Modal sebesar Rp5.000.000 disimpan dengan bunga majemuk 8% per tahun yang dimajemukkan setiap semester. Nilai tabungan setelah 1 tahun adalah ....',
        correctOption: 'Rp5.408.000',
        distractors: ['Rp5.400.000', 'Rp5.416.000', 'Rp5.800.000', 'Rp5.832.000'],
        pembahasanHint:
          'i = 4% per semester, n = 2. M₂ = 5.000.000 × (1,04)² = 5.000.000 × 1,0816 = Rp5.408.000.',
      },
      {
        rumusan:
          'Modal Rp20.000.000 diinvestasikan dengan bunga majemuk 5% per tahun. Besar total uang pada akhir tahun ke-2 adalah ....',
        correctOption: 'Rp22.050.000',
        distractors: ['Rp21.000.000', 'Rp22.000.000', 'Rp22.100.000', 'Rp22.500.000'],
        pembahasanHint: 'M₂ = 20.000.000 × (1,05)² = 20.000.000 × 1,1025 = Rp22.050.000.',
      },
      {
        rumusan:
          'Modal sebesar Rp4.000.000 disimpan dengan bunga majemuk 10% per tahun selama 3 tahun. Besar bunga majemuk yang diperoleh selama 3 tahun adalah ....',
        correctOption: 'Rp1.324.000',
        distractors: ['Rp1.200.000', 'Rp1.240.000', 'Rp1.300.000', 'Rp5.324.000'],
        pembahasanHint: 'M₃ = 4.000.000 × 1,331 = 5.324.000 → Bunga = 5.324.000 − 4.000.000 = Rp1.324.000.',
      },
      {
        rumusan:
          'Setelah 2 tahun ditabung dengan bunga majemuk 5% per tahun, saldo tabungan Rika menjadi Rp4.410.000. Modal awal yang ditabung Rika adalah ....',
        correctOption: 'Rp4.000.000',
        distractors: ['Rp3.800.000', 'Rp3.950.000', 'Rp4.100.000', 'Rp4.200.000'],
        pembahasanHint: 'M₀ = 4.410.000 ÷ (1,05)² = 4.410.000 ÷ 1,1025 = Rp4.000.000.',
      },
      {
        rumusan:
          'Modal Rp10.000.000 diinvestasikan dengan bunga majemuk 6% per tahun yang dimajemukkan setiap semester selama 1 tahun. Nilai akhir investasi tersebut adalah ....',
        correctOption: 'Rp10.609.000',
        distractors: ['Rp10.300.000', 'Rp10.600.000', 'Rp10.636.000', 'Rp11.236.000'],
        pembahasanHint: 'i = 3% per semester, n = 2 → M₂ = 10.000.000 × (1,03)² = Rp10.609.000.',
      },
      {
        rumusan:
          'Tabungan Rp12.000.000 disimpan dengan bunga majemuk 5% per tahun selama 2 tahun. Besar bunga yang diperoleh adalah ....',
        correctOption: 'Rp1.230.000',
        distractors: ['Rp1.200.000', 'Rp1.210.000', 'Rp1.260.000', 'Rp13.230.000'],
        pembahasanHint: 'M₂ = 12.000.000 × 1,1025 = 13.230.000 → Bunga = Rp1.230.000.',
      },
    ];

    const hotsItems = [
      {
        rumusan:
          'Andi menabung Rp10.000.000 dengan bunga tunggal 10% per tahun, sedangkan Dina menabung Rp10.000.000 dengan bunga majemuk 10% per tahun. Selisih tabungan mereka setelah 2 tahun adalah ....',
        correctOption: 'Rp100.000',
        distractors: ['Rp50.000', 'Rp150.000', 'Rp200.000', 'Rp210.000'],
        pembahasanHint:
          'Tunggal = 10.000.000 + 2(1.000.000) = 12.000.000. Majemuk = 10.000.000 × 1,21 = 12.100.000. Selisih = Rp100.000.',
      },
      {
        rumusan:
          'Setelah 3 tahun diinvestasikan dengan bunga majemuk 10% per tahun, modal akhir menjadi Rp26.620.000. Besar modal awal investasi tersebut adalah ....',
        correctOption: 'Rp20.000.000',
        distractors: ['Rp18.000.000', 'Rp19.500.000', 'Rp21.000.000', 'Rp22.000.000'],
        pembahasanHint: 'M₀ = 26.620.000 ÷ (1,1)³ = 26.620.000 ÷ 1,331 = Rp20.000.000.',
      },
      {
        rumusan:
          'Modal sebesar Rp4.000.000 berkembang menjadi Rp4.840.000 dalam waktu 2 tahun dengan sistem bunga majemuk tahunan. Besar suku bunga per tahun adalah ....',
        correctOption: '10%',
        distractors: ['8%', '10,5%', '12%', '15%'],
        pembahasanHint:
          '(1 + i)² = 4.840.000 ÷ 4.000.000 = 1,21 → 1 + i = 1,1 → i = 0,1 = 10%.',
      },
      {
        rumusan:
          'Investasi Rp10.000.000 diberi bunga majemuk 12% per tahun yang dimajemukkan setiap kuartal (3 bulan). Nilai investasi setelah 6 bulan (2 kuartal) adalah ....',
        correctOption: 'Rp10.609.000',
        distractors: ['Rp10.600.000', 'Rp10.612.000', 'Rp11.200.000', 'Rp11.236.000'],
        pembahasanHint:
          'i = 12% ÷ 4 = 3% per kuartal, n = 2. M₂ = 10.000.000 × (1,03)² = 10.000.000 × 1,0609 = Rp10.609.000.',
      },
      {
        rumusan:
          'Rina menabung Rp8.000.000 dengan bunga majemuk 5% per tahun selama 2 tahun, sedangkan Sita menabung jumlah yang sama dengan bunga tunggal 5% per tahun selama 2 tahun. Selisih tabungan Rina dan Sita adalah ....',
        correctOption: 'Rp20.000',
        distractors: ['Rp10.000', 'Rp25.000', 'Rp40.000', 'Rp80.000'],
        pembahasanHint:
          'Majemuk = 8.000.000 × 1,1025 = 8.820.000. Tunggal = 8.800.000. Selisih = Rp20.000.',
      },
      {
        rumusan:
          'Sebuah koperasi menawarkan bunga majemuk 20% per tahun. Waktu minimum (dalam tahun bulat) agar modal awal Rp5.000.000 berkembang melampaui Rp8.500.000 adalah ....',
        correctOption: '3 tahun',
        distractors: ['2 tahun', '4 tahun', '5 tahun', '6 tahun'],
        pembahasanHint:
          'Th 2: 5.000.000 × 1,44 = 7.200.000. Th 3: 5.000.000 × 1,728 = 8.640.000 (> 8.500.000). Jadi 3 tahun.',
      },
      {
        rumusan:
          'Modal awal Rp5.000.000 disimpan dengan bunga majemuk 10% per tahun hingga menjadi Rp6.655.000. Lama modal tersebut disimpan adalah ....',
        correctOption: '3 tahun',
        distractors: ['2 tahun', '4 tahun', '5 tahun', '6 tahun'],
        pembahasanHint: '(1,1)ⁿ = 6.655.000 ÷ 5.000.000 = 1,331 = (1,1)³ → n = 3 tahun.',
      },
      {
        rumusan:
          'Modal sebesar Rp8.000.000 berkembang menjadi Rp9.680.000 dalam 2 tahun dengan sistem bunga majemuk tahunan. Besar suku bunga majemuk per tahun adalah ....',
        correctOption: '10%',
        distractors: ['8%', '9%', '11%', '12%'],
        pembahasanHint: '(1 + i)² = 9.680.000 ÷ 8.000.000 = 1,21 → 1 + i = 1,1 → i = 10%.',
      },
      {
        rumusan:
          'Selisih bunga yang diperoleh dari modal Rp20.000.000 selama 2 tahun dengan bunga majemuk 10% per tahun dibandingkan bunga tunggal 10% per tahun adalah ....',
        correctOption: 'Rp200.000',
        distractors: ['Rp100.000', 'Rp150.000', 'Rp250.000', 'Rp400.000'],
        pembahasanHint: 'Majemuk = 24.200.000, Tunggal = 24.000.000 → Selisih = Rp200.000.',
      },
      {
        rumusan:
          'Setelah 2 tahun dibungakan majemuk 10% per tahun, nilai akhir sebuah investasi adalah Rp18.150.000. Besar modal awal investasi tersebut adalah ....',
        correctOption: 'Rp15.000.000',
        distractors: ['Rp14.500.000', 'Rp15.500.000', 'Rp16.000.000', 'Rp16.500.000'],
        pembahasanHint: 'M₀ = 18.150.000 ÷ 1,21 = Rp15.000.000.',
      },
    ];

    if (tier === 'LOTS') return pickByIdx(lotsItems, variantIdx);
    if (tier === 'MOTS') return pickByIdx(motsItems, variantIdx);
    return pickByIdx(hotsItems, variantIdx);
  }

  if (type === 'JAWABAN_SINGKAT') {
    const jsItems = [
      {
        rumusan:
          'Modal Rp3.000.000 diinvestasikan dengan bunga majemuk 10% per tahun. Berapakah nilai akhir modal setelah 2 tahun?',
        kunciSingkat: 'Rp3.630.000',
        pembahasanHint: 'M₂ = 3.000.000 × (1,1)² = 3.000.000 × 1,21 = Rp3.630.000.',
      },
      {
        rumusan:
          'Tabungan Rp5.000.000 mendapat bunga majemuk 10% per tahun selama 2 tahun. Berapakah besar bunga majemuk yang diperoleh?',
        kunciSingkat: 'Rp1.050.000',
        pembahasanHint:
          'M₂ = 5.000.000 × 1,21 = 6.050.000. Bunga = 6.050.000 − 5.000.000 = Rp1.050.000.',
      },
      {
        rumusan:
          'Setelah 2 tahun dengan bunga majemuk 10% per tahun, tabungan akhir menjadi Rp6.050.000. Berapakah modal awalnya?',
        kunciSingkat: 'Rp5.000.000',
        pembahasanHint: 'M₀ = 6.050.000 ÷ 1,21 = Rp5.000.000.',
      },
      {
        rumusan:
          'Modal Rp10.000.000 dibungakan majemuk 10% per tahun selama 3 tahun. Berapakah nilai akhir modal tersebut?',
        kunciSingkat: 'Rp13.310.000',
        pembahasanHint: 'M₃ = 10.000.000 × (1,1)³ = Rp13.310.000.',
      },
      {
        rumusan:
          'Berapakah suku bunga majemuk per tahun jika modal Rp2.000.000 menjadi Rp2.420.000 dalam 2 tahun?',
        kunciSingkat: '10%',
        pembahasanHint: '(1 + i)² = 2.420.000 ÷ 2.000.000 = 1,21 → 1 + i = 1,1 → i = 10%.',
      },
      {
        rumusan:
          'Selisih antara bunga majemuk 10%/tahun dan bunga tunggal 10%/tahun selama 2 tahun untuk modal Rp10.000.000 adalah ....',
        kunciSingkat: 'Rp100.000',
        pembahasanHint: '12.100.000 − 12.000.000 = Rp100.000.',
      },
      {
        rumusan:
          'Modal Rp10.000.000 disimpan dengan bunga majemuk 6% per tahun yang dimajemukkan setiap semester selama 1 tahun. Berapakah nilai akhirnya?',
        kunciSingkat: 'Rp10.609.000',
        pembahasanHint: 'i = 3%, n = 2 → M₂ = 10.000.000 × (1,03)² = Rp10.609.000.',
      },
      {
        rumusan:
          'Modal Rp8.000.000 diinvestasikan dengan bunga majemuk 5% per tahun selama 2 tahun. Berapakah nilai akhir modal tersebut?',
        kunciSingkat: 'Rp8.820.000',
        pembahasanHint: 'M₂ = 8.000.000 × (1,05)² = Rp8.820.000.',
      },
    ];
    return pickByIdx(jsItems, variantIdx);
  }

  if (type === 'MENJODOHKAN') {
    const matchVariants = [
      {
        rumusan:
          'Pasangkanlah soal perhitungan bunga majemuk pada kolom kiri dengan nilai akhirnya yang tepat pada kolom kanan!',
        pairs: [
          {
            premise: 'Modal Rp2.000.000, bunga majemuk 10%/thn, 2 tahun',
            match: 'Rp2.420.000',
          },
          {
            premise: 'Modal Rp10.000.000, bunga majemuk 10%/thn, 3 tahun',
            match: 'Rp13.310.000',
          },
          {
            premise: 'Modal Rp4.000.000, bunga majemuk 5%/thn, 2 tahun',
            match: 'Rp4.410.000',
          },
        ],
        pembahasanHint: 'Gunakan rumus Mₙ = M₀(1 + i)ⁿ.',
      },
      {
        rumusan:
          'Jodohkanlah permasalahan tabungan bunga majemuk di kolom kiri dengan jawaban perhitungannya di kolom kanan!',
        pairs: [
          {
            premise: 'Bunga yang diperoleh Rp5.000.000 selama 2 thn (10%/thn)',
            match: 'Rp1.050.000',
          },
          {
            premise: 'Modal awal jika M₂ = Rp12.100.000 (bunga 10%/thn)',
            match: 'Rp10.000.000',
          },
          {
            premise: 'Nilai akhir Rp5.000.000 bunga 8%/thn per semester (1 thn)',
            match: 'Rp5.408.000',
          },
        ],
        pembahasanHint:
          'Bunga majemuk = Mₙ − M₀; untuk semesteran bagi suku bunga dengan 2 dan kali periode dengan 2.',
      },
    ];
    return pickByIdx(matchVariants, variantIdx);
  }

  // ESAY Bunga Majemuk
  const esayItems = [
    {
      rumusan:
        'Modal sebesar Rp10.000.000 diinvestasikan dengan bunga majemuk 10% per tahun selama 3 tahun. Hitunglah total modal akhir dan besar bunga yang diperoleh!',
      kunciEsaiSteps: [
        'Menuliskan rumus bunga majemuk: M₃ = M₀(1 + i)³ = 10.000.000 × (1 + 0,1)³',
        'Menghitung nilai akhir: M₃ = 10.000.000 × 1,331 = Rp13.310.000',
        'Menghitung besar bunga: B = Rp13.310.000 − Rp10.000.000 = Rp3.310.000',
      ] as [string, string, string],
      pembahasanHint: 'Modal akhir Rp13.310.000 dengan bunga Rp3.310.000.',
    },
    {
      rumusan:
        'Dina menabung Rp8.000.000 dengan bunga majemuk 5% per tahun selama 2 tahun, sedangkan Roni menabung jumlah yang sama dengan bunga tunggal 5% per tahun selama 2 tahun. Hitunglah tabungan masing-masing serta selisihnya!',
      kunciEsaiSteps: [
        'Tabungan Dina (majemuk): M₂ = 8.000.000 × (1,05)² = 8.000.000 × 1,1025 = Rp8.820.000',
        'Tabungan Roni (tunggal): M₂ = 8.000.000 + (2 × 5% × 8.000.000) = Rp8.800.000',
        'Selisih tabungan keduanya = Rp8.820.000 − Rp8.800.000 = Rp20.000',
      ] as [string, string, string],
      pembahasanHint:
        'Dina Rp8.820.000, Roni Rp8.800.000, selisih Rp20.000.',
    },
    {
      rumusan:
        'Setelah 2 tahun diinvestasikan dengan bunga majemuk 10% per tahun, modal akhir menjadi Rp18.150.000. Hitunglah besar modal awal investasi tersebut!',
      kunciEsaiSteps: [
        'Menuliskan rumus M₂ = M₀(1 + i)² → 18.150.000 = M₀ × (1,1)²',
        'Menghitung faktor pengali: (1,1)² = 1,21',
        'Menentukan modal awal: M₀ = 18.150.000 ÷ 1,21 = Rp15.000.000',
      ] as [string, string, string],
      pembahasanHint: 'Modal awal investasi adalah Rp15.000.000.',
    },
    {
      rumusan:
        'Modal Rp5.000.000 disimpan dengan bunga majemuk 8% per tahun yang dimajemukkan setiap semester (6 bulan sekali) selama 1 tahun. Hitunglah nilai tabungan akhir setelah 1 tahun!',
      kunciEsaiSteps: [
        'Menentukan suku bunga per semester i = 8% ÷ 2 = 4% = 0,04 dan banyak periode n = 2',
        'Substitusi ke rumus: M₂ = 5.000.000 × (1 + 0,04)² = 5.000.000 × 1,0816',
        'Menghitung hasil akhir: M₂ = Rp5.408.000',
      ] as [string, string, string],
      pembahasanHint: 'Nilai tabungan akhir setelah 1 tahun adalah Rp5.408.000.',
    },
    {
      rumusan:
        'Modal sebesar Rp4.000.000 dibungakan secara majemuk dengan suku bunga 5% per tahun. Jika diketahui (1,05)³ = 1,157625, hitunglah nilai akhir modal dan besar bunga setelah 3 tahun!',
      kunciEsaiSteps: [
        'Substitusi ke rumus M₃ = 4.000.000 × (1,05)³ = 4.000.000 × 1,157625',
        'Menghitung nilai akhir: M₃ = Rp4.630.500',
        'Menghitung besar bunga: B = Rp4.630.500 − Rp4.000.000 = Rp630.500',
      ] as [string, string, string],
      pembahasanHint: 'Nilai akhir Rp4.630.500 dan bunga Rp630.500.',
    },
    {
      rumusan:
        'Modal awal Rp5.000.000 disimpan dengan bunga majemuk 10% per tahun hingga menjadi Rp6.655.000. Tentukan lama waktu penyimpanan (dalam tahun) beserta pembuktian perhitungannya!',
      kunciEsaiSteps: [
        'Menuliskan persamaan bunga majemuk: 6.655.000 = 5.000.000 × (1,1)ⁿ',
        'Menyederhanakan perbandingan: (1,1)ⁿ = 6.655.000 ÷ 5.000.000 = 1,331',
        'Karena 1,331 = (1,1)³, diperoleh lama waktu penyimpanan n = 3 tahun',
      ] as [string, string, string],
      pembahasanHint: 'Modal disimpan selama 3 tahun.',
    },
    {
      rumusan:
        'Investasi sebesar Rp20.000.000 disimpan dengan bunga majemuk 5% per tahun selama 2 tahun. Hitunglah nilai akhir investasi, besar bunga majemuknya, dan bandingkan dengan bunga tunggal pada suku bunga yang sama!',
      kunciEsaiSteps: [
        'Menghitung nilai akhir bunga majemuk: M₂ = 20.000.000 × (1,05)² = Rp22.050.000 (bunga Rp2.050.000)',
        'Menghitung bunga tunggal 2 tahun: B = 2 × 5% × 20.000.000 = Rp2.000.000',
        'Menyimpulkan selisih keuntungan bunga majemuk lebih besar Rp50.000 daripada bunga tunggal',
      ] as [string, string, string],
      pembahasanHint: 'Bunga majemuk Rp2.050.000 lebih besar Rp50.000 dibanding bunga tunggal Rp2.000.000.',
    },
  ];
  return pickByIdx(esayItems, variantIdx);
}

// ============================================================================
// 2. MATEMATIKA LAINNYA (PG TAMBAHAN + JAWABAN SINGKAT + MENJODOHKAN + ESAY)
// ============================================================================

function getMathExtraPgBlueprint(
  focusText: string,
  subtopic: string,
  tier: QuestionTier,
  variantIdx: number
): CalculationBlueprint | null {
  if (focusText.includes('lingkaran') || focusText.includes('busur') || focusText.includes('juring') || focusText.includes('singgung')) {
    const items = [
      {
        rumusan:
          'Diketahui sebuah lingkaran berjari-jari 14 cm dengan sudut pusat juring 90°. Luas juring tersebut (π = 22/7) adalah ....',
        correctOption: '154 cm²',
        distractors: ['44 cm²', '77 cm²', '308 cm²', '616 cm²'],
        pembahasanHint: 'Luas juring = (90°/360°) × (22/7) × 14² = ¼ × 616 = 154 cm².',
      },
      {
        rumusan:
          'Sebuah lingkaran berjari-jari 21 cm memiliki busur dengan sudut pusat 60°. Panjang busur tersebut (π = 22/7) adalah ....',
        correctOption: '22 cm',
        distractors: ['11 cm', '33 cm', '44 cm', '66 cm'],
        pembahasanHint: 'Panjang busur = (60°/360°) × 2 × (22/7) × 21 = 1/6 × 132 = 22 cm.',
      },
      {
        rumusan:
          'Dua lingkaran berpusat di P dan Q memiliki jari-jari R = 10 cm dan r = 2 cm. Jika jarak PQ = 17 cm, panjang garis singgung persekutuan luar keduanya adalah ....',
        correctOption: '15 cm',
        distractors: ['12 cm', '13 cm', '14 cm', '16 cm'],
        pembahasanHint: 'l = √(17² − (10 − 2)²) = √(289 − 64) = √225 = 15 cm.',
      },
      {
        rumusan:
          'Dua lingkaran berjari-jari 6 cm dan 3 cm memiliki jarak kedua pusat 15 cm. Panjang garis singgung persekutuan dalam kedua lingkaran tersebut adalah ....',
        correctOption: '12 cm',
        distractors: ['9 cm', '10 cm', '13 cm', '14 cm'],
        pembahasanHint: 'd = √(15² − (6 + 3)²) = √(225 − 81) = √144 = 12 cm.',
      },
      {
        rumusan:
          'Jika besar sudut pusat AOB pada sebuah lingkaran adalah 110°, besar sudut keliling ACB yang menghadap busur AB yang sama adalah ....',
        correctOption: '55°',
        distractors: ['45°', '70°', '110°', '220°'],
        pembahasanHint: 'Sudut keliling = ½ × sudut pusat = ½ × 110° = 55°.',
      },
      {
        rumusan:
          'Persamaan lingkaran yang berpusat di titik O(0, 0) dan berjari-jari 5 adalah ....',
        correctOption: 'x² + y² = 25',
        distractors: ['x² + y² = 5', 'x² + y² = 10', 'x² − y² = 25', '(x − 5)² + y² = 25'],
        pembahasanHint: 'Persamaan lingkaran pusat (0, 0) berjari-jari r adalah x² + y² = r² = 25.',
      },
    ];
    return pickByIdx(items, variantIdx);
  }

  if (focusText.includes('limit')) {
    const items = [
      {
        rumusan: 'Nilai dari lim (x→2) (x² − 4) / (x − 2) adalah ....',
        correctOption: '4',
        distractors: ['0', '2', '6', '8'],
        pembahasanHint: 'Faktorkan (x − 2)(x + 2)/(x − 2) = x + 2 → 2 + 2 = 4.',
      },
      {
        rumusan: 'Nilai dari lim (x→3) (x² − 9) / (x − 3) adalah ....',
        correctOption: '6',
        distractors: ['0', '3', '9', '12'],
        pembahasanHint: 'Faktorkan menjadi x + 3 → 3 + 3 = 6.',
      },
      {
        rumusan: 'Hasil dari lim (x→1) (2x² + 3x − 1) adalah ....',
        correctOption: '4',
        distractors: ['2', '3', '5', '6'],
        pembahasanHint: 'Substitusi langsung: 2(1)² + 3(1) − 1 = 4.',
      },
      {
        rumusan: 'Nilai dari lim (x→∞) (4x² + 3x − 1) / (2x² − 5x + 7) adalah ....',
        correctOption: '2',
        distractors: ['0', '1', '4', '∞'],
        pembahasanHint: 'Pangkat tertinggi sama (x²), bagi koefisiennya: 4 / 2 = 2.',
      },
      {
        rumusan: 'Nilai dari lim (x→2) (x² − 5x + 6) / (x − 2) adalah ....',
        correctOption: '−1',
        distractors: ['−2', '0', '1', '2'],
        pembahasanHint: '(x − 2)(x − 3)/(x − 2) = x − 3 → 2 − 3 = −1.',
      },
      {
        rumusan: 'Nilai dari lim (x→4) (x − 4) / (√x − 2) adalah ....',
        correctOption: '4',
        distractors: ['1', '2', '6', '8'],
        pembahasanHint: 'Faktorkan (√x − 2)(√x + 2)/(√x − 2) = √x + 2 → √4 + 2 = 4.',
      },
    ];
    return pickByIdx(items, variantIdx);
  }

  if (focusText.includes('turunan') || focusText.includes('diferensial')) {
    const items = [
      {
        rumusan: "Diketahui fungsi f(x) = 3x² − 4x + 7. Turunan pertama f'(x) adalah ....",
        correctOption: '6x − 4',
        distractors: ['3x − 4', '6x + 7', '6x² − 4', '3x² − 4'],
        pembahasanHint: "f'(x) = 6x − 4.",
      },
      {
        rumusan: "Jika f(x) = x³ − 2x² + 5x − 3, nilai dari f'(2) adalah ....",
        correctOption: '9',
        distractors: ['5', '7', '11', '13'],
        pembahasanHint: "f'(x) = 3x² − 4x + 5 → f'(2) = 12 − 8 + 5 = 9.",
      },
      {
        rumusan: 'Gradien garis singgung kurva y = x² − 4x + 5 di titik berabsis x = 3 adalah ....',
        correctOption: '2',
        distractors: ['−2', '0', '3', '6'],
        pembahasanHint: "m = y'(3) = 2(3) − 4 = 2.",
      },
      {
        rumusan: 'Nilai x pembuat stasioner dari fungsi f(x) = x² − 8x + 12 adalah ....',
        correctOption: 'x = 4',
        distractors: ['x = 2', 'x = 6', 'x = −4', 'x = 8'],
        pembahasanHint: "Syarat stasioner f'(x) = 0 → 2x − 8 = 0 → x = 4.",
      },
      {
        rumusan: 'Sebuah benda bergerak mengikuti persamaan jarak s(t) = 2t³ − 3t² + 4t (meter). Kecepatan benda pada saat t = 2 detik adalah ....',
        correctOption: '16 m/s',
        distractors: ['8 m/s', '12 m/s', '20 m/s', '24 m/s'],
        pembahasanHint: "v(t) = s'(t) = 6t² − 6t + 4 → v(2) = 24 − 12 + 4 = 16 m/s.",
      },
      {
        rumusan: "Diketahui fungsi f(x) = 4x³ − 6x + 9. Turunan kedua f''(x) adalah ....",
        correctOption: '24x',
        distractors: ['12x² − 6', '12x', '24x − 6', '4x²'],
        pembahasanHint: "f'(x) = 12x² − 6 → f''(x) = 24x.",
      },
    ];
    return pickByIdx(items, variantIdx);
  }

  if (focusText.includes('integral')) {
    const items = [
      {
        rumusan: 'Hasil dari ∫ (6x² + 4x − 3) dx adalah ....',
        correctOption: '2x³ + 2x² − 3x + C',
        distractors: [
          '6x³ + 4x² − 3x + C',
          '3x³ + 2x² − 3x + C',
          '2x³ + 4x² − 3 + C',
          '12x + 4 + C',
        ],
        pembahasanHint: '∫ 6x² dx = 2x³, ∫ 4x dx = 2x², ∫ −3 dx = −3x + C.',
      },
      {
        rumusan: 'Nilai integral tentu ∫₀² (3x² + 2x) dx adalah ....',
        correctOption: '12',
        distractors: ['8', '10', '14', '16'],
        pembahasanHint: '[x³ + x²]₀² = (8 + 4) − 0 = 12.',
      },
      {
        rumusan: 'Nilai dari ∫₁³ (2x + 1) dx adalah ....',
        correctOption: '10',
        distractors: ['6', '8', '12', '14'],
        pembahasanHint: '[x² + x]₁³ = (9 + 3) − (1 + 1) = 12 − 2 = 10.',
      },
      {
        rumusan: "Diketahui f'(x) = 4x − 3 dan f(2) = 5. Rumus fungsi f(x) adalah ....",
        correctOption: '2x² − 3x + 3',
        distractors: ['2x² − 3x + 5', '2x² − 3x − 3', '4x² − 3x + 3', '2x² + 3x + 3'],
        pembahasanHint: 'f(x) = 2x² − 3x + C. f(2) = 8 − 6 + C = 5 → C = 3.',
      },
      {
        rumusan: 'Hasil dari ∫ (8x³ − 6x + 5) dx adalah ....',
        correctOption: '2x⁴ − 3x² + 5x + C',
        distractors: [
          '4x⁴ − 3x² + 5x + C',
          '2x⁴ − 6x² + 5x + C',
          '24x² − 6 + C',
          '2x⁴ − 3x² + 5 + C',
        ],
        pembahasanHint: '8/4 x⁴ − 6/2 x² + 5x + C = 2x⁴ − 3x² + 5x + C.',
      },
      {
        rumusan: 'Luas daerah yang dibatasi kurva y = x², sumbu X, x = 0, dan x = 3 adalah ....',
        correctOption: '9 satuan luas',
        distractors: ['3 satuan luas', '6 satuan luas', '12 satuan luas', '27 satuan luas'],
        pembahasanHint: 'L = ∫₀³ x² dx = [⅓x³]₀³ = ⅓(27) = 9 satuan luas.',
      },
    ];
    return pickByIdx(items, variantIdx);
  }

  if (focusText.includes('polinomial') || focusText.includes('suku banyak') || focusText.includes('kompleks')) {
    const items = [
      {
        rumusan: 'Sisa pembagian suku banyak P(x) = x³ − 2x² + 5x − 4 oleh (x − 2) adalah ....',
        correctOption: '6',
        distractors: ['2', '4', '8', '10'],
        pembahasanHint: 'Sisa = P(2) = 8 − 8 + 10 − 4 = 6.',
      },
      {
        rumusan: 'Nilai suku banyak P(x) = 2x³ − x² + 4x − 5 untuk x = −1 adalah ....',
        correctOption: '−12',
        distractors: ['−8', '−6', '−4', '0'],
        pembahasanHint: 'P(−1) = 2(−1) − 1 + 4(−1) − 5 = −2 − 1 − 4 − 5 = −12.',
      },
      {
        rumusan: 'Jika (x − 1) merupakan faktor dari P(x) = x³ − 3x² + kx + 4, nilai k adalah ....',
        correctOption: '−2',
        distractors: ['−4', '0', '2', '4'],
        pembahasanHint: 'P(1) = 1 − 3 + k + 4 = 0 → k + 2 = 0 → k = −2.',
      },
      {
        rumusan: 'Hasil penjumlahan bilangan kompleks (3 + 4i) + (5 − 2i) adalah ....',
        correctOption: '8 + 2i',
        distractors: ['8 − 2i', '2 + 6i', '8 + 6i', '−2 + 2i'],
        pembahasanHint: '(3 + 5) + (4 − 2)i = 8 + 2i.',
      },
      {
        rumusan: 'Hasil perkalian bilangan kompleks (2 + 3i)(1 − i) adalah ....',
        correctOption: '5 + i',
        distractors: ['2 − 3i', '5 − i', '−1 + i', '2 + i'],
        pembahasanHint: '2 − 2i + 3i − 3i² = 2 + i + 3 = 5 + i.',
      },
      {
        rumusan: 'Modulus dari bilangan kompleks z = 6 + 8i adalah ....',
        correctOption: '10',
        distractors: ['2', '14', '48', '100'],
        pembahasanHint: '|z| = √(6² + 8²) = √100 = 10.',
      },
    ];
    return pickByIdx(items, variantIdx);
  }

  if (focusText.includes('transformasi') || focusText.includes('translasi') || focusText.includes('refleksi') || focusText.includes('rotasi') || focusText.includes('dilatasi')) {
    const items = [
      {
        rumusan: 'Bayangan titik A(3, −2) setelah ditranslasikan oleh T = (4, 5) adalah ....',
        correctOption: '(7, 3)',
        distractors: ['(−1, −7)', '(7, −7)', '(−1, 3)', '(12, −10)'],
        pembahasanHint: "A'(3 + 4, −2 + 5) = (7, 3).",
      },
      {
        rumusan: 'Bayangan titik B(−4, 5) jika direfleksikan terhadap sumbu X adalah ....',
        correctOption: '(−4, −5)',
        distractors: ['(4, 5)', '(4, −5)', '(5, −4)', '(−5, 4)'],
        pembahasanHint: 'Refleksi sumbu X: (x, y) → (x, −y) = (−4, −5).',
      },
      {
        rumusan: 'Bayangan titik C(2, 6) jika direfleksikan terhadap garis y = x adalah ....',
        correctOption: '(6, 2)',
        distractors: ['(−2, 6)', '(2, −6)', '(−6, −2)', '(−2, −6)'],
        pembahasanHint: 'Refleksi garis y = x: (x, y) → (y, x) = (6, 2).',
      },
      {
        rumusan: 'Bayangan titik P(3, 5) jika didilatasikan terhadap pusat O(0, 0) dengan faktor skala k = 2 adalah ....',
        correctOption: '(6, 10)',
        distractors: ['(5, 7)', '(1,5, 2,5)', '(−6, −10)', '(6, 5)'],
        pembahasanHint: "P'(2×3, 2×5) = (6, 10).",
      },
      {
        rumusan: 'Bayangan titik Q(4, −1) akibat rotasi sebesar 90° berlawanan arah jarum jam terhadap pusat O(0, 0) adalah ....',
        correctOption: '(1, 4)',
        distractors: ['(−1, −4)', '(−4, 1)', '(4, 1)', '(−1, 4)'],
        pembahasanHint: 'Rotasi +90° pusat O: (x, y) → (−y, x) = (1, 4).',
      },
      {
        rumusan: 'Titik R(−2, 7) ditranslasikan oleh T₁ = (3, −2) lalu dilanjutkan T₂ = (1, 4). Koordinat bayangan akhirnya adalah ....',
        correctOption: '(2, 9)',
        distractors: ['(1, 5)', '(2, 5)', '(4, 9)', '(−2, 9)'],
        pembahasanHint: 'Total translasi T = (4, 2). (−2 + 4, 7 + 2) = (2, 9).',
      },
    ];
    return pickByIdx(items, variantIdx);
  }

  if (focusText.includes('program linear') || focusText.includes('pertidaksamaan') || focusText.includes('spldv')) {
    const items = [
      {
        rumusan: 'Diketahui sistem persamaan linear 2x + y = 8 dan x − y = 1. Nilai x + y adalah ....',
        correctOption: '5',
        distractors: ['3', '4', '6', '7'],
        pembahasanHint: '3x = 9 → x = 3, y = 2 → x + y = 5.',
      },
      {
        rumusan: 'Nilai maksimum fungsi objektif f(x, y) = 4x + 3y pada titik pojok (0, 0), (5, 0), (3, 4), dan (0, 6) adalah ....',
        correctOption: '24',
        distractors: ['18', '20', '22', '26'],
        pembahasanHint: 'f(3, 4) = 12 + 12 = 24 (terbesar dibanding 0, 20, 18).',
      },
      {
        rumusan: 'Nilai minimum f(x, y) = 5x + 4y di antara titik pojok (6, 0), (2, 3), dan (0, 7) adalah ....',
        correctOption: '22',
        distractors: ['20', '24', '28', '30'],
        pembahasanHint: 'f(2, 3) = 10 + 12 = 22 (terkecil dibanding 30 dan 28).',
      },
      {
        rumusan: 'Himpunan penyelesaian dari pertidaksamaan linear 3x − 5 ≤ x + 7 adalah ....',
        correctOption: 'x ≤ 6',
        distractors: ['x ≥ 6', 'x ≤ 1', 'x ≤ 12', 'x < 6'],
        pembahasanHint: '2x ≤ 12 → x ≤ 6.',
      },
      {
        rumusan: 'Harga 3 pensil dan 2 penghapus Rp11.000, sedangkan harga 1 pensil dan 2 penghapus Rp5.000. Harga 1 pensil adalah ....',
        correctOption: 'Rp3.000',
        distractors: ['Rp1.000', 'Rp2.000', 'Rp4.000', 'Rp5.000'],
        pembahasanHint: '2 pensil = 6.000 → 1 pensil = Rp3.000.',
      },
      {
        rumusan: 'Nilai x dan y yang memenuhi 3x + 2y = 12 dan x = 2 adalah ....',
        correctOption: 'x = 2 dan y = 3',
        distractors: ['x = 2 dan y = 4', 'x = 2 dan y = 6', 'x = 3 dan y = 2', 'x = 2 dan y = 2'],
        pembahasanHint: '3(2) + 2y = 12 → 2y = 6 → y = 3.',
      },
    ];
    return pickByIdx(items, variantIdx);
  }

  // Fallback Matematika PG tetap berupa soal hitungan (tidak pernah sekadar teori kosong)
  const cleanSub = subtopic.trim() || 'aljabar';
  const mathFallbackItems = [
    {
      rumusan: `Dalam penerapan ${cleanSub}, jika diketahui nilai f(x) = 3x − 5, nilai dari f(4) + f(2) adalah ....`,
      correctOption: '8',
      distractors: ['6', '7', '9', '12'],
      pembahasanHint: 'f(4) = 12 − 5 = 7 dan f(2) = 6 − 5 = 1, sehingga 7 + 1 = 8.',
    },
    {
      rumusan: `Diketahui persamaan linear 4(x − 2) = 2x + 6. Nilai x yang memenuhi persamaan tersebut adalah ....`,
      correctOption: '7',
      distractors: ['3', '5', '6', '8'],
      pembahasanHint: '4x − 8 = 2x + 6 → 2x = 14 → x = 7.',
    },
    {
      rumusan: `Perbandingan uang A dan B adalah 3 : 5. Jika jumlah uang keduanya Rp400.000, selisih uang mereka adalah ....`,
      correctOption: 'Rp100.000',
      distractors: ['Rp50.000', 'Rp80.000', 'Rp150.000', 'Rp250.000'],
      pembahasanHint: 'Selisih = ((5 − 3)/(3 + 5)) × 400.000 = (2/8) × 400.000 = Rp100.000.',
    },
    {
      rumusan: `Sebuah barang berharga Rp250.000 mendapat diskon 20%. Harga yang harus dibayar setelah diskon adalah ....`,
      correctOption: 'Rp200.000',
      distractors: ['Rp180.000', 'Rp210.000', 'Rp225.000', 'Rp230.000'],
      pembahasanHint: '250.000 × (1 − 0,20) = Rp200.000.',
    },
    {
      rumusan: `Jika a = 4 dan b = −3, nilai dari 2a² − 3ab + b² adalah ....`,
      correctOption: '77',
      distractors: ['59', '68', '71', '85'],
      pembahasanHint: '2(16) − 3(4)(−3) + 9 = 32 + 36 + 9 = 77.',
    },
    {
      rumusan: `Sebuah proyek diselesaikan oleh 12 pekerja dalam 15 hari. Jika dikerjakan oleh 18 pekerja dengan laju sama, waktu selesainya adalah ....`,
      correctOption: '10 hari',
      distractors: ['8 hari', '9 hari', '12 hari', '22,5 hari'],
      pembahasanHint: 'Perbandingan berbalik nilai: (12 × 15) ÷ 18 = 180 ÷ 18 = 10 hari.',
    },
    {
      rumusan: `Nilai rata-rata dari lima bilangan berurutan 14, 16, 18, 20, dan x adalah 18. Nilai x yang memenuhi adalah ....`,
      correctOption: '22',
      distractors: ['18', '20', '24', '26'],
      pembahasanHint: 'Jumlah = 5 × 18 = 90. 14 + 16 + 18 + 20 = 68, maka x = 90 − 68 = 22.',
    },
    {
      rumusan: `Keliling sebuah persegi panjang adalah 54 cm. Jika panjangnya 15 cm, luas persegi panjang tersebut adalah ....`,
      correctOption: '180 cm²',
      distractors: ['150 cm²', '165 cm²', '195 cm²', '225 cm²'],
      pembahasanHint: 'Lebar = (54 ÷ 2) − 15 = 12 cm. Luas = 15 × 12 = 180 cm².',
    },
  ];
  return pickByIdx(mathFallbackItems, variantIdx);
}

function getMathNonPgBlueprint(
  focusText: string,
  subtopic: string,
  type: QuestionType,
  variantIdx: number
): CalculationBlueprint {
  // Jawaban Singkat Hitungan Matematika
  if (type === 'JAWABAN_SINGKAT') {
    if (focusText.includes('logaritma')) {
      return pickByIdx(
        [
          { rumusan: 'Hitunglah nilai dari ²log 32 + ³log 9!', kunciSingkat: '7', pembahasanHint: '5 + 2 = 7.' },
          { rumusan: 'Berapakah hasil dari ²log 24 − ²log 3?', kunciSingkat: '3', pembahasanHint: '²log 8 = 3.' },
          { rumusan: 'Hitunglah nilai dari ⁵log 125 + ²log 1!', kunciSingkat: '3', pembahasanHint: '3 + 0 = 3.' },
          { rumusan: 'Jika ²log(x − 2) = 4, berapakah nilai x?', kunciSingkat: '18', pembahasanHint: 'x − 2 = 16 → x = 18.' },
          { rumusan: 'Hitunglah hasil dari ³log 5 · ⁵log 81!', kunciSingkat: '4', pembahasanHint: '³log 81 = 4.' },
          { rumusan: 'Berapakah nilai dari ⁴log 64?', kunciSingkat: '3', pembahasanHint: '4³ = 64.' },
        ],
        variantIdx
      );
    }
    if (focusText.includes('eksponen') || focusText.includes('pangkat') || focusText.includes('akar')) {
      return pickByIdx(
        [
          { rumusan: 'Hitunglah hasil operasi dari 2⁴ × 2³ ÷ 2⁵!', kunciSingkat: '4', pembahasanHint: '2⁴⁺³⁻⁵ = 2² = 4.' },
          { rumusan: 'Berapakah nilai x yang memenuhi persamaan 3ˣ⁺¹ = 81?', kunciSingkat: '3', pembahasanHint: 'x + 1 = 4 → x = 3.' },
          { rumusan: 'Hitunglah nilai dari √48 + √12 − √27!', kunciSingkat: '3√3', pembahasanHint: '4√3 + 2√3 − 3√3 = 3√3.' },
          { rumusan: 'Berapakah nilai dari (27)^(2/3) + (16)^(1/2)?', kunciSingkat: '13', pembahasanHint: '9 + 4 = 13.' },
          { rumusan: 'Suatu bakteri membelah dua setiap 20 menit. Jika awalnya 10 sel, berapakah jumlah bakteri setelah 1 jam?', kunciSingkat: '80 sel', pembahasanHint: '10 × 2³ = 80 sel.' },
          { rumusan: 'Berapakah hasil dari 5⁰ + 2⁻² × 16?', kunciSingkat: '5', pembahasanHint: '1 + (¼ × 16) = 1 + 4 = 5.' },
        ],
        variantIdx
      );
    }
    if (focusText.includes('barisan') || focusText.includes('deret')) {
      return pickByIdx(
        [
          { rumusan: 'Diketahui barisan aritmetika 4, 9, 14, 19, .... Tentukan nilai suku ke-11!', kunciSingkat: '54', pembahasanHint: 'U₁₁ = 4 + 10(5) = 54.' },
          { rumusan: 'Hitunglah jumlah 10 suku pertama deret aritmetika 2 + 4 + 6 + ...!', kunciSingkat: '110', pembahasanHint: 'S₁₀ = 5(4 + 18) = 110.' },
          { rumusan: 'Diketahui barisan geometri dengan a = 3 dan r = 2. Berapakah nilai suku ke-5?', kunciSingkat: '48', pembahasanHint: 'U₅ = 3 × 2⁴ = 48.' },
          { rumusan: 'Hitunglah jumlah tak hingga deret geometri 18 + 6 + 2 + ...!', kunciSingkat: '27', pembahasanHint: 'S∞ = 18 / (1 − ⅓) = 27.' },
          { rumusan: 'Suku ke-3 barisan aritmetika adalah 12 dan suku ke-6 adalah 24. Berapakah beda barisan tersebut?', kunciSingkat: '4', pembahasanHint: '3b = 12 → b = 4.' },
          { rumusan: 'Berapakah jumlah 4 suku pertama deret geometri 2 + 6 + 18 + ...?', kunciSingkat: '80', pembahasanHint: '2 + 6 + 18 + 54 = 80.' },
        ],
        variantIdx
      );
    }
    if (focusText.includes('trigonometri') || focusText.includes('sudut')) {
      return pickByIdx(
        [
          { rumusan: 'Hitunglah nilai dari 2 · sin 30° + cos 0°!', kunciSingkat: '2', pembahasanHint: '2(½) + 1 = 2.' },
          { rumusan: 'Jika sin α = 3/5 (kuadran I), berapakah nilai cos α?', kunciSingkat: '4/5', pembahasanHint: 'Tripel (3, 4, 5) → 4/5.' },
          { rumusan: 'Hitunglah nilai dari tan 45° + sin 90° − cos 60°!', kunciSingkat: '1,5', pembahasanHint: '1 + 1 − 0,5 = 1,5.' },
          { rumusan: 'Sebuah tangga 10 m bersandar dengan sudut 30° terhadap tanah. Berapa meter ketinggian ujung tangga di dinding?', kunciSingkat: '5 meter', pembahasanHint: '10 × sin 30° = 5 meter.' },
          { rumusan: 'Ubahlah besar sudut 2/3 π radian ke dalam satuan derajat!', kunciSingkat: '120°', pembahasanHint: '(2/3) × 180° = 120°.' },
          { rumusan: 'Berapakah nilai dari sin 150° + cos 60°?', kunciSingkat: '1', pembahasanHint: '0,5 + 0,5 = 1.' },
        ],
        variantIdx
      );
    }
    if (focusText.includes('kuadrat') || focusText.includes('spltv') || focusText.includes('komposisi') || focusText.includes('invers')) {
      return pickByIdx(
        [
          { rumusan: 'Hitunglah nilai diskriminan persamaan kuadrat x² − 5x + 6 = 0!', kunciSingkat: '1', pembahasanHint: 'D = 25 − 24 = 1.' },
          { rumusan: 'Diketahui f(x) = 2x + 3 dan g(x) = x − 4. Hitunglah nilai (f ∘ g)(6)!', kunciSingkat: '7', pembahasanHint: 'g(6) = 2 → f(2) = 7.' },
          { rumusan: 'Jika x + y = 10 dan x − y = 4, berapakah nilai dari 2x + y?', kunciSingkat: '17', pembahasanHint: 'x = 7, y = 3 → 2(7) + 3 = 17.' },
          { rumusan: 'Tentukan koordinat absis titik puncak (xₚ) grafik f(x) = x² − 8x + 12!', kunciSingkat: '4', pembahasanHint: 'xₚ = −(−8)/2 = 4.' },
          { rumusan: 'Jika f(x) = 3x − 7, berapakah nilai f⁻¹(8)?', kunciSingkat: '5', pembahasanHint: '3x − 7 = 8 → x = 5.' },
          { rumusan: 'Jika x₁ dan x₂ akar-akar x² − 9x + 14 = 0, berapakah nilai x₁ · x₂?', kunciSingkat: '14', pembahasanHint: 'c/a = 14.' },
        ],
        variantIdx
      );
    }
    if (focusText.includes('statistika') || focusText.includes('peluang') || focusText.includes('kombinasi') || focusText.includes('permutasi') || focusText.includes('median')) {
      return pickByIdx(
        [
          { rumusan: 'Hitunglah nilai rata-rata dari data: 70, 80, 75, 85, 90!', kunciSingkat: '80', pembahasanHint: '400 ÷ 5 = 80.' },
          { rumusan: 'Sebuah dadu bermata 6 dilempar sekali. Berapakah peluang muncul mata dadu lebih dari 4?', kunciSingkat: '1/3', pembahasanHint: '{5, 6} → 2/6 = 1/3.' },
          { rumusan: 'Hitunglah nilai kombinasi C(6, 2)!', kunciSingkat: '15', pembahasanHint: '(6 × 5) ÷ 2 = 15.' },
          { rumusan: 'Tentukan median dari data: 5, 9, 4, 7, 6, 8, 10!', kunciSingkat: '7', pembahasanHint: 'Urut: 4,5,6,7,8,9,10 → median = 7.' },
          { rumusan: 'Berapakah banyak susunan kata berbeda dari huruf-huruf "MATI"?', kunciSingkat: '24', pembahasanHint: '4! = 24.' },
          { rumusan: 'Peluang hujan hari ini adalah 0,35. Berapakah peluang hari ini tidak hujan?', kunciSingkat: '0,65', pembahasanHint: '1 − 0,35 = 0,65.' },
        ],
        variantIdx
      );
    }

    // General Math Jawaban Singkat
    return pickByIdx(
      [
        { rumusan: `Pada materi ${subtopic}, jika diketahui f(x) = 4x − 3, berapakah nilai f(5)?`, kunciSingkat: '17', pembahasanHint: '4(5) − 3 = 17.' },
        { rumusan: `Tentukan nilai x yang memenuhi persamaan 5x − 7 = 2x + 11!`, kunciSingkat: '6', pembahasanHint: '3x = 18 → x = 6.' },
        { rumusan: `Sebuah benda berharga Rp150.000 didiskon 10%. Berapakah harga bayarnya?`, kunciSingkat: 'Rp135.000', pembahasanHint: '150.000 − 15.000 = Rp135.000.' },
        { rumusan: `Hitunglah luas segitiga dengan alas 12 cm dan tinggi 9 cm!`, kunciSingkat: '54 cm²', pembahasanHint: '½ × 12 × 9 = 54 cm².' },
        { rumusan: `Jika matriks A = [[5, 2], [3, 4]], berapakah nilai determinan matriks A?`, kunciSingkat: '14', pembahasanHint: '(5×4) − (2×3) = 14.' },
        { rumusan: `Hitunglah panjang vektor v = (6, 8)!`, kunciSingkat: '10', pembahasanHint: '√(6² + 8²) = 10.' },
      ],
      variantIdx
    );
  }

  // MENJODOHKAN Hitungan Matematika
  if (type === 'MENJODOHKAN') {
    if (focusText.includes('eksponen') || focusText.includes('logaritma') || focusText.includes('akar')) {
      return pickByIdx(
        [
          {
            rumusan: 'Pasangkanlah bentuk operasi perpangkatan & logaritma di kolom kiri dengan hasil hitungnya di kolom kanan!',
            pairs: [
              { premise: '2³ × 2²', match: '32' },
              { premise: '²log 16 + ³log 9', match: '6' },
              { premise: '√48 − √12', match: '2√3' },
            ],
            pembahasanHint: '2⁵ = 32, 4 + 2 = 6, 4√3 − 2√3 = 2√3.',
          },
          {
            rumusan: 'Jodohkanlah persamaan eksponen dan logaritma di kolom kiri dengan nilai x yang tepat di kolom kanan!',
            pairs: [
              { premise: '2ˣ⁺¹ = 16', match: 'x = 3' },
              { premise: '³log x = 2', match: 'x = 9' },
              { premise: '5²ˣ = 125', match: 'x = 1,5' },
            ],
            pembahasanHint: '2⁴=16 → x=3; 3²=9; 2x=3 → x=1,5.',
          },
        ],
        variantIdx
      );
    }
    if (focusText.includes('barisan') || focusText.includes('deret')) {
      return pickByIdx(
        [
          {
            rumusan: 'Pasangkanlah soal hitungan barisan & deret di kolom kiri dengan hasil penyelesaiannya di kolom kanan!',
            pairs: [
              { premise: 'U₁₀ barisan aritmetika 2, 5, 8, ...', match: '29' },
              { premise: 'U₄ barisan geometri 3, 6, 12, ...', match: '24' },
              { premise: 'S∞ deret geometri 16 + 8 + 4 + ...', match: '32' },
            ],
            pembahasanHint: 'U₁₀ = 2 + 9(3) = 29; U₄ = 3×8 = 24; S∞ = 16/(1−0,5) = 32.',
          },
          {
            rumusan: 'Jodohkanlah perhitungan deret pada kolom kiri dengan nilainya di kolom kanan!',
            pairs: [
              { premise: 'S₅ deret 1 + 3 + 5 + 7 + 9', match: '25' },
              { premise: 'Beda barisan dengan U₂ = 7 dan U₅ = 19', match: '4' },
              { premise: 'Rasio barisan 4, 12, 36, ...', match: '3' },
            ],
            pembahasanHint: '1+3+5+7+9 = 25; (19−7)/3 = 4; 12/4 = 3.',
          },
        ],
        variantIdx
      );
    }
    if (focusText.includes('trigonometri') || focusText.includes('sudut')) {
      return {
        rumusan: 'Pasangkanlah operasi trigonometri di kolom kiri dengan nilai hasilnya di kolom kanan!',
        pairs: [
          { premise: 'sin 30° + cos 60°', match: '1' },
          { premise: 'tan 60° × sin 60°', match: '1,5' },
          { premise: 'cos 0° + tan 45°', match: '2' },
        ],
        pembahasanHint: '½+½=1; √3 × ½√3 = 3/2 = 1,5; 1+1=2.',
      };
    }
    return pickByIdx(
      [
        {
          rumusan: `Pasangkanlah soal hitungan terkait ${subtopic} pada kolom kiri dengan hasil yang benar di kolom kanan!`,
          pairs: [
            { premise: 'Jika f(x) = 2x + 5, nilai f(4)', match: '13' },
            { premise: 'Akar positif dari x² − 5x − 14 = 0', match: '7' },
            { premise: 'Median data 10, 14, 16, 20, 24', match: '16' },
          ],
          pembahasanHint: '2(4)+5=13; (x−7)(x+2)=0 → 7; nilai tengah = 16.',
        },
        {
          rumusan: `Jodohkanlah ekspresi matematika di kolom kiri dengan nilai perhitungannya di kolom kanan!`,
          pairs: [
            { premise: 'Determinan [[4, 1], [2, 3]]', match: '10' },
            { premise: 'Panjang vektor (3, 4)', match: '5' },
            { premise: 'Nilai C(5, 2)', match: '10' },
          ],
          pembahasanHint: '(4×3)−(1×2)=10; √(9+16)=5; (5×4)/2=10.',
        },
      ],
      variantIdx
    );
  }

  // ESAY Hitungan Matematika
  if (focusText.includes('eksponen') || focusText.includes('logaritma')) {
    return pickByIdx(
      [
        {
          rumusan: 'Sebuah koloni bakteri berjumlah 100 sel membelah menjadi dua kali lipat setiap 30 menit. Hitunglah banyak bakteri setelah 2,5 jam dan tuliskan langkah perhitungannya!',
          kunciEsaiSteps: [
            'Menentukan banyak periode pembelahan: n = 150 menit ÷ 30 menit = 5 kali',
            'Substitusi ke rumus pertumbuhan: N = 100 × 2⁵ = 100 × 32',
            'Menuliskan hasil akhir jumlah bakteri setelah 2,5 jam = 3.200 sel',
          ],
          pembahasanHint: 'Jumlah bakteri setelah 2,5 jam adalah 3.200 sel.',
        },
        {
          rumusan: 'Tentukan nilai x yang memenuhi persamaan eksponen 4ˣ⁺¹ = 8ˣ⁻¹ beserta langkah penyederhanaan basisnya!',
          kunciEsaiSteps: [
            'Menyamakan basis pangkat menjadi 2: (2²)ˣ⁺¹ = (2³)ˣ⁻¹ → 2²ˣ⁺² = 2³ˣ⁻³',
            'Menyamakan pangkatnya: 2x + 2 = 3x − 3',
            'Menyelesaikan persamaan linear hingga diperoleh x = 5',
          ],
          pembahasanHint: 'Nilai x = 5.',
        },
        {
          rumusan: 'Diketahui ²log 3 = a dan ²log 5 = b. Nyatakan nilai dari ²log 45 + ²log 8 dalam bentuk variabel a dan b!',
          kunciEsaiSteps: [
            'Menguraikan ²log 45 = ²log(3² × 5) = 2(²log 3) + ²log 5 = 2a + b',
            'Menghitung ²log 8 = ²log(2³) = 3',
            'Menjumlahkan keduanya sehingga diperoleh hasil akhir 2a + b + 3',
          ],
          pembahasanHint: 'Hasil akhirnya adalah 2a + b + 3.',
        },
      ],
      variantIdx
    );
  }

  if (focusText.includes('barisan') || focusText.includes('deret')) {
    return pickByIdx(
      [
        {
          rumusan: 'Sebuah aula pertunjukan memiliki 12 baris kursi. Baris pertama terdapat 18 kursi dan setiap baris berikutnya selalu bertambah 4 kursi. Hitunglah banyak kursi pada baris ke-12 dan jumlah seluruh kursi dalam aula!',
          kunciEsaiSteps: [
            'Mengidentifikasi a = 18, b = 4, n = 12, dan menghitung U₁₂ = 18 + 11(4) = 62 kursi',
            'Menggunakan rumus deret: S₁₂ = ½ × 12 × (18 + 62)',
            'Menghitung total seluruh kursi = 6 × 80 = 480 kursi',
          ],
          pembahasanHint: 'U₁₂ = 62 kursi dan total seluruh kursi = 480 kursi.',
        },
        {
          rumusan: 'Keuntungan seorang pedagang bertambah tetap setiap bulan. Jika keuntungan bulan ke-2 Rp1.200.000 dan bulan ke-5 Rp1.800.000, hitunglah keuntungan bulan pertama dan total keuntungan selama 10 bulan pertama!',
          kunciEsaiSteps: [
            'Mencari beda: 3b = 1.800.000 − 1.200.000 = 600.000 → b = Rp200.000',
            'Mencari suku pertama: a = 1.200.000 − 200.000 = Rp1.000.000',
            'Menghitung S₁₀ = 5 × (2(1.000.000) + 9(200.000)) = Rp19.000.000',
          ],
          pembahasanHint: 'a = Rp1.000.000 dan S₁₀ = Rp19.000.000.',
        },
        {
          rumusan: 'Seutas tali dipotong menjadi 5 bagian yang panjangnya membentuk barisan geometri. Jika potongan terpendek 4 cm dan terpanjang 64 cm, hitunglah rasio dan panjang tali mula-mula!',
          kunciEsaiSteps: [
            'Menentukan rasio: ar⁴ = 64 → 4r⁴ = 64 → r⁴ = 16 → r = 2',
            'Menghitung deret: S₅ = 4(2⁵ − 1) / (2 − 1) = 4 × 31',
            'Menuliskan panjang tali mula-mula = 124 cm',
          ],
          pembahasanHint: 'Rasio r = 2 dan panjang tali mula-mula = 124 cm.',
        },
      ],
      variantIdx
    );
  }

  if (focusText.includes('trigonometri') || focusText.includes('sudut')) {
    return pickByIdx(
      [
        {
          rumusan: 'Seorang siswa berdiri sejauh 20 meter dari kaki sebuah menara dan melihat puncak menara dengan sudut elevasi 45°. Jika tinggi mata siswa dari tanah 1,6 meter, hitunglah tinggi menara tersebut!',
          kunciEsaiSteps: [
            'Memodelkan segitiga siku-siku: tinggi di atas mata = 20 × tan 45°',
            'Menghitung: 20 × 1 = 20 meter',
            'Menambahkan tinggi mata siswa: 20 + 1,6 = 21,6 meter',
          ],
          pembahasanHint: 'Tinggi menara = 21,6 meter.',
        },
        {
          rumusan: 'Pada segitiga siku-siku ABC (siku-siku di B), diketahui panjang sisi AB = 8 cm dan BC = 6 cm. Hitunglah panjang sisi miring AC serta nilai sin A, cos A, dan tan A!',
          kunciEsaiSteps: [
            'Menghitung AC dengan Pythagoras: AC = √(8² + 6²) = √100 = 10 cm',
            'Menentukan sin A = 6/10 = 3/5 dan cos A = 8/10 = 4/5',
            'Menentukan tan A = 6/8 = 3/4',
          ],
          pembahasanHint: 'AC = 10 cm; sin A = 3/5, cos A = 4/5, tan A = 3/4.',
        },
      ],
      variantIdx
    );
  }

  // Fallback Esai Matematika tetap berupa soal perhitungan langkah demi langkah
  return pickByIdx(
    [
      {
        rumusan: `Diberikan fungsi kuadrat f(x) = x² − 6x + 5 terkait ${subtopic}. Tentukanlah: (a) titik potong sumbu X, (b) titik potong sumbu Y, dan (c) koordinat titik puncaknya!`,
        kunciEsaiSteps: [
          'Titik potong sumbu X (y=0): (x − 1)(x − 5) = 0 → (1, 0) dan (5, 0)',
          'Titik potong sumbu Y (x=0): f(0) = 5 → (0, 5)',
          'Koordinat titik puncak: xₚ = 3 dan yₚ = 3² − 6(3) + 5 = −4 → (3, −4)',
        ],
        pembahasanHint: 'Titik potong (1,0), (5,0), (0,5) dan puncak (3, −4).',
      },
      {
        rumusan: 'Harga 2 buku tulis dan 3 pena adalah Rp17.000, sedangkan harga 1 buku tulis dan 2 pena adalah Rp10.000. Hitunglah harga 1 buku tulis, harga 1 pena, dan harga 4 buku tulis + 1 pena!',
        kunciEsaiSteps: [
          'Menyusun model SPLDV: 2x + 3y = 17.000 dan x + 2y = 10.000',
          'Menyelesaikan eliminasi/substitusi hingga diperoleh x = Rp4.000 dan y = Rp3.000',
          'Menghitung 4x + y = 4(4.000) + 3.000 = Rp19.000',
        ],
        pembahasanHint: 'Buku = Rp4.000, Pena = Rp3.000, dan 4 buku + 1 pena = Rp19.000.',
      },
      {
        rumusan: 'Diketahui data nilai ulangan matematika 6 siswa adalah: 70, 80, 75, 85, 90, dan 80. Hitunglah nilai rata-rata (mean), median, dan ragam (varians) data tersebut!',
        kunciEsaiSteps: [
          'Mean = (70 + 80 + 75 + 85 + 90 + 80) ÷ 6 = 480 ÷ 6 = 80',
          'Data urut: 70, 75, 80, 80, 85, 90 → Median = (80 + 80)/2 = 80',
          'Ragam = ((−10)² + (−5)² + 0 + 0 + 5² + 10²) ÷ 6 = 250 ÷ 6 ≈ 41,67',
        ],
        pembahasanHint: 'Mean = 80, Median = 80, Ragam ≈ 41,67.',
      },
    ],
    variantIdx
  );
}

// ============================================================================
// 3. FISIKA (SOAL HITUNGAN PG, JAWABAN SINGKAT, MENJODOHKAN, ESAY)
// ============================================================================

function getFisikaBlueprint(
  focusText: string,
  tier: QuestionTier,
  type: QuestionType,
  variantIdx: number
): CalculationBlueprint {
  if (type === 'PG') {
    if (focusText.includes('ukur') || focusText.includes('besaran') || focusText.includes('satuan') || focusText.includes('angka penting') || focusText.includes('sorong')) {
      return pickByIdx(
        [
          {
            rumusan: 'Sebuah benda bergerak dengan kecepatan 72 km/jam. Nilai kecepatan tersebut jika dinyatakan dalam satuan SI (m/s) adalah ....',
            correctOption: '20 m/s',
            distractors: ['10 m/s', '15 m/s', '25 m/s', '36 m/s'],
            pembahasanHint: '72 km/jam = 72.000 m / 3.600 s = 20 m/s.',
          },
          {
            rumusan: 'Hasil pengukuran panjang pelat adalah 12,45 cm dan lebarnya 3,2 cm. Menurut aturan angka penting, luas pelat tersebut adalah ....',
            correctOption: '40 cm²',
            distractors: ['39,8 cm²', '39,84 cm²', '40,0 cm²', '39 cm²'],
            pembahasanHint: '12,45 × 3,2 = 39,84. Karena 3,2 memiliki 2 angka penting, dibulatkan menjadi 40 cm².',
          },
          {
            rumusan: 'Pengukuran diameter pipa menggunakan jangka sorong menunjukkan skala utama 2,3 cm dan garis skala nonius berimpit pada angka 6 (ketelitian 0,01 cm). Hasil pengukurannya adalah ....',
            correctOption: '2,36 cm',
            distractors: ['2,30 cm', '2,35 cm', '2,46 cm', '2,90 cm'],
            pembahasanHint: '2,3 cm + (6 × 0,01 cm) = 2,36 cm.',
          },
          {
            rumusan: 'Sebuah mikrometer sekrup menunjukkan skala utama 4,5 mm dan skala putar pada angka 28 (ketelitian 0,01 mm). Tebal benda yang diukur adalah ....',
            correctOption: '4,78 mm',
            distractors: ['4,28 mm', '4,58 mm', '4,82 mm', '7,30 mm'],
            pembahasanHint: '4,5 mm + 0,28 mm = 4,78 mm.',
          },
          {
            rumusan: 'Hasil penjumlahan dari dua massa benda 14,25 kg dan 3,4 kg menurut aturan angka penting adalah ....',
            correctOption: '17,7 kg',
            distractors: ['17,6 kg', '17,65 kg', '18 kg', '17,70 kg'],
            pembahasanHint: '14,25 + 3,4 = 17,65 → dibulatkan ke 1 angka taksiran (1 desimal) menjadi 17,7 kg.',
          },
          {
            rumusan: 'Sebuah balok memiliki panjang 50 cm, lebar 20 cm, dan tinggi 10 cm. Volume balok dalam satuan SI (m³) adalah ....',
            correctOption: '0,01 m³',
            distractors: ['0,001 m³', '0,1 m³', '1 m³', '10 m³'],
            pembahasanHint: 'V = 0,5 × 0,2 × 0,1 = 0,01 m³.',
          },
        ],
        variantIdx
      );
    }

    if (focusText.includes('fluida') || focusText.includes('tekanan') || focusText.includes('pascal') || focusText.includes('archimedes') || focusText.includes('bernoulli')) {
      return pickByIdx(
        [
          {
            rumusan: 'Sebuah pompa hidrolik memiliki luas penampang kecil A₁ = 10 cm² dan penampang besar A₂ = 100 cm². Jika gaya tekan F₁ = 50 N, gaya angkat F₂ yang dihasilkan adalah ....',
            correctOption: '500 N',
            distractors: ['50 N', '100 N', '250 N', '5.000 N'],
            pembahasanHint: 'F₂ = (A₂/A₁) × F₁ = (100/10) × 50 = 500 N.',
          },
          {
            rumusan: 'Seekor ikan berenang pada kedalaman 3 meter di dalam kolam air tawar (ρ = 1.000 kg/m³, g = 10 m/s²). Tekanan hidrostatis yang dialami ikan adalah ....',
            correctOption: '30.000 Pa',
            distractors: ['3.000 Pa', '15.000 Pa', '300.000 Pa', '1.000 Pa'],
            pembahasanHint: 'Pₕ = ρ·g·h = 1.000 × 10 × 3 = 30.000 Pa.',
          },
          {
            rumusan: 'Sebuah benda bervolume 0,02 m³ tercelup seluruhnya dalam air (ρ = 1.000 kg/m³, g = 10 m/s²). Gaya ke atas (Archimedes) yang bekerja pada benda adalah ....',
            correctOption: '200 N',
            distractors: ['20 N', '50 N', '100 N', '2.000 N'],
            pembahasanHint: 'Fₐ = ρ·g·V = 1.000 × 10 × 0,02 = 200 N.',
          },
          {
            rumusan: 'Air mengalir melalui pipa berpenampang A₁ = 8 cm² dengan kelajuan v₁ = 3 m/s menuju pipa berpenampang A₂ = 4 cm². Kelajuan aliran air pada pipa kecil adalah ....',
            correctOption: '6 m/s',
            distractors: ['1,5 m/s', '3 m/s', '4 m/s', '12 m/s'],
            pembahasanHint: 'A₁v₁ = A₂v₂ → 8 × 3 = 4 × v₂ → v₂ = 6 m/s.',
          },
          {
            rumusan: 'Sebuah bak air menampung aliran dengan debit 4 liter/detik. Waktu yang diperlukan untuk mengisi tangki berkapasitas 240 liter adalah ....',
            correctOption: '60 detik',
            distractors: ['30 detik', '40 detik', '80 detik', '96 detik'],
            pembahasanHint: 't = V ÷ Q = 240 ÷ 4 = 60 detik.',
          },
          {
            rumusan: 'Gaya sebesar 400 N menekan permukaan seluas 0,05 m² secara tegak lurus. Tekanan yang diberikan adalah ....',
            correctOption: '8.000 Pa',
            distractors: ['20 Pa', '800 Pa', '2.000 Pa', '80.000 Pa'],
            pembahasanHint: 'P = F ÷ A = 400 ÷ 0,05 = 8.000 Pa.',
          },
        ],
        variantIdx
      );
    }

    if (focusText.includes('listrik') || focusText.includes('rangkaian') || focusText.includes('ohm') || focusText.includes('hambatan') || focusText.includes('magnet')) {
      return pickByIdx(
        [
          {
            rumusan: 'Sebuah penghantar berhambatan 12 Ω dihubungkan pada tegangan 24 Volt. Kuat arus listrik yang mengalir adalah ....',
            correctOption: '2 Ampere',
            distractors: ['0,5 Ampere', '4 Ampere', '12 Ampere', '36 Ampere'],
            pembahasanHint: 'I = V ÷ R = 24 ÷ 12 = 2 A.',
          },
          {
            rumusan: 'Tiga buah resistor masing-masing bernilai 4 Ω, 6 Ω, dan 10 Ω dirangkai secara seri. Hambatan pengganti rangkaian tersebut adalah ....',
            correctOption: '20 Ω',
            distractors: ['2 Ω', '10 Ω', '12 Ω', '24 Ω'],
            pembahasanHint: 'R_total = 4 + 6 + 10 = 20 Ω.',
          },
          {
            rumusan: 'Dua buah resistor masing-masing 6 Ω dan 3 Ω disusun secara paralel. Hambatan pengganti kedua resistor tersebut adalah ....',
            correctOption: '2 Ω',
            distractors: ['1 Ω', '3 Ω', '4,5 Ω', '9 Ω'],
            pembahasanHint: '1/Rₚ = 1/6 + 1/3 = 3/6 → Rₚ = 2 Ω.',
          },
          {
            rumusan: 'Sebuah lampu bertuliskan 220 V / 44 W menyala normal selama 100 detik. Besar energi listrik yang digunakan lampu tersebut adalah ....',
            correctOption: '4.400 Joule',
            distractors: ['440 Joule', '2.200 Joule', '22.000 Joule', '44.000 Joule'],
            pembahasanHint: 'W = P × t = 44 × 100 = 4.400 Joule.',
          },
          {
            rumusan: 'Setrika listrik bekerja pada tegangan 220 V dan mengalirkan arus sebesar 2 A. Daya listrik setrika tersebut adalah ....',
            correctOption: '440 Watt',
            distractors: ['110 Watt', '220 Watt', '330 Watt', '880 Watt'],
            pembahasanHint: 'P = V × I = 220 × 2 = 440 Watt.',
          },
          {
            rumusan: 'Kawat lurus berarus listrik 5 A sepanjang 2 meter berada tegak lurus dalam medan magnet homogen 0,4 Tesla. Besar gaya Lorentz pada kawat adalah ....',
            correctOption: '4 N',
            distractors: ['1 N', '2 N', '8 N', '10 N'],
            pembahasanHint: 'F = B · I · L = 0,4 × 5 × 2 = 4 N.',
          },
        ],
        variantIdx
      );
    }

    if (focusText.includes('suhu') || focusText.includes('kalor') || focusText.includes('termodinamika') || focusText.includes('gas')) {
      return pickByIdx(
        [
          {
            rumusan: 'Air bermassa 2 kg dipanaskan dari suhu 20°C menjadi 70°C (kalor jenis air c = 4.200 J/kg°C). Kalor yang dibutuhkan adalah ....',
            correctOption: '420.000 J',
            distractors: ['84.000 J', '210.000 J', '420 J', '840.000 J'],
            pembahasanHint: 'Q = m·c·ΔT = 2 × 4.200 × (70 − 20) = 420.000 J.',
          },
          {
            rumusan: 'Suhu suatu ruangan tercatat 27°C. Jika dinyatakan dalam skala Kelvin, suhunya adalah ....',
            correctOption: '300 K',
            distractors: ['246 K', '273 K', '310 K', '327 K'],
            pembahasanHint: 'T = 27 + 273 = 300 K.',
          },
          {
            rumusan: 'Gas ideal mengalami proses isobarik pada tekanan 2 × 10⁵ Pa sehingga volumenya memuai dari 0,02 m³ menjadi 0,05 m³. Usaha luar yang dilakukan gas adalah ....',
            correctOption: '6.000 Joule',
            distractors: ['3.000 Joule', '4.000 Joule', '10.000 Joule', '14.000 Joule'],
            pembahasanHint: 'W = P · ΔV = 2×10⁵ × (0,05 − 0,02) = 6.000 J.',
          },
          {
            rumusan: 'Sebuah mesin Carnot bekerja antara reservoir suhu tinggi 600 K dan suhu rendah 300 K. Efisiensi maksimum mesin tersebut adalah ....',
            correctOption: '50%',
            distractors: ['25%', '40%', '60%', '75%'],
            pembahasanHint: 'η = (1 − 300/600) × 100% = 50%.',
          },
          {
            rumusan: 'Suhu air menunjukkan angka 50°C. Besar suhu tersebut pada termometer skala Fahrenheit adalah ....',
            correctOption: '122°F',
            distractors: ['90°F', '108°F', '112°F', '132°F'],
            pembahasanHint: 'F = (9/5 × 50) + 32 = 90 + 32 = 122°F.',
          },
          {
            rumusan: 'Sebuah sistem gas menyerap kalor sebesar 800 J dan melakukan usaha luar sebesar 300 J. Perubahan energi dalam gas adalah ....',
            correctOption: '500 Joule',
            distractors: ['200 Joule', '300 Joule', '1.100 Joule', '2.400 Joule'],
            pembahasanHint: 'ΔU = Q − W = 800 − 300 = 500 J.',
          },
        ],
        variantIdx
      );
    }

    if (focusText.includes('gelombang') || focusText.includes('bunyi') || focusText.includes('cahaya') || focusText.includes('optik')) {
      return pickByIdx(
        [
          {
            rumusan: 'Sebuah gelombang merambat dengan frekuensi 50 Hz dan panjang gelombang 4 meter. Cepat rambat gelombang tersebut adalah ....',
            correctOption: '200 m/s',
            distractors: ['12,5 m/s', '46 m/s', '54 m/s', '400 m/s'],
            pembahasanHint: 'v = λ × f = 4 × 50 = 200 m/s.',
          },
          {
            rumusan: 'Dalam waktu 10 detik terbentuk 40 getaran penuh pada tali. Frekuensi dan periode getaran tersebut berturut-turut adalah ....',
            correctOption: '4 Hz dan 0,25 detik',
            distractors: ['0,25 Hz dan 4 detik', '4 Hz dan 4 detik', '40 Hz dan 10 detik', '2 Hz dan 0,5 detik'],
            pembahasanHint: 'f = 40/10 = 4 Hz; T = 1/f = 0,25 s.',
          },
          {
            rumusan: 'Sebuah benda diletakkan 30 cm di depan cermin cekung yang berjarak fokus 10 cm. Jarak bayangan yang terbentuk adalah ....',
            correctOption: '15 cm',
            distractors: ['7,5 cm', '10 cm', '20 cm', '40 cm'],
            pembahasanHint: "1/s' = 1/10 − 1/30 = 2/30 → s' = 15 cm.",
          },
          {
            rumusan: 'Intensitas suatu sumber bunyi adalah 10⁻⁶ W/m² dengan intensitas ambang I₀ = 10⁻¹² W/m². Taraf intensitas bunyi tersebut adalah ....',
            correctOption: '60 dB',
            distractors: ['40 dB', '50 dB', '70 dB', '80 dB'],
            pembahasanHint: 'TI = 10 log(10⁻⁶ / 10⁻¹²) = 10 log(10⁶) = 60 dB.',
          },
          {
            rumusan: 'Sebuah garpu tala berfrekuensi 680 Hz berbunyi di udara dengan cepat rambat bunyi 340 m/s. Panjang gelombang bunyinya adalah ....',
            correctOption: '0,5 meter',
            distractors: ['0,25 meter', '1 meter', '2 meter', '4 meter'],
            pembahasanHint: 'λ = v ÷ f = 340 ÷ 680 = 0,5 meter.',
          },
          {
            rumusan: 'Sebuah benda berada 20 cm di depan lensa cembung dan membentuk bayangan nyata pada jarak 60 cm. Perbesaran bayangannya adalah ....',
            correctOption: '3 kali',
            distractors: ['1/3 kali', '2 kali', '4 kali', '40 kali'],
            pembahasanHint: "M = |s'/s| = 60/20 = 3 kali.",
          },
        ],
        variantIdx
      );
    }

    // Kinematika / Dinamika / Energi / Momentum / Fallback Fisika
    const generalPhysicsItems = [
      {
        rumusan: 'Sebuah mobil bermassa 1.000 kg bergerak dengan kelajuan 20 m/s. Besar energi kinetik (Eₖ) mobil tersebut adalah ....',
        correctOption: '200.000 Joule',
        distractors: ['10.000 Joule', '20.000 Joule', '100.000 Joule', '400.000 Joule'],
        pembahasanHint: 'Eₖ = ½m·v² = ½(1.000)(20²) = 200.000 J.',
      },
      {
        rumusan: 'Sebuah bola dilempar vertikal ke atas dengan kecepatan awal 20 m/s (g = 10 m/s²). Ketinggian maksimum yang dicapai bola adalah ....',
        correctOption: '20 meter',
        distractors: ['10 meter', '15 meter', '30 meter', '40 meter'],
        pembahasanHint: 'h_max = v₀² ÷ (2g) = 400 ÷ 20 = 20 meter.',
      },
      {
        rumusan: 'Sebuah benda bermassa 5 kg ditarik dengan gaya mendatar sebesar 30 N di atas lantai licin. Percepatan yang dialami benda adalah ....',
        correctOption: '6 m/s²',
        distractors: ['3 m/s²', '5 m/s²', '25 m/s²', '150 m/s²'],
        pembahasanHint: 'a = F ÷ m = 30 ÷ 5 = 6 m/s².',
      },
      {
        rumusan: 'Buah kelapa bermassa 2 kg berada pada ketinggian 15 meter dari tanah (g = 10 m/s²). Energi potensial gravitasi buah kelapa tersebut adalah ....',
        correctOption: '300 Joule',
        distractors: ['30 Joule', '150 Joule', '200 Joule', '600 Joule'],
        pembahasanHint: 'Eₚ = m·g·h = 2 × 10 × 15 = 300 J.',
      },
      {
        rumusan: 'Sebuah balok didorong dengan gaya konstan 40 N sehingga berpindah sejauh 5 meter searah gaya. Usaha yang dilakukan gaya tersebut adalah ....',
        correctOption: '200 Joule',
        distractors: ['8 Joule', '35 Joule', '45 Joule', '400 Joule'],
        pembahasanHint: 'W = F × s = 40 × 5 = 200 J.',
      },
      {
        rumusan: 'Sebuah benda bermassa 4 kg bergerak dengan kecepatan 8 m/s. Besar momentum benda tersebut adalah ....',
        correctOption: '32 kg·m/s',
        distractors: ['2 kg·m/s', '12 kg·m/s', '64 kg·m/s', '128 kg·m/s'],
        pembahasanHint: 'p = m × v = 4 × 8 = 32 kg·m/s.',
      },
      {
        rumusan: 'Sebuah kendaraan bergerak dipercepat beraturan dari keadaan diam hingga mencapai kecepatan 30 m/s dalam waktu 6 detik. Percepatan kendaraan adalah ....',
        correctOption: '5 m/s²',
        distractors: ['3 m/s²', '6 m/s²', '24 m/s²', '180 m/s²'],
        pembahasanHint: 'a = (v − v₀) ÷ t = 30 ÷ 6 = 5 m/s².',
      },
      {
        rumusan: 'Sebuah motor melakukan usaha sebesar 3.000 Joule dalam waktu 10 detik. Daya motor tersebut adalah ....',
        correctOption: '300 Watt',
        distractors: ['30 Watt', '300 Joule', '3.010 Watt', '30.000 Watt'],
        pembahasanHint: 'P = W ÷ t = 3.000 ÷ 10 = 300 Watt.',
      },
    ];
    return tier === 'HOTS'
      ? pickByIdx(generalPhysicsItems, variantIdx + 1)
      : pickByIdx(generalPhysicsItems, variantIdx);
  }

  if (type === 'JAWABAN_SINGKAT') {
    return pickByIdx(
      [
        { rumusan: 'Sebuah benda bermassa 4 kg didorong dengan gaya 24 N pada bidang licin. Berapakah percepatan benda (dalam m/s²)?', kunciSingkat: '6 m/s²', pembahasanHint: 'a = 24 ÷ 4 = 6 m/s².' },
        { rumusan: 'Benda bermassa 2 kg berada di ketinggian 10 m (g = 10 m/s²). Berapakah energi potensialnya?', kunciSingkat: '200 Joule', pembahasanHint: 'Eₚ = 2 × 10 × 10 = 200 J.' },
        { rumusan: 'Hambatan 10 Ω dilalui arus listrik 3 A. Berapakah beda potensial ujung-ujung hambatan tersebut?', kunciSingkat: '30 Volt', pembahasanHint: 'V = I × R = 3 × 10 = 30 V.' },
        { rumusan: 'Gelombang dengan frekuensi 25 Hz dan panjang gelombang 4 m memiliki cepat rambat sebesar ....', kunciSingkat: '100 m/s', pembahasanHint: 'v = 25 × 4 = 100 m/s.' },
        { rumusan: 'Ubahlah kecepatan 36 km/jam ke dalam satuan m/s!', kunciSingkat: '10 m/s', pembahasanHint: '36.000 ÷ 3.600 = 10 m/s.' },
        { rumusan: 'Gaya 50 N memindahkan peti sejauh 6 m searah gaya. Berapakah usaha yang dilakukan?', kunciSingkat: '300 Joule', pembahasanHint: 'W = 50 × 6 = 300 J.' },
      ],
      variantIdx
    );
  }

  if (type === 'MENJODOHKAN') {
    return pickByIdx(
      [
        {
          rumusan: 'Pasangkanlah soal perhitungan fisika di kolom kiri dengan hasil nilainya yang tepat di kolom kanan!',
          pairs: [
            { premise: 'Energi kinetik m = 2 kg, v = 10 m/s', match: '100 Joule' },
            { premise: 'Gaya F untuk m = 5 kg, a = 4 m/s²', match: '20 Newton' },
            { premise: 'Daya untuk usaha 600 J selama 3 detik', match: '200 Watt' },
          ],
          pembahasanHint: 'Eₖ=½mv², F=ma, P=W/t.',
        },
        {
          rumusan: 'Jodohkanlah permasalahan besaran fisika pada kolom kiri dengan hasil perhitungannya di kolom kanan!',
          pairs: [
            { premise: 'Konversi kecepatan 54 km/jam ke m/s', match: '15 m/s' },
            { premise: 'Tegangan pada R = 8 Ω, I = 3 A', match: '24 Volt' },
            { premise: 'Tekanan hidrostatis air h = 2 m (g = 10)', match: '20.000 Pa' },
          ],
          pembahasanHint: '54/3,6=15; V=8×3=24; P=1000×10×2=20.000.',
        },
      ],
      variantIdx
    );
  }

  // ESAY Fisika
  return pickByIdx(
    [
      {
        rumusan: 'Sebuah benda bermassa 4 kg mula-mula diam, lalu ditarik gaya mendatar konstan 20 N di atas lantai licin selama 6 detik. Hitunglah percepatan benda, kecepatan akhirnya, dan energi kinetik pada detik ke-6!',
        kunciEsaiSteps: [
          'Menghitung percepatan: a = F ÷ m = 20 ÷ 4 = 5 m/s²',
          'Menghitung kecepatan akhir: v = v₀ + a·t = 0 + 5(6) = 30 m/s',
          'Menghitung energi kinetik: Eₖ = ½ × 4 × 30² = 2 × 900 = 1.800 Joule',
        ],
        pembahasanHint: 'a = 5 m/s², v = 30 m/s, Eₖ = 1.800 Joule.',
      },
      {
        rumusan: 'Sebuah pompa hidrolik memiliki luas penampang kecil 20 cm² dan penampang besar 500 cm². Jika mobil seberat 15.000 N diletakkan di atas penampang besar, hitunglah gaya tekan minimum pada penampang kecil agar mobil terangkat!',
        kunciEsaiSteps: [
          'Menuliskan persamaan Hukum Pascal: F₁ / A₁ = F₂ / A₂',
          'Substitusi nilai: F₁ / 20 = 15.000 / 500 = 30',
          'Menghitung gaya tekan: F₁ = 30 × 20 = 600 Newton',
        ],
        pembahasanHint: 'Gaya tekan minimum yang diperlukan adalah 600 N.',
      },
      {
        rumusan: 'Air bermassa 2 kg dipanaskan dari suhu 25°C hingga 75°C (kalor jenis air 4.200 J/kg°C). Jika pemanas listrik berdaya 1.000 Watt digunakan untuk memanaskan air tersebut, hitunglah kalor yang diperlukan dan waktu pemanasannya!',
        kunciEsaiSteps: [
          'Menghitung kalor: Q = m·c·ΔT = 2 × 4.200 × (75 − 25) = 420.000 Joule',
          'Menggunakan hubungan P = Q ÷ t → t = Q ÷ P',
          'Menghitung waktu: t = 420.000 ÷ 1.000 = 420 detik (7 menit)',
        ],
        pembahasanHint: 'Kalor = 420.000 J dan waktu = 420 detik (7 menit).',
      },
    ],
    variantIdx
  );
}

// ============================================================================
// 4. KIMIA (SOAL HITUNGAN PG, JAWABAN SINGKAT, MENJODOHKAN, ESAY)
// ============================================================================

function getKimiaBlueprint(
  focusText: string,
  type: QuestionType,
  variantIdx: number
): CalculationBlueprint {
  if (type === 'PG') {
    if (focusText.includes('asam') || focusText.includes('basa') || focusText.includes('ph') || focusText.includes('titrasi') || focusText.includes('penyangga') || focusText.includes('hidrolisis')) {
      return pickByIdx(
        [
          {
            rumusan: 'Nilai pH dari larutan asam kuat HCl 0,01 M adalah ....',
            correctOption: '2',
            distractors: ['1', '3', '7', '12'],
            pembahasanHint: '[H⁺] = 10⁻² → pH = −log(10⁻²) = 2.',
          },
          {
            rumusan: 'Nilai pH dari larutan basa kuat NaOH 0,001 M adalah ....',
            correctOption: '11',
            distractors: ['3', '9', '10', '13'],
            pembahasanHint: '[OH⁻] = 10⁻³ → pOH = 3 → pH = 14 − 3 = 11.',
          },
          {
            rumusan: 'Sebanyak 25 mL larutan HCl dititrasi dengan 25 mL larutan NaOH 0,2 M hingga mencapai titik ekuivalen. Konsentrasi larutan HCl adalah ....',
            correctOption: '0,2 M',
            distractors: ['0,1 M', '0,4 M', '0,5 M', '1,0 M'],
            pembahasanHint: 'M₁·V₁ = M₂·V₂ → M₁(25) = 0,2(25) → M₁ = 0,2 M.',
          },
          {
            rumusan: 'Larutan asam lemah CH₃COOH 0,1 M mempunyai Kₐ = 10⁻⁵. Nilai pH larutan tersebut adalah ....',
            correctOption: '3',
            distractors: ['1', '2', '4', '5'],
            pembahasanHint: '[H⁺] = √(10⁻⁵ × 10⁻¹) = 10⁻³ → pH = 3.',
          },
        ],
        variantIdx
      );
    }

    return pickByIdx(
      [
        {
          rumusan: 'Massa molekul relatif (Mᵣ) senyawa glukosa C₆H₁₂O₆ (Aᵣ C = 12, H = 1, O = 16) adalah ....',
          correctOption: '180',
          distractors: ['90', '144', '160', '342'],
          pembahasanHint: '6(12) + 12(1) + 6(16) = 72 + 12 + 96 = 180.',
        },
        {
          rumusan: 'Sebanyak 4 gram NaOH (Mᵣ = 40) dilarutkan dalam air hingga volume 500 mL. Molaritas larutan tersebut adalah ....',
          correctOption: '0,2 M',
          distractors: ['0,05 M', '0,1 M', '0,4 M', '2,0 M'],
          pembahasanHint: 'n = 4/40 = 0,1 mol. M = 0,1 ÷ 0,5 = 0,2 M.',
        },
        {
          rumusan: 'Jumlah mol dari 22 gram gas karbon dioksida CO₂ (Mᵣ = 44) adalah ....',
          correctOption: '0,5 mol',
          distractors: ['0,25 mol', '1 mol', '2 mol', '4 mol'],
          pembahasanHint: 'n = m ÷ Mᵣ = 22 ÷ 44 = 0,5 mol.',
        },
        {
          rumusan: 'Volume dari 2 mol gas oksigen O₂ pada keadaan standar (STP, Vₘ = 22,4 L/mol) adalah ....',
          correctOption: '44,8 liter',
          distractors: ['11,2 liter', '22,4 liter', '33,6 liter', '67,2 liter'],
          pembahasanHint: 'V = n × 22,4 = 2 × 22,4 = 44,8 liter.',
        },
        {
          rumusan: 'Unsur X memiliki nomor atom 11 dan nomor massa 23. Jumlah neutron yang terdapat dalam inti atom unsur X adalah ....',
          correctOption: '12',
          distractors: ['11', '23', '34', '10'],
          pembahasanHint: 'Neutron = Nomor massa − Nomor atom = 23 − 11 = 12.',
        },
        {
          rumusan: 'Massa molekul relatif (Mᵣ) dari urea CO(NH₂)₂ (Aᵣ C = 12, O = 16, N = 14, H = 1) adalah ....',
          correctOption: '60',
          distractors: ['44', '46', '58', '62'],
          pembahasanHint: '12 + 16 + 2(14) + 4(1) = 60.',
        },
      ],
      variantIdx
    );
  }

  if (type === 'JAWABAN_SINGKAT') {
    return pickByIdx(
      [
        { rumusan: 'Hitunglah massa molekul relatif (Mᵣ) dari H₂SO₄ (Aᵣ H = 1, S = 32, O = 16)!', kunciSingkat: '98', pembahasanHint: '2(1) + 32 + 4(16) = 98.' },
        { rumusan: 'Berapakah pH dari larutan HNO₃ 0,001 M?', kunciSingkat: '3', pembahasanHint: '[H⁺] = 10⁻³ → pH = 3.' },
        { rumusan: 'Hitunglah jumlah mol dari 9 gram air H₂O (Mᵣ = 18)!', kunciSingkat: '0,5 mol', pembahasanHint: '9 ÷ 18 = 0,5 mol.' },
        { rumusan: 'Berapakah molaritas 11,7 gram NaCl (Mᵣ = 58,5) dalam 1 liter larutan?', kunciSingkat: '0,2 M', pembahasanHint: 'n = 0,2 mol → M = 0,2 M.' },
      ],
      variantIdx
    );
  }

  if (type === 'MENJODOHKAN') {
    return {
      rumusan: 'Pasangkanlah soal perhitungan kimia di kolom kiri dengan hasil nilainya yang tepat di kolom kanan!',
      pairs: [
        { premise: 'Mᵣ senyawa NaOH (Na=23, O=16, H=1)', match: '40' },
        { premise: 'pH larutan HCl 0,01 M', match: '2' },
        { premise: 'Volume 0,5 mol gas pada keadaan STP', match: '11,2 liter' },
      ],
      pembahasanHint: 'Mᵣ NaOH = 40; pH = 2; V = 0,5 × 22,4 = 11,2 L.',
    };
  }

  return pickByIdx(
    [
      {
        rumusan: 'Sebanyak 6 gram urea CO(NH₂)₂ (Mᵣ = 60) dilarutkan dalam air hingga volume 250 mL. Hitunglah jumlah mol urea serta molaritas larutan yang terbentuk!',
        kunciEsaiSteps: [
          'Menghitung mol urea: n = massa ÷ Mᵣ = 6 ÷ 60 = 0,1 mol',
          'Mengonversi volume larutan: V = 250 mL = 0,25 liter',
          'Menghitung molaritas: M = n ÷ V = 0,1 ÷ 0,25 = 0,4 M',
        ],
        pembahasanHint: 'Jumlah mol 0,1 mol dan molaritas 0,4 M.',
      },
      {
        rumusan: 'Sebanyak 20 mL larutan H₂SO₄ 0,1 M tepat dititrasi dengan 40 mL larutan NaOH. Hitunglah konsentrasi (molaritas) larutan NaOH tersebut!',
        kunciEsaiSteps: [
          'Menuliskan rumus titrasi asam-basa: a · Mₐ · Vₐ = b · M_b · V_b',
          'Substitusi (valensi H₂SO₄ = 2, NaOH = 1): 2 × 0,1 × 20 = 1 × M_b × 40',
          'Menghitung M_b = 4 ÷ 40 = 0,1 M',
        ],
        pembahasanHint: 'Konsentrasi larutan NaOH adalah 0,1 M.',
      },
    ],
    variantIdx
  );
}

// ============================================================================
// 5. EKONOMI / AKUNTANSI / PKWU (SOAL HITUNGAN)
// ============================================================================

function getEkonomiBlueprint(
  focusText: string,
  type: QuestionType,
  variantIdx: number
): CalculationBlueprint {
  if (type === 'PG') {
    if (focusText.includes('akuntansi') || focusText.includes('jurnal') || focusText.includes('neraca') || focusText.includes('bep') || focusText.includes('hpp')) {
      return pickByIdx(
        [
          {
            rumusan: 'Sebuah perusahaan memiliki total aset Rp120.000.000 dan total utang Rp45.000.000. Besar modal (ekuitas) perusahaan tersebut adalah ....',
            correctOption: 'Rp75.000.000',
            distractors: ['Rp45.000.000', 'Rp65.000.000', 'Rp85.000.000', 'Rp165.000.000'],
            pembahasanHint: 'Modal = Aset − Utang = 120.000.000 − 45.000.000 = Rp75.000.000.',
          },
          {
            rumusan: 'Usaha kerajinan memiliki biaya tetap Rp6.000.000, biaya variabel per unit Rp20.000, dan harga jual per unit Rp50.000. Titik impas (BEP unit) usaha tersebut adalah ....',
            correctOption: '200 unit',
            distractors: ['100 unit', '120 unit', '150 unit', '300 unit'],
            pembahasanHint: 'BEP = FC / (P − VC) = 6.000.000 / (50.000 − 20.000) = 200 unit.',
          },
          {
            rumusan: 'Pendapatan jasa sebuah bengkel sebesar Rp25.000.000 dan beban operasionalnya Rp16.500.000. Laba bersih yang diperoleh bengkel adalah ....',
            correctOption: 'Rp8.500.000',
            distractors: ['Rp7.500.000', 'Rp9.500.000', 'Rp16.500.000', 'Rp41.500.000'],
            pembahasanHint: 'Laba = Pendapatan − Beban = 25.000.000 − 16.500.000 = Rp8.500.000.',
          },
        ],
        variantIdx
      );
    }

    if (focusText.includes('pendapatan nasional') || focusText.includes('gdp') || focusText.includes('inflasi') || focusText.includes('pertumbuhan')) {
      return pickByIdx(
        [
          {
            rumusan: 'Diketahui PDB (GDP) riil suatu negara tahun 2024 adalah Rp2.000 triliun dan tahun 2025 naik menjadi Rp2.120 triliun. Laju pertumbuhan ekonomi tahun 2025 adalah ....',
            correctOption: '6%',
            distractors: ['4%', '5%', '8%', '12%'],
            pembahasanHint: 'g = ((2.120 − 2.000) / 2.000) × 100% = 6%.',
          },
          {
            rumusan: 'Diketahui indeks harga tahun 2024 sebesar 120 dan tahun 2025 menjadi 126. Laju inflasi pada tahun 2025 adalah ....',
            correctOption: '5%',
            distractors: ['4%', '6%', '10%', '20%'],
            pembahasanHint: 'Inflasi = ((126 − 120) / 120) × 100% = 5%.',
          },
          {
            rumusan: 'Diketahui konsumsi C = 400, investasi I = 150, pengeluaran pemerintah G = 200, ekspor X = 120, dan impor M = 70 (dalam miliar rupiah). Pendapatan nasional dengan pendekatan pengeluaran adalah ....',
            correctOption: 'Rp800 miliar',
            distractors: ['Rp750 miliar', 'Rp850 miliar', 'Rp870 miliar', 'Rp940 miliar'],
            pembahasanHint: 'Y = C + I + G + (X − M) = 400 + 150 + 200 + (120 − 70) = 800 miliar.',
          },
        ],
        variantIdx
      );
    }

    return pickByIdx(
      [
        {
          rumusan: 'Diketahui fungsi permintaan Qd = 40 − 2P dan fungsi penawaran Qs = −20 + 3P. Harga keseimbangan pasar (P) adalah ....',
          correctOption: '12',
          distractors: ['8', '10', '16', '20'],
          pembahasanHint: '40 − 2P = −20 + 3P → 5P = 60 → P = 12.',
        },
        {
          rumusan: 'Harga suatu barang turun dari Rp10.000 menjadi Rp8.000 sehingga jumlah barang yang diminta naik dari 100 unit menjadi 150 unit. Koefisien elastisitas permintaannya adalah ....',
          correctOption: '2,5 (Elastis)',
          distractors: ['0,4 (Inelastis)', '1,0 (Uniter)', '1,5 (Elastis)', '2,0 (Elastis)'],
          pembahasanHint: '|Ed| = (ΔQ/ΔP) × (P/Q) = (50/2.000) × (10.000/100) = 2,5.',
        },
        {
          rumusan: 'Seorang lulusan SMA ditawari gaji Rp3.500.000/bulan di toko A, Rp4.200.000/bulan di kantor B, atau Rp3.800.000/bulan di pabrik C. Jika ia memilih bekerja di kantor B, besar biaya peluangnya adalah ....',
          correctOption: 'Rp3.800.000',
          distractors: ['Rp3.500.000', 'Rp4.200.000', 'Rp7.300.000', 'Rp400.000'],
          pembahasanHint: 'Biaya peluang adalah alternatif terbaik yang dikorbankan, yaitu Rp3.800.000.',
        },
      ],
      variantIdx
    );
  }

  if (type === 'JAWABAN_SINGKAT') {
    return pickByIdx(
      [
        { rumusan: 'Jika fungsi permintaan Qd = 50 − 2P dan penawaran Qs = 10 + 2P, berapakah harga keseimbangan pasar (P)?', kunciSingkat: '10', pembahasanHint: '4P = 40 → P = 10.' },
        { rumusan: 'Perusahaan memiliki aset Rp90.000.000 dan modal Rp55.000.000. Berapakah total utangnya?', kunciSingkat: 'Rp35.000.000', pembahasanHint: '90 jt − 55 jt = Rp35.000.000.' },
        { rumusan: 'Biaya tetap Rp4.000.000, biaya variabel Rp15.000/unit, dan harga jual Rp25.000/unit. Berapakah BEP unitnya?', kunciSingkat: '400 unit', pembahasanHint: '4.000.000 ÷ 10.000 = 400 unit.' },
      ],
      variantIdx
    );
  }

  if (type === 'MENJODOHKAN') {
    return {
      rumusan: 'Pasangkanlah soal hitungan ekonomi & akuntansi di kolom kiri dengan jawabannya di kolom kanan!',
      pairs: [
        { premise: 'Aset Rp100 jt, Utang Rp30 jt → Modal', match: 'Rp70.000.000' },
        { premise: 'BEP unit jika FC = 3 jt, P = 50 rb, VC = 20 rb', match: '100 unit' },
        { premise: 'PDB naik dari 1.000 ke 1.050 → Pertumbuhan', match: '5%' },
      ],
      pembahasanHint: 'Modal = Aset − Utang; BEP = FC/(P−VC); Pertumbuhan = ΔPDB/PDB₀.',
    };
  }

  return pickByIdx(
    [
      {
        rumusan: 'Diketahui fungsi permintaan Qd = 60 − 2P dan fungsi penawaran Qs = −15 + 3P. Hitunglah harga keseimbangan (Pe) dan jumlah keseimbangan (Qe) pasar!',
        kunciEsaiSteps: [
          'Menyamakan Qd = Qs → 60 − 2P = −15 + 3P',
          'Menghitung harga keseimbangan: 5P = 75 → Pe = 15',
          'Menghitung jumlah keseimbangan: Qe = 60 − 2(15) = 30 unit',
        ],
        pembahasanHint: 'Harga keseimbangan Pe = 15 dan jumlah keseimbangan Qe = 30 unit.',
      },
      {
        rumusan: 'Sebuah usaha rumahan memiliki biaya tetap Rp8.000.000, biaya variabel Rp30.000 per produk, dan harga jual Rp50.000 per produk. Hitunglah BEP dalam unit dan BEP dalam rupiah!',
        kunciEsaiSteps: [
          'Menghitung margin kontribusi: P − VC = Rp50.000 − Rp30.000 = Rp20.000',
          'Menghitung BEP unit = 8.000.000 ÷ 20.000 = 400 unit',
          'Menghitung BEP rupiah = 400 × Rp50.000 = Rp20.000.000',
        ],
        pembahasanHint: 'BEP = 400 unit atau Rp20.000.000.',
      },
    ],
    variantIdx
  );
}

// ============================================================================
// 6. INFORMATIKA (SOAL HITUNGAN SISTEM BILANGAN / JARINGAN / KOMPLEKSITAS)
// ============================================================================

function getInformatikaBlueprint(
  type: QuestionType,
  variantIdx: number
): CalculationBlueprint {
  if (type === 'PG') {
    return pickByIdx(
      [
        {
          rumusan: 'Hasil konversi bilangan biner 10110₂ ke dalam sistem bilangan desimal adalah ....',
          correctOption: '22',
          distractors: ['18', '20', '24', '26'],
          pembahasanHint: '1(16) + 0(8) + 1(4) + 1(2) + 0(1) = 16 + 4 + 2 = 22.',
        },
        {
          rumusan: 'Hasil konversi bilangan desimal 45₁₀ ke dalam sistem bilangan biner adalah ....',
          correctOption: '101101₂',
          distractors: ['101011₂', '110101₂', '100101₂', '101110₂'],
          pembahasanHint: '32 + 8 + 4 + 1 = 45 → 101101₂.',
        },
        {
          rumusan: 'Sebuah berkas berukuran 20 MB akan diunduh menggunakan koneksi berkecepatan 4 MB/detik. Waktu minimum pengunduhan berkas adalah ....',
          correctOption: '5 detik',
          distractors: ['4 detik', '8 detik', '16 detik', '80 detik'],
          pembahasanHint: 't = 20 MB ÷ 4 MB/s = 5 detik.',
        },
        {
          rumusan: 'Pada pencarian biner (binary search) dalam array terurut berisi 64 elemen, jumlah perbandingan maksimum yang dibutuhkan adalah ....',
          correctOption: '7 kali',
          distractors: ['4 kali', '16 kali', '32 kali', '64 kali'],
          pembahasanHint: 'log₂(64) + 1 = 6 + 1 = 7 langkah maksimum.',
        },
      ],
      variantIdx
    );
  }
  if (type === 'JAWABAN_SINGKAT') {
    return pickByIdx(
      [
        { rumusan: 'Ubahlah bilangan biner 1101₂ menjadi bilangan desimal!', kunciSingkat: '13', pembahasanHint: '8 + 4 + 0 + 1 = 13.' },
        { rumusan: 'Ubahlah bilangan desimal 25₁₀ menjadi bilangan biner!', kunciSingkat: '11001', pembahasanHint: '16 + 8 + 1 = 25 → 11001₂.' },
      ],
      variantIdx
    );
  }
  if (type === 'MENJODOHKAN') {
    return {
      rumusan: 'Pasangkanlah bilangan biner di kolom kiri dengan nilai desimalnya di kolom kanan!',
      pairs: [
        { premise: '1010₂', match: '10' },
        { premise: '1111₂', match: '15' },
        { premise: '10000₂', match: '16' },
      ],
      pembahasanHint: 'Konversi posisi bit 2³, 2², 2¹, 2⁰.',
    };
  }
  return {
    rumusan: 'Konversikan bilangan desimal 53₁₀ ke dalam bilangan biner dan heksadesimal disertai langkah pembagian berulangnya!',
    kunciEsaiSteps: [
      'Membagi 53 dengan 2 berulang hingga diperoleh sisa: 110101₂',
      'Mengelompokkan biner per 4 bit dari kanan: 0011 0101',
      'Mengubah ke heksadesimal: 0011 = 3 dan 0101 = 5 → 35₁₆',
    ],
    pembahasanHint: '53₁₀ = 110101₂ = 35₁₆.',
  };
}

// ============================================================================
// ENTRY POINT
// ============================================================================

export function buildCalculationBlueprint(params: {
  domain: CalculationDomain;
  subject: string;
  babTitle: string;
  scope: string;
  subtopic: string;
  tier: QuestionTier;
  type: QuestionType;
  variantIdx: number;
}): CalculationBlueprint | null {
  const { domain, babTitle, scope, subtopic, tier, type, variantIdx } = params;
  const subLower = subtopic.toLowerCase();
  const focusText = `${subLower} ${babTitle} ${scope}`.toLowerCase();

  if (domain === 'MATEMATIKA') {
    const isAnuitas =
      subLower.includes('anuitas') ||
      subLower.includes('angsuran') ||
      subLower.includes('cicilan') ||
      subLower.includes('pinjaman');
    const isBunga =
      subLower.includes('bunga majemuk') ||
      subLower.includes('bunga tunggal') ||
      subLower.includes('bunga') ||
      subLower.includes('tabungan') ||
      subLower.includes('deposito') ||
      subLower.includes('investasi');

    if (isAnuitas) {
      return getAnuitasBlueprint(tier, type, variantIdx);
    }
    if (isBunga) {
      return getBungaMajemukBlueprint(tier, type, variantIdx);
    }
    // Jika subtopic belum spesifik tapi Bab/lingkup memuat anuitas dan bunga majemuk
    if (
      focusText.includes('anuitas') &&
      (focusText.includes('bunga') || focusText.includes('majemuk'))
    ) {
      return Math.abs(variantIdx) % 2 === 0
        ? getAnuitasBlueprint(tier, type, variantIdx)
        : getBungaMajemukBlueprint(tier, type, variantIdx);
    }
    if (focusText.includes('anuitas')) {
      return getAnuitasBlueprint(tier, type, variantIdx);
    }
    if (focusText.includes('bunga majemuk') || focusText.includes('bunga tunggal')) {
      return getBungaMajemukBlueprint(tier, type, variantIdx);
    }

    if (type !== 'PG') {
      return getMathNonPgBlueprint(focusText, subtopic, type, variantIdx);
    }
    return getMathExtraPgBlueprint(focusText, subtopic, tier, variantIdx);
  }

  if (domain === 'FISIKA') {
    return getFisikaBlueprint(focusText, tier, type, variantIdx);
  }

  if (domain === 'KIMIA') {
    return getKimiaBlueprint(focusText, type, variantIdx);
  }

  if (domain === 'EKONOMI') {
    return getEkonomiBlueprint(focusText, type, variantIdx);
  }

  if (domain === 'INFORMATIKA') {
    return getInformatikaBlueprint(type, variantIdx);
  }

  return null;
}
