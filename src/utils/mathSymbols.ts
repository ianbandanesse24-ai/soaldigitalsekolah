export interface SymbolCategory {
  id: 'operasi' | 'pangkat' | 'relasi' | 'yunani' | 'sains_bahasa' | 'rumus';
  label: string;
  items: { label: string; value: string; title: string }[];
}

export const MATH_SYMBOL_CATEGORIES: SymbolCategory[] = [
  {
    id: 'operasi',
    label: 'Operasi, Akar & Pecahan',
    items: [
      { label: '×', value: '×', title: 'Kali' },
      { label: '÷', value: '÷', title: 'Bagi' },
      { label: '·', value: '·', title: 'Titik kali' },
      { label: '±', value: '±', title: 'Plus minus' },
      { label: '∓', value: '∓', title: 'Minus plus' },
      { label: '√', value: '√', title: 'Akar kuadrat' },
      { label: '∛', value: '∛', title: 'Akar pangkat tiga' },
      { label: '∜', value: '∜', title: 'Akar pangkat empat' },
      { label: '∞', value: '∞', title: 'Tak hingga' },
      { label: '°', value: '°', title: 'Derajat' },
      { label: '′', value: '′', title: 'Menit sudut / Turunan pertama' },
      { label: '″', value: '″', title: 'Detik sudut / Turunan kedua' },
      { label: '%', value: '%', title: 'Persen' },
      { label: '‰', value: '‰', title: 'Permil' },
      { label: '½', value: '½', title: 'Seperdua' },
      { label: '⅓', value: '⅓', title: 'Sepertiga' },
      { label: '⅔', value: '⅔', title: 'Dua pertiga' },
      { label: '¼', value: '¼', title: 'Seperempat' },
      { label: '¾', value: '¾', title: 'Tiga perempat' },
      { label: '⅕', value: '⅕', title: 'Seperlima' },
      { label: '⅖', value: '⅖', title: 'Dua perlima' },
      { label: '⅗', value: '⅗', title: 'Tiga perlima' },
      { label: '⅘', value: '⅘', title: 'Empat perlima' },
      { label: '⅙', value: '⅙', title: 'Seperenam' },
      { label: '⅚', value: '⅚', title: 'Lima perenam' },
      { label: '⅛', value: '⅛', title: 'Seperdelapan' },
      { label: '|x|', value: '|x|', title: 'Nilai mutlak' },
    ],
  },
  {
    id: 'pangkat',
    label: 'Pangkat & Indeks',
    items: [
      { label: '⁰', value: '⁰', title: 'Pangkat 0' },
      { label: '¹', value: '¹', title: 'Pangkat 1' },
      { label: '²', value: '²', title: 'Kuadrat (pangkat 2)' },
      { label: '³', value: '³', title: 'Kubik (pangkat 3)' },
      { label: '⁴', value: '⁴', title: 'Pangkat 4' },
      { label: '⁵', value: '⁵', title: 'Pangkat 5' },
      { label: '⁶', value: '⁶', title: 'Pangkat 6' },
      { label: '⁷', value: '⁷', title: 'Pangkat 7' },
      { label: '⁸', value: '⁸', title: 'Pangkat 8' },
      { label: '⁹', value: '⁹', title: 'Pangkat 9' },
      { label: 'ⁿ', value: 'ⁿ', title: 'Pangkat n' },
      { label: 'ˣ', value: 'ˣ', title: 'Pangkat x' },
      { label: 'ʸ', value: 'ʸ', title: 'Pangkat y' },
      { label: '⁺', value: '⁺', title: 'Muatan / pangkat positif' },
      { label: '⁻', value: '⁻', title: 'Muatan / pangkat negatif' },
      { label: '₀', value: '₀', title: 'Indeks 0' },
      { label: '₁', value: '₁', title: 'Indeks 1' },
      { label: '₂', value: '₂', title: 'Indeks 2' },
      { label: '₃', value: '₃', title: 'Indeks 3' },
      { label: '₄', value: '₄', title: 'Indeks 4' },
      { label: '₅', value: '₅', title: 'Indeks 5' },
      { label: '₆', value: '₆', title: 'Indeks 6' },
      { label: 'ₙ', value: 'ₙ', title: 'Indeks n' },
      { label: 'ᵢ', value: 'ᵢ', title: 'Indeks i' },
      { label: 'ⱼ', value: 'ⱼ', title: 'Indeks j' },
      { label: '₊', value: '₊', title: 'Indeks +' },
      { label: '₋', value: '₋', title: 'Indeks -' },
    ],
  },
  {
    id: 'relasi',
    label: 'Relasi, Logika & Himpunan',
    items: [
      { label: '=', value: '=', title: 'Sama dengan' },
      { label: '≠', value: '≠', title: 'Tidak sama dengan' },
      { label: '≈', value: '≈', title: 'Kira-kira sama dengan' },
      { label: '≡', value: '≡', title: 'Kongruen / ekuivalen' },
      { label: '≤', value: '≤', title: 'Kurang dari atau sama dengan' },
      { label: '≥', value: '≥', title: 'Lebih dari atau sama dengan' },
      { label: '∝', value: '∝', title: 'Sebanding dengan' },
      { label: '∈', value: '∈', title: 'Anggota himpunan' },
      { label: '∉', value: '∉', title: 'Bukan anggota himpunan' },
      { label: '⊂', value: '⊂', title: 'Himpunan bagian' },
      { label: '⊆', value: '⊆', title: 'Himpunan bagian atau sama' },
      { label: '∪', value: '∪', title: 'Gabungan (Union)' },
      { label: '∩', value: '∩', title: 'Irisan (Intersection)' },
      { label: '∅', value: '∅', title: 'Himpunan kosong' },
      { label: '∀', value: '∀', title: 'Kuantor universal (untuk semua)' },
      { label: '∃', value: '∃', title: 'Kuantor eksistensial (terdapat)' },
      { label: '¬', value: '¬', title: 'Negasi / ingkaran' },
      { label: '∧', value: '∧', title: 'Konjungsi (DAN)' },
      { label: '∨', value: '∨', title: 'Disjungsi (ATAU)' },
      { label: '→', value: '→', title: 'Panah kanan / reaksi / limit' },
      { label: '←', value: '←', title: 'Panah kiri' },
      { label: '↔', value: '↔', title: 'Kesetimbangan / korespondensi' },
      { label: '⇌', value: '⇌', title: 'Reaksi kesetimbangan kimia bolak-balik' },
      { label: '⇒', value: '⇒', title: 'Implikasi (Maka)' },
      { label: '⇔', value: '⇔', title: 'Biimplikasi (Jika dan hanya jika)' },
      { label: '∴', value: '∴', title: 'Jadi / oleh karena itu' },
      { label: '∵', value: '∵', title: 'Karena' },
    ],
  },
  {
    id: 'yunani',
    label: 'Yunani, Kalkulus & Geometri',
    items: [
      { label: 'π', value: 'π', title: 'Pi' },
      { label: 'θ', value: 'θ', title: 'Theta' },
      { label: 'α', value: 'α', title: 'Alfa' },
      { label: 'β', value: 'β', title: 'Beta' },
      { label: 'γ', value: 'γ', title: 'Gamma' },
      { label: 'δ', value: 'δ', title: 'Delta kecil' },
      { label: 'Δ', value: 'Δ', title: 'Delta besar / perubahan / diskriminan' },
      { label: 'ε', value: 'ε', title: 'Epsilon' },
      { label: 'η', value: 'η', title: 'Eta (efisiensi)' },
      { label: 'λ', value: 'λ', title: 'Lambda (panjang gelombang / nilai eigen)' },
      { label: 'μ', value: 'μ', title: 'Mu (rata-rata / koefisien gesek / mikro)' },
      { label: 'ρ', value: 'ρ', title: 'Rho (massa jenis / hambatan jenis)' },
      { label: 'σ', value: 'σ', title: 'Sigma kecil (simpangan baku)' },
      { label: 'Σ', value: 'Σ', title: 'Sigma besar' },
      { label: 'τ', value: 'τ', title: 'Tau (torsi / momen gaya)' },
      { label: 'Φ', value: 'Φ', title: 'Phi besar (fluks)' },
      { label: 'Ω', value: 'Ω', title: 'Ohm' },
      { label: 'ω', value: 'ω', title: 'Omega kecil (kecepatan sudut)' },
      { label: '∑', value: '∑', title: 'Notasi Sigma (penjumlahan)' },
      { label: '∏', value: '∏', title: 'Notasi Pi (perkalian)' },
      { label: '∫', value: '∫', title: 'Integral' },
      { label: '∂', value: '∂', title: 'Turunan parsial' },
      { label: '∇', value: '∇', title: 'Nabla / gradien' },
      { label: '∠', value: '∠', title: 'Sudut' },
      { label: '△', value: '△', title: 'Segitiga' },
      { label: '⊥', value: '⊥', title: 'Tegak lurus' },
      { label: '∥', value: '∥', title: 'Sejajar' },
      { label: '≅', value: '≅', title: 'Kongruen' },
      { label: '∼', value: '∼', title: 'Sebangun' },
    ],
  },
  {
    id: 'sains_bahasa',
    label: 'Sains, Satuan & Bahasa',
    items: [
      { label: '℃', value: '℃', title: 'Derajat Celcius' },
      { label: '℉', value: '℉', title: 'Derajat Fahrenheit' },
      { label: 'Å', value: 'Å', title: 'Angstrom' },
      { label: 'µ', value: 'µ', title: 'Mikro' },
      { label: '↑', value: '↑', title: 'Gas terlepas / naik' },
      { label: '↓', value: '↓', title: 'Endapan / turun' },
      { label: 'ΔH', value: 'ΔH', title: 'Perubahan entalpi' },
      { label: 'Mᵣ', value: 'Mᵣ', title: 'Massa molekul relatif' },
      { label: 'Aᵣ', value: 'Aᵣ', title: 'Massa atom relatif' },
      { label: 'H⁺', value: 'H⁺', title: 'Ion hidrogen' },
      { label: 'OH⁻', value: 'OH⁻', title: 'Ion hidroksida' },
      { label: '—', value: '—', title: 'Tanda pisah (em dash)' },
      { label: '…', value: '…', title: 'Elipsis' },
      { label: '«', value: '«', title: 'Kurung sudut buka' },
      { label: '»', value: '»', title: 'Kurung sudut tutup' },
      { label: '€', value: '€', title: 'Euro' },
      { label: '£', value: '£', title: 'Pound' },
      { label: '¥', value: '¥', title: 'Yen' },
      { label: 'ﷺ', value: 'ﷺ', title: 'Shallallahu alaihi wasallam' },
      { label: 'ﷻ', value: 'ﷻ', title: 'Jalla jalaluhu' },
    ],
  },
  {
    id: 'rumus',
    label: 'Template Rumus SMA',
    items: [
      {
        label: 'x₁,₂ = (-b ± √(b² - 4ac)) / 2a',
        value: 'x₁,₂ = (-b ± √(b² - 4ac)) / 2a',
        title: 'Rumus ABC Persamaan Kuadrat',
      },
      {
        label: 'ᵃlog b = c ⇔ aᶜ = b',
        value: '²log 8 = 3 ⇔ 2³ = 8',
        title: 'Konsep Logaritma',
      },
      {
        label: 'Uₙ = a + (n - 1)b',
        value: 'Uₙ = a + (n - 1)b',
        title: 'Suku ke-n Barisan Aritmetika',
      },
      {
        label: 'Sₙ = ½n(2a + (n - 1)b)',
        value: 'Sₙ = ½n(2a + (n - 1)b)',
        title: 'Jumlah n Suku Deret Aritmetika',
      },
      {
        label: 'Uₙ = a · rⁿ⁻¹',
        value: 'Uₙ = a · rⁿ⁻¹',
        title: 'Suku ke-n Barisan Geometri',
      },
      {
        label: 'sin²θ + cos²θ = 1',
        value: 'sin²θ + cos²θ = 1',
        title: 'Identitas Trigonometri',
      },
      {
        label: 'lim(x→a) f(x)',
        value: 'lim(x→a) f(x)',
        title: 'Limit Fungsi',
      },
      {
        label: 'f′(x) = lim(h→0) [f(x+h) - f(x)] / h',
        value: 'f′(x) = lim(h→0) [f(x+h) - f(x)] / h',
        title: 'Definisi Turunan Fungsi',
      },
      {
        label: '∫ f(x) dx = F(x) + C',
        value: '∫ f(x) dx = F(x) + C',
        title: 'Integral Tak Tentu',
      },
      {
        label: 'x̄ = (∑ xᵢ · fᵢ) / ∑ fᵢ',
        value: 'x̄ = (∑ xᵢ · fᵢ) / ∑ fᵢ',
        title: 'Rata-Rata Data Berkelompok',
      },
      {
        label: 'F = m · a',
        value: 'F = m · a',
        title: 'Hukum II Newton',
      },
      {
        label: 'Eₖ = ½m · v²',
        value: 'Eₖ = ½m · v²',
        title: 'Energi Kinetik',
      },
      {
        label: 'V = I · R',
        value: 'V = I · R',
        title: 'Hukum Ohm',
      },
      {
        label: 'pH = -log[H⁺]',
        value: 'pH = -log[H⁺]',
        title: 'Derajat Keasaman Kimia',
      },
      {
        label: 'H₂O + CO₂ ⇌ H₂CO₃',
        value: 'H₂O + CO₂ ⇌ H₂CO₃',
        title: 'Persamaan Reaksi Kesetimbangan',
      },
      {
        label: 'E_d = (%ΔQ) / (%ΔP)',
        value: 'Ed = (%ΔQ) / (%ΔP)',
        title: 'Koefisien Elastisitas Permintaan',
      },
      {
        label: 'Y = C + I + G + (X - M)',
        value: 'Y = C + I + G + (X - M)',
        title: 'Pendapatan Nasional (Pendekatan Pengeluaran)',
      },
    ],
  },
];

const SUPERSCRIPT_MAP: Record<string, string> = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
  n: 'ⁿ',
  x: 'ˣ',
  y: 'ʸ',
  '+': '⁺',
  '-': '⁻',
  '=': '⁼',
  '(': '⁽',
  ')': '⁾',
};

const SUBSCRIPT_MAP: Record<string, string> = {
  '0': '₀',
  '1': '₁',
  '2': '₂',
  '3': '₃',
  '4': '₄',
  '5': '₅',
  '6': '₆',
  '7': '₇',
  '8': '₈',
  '9': '₉',
  n: 'ₙ',
  i: 'ᵢ',
  j: 'ⱼ',
  k: 'ₖ',
  '+': '₊',
  '-': '₋',
};

/**
 * Mengonversi notasi ketikan seperti x^2, H_2O, <=, >=, !=, ->, <->, \sqrt, \pi
 * menjadi simbol matematika/sains Unicode baku agar tampil rapi di aplikasi, PDF, Word, dan Excel.
 */
export function convertAsciiMathToUnicode(text: string): string {
  return text
    .replace(/\\sqrt/g, '√')
    .replace(/\\pi/g, 'π')
    .replace(/\\theta/g, 'θ')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\gamma/g, 'γ')
    .replace(/\\delta/g, 'δ')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\lambda/g, 'λ')
    .replace(/\\mu/g, 'μ')
    .replace(/\\rho/g, 'ρ')
    .replace(/\\sigma/g, 'σ')
    .replace(/\\Sigma|\\sum/g, '∑')
    .replace(/\\prod/g, '∏')
    .replace(/\\int/g, '∫')
    .replace(/\\partial/g, '∂')
    .replace(/\\nabla/g, '∇')
    .replace(/\\infty|\\inf/g, '∞')
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '·')
    .replace(/\\div/g, '÷')
    .replace(/\\pm/g, '±')
    .replace(/\\neq/g, '≠')
    .replace(/\\leq/g, '≤')
    .replace(/\\geq/g, '≥')
    .replace(/\\approx/g, '≈')
    .replace(/\\in\b/g, '∈')
    .replace(/\\notin\b/g, '∉')
    .replace(/\\subset/g, '⊂')
    .replace(/\\cup/g, '∪')
    .replace(/\\cap/g, '∩')
    .replace(/\\forall/g, '∀')
    .replace(/\\exists/g, '∃')
    .replace(/\\neg/g, '¬')
    .replace(/\\land/g, '∧')
    .replace(/\\lor/g, '∨')
    .replace(/\\angle/g, '∠')
    .replace(/\\triangle/g, '△')
    .replace(/\\perp/g, '⊥')
    .replace(/\\parallel/g, '∥')
    .replace(/\\deg/g, '°')
    .replace(/\\Omega/g, 'Ω')
    .replace(/\\omega/g, 'ω')
    .replace(/\\rightleftharpoons/g, '⇌')
    .replace(/\\Rightarrow/g, '⇒')
    .replace(/\\Leftrightarrow/g, '⇔')
    .replace(/\\rightarrow/g, '→')
    .replace(/<->/g, '⇌')
    .replace(/<=>/g, '⇔')
    .replace(/=>/g, '⇒')
    .replace(/->/g, '→')
    .replace(/<-/g, '←')
    .replace(/<=/g, '≤')
    .replace(/>=/g, '≥')
    .replace(/!=/g, '≠')
    .replace(/~=/g, '≈')
    .replace(/\+-/g, '±')
    .replace(/\^\{([0-9nxy+\-=()]+)\}/g, (_, chars: string) =>
      chars
        .split('')
        .map((c) => SUPERSCRIPT_MAP[c] ?? c)
        .join('')
    )
    .replace(/\^([0-9nxy+\-]+)/g, (_, chars: string) =>
      chars
        .split('')
        .map((c) => SUPERSCRIPT_MAP[c] ?? c)
        .join('')
    )
    .replace(/_\{([0-9nijk+\-]+)\}/g, (_, chars: string) =>
      chars
        .split('')
        .map((c) => SUBSCRIPT_MAP[c] ?? c)
        .join('')
    )
    .replace(/_([0-9nijk]+)/g, (_, chars: string) =>
      chars
        .split('')
        .map((c) => SUBSCRIPT_MAP[c] ?? c)
        .join('')
    );
}
