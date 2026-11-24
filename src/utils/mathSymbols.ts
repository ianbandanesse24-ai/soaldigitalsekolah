export interface SymbolCategory {
  id: 'operasi' | 'pangkat' | 'relasi' | 'yunani' | 'rumus';
  label: string;
  items: { label: string; value: string; title: string }[];
}

export const MATH_SYMBOL_CATEGORIES: SymbolCategory[] = [
  {
    id: 'operasi',
    label: 'Operasi & Akar',
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
    ],
  },
  {
    id: 'relasi',
    label: 'Relasi & Himpunan',
    items: [
      { label: '=', value: '=', title: 'Sama dengan' },
      { label: '≠', value: '≠', title: 'Tidak sama dengan' },
      { label: '≈', value: '≈', title: 'Kira-kira sama dengan' },
      { label: '≡', value: '≡', title: 'Kongruen / ekuivalen' },
      { label: '≤', value: '≤', title: 'Kurang dari atau sama dengan' },
      { label: '≥', value: '≥', title: 'Lebih dari atau sama dengan' },
      { label: '∈', value: '∈', title: 'Anggota himpunan' },
      { label: '∉', value: '∉', title: 'Bukan anggota himpunan' },
      { label: '⊂', value: '⊂', title: 'Himpunan bagian' },
      { label: '⊆', value: '⊆', title: 'Himpunan bagian sama' },
      { label: '∪', value: '∪', title: 'Gabungan (Union)' },
      { label: '∩', value: '∩', title: 'Irisan (Intersection)' },
      { label: '∅', value: '∅', title: 'Himpunan kosong' },
      { label: '∀', value: '∀', title: 'Untuk semua' },
      { label: '∃', value: '∃', title: 'Terdapat' },
      { label: '→', value: '→', title: 'Panah kanan / reaksi / limit' },
      { label: '←', value: '←', title: 'Panah kiri' },
      { label: '↔', value: '↔', title: 'Reaksi kesetimbangan / biimplikasi' },
      { label: '⇒', value: '⇒', title: 'Implikasi (Maka)' },
      { label: '⇔', value: '⇔', title: 'Biimplikasi (Jika dan hanya jika)' },
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
      { label: 'λ', value: 'λ', title: 'Lambda' },
      { label: 'μ', value: 'μ', title: 'Mu (rata-rata / mikro)' },
      { label: 'ρ', value: 'ρ', title: 'Rho (massa jenis)' },
      { label: 'σ', value: 'σ', title: 'Sigma kecil (simpangan baku)' },
      { label: 'Σ', value: 'Σ', title: 'Sigma besar' },
      { label: 'Φ', value: 'Φ', title: 'Phi' },
      { label: 'Ω', value: 'Ω', title: 'Ohm' },
      { label: 'ω', value: 'ω', title: 'Omega (kecepatan sudut)' },
      { label: '∑', value: '∑', title: 'Notasi Sigma (penjumlahan)' },
      { label: '∏', value: '∏', title: 'Notasi Pi (perkalian)' },
      { label: '∫', value: '∫', title: 'Integral' },
      { label: '∂', value: '∂', title: 'Turunan parsial' },
      { label: '∇', value: '∇', title: 'Nabla / gradien' },
      { label: '∠', value: '∠', title: 'Sudut' },
      { label: '△', value: '△', title: 'Segitiga' },
      { label: '⊥', value: '⊥', title: 'Tegak lurus' },
      { label: '∥', value: '∥', title: 'Sejajar' },
    ],
  },
  {
    id: 'rumus',
    label: 'Template Rumus',
    items: [
      {
        label: 'x₁,₂ = (-b ± √(b² - 4ac)) / 2a',
        value: 'x₁,₂ = (-b ± √(b² - 4ac)) / 2a',
        title: 'Rumus ABC Persamaan Kuadrat',
      },
      {
        label: '²log 8 = 3',
        value: '²log 8 = 3',
        title: 'Contoh Notasi Logaritma',
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
        label: '∫ f(x) dx = F(x) + C',
        value: '∫ f(x) dx = F(x) + C',
        title: 'Integral Tak Tentu',
      },
      {
        label: '∑(i=1..n) xᵢ',
        value: '∑(i=1..n) xᵢ',
        title: 'Notasi Sigma',
      },
      {
        label: 'F = m · a',
        value: 'F = m · a',
        title: 'Hukum II Newton',
      },
      {
        label: 'E = m · c²',
        value: 'E = m · c²',
        title: 'Energi Relativistik',
      },
      {
        label: 'pH = -log[H⁺]',
        value: 'pH = -log[H⁺]',
        title: 'Rumus Derajat Keasaman Kimia',
      },
      {
        label: 'H₂O + CO₂ → H₂CO₃',
        value: 'H₂O + CO₂ → H₂CO₃',
        title: 'Contoh Persamaan Reaksi Kimia',
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
  '+': '⁺',
  '-': '⁻',
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
};

/**
 * Mengonversi notasi ketikan seperti x^2, H_2O, <=, >=, !=, ->, \sqrt, \pi
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
    .replace(/\\sigma/g, 'σ')
    .replace(/\\Sigma|\\sum/g, '∑')
    .replace(/\\int/g, '∫')
    .replace(/\\infty|\\inf/g, '∞')
    .replace(/\\times/g, '×')
    .replace(/\\div/g, '÷')
    .replace(/\\deg/g, '°')
    .replace(/\\Omega/g, 'Ω')
    .replace(/<=>/g, '⇔')
    .replace(/=>/g, '⇒')
    .replace(/->/g, '→')
    .replace(/<-/g, '←')
    .replace(/<=/g, '≤')
    .replace(/>=/g, '≥')
    .replace(/!=/g, '≠')
    .replace(/~=/g, '≈')
    .replace(/\+-/g, '±')
    .replace(/\^\{([0-9n+-]+)\}/g, (_, chars: string) =>
      chars
        .split('')
        .map((c) => SUPERSCRIPT_MAP[c] ?? c)
        .join('')
    )
    .replace(/\^([0-9n+-]+)/g, (_, chars: string) =>
      chars
        .split('')
        .map((c) => SUPERSCRIPT_MAP[c] ?? c)
        .join('')
    )
    .replace(/_\{([0-9n]+)\}/g, (_, chars: string) =>
      chars
        .split('')
        .map((c) => SUBSCRIPT_MAP[c] ?? c)
        .join('')
    )
    .replace(/_([0-9n]+)/g, (_, chars: string) =>
      chars
        .split('')
        .map((c) => SUBSCRIPT_MAP[c] ?? c)
        .join('')
    );
}
