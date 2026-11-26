import { BabMateriConfig } from '../types/exam';

export type CpRegulationCode = 'CP_046_2025' | 'CP_020_2026';

export type SmaSubjectGroup =
  | 'Mapel Umum SMA'
  | 'Pendidikan Agama & Budi Pekerti'
  | 'Mapel Dasar Fase E (Kelas X)'
  | 'Mapel Pilihan — MIPA'
  | 'Mapel Pilihan — IPS'
  | 'Mapel Pilihan — Bahasa & Budaya'
  | 'Mapel Pilihan — Prakarya & Vokasi';

export interface SmaSubjectDefinition {
  name: string;
  group: SmaSubjectGroup;
  kind: 'UMUM' | 'PILIHAN' | 'AGAMA';
}

export interface CpElementReference {
  elemen: string;
  namaBab: string;
  lingkupMateri: string;
  capaianPembelajaran: string;
}

export interface CpAnalysisResult {
  regulationCode: CpRegulationCode;
  regulationShort: string;
  regulationFull: string;
  kategoriMapel: 'Mata Pelajaran Umum' | 'Pendidikan Agama dan Budi Pekerti';
  smaGroup: SmaSubjectGroup;
  smaKind: 'UMUM' | 'PILIHAN' | 'AGAMA';
  summary: string;
  elements: CpElementReference[];
}

export const CP_REGULATIONS: Record<
  CpRegulationCode,
  { short: string; full: string; year: string }
> = {
  CP_046_2025: {
    short: 'CP 046 Tahun 2025',
    full: 'Keputusan Kepala BSKAP No. 046/H/KR/2025 (Mata Pelajaran Umum & Pilihan SMA)',
    year: '2025',
  },
  CP_020_2026: {
    short: 'CP 020 Tahun 2026',
    full: 'Keputusan Kepala BKPDM No. 020 Tahun 2026 (Pendidikan Agama & Budi Pekerti SMA)',
    year: '2026',
  },
};

export const SMA_SUBJECT_CATALOG: SmaSubjectDefinition[] = [
  // 1. Kelompok Mapel Umum SMA (Wajib Fase E & F — CP 046/2025)
  { name: 'Pendidikan Pancasila', group: 'Mapel Umum SMA', kind: 'UMUM' },
  { name: 'Bahasa Indonesia', group: 'Mapel Umum SMA', kind: 'UMUM' },
  { name: 'Matematika', group: 'Mapel Umum SMA', kind: 'UMUM' },
  { name: 'Bahasa Inggris', group: 'Mapel Umum SMA', kind: 'UMUM' },
  { name: 'Sejarah', group: 'Mapel Umum SMA', kind: 'UMUM' },
  {
    name: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    group: 'Mapel Umum SMA',
    kind: 'UMUM',
  },
  { name: 'Seni Rupa', group: 'Mapel Umum SMA', kind: 'UMUM' },
  { name: 'Seni Musik', group: 'Mapel Umum SMA', kind: 'UMUM' },
  { name: 'Seni Tari', group: 'Mapel Umum SMA', kind: 'UMUM' },
  { name: 'Seni Teater', group: 'Mapel Umum SMA', kind: 'UMUM' },
  {
    name: 'Muatan Lokal / Bahasa Daerah',
    group: 'Mapel Umum SMA',
    kind: 'UMUM',
  },

  // 2. Kelompok Pendidikan Agama & Budi Pekerti SMA (Wajib Fase E & F — CP 020/2026)
  {
    name: 'Pendidikan Agama Islam dan Budi Pekerti',
    group: 'Pendidikan Agama & Budi Pekerti',
    kind: 'AGAMA',
  },
  {
    name: 'Pendidikan Agama Kristen dan Budi Pekerti',
    group: 'Pendidikan Agama & Budi Pekerti',
    kind: 'AGAMA',
  },
  {
    name: 'Pendidikan Agama Katolik dan Budi Pekerti',
    group: 'Pendidikan Agama & Budi Pekerti',
    kind: 'AGAMA',
  },
  {
    name: 'Pendidikan Agama Hindu dan Budi Pekerti',
    group: 'Pendidikan Agama & Budi Pekerti',
    kind: 'AGAMA',
  },
  {
    name: 'Pendidikan Agama Buddha dan Budi Pekerti',
    group: 'Pendidikan Agama & Budi Pekerti',
    kind: 'AGAMA',
  },
  {
    name: 'Pendidikan Agama Khonghucu dan Budi Pekerti',
    group: 'Pendidikan Agama & Budi Pekerti',
    kind: 'AGAMA',
  },
  {
    name: 'Pendidikan Kepercayaan terhadap Tuhan YME dan Budi Pekerti',
    group: 'Pendidikan Agama & Budi Pekerti',
    kind: 'AGAMA',
  },

  // 3. Kelompok Mapel Dasar Fase E / Kelas X SMA (CP 046/2025)
  {
    name: 'Ilmu Pengetahuan Alam (IPA)',
    group: 'Mapel Dasar Fase E (Kelas X)',
    kind: 'UMUM',
  },
  {
    name: 'Ilmu Pengetahuan Sosial (IPS)',
    group: 'Mapel Dasar Fase E (Kelas X)',
    kind: 'UMUM',
  },

  // 4. Kelompok Mapel Pilihan SMA — MIPA (CP 046/2025)
  {
    name: 'Matematika Tingkat Lanjut',
    group: 'Mapel Pilihan — MIPA',
    kind: 'PILIHAN',
  },
  { name: 'Fisika', group: 'Mapel Pilihan — MIPA', kind: 'PILIHAN' },
  { name: 'Kimia', group: 'Mapel Pilihan — MIPA', kind: 'PILIHAN' },
  { name: 'Biologi', group: 'Mapel Pilihan — MIPA', kind: 'PILIHAN' },
  { name: 'Informatika', group: 'Mapel Pilihan — MIPA', kind: 'PILIHAN' },

  // 5. Kelompok Mapel Pilihan SMA — IPS (CP 046/2025)
  { name: 'Ekonomi', group: 'Mapel Pilihan — IPS', kind: 'PILIHAN' },
  { name: 'Geografi', group: 'Mapel Pilihan — IPS', kind: 'PILIHAN' },
  { name: 'Sosiologi', group: 'Mapel Pilihan — IPS', kind: 'PILIHAN' },
  { name: 'Antropologi', group: 'Mapel Pilihan — IPS', kind: 'PILIHAN' },

  // 6. Kelompok Mapel Pilihan SMA — Bahasa & Budaya (CP 046/2025)
  {
    name: 'Bahasa Indonesia Tingkat Lanjut',
    group: 'Mapel Pilihan — Bahasa & Budaya',
    kind: 'PILIHAN',
  },
  {
    name: 'Bahasa Inggris Tingkat Lanjut',
    group: 'Mapel Pilihan — Bahasa & Budaya',
    kind: 'PILIHAN',
  },
  { name: 'Bahasa Arab', group: 'Mapel Pilihan — Bahasa & Budaya', kind: 'PILIHAN' },
  { name: 'Bahasa Jepang', group: 'Mapel Pilihan — Bahasa & Budaya', kind: 'PILIHAN' },
  { name: 'Bahasa Jerman', group: 'Mapel Pilihan — Bahasa & Budaya', kind: 'PILIHAN' },
  {
    name: 'Bahasa Mandarin',
    group: 'Mapel Pilihan — Bahasa & Budaya',
    kind: 'PILIHAN',
  },
  {
    name: 'Bahasa Prancis',
    group: 'Mapel Pilihan — Bahasa & Budaya',
    kind: 'PILIHAN',
  },
  { name: 'Bahasa Korea', group: 'Mapel Pilihan — Bahasa & Budaya', kind: 'PILIHAN' },

  // 7. Kelompok Mapel Pilihan SMA — Prakarya & Vokasi (CP 046/2025)
  {
    name: 'Prakarya dan Kewirausahaan (PKWU)',
    group: 'Mapel Pilihan — Prakarya & Vokasi',
    kind: 'PILIHAN',
  },
];

export function isAgamaBudiPekertiSubject(mataPelajaran: string): boolean {
  const lower = (mataPelajaran || '').toLowerCase();
  return (
    lower.includes('agama') ||
    lower.includes('budi pekerti') ||
    lower.includes('kepercayaan terhadap tuhan') ||
    lower.includes('pai') ||
    lower.includes('kristen') ||
    lower.includes('katolik') ||
    lower.includes('hindu') ||
    lower.includes('buddha') ||
    lower.includes('khonghucu')
  );
}

export function getSmaSubjectMeta(
  mataPelajaran: string
): Pick<SmaSubjectDefinition, 'group' | 'kind'> {
  const exact = SMA_SUBJECT_CATALOG.find(
    (s) => s.name.toLowerCase() === (mataPelajaran || '').trim().toLowerCase()
  );
  if (exact) return { group: exact.group, kind: exact.kind };

  if (isAgamaBudiPekertiSubject(mataPelajaran)) {
    return { group: 'Pendidikan Agama & Budi Pekerti', kind: 'AGAMA' };
  }
  const lower = (mataPelajaran || '').toLowerCase();
  if (
    lower.includes('tingkat lanjut') ||
    lower.includes('fisika') ||
    lower.includes('kimia') ||
    lower.includes('biologi') ||
    lower.includes('informatika')
  ) {
    return { group: 'Mapel Pilihan — MIPA', kind: 'PILIHAN' };
  }
  if (
    lower.includes('ekonomi') ||
    lower.includes('geografi') ||
    lower.includes('sosiologi') ||
    lower.includes('antropologi')
  ) {
    return { group: 'Mapel Pilihan — IPS', kind: 'PILIHAN' };
  }
  if (lower.includes('bahasa ')) {
    return { group: 'Mapel Pilihan — Bahasa & Budaya', kind: 'PILIHAN' };
  }
  if (lower.includes('prakarya') || lower.includes('pkwu')) {
    return { group: 'Mapel Pilihan — Prakarya & Vokasi', kind: 'PILIHAN' };
  }
  return { group: 'Mapel Umum SMA', kind: 'UMUM' };
}

type SmaPhase = 'E' | 'F';

function normalizeSmaPhase(fase: string): SmaPhase {
  const upper = (fase || '').toUpperCase();
  if (upper.includes('FASE F') || upper === 'F') return 'F';
  return 'E';
}

function getPaiSmaElements(phase: SmaPhase): CpElementReference[] {
  if (phase === 'E') {
    return [
      {
        elemen: "Al-Qur'an dan Hadis",
        namaBab: 'Bab 1: Kompetisi dalam Kebaikan & Etos Kerja Islami',
        lingkupMateri:
          'Analisis QS. Al-Maidah:48, QS. At-Taubah:105, tajwid & hadis etos kerja produktif',
        capaianPembelajaran:
          "Menganalisis ayat Al-Qur'an dan hadis tentang berlomba-lomba dalam kebaikan (fastabiqul khairat) dan etos kerja dalam kehidupan modern.",
      },
      {
        elemen: 'Akidah & Akhlak',
        namaBab: "Bab 2: Syu'abul Iman & Pengendalian Diri Remaja SMA",
        lingkupMateri:
          "Cabang-cabang iman (syu'abul iman), menjauhi pergaulan bebas, zina & gaya hidup berlebih-lebihan",
        capaianPembelajaran:
          "Memahami hakikat keimanan melalui syu'abul iman serta membiasakan pengendalian diri, kesederhanaan, dan penghormatan martabat manusia.",
      },
      {
        elemen: 'Fikih & Sejarah Peradaban Islam',
        namaBab: 'Bab 3: Prinsip Ekonomi Syariah & Islam di Nusantara',
        lingkupMateri:
          'Asuransi, perbankan, koperasi syariah, serta strategi dakwah damai Wali Songo di Nusantara',
        capaianPembelajaran:
          'Menerapkan prinsip muamalah ekonomi syariah yang adil dan meneladani strategi dakwah damai serta kultural Islam di Nusantara.',
      },
    ];
  }

  return [
    {
      elemen: "Al-Qur'an dan Hadis",
      namaBab: 'Bab 1: Berpikir Kritis, Iptek & Demokrasi Bermartabat',
      lingkupMateri:
        'Tadabur QS. Ali Imran:190-191, QS. Ali Imran:159, musyawarah & cinta tanah air',
      capaianPembelajaran:
        "Menganalisis pesan Al-Qur'an dan hadis tentang berpikir kritis, pengembangan iptek, dan musyawarah untuk kemaslahatan umat dan bangsa.",
    },
    {
      elemen: 'Akidah & Akhlak',
      namaBab: 'Bab 2: Ma’rifatullah, Moderasi Beragama & Akhlak Kebangsaan',
      lingkupMateri:
        'Etika pergaulan global, keadilan sosial, toleransi aktif (al-samhah) & rahmat bagi semesta',
      capaianPembelajaran:
        'Menginternalisasi nilai keimanan yang mendalam dalam wujud moderasi beragama, keadilan sosial, dan kontribusi nyata bagi perdamaian.',
    },
    {
      elemen: 'Fikih & Sejarah Peradaban Islam',
      namaBab: 'Bab 3: Fikih Munakahat, Mawaris & Peradaban Islam Modern',
      lingkupMateri:
        'Ketentuan pernikahan, pembagian waris (mawaris), ijtihad & tokoh pembaruan Islam',
      capaianPembelajaran:
        'Memahami hukum keluarga Islam (munakahat dan mawaris) secara komprehensif serta mengambil inspirasi dari pembaruan peradaban Islam modern.',
    },
  ];
}

function getAgamaSmaElements(
  subject: string,
  phase: SmaPhase
): CpElementReference[] {
  const lower = subject.toLowerCase();
  const levelDesc = phase === 'E' ? 'Kelas X SMA (Fase E)' : 'Kelas XI–XII SMA (Fase F)';

  if (lower.includes('kristen')) {
    return [
      {
        elemen: 'Allah Berkarya',
        namaBab: `Bab 1: Allah Pemelihara & Pembaru Kehidupan (${levelDesc})`,
        lingkupMateri:
          phase === 'E'
            ? 'Kedewasaan pribadi, panggilan Allah dalam keluarga & peran Roh Kudus'
            : 'Karya pembaruan Allah dalam ilmu pengetahuan, teknologi & tantangan zaman modern',
        capaianPembelajaran:
          'Menganalisis karya Allah yang memelihara dan memperbarui kehidupan manusia serta meresponsnya melalui tanggung jawab iman remaja SMA.',
      },
      {
        elemen: 'Manusia dan Nilai-nilai Kristiani',
        namaBab: 'Bab 2: Etika Kristiani, Keadilan & Hak Asasi Manusia',
        lingkupMateri:
          'Prinsip keadilan, kesetaraan, cinta kasih, kejujuran & pengambilan keputusan moral',
        capaianPembelajaran:
          'Menerapkan nilai-nilai Kristiani tentang keadilan, kebenaran, dan kasih dalam menghadapi persoalan sosial dan etika remaja.',
      },
      {
        elemen: 'Gereja, Masyarakat Majemuk & Alam',
        namaBab: 'Bab 3: Moderasi Beragama, Demokrasi & Ekologi Kristiani',
        lingkupMateri:
          'Dialog lintas iman, peran warga negara yang melayani serta pelestarian lingkungan hidup',
        capaianPembelajaran:
          'Mewujudkan sikap inklusif, membawa damai sejahtera di masyarakat majemuk, dan memelihara kelestarian alam ciptaan Tuhan.',
      },
    ];
  }

  if (lower.includes('katolik')) {
    return [
      {
        elemen: 'Pribadi Peserta Didik',
        namaBab: `Bab 1: Panggilan Hidup, Suara Hati & Martabat Manusia (${levelDesc})`,
        lingkupMateri:
          'Kesetaraan pria-wanita, suara hati kritis terhadap media & pilihan panggilan hidup',
        capaianPembelajaran:
          'Memahami diri sebagai citra Allah yang bermartabat, mengembangkan suara hati yang benar, dan bersikap kritis terhadap budaya modern.',
      },
      {
        elemen: 'Yesus Kristus & Kitab Suci',
        namaBab: 'Bab 2: Kerajaan Allah, Wafat-Kebangkitan & Ajaran Sosial Gereja',
        lingkupMateri:
          'Pejuang Kerajaan Allah, makna sengsara-kebangkitan Kristus & Ajaran Sosial Gereja (ASG)',
        capaianPembelajaran:
          'Meneladani pribadi dan ajaran Yesus Kristus serta menerapkan prinsip Ajaran Sosial Gereja bagi keadilan dan solidaritas.',
      },
      {
        elemen: 'Gereja dan Masyarakat',
        namaBab: 'Bab 3: Dialog Lintas Agama, Perdamaian & Keutuhan Ciptaan',
        lingkupMateri:
          'Peran umat Katolik dalam pembangunan bangsa, toleransi dan pertobatan ekologis',
        capaianPembelajaran:
          'Berperan aktif membangun persaudaraan sejati lintas iman, keadilan sosial, dan pelestarian lingkungan hidup.',
      },
    ];
  }

  if (lower.includes('hindu')) {
    return [
      {
        elemen: 'Kitab Suci Veda & Sraddha Bhakti',
        namaBab: `Bab 1: Weda Sumber Hukum, Moksa & Bhakti (${levelDesc})`,
        lingkupMateri:
          'Kedudukan Upanisad, Purana, Catur Purusartha & jalan menuju Moksa (Catur Marga)',
        capaianPembelajaran:
          'Menganalisis ajaran Kitab Suci Veda, Catur Marga, dan nilai-nilai Sraddha Bhakti secara mendalam dan kontekstual.',
      },
      {
        elemen: 'Susila (Etika & Moralitas)',
        namaBab: 'Bab 2: Tri Hita Karana, Vasudhaiva Kutumbakam & Etika Sosial',
        lingkupMateri:
          'Harmoni dengan Hyang Widhi, sesama, dan alam; pengendalian Panca Maya Kosa & Yama Niyama Brata',
        capaianPembelajaran:
          'Mengamalkan prinsip Vasudhaiva Kutumbakam dan Tri Hita Karana untuk mewujudkan toleransi dan kepedulian sosial-ekologis.',
      },
      {
        elemen: 'Acara & Sejarah Agama Hindu',
        namaBab: 'Bab 3: Hakikat Yadnya, Budaya & Sejarah Hindu Nusantara',
        lingkupMateri:
          'Implementasi Panca Yadnya dalam kehidupan modern dan peninggalan peradaban Hindu di Indonesia',
        capaianPembelajaran:
          'Memaknai pelaksanaan Yadnya secara filosofis-kontekstual dan meneladani warisan luhur sejarah Hindu Nusantara.',
      },
    ];
  }

  if (lower.includes('buddha')) {
    return [
      {
        elemen: 'Sejarah & Kitab Suci Tripitaka',
        namaBab: `Bab 1: Tipitaka, Jalan Mulia Berunsur Delapan & Hukum Universal (${levelDesc})`,
        lingkupMateri:
          'Empat Kesunyataan Mulia, Jalan Tengah, hukum Tilakkhana & Paticcasamuppada',
        capaianPembelajaran:
          'Menganalisis ajaran Buddha Dharma dalam Tipitaka serta memahami hukum sebab-akibat dan hukum universal kehidupan.',
      },
      {
        elemen: 'Sila (Moralitas & Budi Pekerti)',
        namaBab: 'Bab 2: Etika Sosial Buddhis, Brahmavihara & Moderasi Beragama',
        lingkupMateri:
          'Penerapan Metta, Karuna, Mudita, Upekkha serta etika bermasyarakat dan bernegara',
        capaianPembelajaran:
          'Mengamalkan empat sifat luhur (Brahmavihara) dalam membangun kerukunan, toleransi, dan kepedulian sosial.',
      },
      {
        elemen: 'Samadhi & Panna (Kebijaksanaan)',
        namaBab: 'Bab 3: Meditasi Kesadaran Penuh (Mindfulness) & Iptek',
        lingkupMateri:
          'Pengembangan ketenangan batin (samatha-vipassana) dan sikap bijaksana menghadapi era digital',
        capaianPembelajaran:
          'Melatih pengendalian diri, kesadaran penuh, dan kebijaksanaan (panna) dalam menyikapi persoalan hidup modern.',
      },
    ];
  }

  if (lower.includes('khonghucu')) {
    return [
      {
        elemen: 'Kitab Suci & Keimanan (Xin)',
        namaBab: `Bab 1: Kitab Si Shu, Wu Jing & Nilai Keimanan kepada Tian (${levelDesc})`,
        lingkupMateri:
          'Ajaran Tengah Sempurna (Zhong Yong), Da Xue & penghayatan firman Tian',
        capaianPembelajaran:
          'Menganalisis ajaran Kitab Suci Si Shu dan Wu Jing sebagai pedoman pembinaan diri dan keimanan kepada Tian.',
      },
      {
        elemen: 'Tata Laku & Etika (Li & Xiao)',
        namaBab: 'Bab 2: Pembinaan Diri Junzi, Wu Chang & Harmoni Kebinekaan',
        lingkupMateri:
          'Penerapan Ren, Yi, Li, Zhi, Xin dan tanggung jawab sosial manusia berbudi luhur (Junzi)',
        capaianPembelajaran:
          'Mengaktualisasikan karakter Junzi melalui sikap jujur, susila, bakti, dan toleransi di tengah masyarakat majemuk.',
      },
      {
        elemen: 'Sejarah Suci & Peribadahan',
        namaBab: 'Bab 3: Keteladanan Nabi Kongzi & Kontribusi Sosial Rujiao',
        lingkupMateri:
          'Sejarah perkembangan agama Khonghucu, makna ritual dan bakti sosial bagi kemanusiaan',
        capaianPembelajaran:
          'Memahami makna peribadahan serta meneladani semangat pembinaan diri dan pelayanan kemanusiaan Nabi Kongzi.',
      },
    ];
  }

  if (lower.includes('kepercayaan')) {
    return [
      {
        elemen: 'Keagungan Tuhan YME & Spiritualitas',
        namaBab: `Bab 1: Penghayatan Ketuhanan YME & Olah Rasa (${levelDesc})`,
        lingkupMateri:
          'Pengenalan jati diri, keheningan batin, syukur & keselarasan hidup dengan Tuhan YME',
        capaianPembelajaran:
          'Memahami keagungan Tuhan Yang Maha Esa serta mengembangkan kesadaran spiritual dan pengendalian diri yang mendalam.',
      },
      {
        elemen: 'Budi Pekerti & Kemanusiaan',
        namaBab: 'Bab 2: Nilai Luhur Kearifan Lokal & Harmoni Sosial',
        lingkupMateri:
          'Tepa selira, gotong royong, kejujuran, hormat pada leluhur & toleransi antarumat',
        capaianPembelajaran:
          'Mengamalkan nilai luhur budi pekerti, tepa selira, dan persaudaraan dalam kehidupan masyarakat majemuk.',
      },
      {
        elemen: 'Alam Semesta & Kebangsaan',
        namaBab: 'Bab 3: Memayu Hayuning Bawana & Cinta Tanah Air',
        lingkupMateri:
          'Keselarasan dengan alam semesta, pelestarian budaya luhur & kontribusi bagi NKRI',
        capaianPembelajaran:
          'Mewujudkan tanggung jawab menjaga keharmonisan alam semesta dan merawat persatuan bangsa Indonesia.',
      },
    ];
  }

  return getPaiSmaElements(phase);
}

function getGeneralOrElectiveSmaElements(
  subject: string,
  phase: SmaPhase
): CpElementReference[] {
  const lower = subject.toLowerCase();

  // 1. Matematika Tingkat Lanjut (Mapel Pilihan MIPA Fase F)
  if (lower.includes('matematika tingkat lanjut')) {
    return [
      {
        elemen: 'Aljabar dan Fungsi Lanjut',
        namaBab: 'Bab 1: Bilangan Kompleks, Polinomial & Matriks',
        lingkupMateri:
          'Operasi & bentuk polar bilangan kompleks, teorema faktor/sisa polinomial, determinan & invers matriks',
        capaianPembelajaran:
          'Melakukan operasi aljabar pada bilangan kompleks, menganalisis faktorisasi polinomial, dan menyelesaikan masalah kontekstual menggunakan matriks.',
      },
      {
        elemen: 'Geometri Analitik & Transformasi',
        namaBab: 'Bab 2: Vektor di Ruang & Transformasi Geometri Matriks',
        lingkupMateri:
          'Operasi vektor 2D/3D, perkalian skalar (dot product), komposisi transformasi geometri & irisan kerucut',
        capaianPembelajaran:
          'Menerapkan operasi vektor dan transformasi geometri berbasis matriks dalam memodelkan permasalahan ruang dan fisika.',
      },
      {
        elemen: 'Kalkulus & Analisis Lanjut',
        namaBab: 'Bab 3: Fungsi Trigonometri Lanjut, Limit & Aplikasi Kalkulus',
        lingkupMateri:
          'Identitas & persamaan trigonometri lanjut, limit fungsi aljabar-trigonometri, laju perubahan & optimasi',
        capaianPembelajaran:
          'Menganalisis karakteristik fungsi trigonometri lanjut, limit, serta turunan dalam menyelesaikan masalah optimasi nyata.',
      },
    ];
  }

  // 2. Matematika (Mapel Umum SMA Fase E & F)
  if (lower === 'matematika' || lower.includes('matematika')) {
    if (phase === 'E') {
      return [
        {
          elemen: 'Bilangan',
          namaBab: 'Bab 1: Eksponen & Logaritma',
          lingkupMateri:
            'Sifat bilangan berpangkat (termasuk pangkat pecahan), bentuk akar, pertumbuhan/peluruhan & logaritma',
          capaianPembelajaran:
            'Menggeneralisasi sifat-sifat bilangan berpangkat dan logaritma dalam pemecahan masalah bermakna.',
        },
        {
          elemen: 'Aljabar dan Fungsi',
          namaBab: 'Bab 2: Barisan, Deret, SPLTV & Fungsi Kuadrat',
          lingkupMateri:
            'Barisan dan deret aritmetika/geometri, sistem persamaan-pertidaksamaan linear & fungsi kuadrat',
          capaianPembelajaran:
            'Menyelesaikan masalah kontekstual yang berkaitan dengan barisan, deret, SPLTV, dan fungsi kuadrat.',
        },
        {
          elemen: 'Geometri & Analisis Data dan Peluang',
          namaBab: 'Bab 3: Trigonometri, Statistika & Peluang Kejadian',
          lingkupMateri:
            'Perbandingan trigonometri sudut istimewa, ukuran pemusatan-penyebaran data & peluang kejadian saling lepas',
          capaianPembelajaran:
            'Menyelesaikan masalah segitiga siku-siku dengan perbandingan trigonometri serta menganalisis data statistik dan peluang.',
        },
      ];
    }
    return [
      {
        elemen: 'Aljabar dan Fungsi',
        namaBab: 'Bab 1: Fungsi Komposisi, Fungsi Invers & Pemodelan',
        lingkupMateri:
          'Domain-range fungsi, komposisi fungsi, fungsi invers & penerapan fungsi eksponensial-kuadrat',
        capaianPembelajaran:
          'Menentukan dan memodelkan fenomena kehidupan nyata menggunakan fungsi komposisi dan fungsi invers.',
      },
      {
        elemen: 'Geometri',
        namaBab: 'Bab 2: Lingkaran, Busur, Juring & Garis Singgung',
        lingkupMateri:
          'Sudut pusat dan sudut keliling, segi empat tali busur, garis singgung persekutuan lingkaran',
        capaianPembelajaran:
          'Menerapkan teorema tentang lingkaran (sudut, tali busur, garis singgung) dalam menyelesaikan masalah geometri.',
      },
      {
        elemen: 'Analisis Data dan Peluang',
        namaBab: 'Bab 3: Regresi Linear, Kaidah Pencacahan & Peluang',
        lingkupMateri:
          'Diagram pencar (scatter plot), regresi linear, permutasi-kombinasi & peluang kejadian majemuk/bersyarat',
        capaianPembelajaran:
          'Melakukan analisis korelasi dan regresi linear sederhana serta menyelesaikan masalah kombinatorika dan peluang bersyarat.',
      },
    ];
  }

  // 3. Bahasa Indonesia & Bahasa Indonesia Tingkat Lanjut
  if (lower.includes('bahasa indonesia tingkat lanjut')) {
    return [
      {
        elemen: 'Menyimak & Membaca Teks Sastra-Akademik',
        namaBab: 'Bab 1: Analisis Teks Ilmiah, Sastra Klasik & Kontemporer',
        lingkupMateri:
          'Telaah kritis artikel jurnal ilmiah, novel sastra Indonesia-dunia, serta teori kritik sastra',
        capaianPembelajaran:
          'Mengevaluasi argumen ilmiah dan nilai estetika-filosofis karya sastra klasik maupun kontemporer secara mendalam.',
      },
      {
        elemen: 'Berbicara & Berdiskusi Akademik',
        namaBab: 'Bab 2: Debat Akademik, Seminar & Orasi Ilmiah',
        lingkupMateri:
          'Retorika argumentatif berbasis data, teknik moderasi seminar & penyajian kritik sastra lisan',
        capaianPembelajaran:
          'Menyajikan gagasan ilmiah dan apresiasi sastra secara kritis, logis, dan persuasif dalam forum akademik.',
      },
      {
        elemen: 'Menulis Karya Ilmiah & Sastra Kreatif',
        namaBab: 'Bab 3: Penulisan Esai Kritis, Karya Tulis Ilmiah & Prosa',
        lingkupMateri:
          'Sistematika KTI, sitasi & daftar pustaka baku, esai kritik sastra serta penulisan cerpen/drama',
        capaianPembelajaran:
          'Menyusun karya tulis ilmiah berstandar akademik dan karya sastra kreatif dengan penguasaan kaidah kebahasaan tingkat lanjut.',
      },
    ];
  }

  if (lower.includes('bahasa indonesia')) {
    return [
      {
        elemen: 'Menyimak & Membaca-Memirsa',
        namaBab:
          phase === 'E'
            ? 'Bab 1: Teks Laporan Hasil Observasi, Anekdot & Hikayat'
            : 'Bab 1: Teks Argumentasi, Berita Aktual & Resensi Karya',
        lingkupMateri:
          phase === 'E'
            ? 'Struktur LHO, kritik sosial dalam teks anekdot, nilai kearifan hikayat & informasi multimodal'
            : 'Analisis fakta-opini dalam teks argumentasi, struktur berita, serta penelaahan resensi buku/film',
        capaianPembelajaran:
          'Mengevaluasi dan mengkreasi informasi berupa gagasan, pikiran, perasaan, dan pandangan yang akurat dari berbagai tipe teks.',
      },
      {
        elemen: 'Berbicara dan Mempresentasikan',
        namaBab:
          phase === 'E'
            ? 'Bab 2: Teks Negosiasi & Presentasi Biografi Tokoh'
            : 'Bab 2: Debat Ilmiah, Ceramah & Pementasan Drama',
        lingkupMateri:
          phase === 'E'
            ? 'Strategi kesepakatan dalam negosiasi, keteladanan tokoh biografi & presentasi santun'
            : 'Penyampaian argumen debat berbasis bukti, retorika ceramah inspiratif & ekspresi pementasan',
        capaianPembelajaran:
          'Mengolah dan menyajikan gagasan serta tanggapan secara runtut, logis, kritis, dan santun dalam forum diskusi.',
      },
      {
        elemen: 'Menulis',
        namaBab:
          phase === 'E'
            ? 'Bab 3: Puisi, Teks Eksposisi & Penyuntingan EYD V'
            : 'Bab 3: Proposal, Karya Ilmiah & Surat Lamaran Pekerjaan',
        lingkupMateri:
          phase === 'E'
            ? 'Diksi & majas puisi, pengembangan paragraf eksposisi serta ketepatan ejaan EYD V'
            : 'Penyusunan proposal kegiatan/penelitian, artikel ilmiah populer & surat resmi sesuai kaidah',
        capaianPembelajaran:
          'Menulis gagasan, pengalaman, atau hasil kajian ke dalam berbagai jenis teks secara terstruktur dan sesuai kaidah bahasa Indonesia.',
      },
    ];
  }

  // 4. Bahasa Inggris & Bahasa Inggris Tingkat Lanjut
  if (lower.includes('bahasa inggris tingkat lanjut')) {
    return [
      {
        elemen: 'Listening & Speaking (Advanced Discourse)',
        namaBab: 'Bab 1: Critical Discussion, Debate & Academic Presentation',
        lingkupMateri:
          'Expressing nuanced stance, hedging expressions, rebuttal & structured oral argumentation',
        capaianPembelajaran:
          'Menganalisis wacana lisan kompleks dan berpartisipasi aktif dalam diskusi kritis serta presentasi akademik berbahasa Inggris.',
      },
      {
        elemen: 'Reading & Viewing (Complex Multimodal Texts)',
        namaBab: 'Bab 2: Narrative, Analytical/Hortatory Exposition & Discussion Texts',
        lingkupMateri:
          'Evaluating author bias, rhetorical devices, complex clauses & cross-cultural literary texts',
        capaianPembelajaran:
          'Mengevaluasi struktur retorika, sudut pandang penulis, dan pesan tersirat pada teks argumentatif, diskusi, serta karya sastra.',
      },
      {
        elemen: 'Writing & Presenting (Academic & Literary Writing)',
        namaBab: 'Bab 3: Academic Essay, Review & Argumentative Composition',
        lingkupMateri:
          'Cohesive devices, passive/conditional structures, thesis-driven essays & critical text reviews',
        capaianPembelajaran:
          'Memproduksi esai argumentatif, teks diskusi, dan ulasan kritis secara koheren dengan tata bahasa tingkat lanjut.',
      },
    ];
  }

  if (lower.includes('bahasa inggris')) {
    return [
      {
        elemen: 'Listening & Speaking (Menyimak–Berbicara)',
        namaBab: 'Bab 1: Transactional & Interpersonal Communication',
        lingkupMateri:
          'Asking & giving opinions, agreeing/disagreeing, expressing empathy & oral presentation',
        capaianPembelajaran:
          'Menggunakan bahasa Inggris untuk berinteraksi dan bertukar gagasan secara bermakna, santun, dan percaya diri.',
      },
      {
        elemen: 'Reading & Viewing (Membaca–Memirsa)',
        namaBab:
          phase === 'E'
            ? 'Bab 2: Descriptive, Recount & Narrative Texts'
            : 'Bab 2: Analytical Exposition, Hortatory & Discussion Texts',
        lingkupMateri:
          phase === 'E'
            ? 'Social function, generic structure, main ideas & implied meanings in multimodal texts'
            : 'Arguments, thesis statements, multimodal infographics & critical evaluation of contemporary issues',
        capaianPembelajaran:
          'Membaca, memirsa, dan mengevaluasi informasi tersurat maupun tersirat serta tujuan sosial berbagai ragam teks tertulis.',
      },
      {
        elemen: 'Writing & Presenting (Menulis–Mempresentasikan)',
        namaBab: 'Bab 3: Structured Text Production & Language Features',
        lingkupMateri:
          'Simple past, present perfect, passive voice, modal verbs, connectors & text editing',
        capaianPembelajaran:
          'Memproduksi teks tulis dan multimodal yang koheren sesuai tujuan komunikatif, struktur teks, dan unsur kebahasaan.',
      },
    ];
  }

  // 5. Bahasa Asing Lainnya (Arab, Jepang, Jerman, Mandarin, Prancis, Korea)
  if (
    lower.includes('bahasa arab') ||
    lower.includes('bahasa jepang') ||
    lower.includes('bahasa jerman') ||
    lower.includes('bahasa mandarin') ||
    lower.includes('bahasa prancis') ||
    lower.includes('bahasa korea')
  ) {
    return [
      {
        elemen: 'Menyimak & Berbicara (Reseptif–Produktif Lisan)',
        namaBab: `Bab 1: Tindak Tutur & Dialog Sehari-hari (${subject})`,
        lingkupMateri:
          'Perkenalan, kehidupan sekolah, keluarga, hobi & ungkapan kesopanan sesuai budaya bahasa sasaran',
        capaianPembelajaran:
          `Memahami informasi lisan sederhana hingga menengah dan berinteraksi menggunakan ungkapan komunikatif dasar-lanjut dalam ${subject}.`,
      },
      {
        elemen: 'Membaca & Memirsa (Pemahaman Teks & Aksara)',
        namaBab: `Bab 2: Pemahaman Wacana Tulis & Kosakata (${subject})`,
        lingkupMateri:
          'Pengenalan sistem aksara/huruf, struktur kalimat dasar-menengah, pengumuman & teks deskriptif pendek',
        capaianPembelajaran:
          `Membaca dan memahami isi teks tulis/visual sederhana serta mengidentifikasi informasi rinci dalam ${subject}.`,
      },
      {
        elemen: 'Menulis & Pemahaman Lintas Budaya',
        namaBab: `Bab 3: Produksi Teks Pendek & Apresiasi Budaya`,
        lingkupMateri:
          'Penulisan kalimat/paragraf terstruktur, tata bahasa fungsional & perbandingan budaya Indonesia–negara sasaran',
        capaianPembelajaran:
          `Menulis teks deskriptif atau dialog pendek dengan struktur yang tepat serta menghargai keberagaman budaya lintas bangsa.`,
      },
    ];
  }

  // 6. Pendidikan Pancasila SMA
  if (lower.includes('pancasila')) {
    return [
      {
        elemen: 'Pancasila',
        namaBab:
          phase === 'E'
            ? 'Bab 1: Pancasila sebagai Dasar Negara, Pandangan Hidup & Ideologi'
            : 'Bab 1: Ideologi Terbuka & Aktualisasi Pancasila di Era Global',
        lingkupMateri:
          phase === 'E'
            ? 'Gagasan pendiri bangsa, hakikat sila Pancasila, peluang & tantangan penerapan nilai Pancasila'
            : 'Kedudukan Pancasila sebagai ideologi terbuka, etika politik & solusi persoalan kebangsaan',
        capaianPembelajaran:
          'Menganalisis cara pandang pendiri bangsa tentang rumusan Pancasila serta mengaktualisasikan nilai-nilainya dalam kehidupan berbangsa.',
      },
      {
        elemen: 'UUD NRI Tahun 1945',
        namaBab: 'Bab 2: Konstitusi, Hierarki Hukum & Demokrasi Pancasila',
        lingkupMateri:
          'Produk hukum nasional, perilaku taat hukum, hak dan kewajiban warga negara serta sistem demokrasi',
        capaianPembelajaran:
          'Menganalisis hierarki peraturan perundang-undangan, menegakkan hak dan kewajiban konstitusional, dan menerapkan budaya taat hukum.',
      },
      {
        elemen: 'Bhinneka Tunggal Ika & NKRI',
        namaBab: 'Bab 3: Harmoni Keberagaman, Sengketa Wilayah & Bela Negara',
        lingkupMateri:
          'Prinsip gotong royong, penyelesaian konflik sosial secara damai, batas wilayah NKRI & pertahanan negara',
        capaianPembelajaran:
          'Merancang inisiatif menjaga harmoni dalam kebinekaan serta berpartisipasi aktif mempertahankan kedaulatan NKRI.',
      },
    ];
  }

  // 7. Sejarah SMA
  if (lower.includes('sejarah')) {
    return [
      {
        elemen: 'Pemahaman Konsep Sejarah (Diakronis & Sinkronis)',
        namaBab:
          phase === 'E'
            ? 'Bab 1: Pengantar Ilmu Sejarah, Asal-Usul Nenek Moyang & Kerajaan Nusantara'
            : 'Bab 1: Kolonialisme, Pergerakan Nasional & Proklamasi Kemerdekaan',
        lingkupMateri:
          phase === 'E'
            ? 'Konsep ruang-waktu, jalur rempah, akulturasi Hindu-Buddha & Islam di Nusantara'
            : 'Perlawanan daerah, organisasi pergerakan nasional, pendudukan Jepang & revolusi kemerdekaan',
        capaianPembelajaran:
          'Menganalisis keterkaitan peristiwa sejarah lokal, nasional, dan global dengan menggunakan cara berpikir diakronis dan sinkronis.',
      },
      {
        elemen: 'Keterampilan Proses Sejarah (Inkuiri Historis)',
        namaBab: 'Bab 2: Heuristik, Kritik Sumber & Historiografi Sederhana',
        lingkupMateri:
          'Verifikasi sumber primer-sekunder, membedakan fakta-interpretasi & penulisan sejarah lokal bermakna',
        capaianPembelajaran:
          'Melakukan penelitian sejarah sederhana melalui langkah heuristik, kritik sumber, interpretasi, dan historiografi.',
      },
      {
        elemen: 'Refleksi Sejarah Kontemporer',
        namaBab:
          phase === 'E'
            ? 'Bab 3: Warisan Sejarah Maritim & Identitas Kebangsaan'
            : 'Bab 3: Demokrasi Liberal-Terpimpin, Orde Baru hingga Era Reformasi',
        lingkupMateri:
          phase === 'E'
            ? 'Nilai keteladanan tokoh sejarah lokal dan peran strategis jaringan perdagangan Nusantara'
            : 'Dinamika politik-ekonomi Indonesia merdeka, peran Indonesia di dunia (KAA/ASEAN) & Reformasi 1998',
        capaianPembelajaran:
          'Merefleksikan pelajaran sejarah (ibrah historis) untuk membangun kesadaran kebangsaan dan visi masa depan Indonesia.',
      },
    ];
  }

  // 8. IPA Terpadu (Fase E) & Fisika / Kimia / Biologi (Mapel Pilihan MIPA)
  if (lower.includes('fisika')) {
    return [
      {
        elemen: 'Pemahaman Fisika',
        namaBab:
          phase === 'E'
            ? 'Bab 1: Pengukuran, Energi Terbarukan & Pemanasan Global'
            : 'Bab 1: Vektor, Kinematika, Dinamika & Fluida',
        lingkupMateri:
          phase === 'E'
            ? 'Angka penting & ketidakpastian pengukuran, transformasi energi terbarukan & mitigasi perubahan iklim'
            : 'Gerak parabola-melingkar, hukum Newton, usaha-energi, momentum-impuls & fluida statis-dinamis',
        capaianPembelajaran:
          'Menerapkan konsep dan hukum fisika dalam menganalisis fenomena alam serta merancang solusi berbasis prinsip fisika.',
      },
      {
        elemen: 'Keterampilan Proses & Eksperimen Fisika',
        namaBab:
          phase === 'E'
            ? 'Bab 2: Metode Ilmiah, Grafik Data & Ketidakpastian Alat Ukur'
            : 'Bab 2: Termodinamika, Gelombang, Listrik & Fisika Modern',
        lingkupMateri:
          phase === 'E'
            ? 'Jangka sorong, mikrometer sekrup, pengolahan data eksperimen & penarikan kesimpulan ilmiah'
            : 'Kalor & termodinamika, gelombang bunyi-cahaya, rangkaian listrik AC/DC, induksi elektromagnetik & kuantum',
        capaianPembelajaran:
          'Merencanakan penyelidikan fisika, mengolah data eksperimen dengan mempertimbangkan ketidakpastian, dan mengomunikasikan hasilnya.',
      },
      {
        elemen: 'Aplikasi Fisika & Rekayasa Teknologi',
        namaBab: 'Bab 3: Inovasi Teknologi Ramah Lingkungan & Instrumentasi',
        lingkupMateri:
          'Pembangkit listrik terbarukan, efisiensi energi, optik alat & penerapan fisika digital',
        capaianPembelajaran:
          'Mengintegrasikan prinsip fisika untuk merancang purwarupa atau solusi teknologi yang relevan bagi kehidupan masyarakat.',
      },
    ];
  }

  if (lower.includes('kimia')) {
    return [
      {
        elemen: 'Pemahaman Kimia',
        namaBab:
          phase === 'E'
            ? 'Bab 1: Kimia Hijau, Struktur Atom & Hukum Dasar Kimia'
            : 'Bab 1: Stoikiometri, Termokimia, Laju Reaksi & Kesetimbangan',
        lingkupMateri:
          phase === 'E'
            ? '12 prinsip kimia hijau, konfigurasi elektron, sistem periodik unsur & persamaan reaksi kimia'
            : 'Konsep mol, entalpi reaksi, faktor laju reaksi, pergeseran kesetimbangan & larutan asam-basa',
        capaianPembelajaran:
          'Memahami struktur materi, sifat unsur, stoikiometri, dan dinamika reaksi kimia serta kaitannya dengan prinsip kimia hijau.',
      },
      {
        elemen: 'Keterampilan Proses & Laboratorium Kimia',
        namaBab:
          phase === 'E'
            ? 'Bab 2: Keselamatan Kerja Lab, Tata Nama Senyawa & Stoikiometri Dasar'
            : 'Bab 2: Titrasi, Larutan Penyangga, Hidrolisis & Elektrokimia',
        lingkupMateri:
          phase === 'E'
            ? 'Simbol bahaya B3, tata nama IUPAC, hukum Lavoisier-Proust-Dalton & perhitungan mol sederhana'
            : 'Stoikiometri larutan, pH penyangga/hidrolisis, kelarutan Ksp, sel Volta-elektrolisis & kimia organik',
        capaianPembelajaran:
          'Melakukan percobaan kimia secara aman, menganalisis data kuantitatif stoikiometri dan titrasi, serta menyusun laporan ilmiah.',
      },
      {
        elemen: 'Aplikasi Kimia Berkelanjutan',
        namaBab: 'Bab 3: Kimia Lingkungan, Polimer & Energi Elektrokimia',
        lingkupMateri:
          'Pencegahan korosi, baterai ramah lingkungan, biopolimer & solusi pencemaran air/udara',
        capaianPembelajaran:
          'Menerapkan konsep kimia untuk mengevaluasi dan memecahkan masalah lingkungan, kesehatan, dan industri berkelanjutan.',
      },
    ];
  }

  if (lower.includes('biologi')) {
    return [
      {
        elemen: 'Pemahaman Biologi (Sel, Biodiversitas & Fisiologi)',
        namaBab:
          phase === 'E'
            ? 'Bab 1: Keanekaragaman Hayati, Virus, Ekosistem & Perubahan Iklim'
            : 'Bab 1: Bioproses Sel, Sistem Organ Manusia & Metabolisme',
        lingkupMateri:
          phase === 'E'
            ? 'Klasifikasi makhluk hidup, struktur-replikasi virus, komponen ekosistem, jaring makanan & konservasi'
            : 'Transpor membran sel, enzim, katabolisme-anabolisme, sistem sirkulasi, respirasi, koordinasi & imun',
        capaianPembelajaran:
          'Menganalisis struktur dan fungsi sistem kehidupan dari tingkat molekuler/seluler hingga ekosistem secara mendalam.',
      },
      {
        elemen: 'Genetika, Evolusi & Bioteknologi',
        namaBab:
          phase === 'E'
            ? 'Bab 2: Inovasi Bioteknologi Konvensional & Pelestarian Spesies'
            : 'Bab 2: Substansi Genetika, Pembelahan Sel, Pewarisan Sifat & Evolusi',
        lingkupMateri:
          phase === 'E'
            ? 'Fermentasi pangan lokal, peranan bakteri/jamur & strategi mitigasi kepunahan keanekaragaman hayati'
            : 'DNA-RNA & sintesis protein, mitosis-meiosis, hukum Mendel, mutasi, teori evolusi & rekayasa genetika',
        capaianPembelajaran:
          'Mengevaluasi mekanisme pewarisan sifat, evolusi, serta manfaat dan bioetika penerapan bioteknologi modern.',
      },
      {
        elemen: 'Keterampilan Proses Biologi (Inkuiri Hayati)',
        namaBab: 'Bab 3: Eksperimen Fisiologi, Ekologi & Solusi Kesehatan',
        lingkupMateri:
          'Pengamatan mikroskopis, uji kandungan zat makanan, eksperimen faktor pertumbuhan & analisis data hayati',
        capaianPembelajaran:
          'Merancang dan melaksanakan penelitian biologi sederhana serta menyajikan solusi ilmiah atas persoalan kesehatan dan lingkungan.',
      },
    ];
  }

  if (lower.includes('ilmu pengetahuan alam') || lower === 'ipa') {
    return [
      {
        elemen: 'Fisika & Pengukuran (IPA Terpadu Fase E)',
        namaBab: 'Bab 1: Pengukuran Ilmiah & Energi Terbarukan',
        lingkupMateri:
          'Besaran, satuan, alat ukur presisi, bentuk energi, efisiensi & mitigasi pemanasan global',
        capaianPembelajaran:
          'Melakukan pengukuran akurat dengan aturan angka penting dan menganalisis transformasi energi menuju energi berkelanjutan.',
      },
      {
        elemen: 'Kimia & Perubahan Materi (IPA Terpadu Fase E)',
        namaBab: 'Bab 2: Kimia Hijau, Struktur Atom & Hukum Dasar Kimia',
        lingkupMateri:
          'Prinsip kimia hijau dalam kehidupan, konfigurasi elektron, tata nama & persamaan reaksi sederhana',
        capaianPembelajaran:
          'Menganalisis struktur atom dan hukum dasar kimia untuk mendukung proses kimia yang ramah lingkungan.',
      },
      {
        elemen: 'Biologi & Ekosistem (IPA Terpadu Fase E)',
        namaBab: 'Bab 3: Virus, Keanekaragaman Hayati & Ekosistem Berkelanjutan',
        lingkupMateri:
          'Peranan virus dan mikroorganisme, keanekaragaman hayati Indonesia, rantai makanan & bioteknologi dasar',
        capaianPembelajaran:
          'Menganalisis keterkaitan komponen ekosistem, virus, dan keanekaragaman hayati dalam menjaga keseimbangan alam.',
      },
    ];
  }

  // 9. IPS Terpadu (Fase E) & Ekonomi / Geografi / Sosiologi / Antropologi (Mapel Pilihan IPS)
  if (lower.includes('ekonomi')) {
    return [
      {
        elemen: 'Pemahaman Konsep Ekonomi',
        namaBab:
          phase === 'E'
            ? 'Bab 1: Kelangkaan, Biaya Peluang, Pasar & Lembaga Keuangan'
            : 'Bab 1: Pendapatan Nasional, Pertumbuhan Ekonomi, Inflasi & Kebijakan Moneter-Fiskal',
        lingkupMateri:
          phase === 'E'
            ? 'Masalah pokok ekonomi, permintaan-penawaran, keseimbangan pasar, bank & OJK/literasi keuangan'
            : 'GDP/GNP, ketenagakerjaan, indeks harga, APBN/APBD, perpajakan & perdagangan internasional',
        capaianPembelajaran:
          'Menganalisis konsep dan masalah ekonomi secara kritis baik pada lingkup mikro, makro, maupun perekonomian terbuka.',
      },
      {
        elemen: 'Keterampilan Proses & Akuntansi Dasar',
        namaBab:
          phase === 'E'
            ? 'Bab 2: Pengambilan Keputusan Ekonomi & Literasi Keuangan Digital'
            : 'Bab 2: Sistem Pembayaran, Badan Usaha & Siklus Akuntansi Perusahaan',
        lingkupMateri:
          phase === 'E'
            ? 'Perencanaan anggaran pribadi, investasi aman, fintech & analisis tabel/kurva ekonomi'
            : 'Koperasi, BUMN/BUMS, persamaan dasar akuntansi, jurnal umum, buku besar & laporan keuangan',
        capaianPembelajaran:
          'Mengolah data ekonomi serta menyusun pencatatan keuangan atau siklus akuntansi sederhana secara akurat dan bertanggung jawab.',
      },
      {
        elemen: 'Pembangunan Ekonomi Berkelanjutan',
        namaBab: 'Bab 3: Kewirausahaan Sosial & Ekonomi Kreatif Nasional',
        lingkupMateri:
          'Inovasi usaha lokal, peran UMKM, ekonomi sirkular & strategi mengatasi ketimpangan ekonomi',
        capaianPembelajaran:
          'Merancang gagasan solusi ekonomi kreatif yang beretika dan berkontribusi pada kesejahteraan masyarakat.',
      },
    ];
  }

  if (lower.includes('geografi')) {
    return [
      {
        elemen: 'Pemahaman Konsep Geografi & Kewilayahan',
        namaBab:
          phase === 'E'
            ? 'Bab 1: Konsep Geografi, Peta, Penginderaan Jauh & SIG'
            : 'Bab 1: Posisi Strategis Indonesia, Biosfer, Kependudukan & Wilayah',
        lingkupMateri:
          phase === 'E'
            ? '10 konsep geografi, 4 prinsip & pendekatan keruangan-ekologi-kompleks wilayah, peta & dasar SIG'
            : 'Poros maritim dunia, sebaran flora-fauna, dinamika kependudukan, tata ruang kota-desa & negara maju-berkembang',
        capaianPembelajaran:
          'Menganalisis fenomena geosfer dan kewilayahan menggunakan pendekatan keruangan, kelingkungan, dan kompleks wilayah.',
      },
      {
        elemen: 'Dinamika Geosfer & Mitigasi Bencana',
        namaBab: 'Bab 2: Litosfer, Atmosfer, Hidrosfer & Mitigasi Bencana Alam',
        lingkupMateri:
          'Tektonik lempeng, iklim global, siklus hidrologi, kawasan rawan bencana & strategi adaptasi bencana',
        capaianPembelajaran:
          'Mengevaluasi dinamika litosfer, atmosfer, dan hidrosfer serta merumuskan langkah mitigasi bencana berbasis kearifan lokal dan teknologi.',
      },
      {
        elemen: 'Keterampilan Proses Geografi (Analisis Spasial)',
        namaBab: 'Bab 3: Interpretasi Citra, Pengelolaan SDA & Pembangunan Berkelanjutan',
        lingkupMateri:
          'Analisis citra penginderaan jauh, potensi SDA strategis, ketahanan pangan & lingkungan hidup',
        capaianPembelajaran:
          'Mengolah data spasial melalui peta/SIG dan merancang rekomendasi pengelolaan sumber daya alam berkelanjutan.',
      },
    ];
  }

  if (lower.includes('sosiologi')) {
    return [
      {
        elemen: 'Pemahaman Konsep Sosiologi',
        namaBab:
          phase === 'E'
            ? 'Bab 1: Individu, Kelompok, Interaksi Sosial & Lembaga Sosial'
            : 'Bab 1: Struktur Sosial, Konflik, Perubahan Sosial & Globalisasi',
        lingkupMateri:
          phase === 'E'
            ? 'Fungsi sosiologi, nilai dan norma, sosialisasi kepribadian, interaksi & gejala sosial masyarakat'
            : 'Diferensiasi-stratifikasi sosial, integrasi sosial, faktor perubahan sosial & tantangan budaya digital',
        capaianPembelajaran:
          'Menganalisis gejala, struktur, konflik, dan perubahan sosial di masyarakat menggunakan perspektif sosiologis secara objektif.',
      },
      {
        elemen: 'Keterampilan Proses (Penelitian Sosial)',
        namaBab: 'Bab 2: Metode Penelitian Sosial & Analisis Data Lapangan',
        lingkupMateri:
          'Perumusan masalah sosial, teknik wawancara/observasi/angket, etika penelitian & laporan riset sosial',
        capaianPembelajaran:
          'Melakukan penelitian sosial sederhana mengenai permasalahan aktual di lingkungan sekitar dan mengomunikasikan temuannya.',
      },
      {
        elemen: 'Kepedulian & Pemberdayaan Sosial',
        namaBab: 'Bab 3: Kesetaraan, Ketimpangan Sosial & Pemberdayaan Komunitas',
        lingkupMateri:
          'Resolusi konflik damai, inklusi sosial, penanganan ketimpangan & pemberdayaan berbasis kearifan lokal',
        capaianPembelajaran:
          'Merancang aksi sosial atau gagasan pemberdayaan komunitas untuk mengatasi ketimpangan dan memperkuat kohesi sosial.',
      },
    ];
  }

  if (lower.includes('antropologi')) {
    return [
      {
        elemen: 'Pengantar Antropologi & Kebudayaan',
        namaBab: 'Bab 1: Ruang Lingkup Antropologi, Budaya & Keragaman Etnik',
        lingkupMateri:
          'Konsep kebudayaan, unsur universal budaya, etnografi & pelestarian warisan budaya Nusantara',
        capaianPembelajaran:
          'Memahami konsep dasar antropologi, dinamika kebudayaan, dan kekayaan etnik Indonesia secara inklusif dan reflektif.',
      },
      {
        elemen: 'Etnografi & Dinamika Sosio-Kultural',
        namaBab: 'Bab 2: Metode Etnografi, Bahasa, Religi & Perubahan Budaya',
        lingkupMateri:
          'Observasi partisipatif, sistem kekerabatan, akulturasi-asimilasi & budaya populer generasi muda',
        capaianPembelajaran:
          'Menerapkan metode etnografi sederhana untuk mengkaji fenomena sosial-budaya dan perubahan masyarakat modern.',
      },
      {
        elemen: 'Multikulturalisme & Kearifan Lokal',
        namaBab: 'Bab 3: Masyarakat Multikultural, Relativisme Budaya & Perdamaian',
        lingkupMateri:
          'Menghindari etnosentrisme/stereotip, dialog antarbudaya & peran kearifan lokal dalam harmoni bangsa',
        capaianPembelajaran:
          'Menunjukkan sikap empati kultural, menghormati keberagaman adat-budaya, dan merawat integrasi masyarakat multikultural.',
      },
    ];
  }

  if (lower.includes('ilmu pengetahuan sosial') || lower === 'ips') {
    return [
      {
        elemen: 'Sejarah & Sosiologi (IPS Terpadu Fase E)',
        namaBab: 'Bab 1: Manusia, Ruang, Waktu & Interaksi Sosial',
        lingkupMateri:
          'Cara berpikir sejarah (diakronis-sinkronis), identitas individu, interaksi & lembaga sosial',
        capaianPembelajaran:
          'Memahami keterkaitan peristiwa sejarah dengan dinamika interaksi serta gejala sosial dalam kehidupan masyarakat.',
      },
      {
        elemen: 'Ekonomi (IPS Terpadu Fase E)',
        namaBab: 'Bab 2: Kelangkaan, Mekanisme Pasar & Literasi Keuangan',
        lingkupMateri:
          'Kebutuhan manusia, biaya peluang, kegiatan ekonomi, permintaan-penawaran & lembaga jasa keuangan',
        capaianPembelajaran:
          'Menganalisis masalah kelangkaan, perilaku konsumen-produsen, serta peran lembaga keuangan dalam pengambilan keputusan ekonomi.',
      },
      {
        elemen: 'Geografi & Inkuiri Sosial (IPS Terpadu Fase E)',
        namaBab: 'Bab 3: Fenomena Geosfer, Peta & Penelitian Sosial Sederhana',
        lingkupMateri:
          'Konsep dasar geografi, mitigasi bencana, pengumpulan data lapangan & pelaporan inkuiri sosial',
        capaianPembelajaran:
          'Melakukan penelitian sosial sederhana mengenai fenomena kewilayahan dan masyarakat berbasis data empiris.',
      },
    ];
  }

  // 10. Informatika SMA (Mapel Pilihan MIPA / Dasar Fase E)
  if (lower.includes('informatika')) {
    return [
      {
        elemen: 'Berpikir Komputasional & Algoritma Pemrograman',
        namaBab:
          phase === 'E'
            ? 'Bab 1: Pencarian, Pengurutan, Struktur Data & Pemrograman Dasar'
            : 'Bab 1: Algoritma Lanjut, Struktur Data Kompleks & Rekayasa Perangkat Lunak',
        lingkupMateri:
          phase === 'E'
            ? 'Searching, sorting, stack-queue, flowchart & pemrograman prosedural (Python/C)'
            : 'Graf/pohon, pemrograman modular, desain basis data & pengembangan aplikasi kolaboratif',
        capaianPembelajaran:
          'Menerapkan berpikir komputasional untuk merancang algoritma efisien dan mengimplementasikannya dalam bahasa pemrograman.',
      },
      {
        elemen: 'Sistem Komputer, Jaringan & Analisis Data',
        namaBab: 'Bab 2: Arsitektur Komputer, Jaringan Internet & Analisis Data',
        lingkupMateri:
          'Interaksi perangkat keras-OS, topologi & keamanan jaringan komputer, pengumpulan-visualisasi data',
        capaianPembelajaran:
          'Memahami arsitektur sistem komputer dan konektivitas jaringan yang aman serta menganalisis data berskala besar secara bermakna.',
      },
      {
        elemen: 'Dampak Sosial Informatika & Praktik Lintas Bidang',
        namaBab: 'Bab 3: Keamanan Siber, Kecerdasan Artifisial & Etika Digital',
        lingkupMateri:
          'Perlindungan data pribadi, HAKI, etika pemanfaatan AI & proyek inovasi teknologi lintas bidang',
        capaianPembelajaran:
          'Mengevaluasi dampak sosial teknologi digital serta merancang karya komputasional yang aman, beretika, dan bermanfaat.',
      },
    ];
  }

  // 11. PJOK SMA
  if (lower.includes('pjok') || lower.includes('jasmani')) {
    return [
      {
        elemen: 'Keterampilan & Pengetahuan Gerak',
        namaBab: 'Bab 1: Permainan Bola, Atletik, Senam & Bela Diri',
        lingkupMateri:
          'Analisis teknik dan strategi permainan bola besar/kecil, nomor atletik, senam lantai & pencak silat',
        capaianPembelajaran:
          'Mengevaluasi dan mempraktikkan keterampilan gerak serta taktik permainan dan olahraga secara efektif dan aman.',
      },
      {
        elemen: 'Pengembangan Kebugaran & Pola Hidup Aktif',
        namaBab: 'Bab 2: Program Latihan Kebugaran Jasmani & Aktivitas Ritmik',
        lingkupMateri:
          'Komponen daya tahan, kekuatan, kelenturan, penyusunan program latihan pribadi & gerak berirama',
        capaianPembelajaran:
          'Merancang dan memantau program pengembangan kebugaran jasmani sesuai kebutuhan kesehatan pribadi.',
      },
      {
        elemen: 'Karakter Olahraga & Kesehatan Remaja',
        namaBab: 'Bab 3: Sportivitas, P3K & Pencegahan Bahaya Kesehatan Remaja',
        lingkupMateri:
          'Nilai fair play, keselamatan di air/alam, gizi seimbang, bahaya NAPZA & pergaulan sehat',
        capaianPembelajaran:
          'Menunjukkan karakter sportivitas, kepemimpinan, serta menerapkan pola hidup sehat dan aman bagi remaja SMA.',
      },
    ];
  }

  // 12. Seni Rupa / Seni Musik / Seni Tari / Seni Teater
  if (lower.includes('seni')) {
    return [
      {
        elemen: 'Mengalami & Merefleksikan Karya Seni',
        namaBab: `Bab 1: Unsur, Prinsip & Apresiasi Karya ${subject}`,
        lingkupMateri:
          `Eksplorasi unsur estetika, sejarah aliran seni Nusantara-mancanegara & kritik karya ${subject}`,
        capaianPembelajaran:
          `Mengamati, menganalisis, dan mengevaluasi unsur serta nilai estetis-kultural dari berbagai karya ${subject}.`,
      },
      {
        elemen: 'Menciptakan (Creating)',
        namaBab: `Bab 2: Proses Penciptaan & Eksperimen Media ${subject}`,
        lingkupMateri:
          `Teknik berkarya kreatif, perancangan konsep orisinal & eksplorasi media konvensional-digital`,
        capaianPembelajaran:
          `Menciptakan karya ${subject} yang orisinal, ekspresif, dan bermakna melalui penguasaan teknik dan konsep.`,
      },
      {
        elemen: 'Berpikir Artistik & Berdampak',
        namaBab: `Bab 3: Kurasi, Pameran/Pertunjukan & Seni untuk Masyarakat`,
        lingkupMateri:
          `Manajemen pergelaran/pameran sekolah, kolaborasi seni & pesan sosial melalui karya seni`,
        capaianPembelajaran:
          `Mengorganisasikan penyajian karya ${subject} secara kolaboratif sehingga memberikan dampak positif dan inspiratif bagi publik.`,
      },
    ];
  }

  // 13. Prakarya dan Kewirausahaan (PKWU) SMA
  if (lower.includes('prakarya') || lower.includes('pkwu')) {
    return [
      {
        elemen: 'Observasi & Eksplorasi Peluang Usaha',
        namaBab: 'Bab 1: Potensi Sumber Daya Lokal & Peluang Wirausaha SMA',
        lingkupMateri:
          'Aspek kerajinan, rekayasa, budidaya, pengolahan pangan serta riset kebutuhan pasar lokal/digital',
        capaianPembelajaran:
          'Menganalisis potensi sumber daya alam, budaya lokal, dan tren pasar untuk merumuskan peluang produk prakarya bernilai tambah.',
      },
      {
        elemen: 'Desain & Produksi Karya Inovatif',
        namaBab: 'Bab 2: Perancangan Purwarupa, Produksi & HPP Produk',
        lingkupMateri:
          'Desain kemasan ergonomis, standar mutu produksi, K3, perhitungan BEP & Harga Pokok Produksi',
        capaianPembelajaran:
          'Merancang dan memproduksi karya prakarya yang kreatif, layak jual, efisien biaya, dan ramah lingkungan.',
      },
      {
        elemen: 'Refleksi, Pemasaran & Evaluasi Usaha',
        namaBab: 'Bab 3: Strategi Pemasaran Digital & Evaluasi Kewirausahaan',
        lingkupMateri:
          'Branding produk, pemasaran media sosial/lokapasar, laporan rugi-laba & rencana pengembangan usaha',
        capaianPembelajaran:
          'Memasarkan produk hasil karya secara efektif serta mengevaluasi kelayakan finansial dan keberlanjutan usaha.',
      },
    ];
  }

  // 14. Muatan Lokal / Bahasa Daerah atau Mapel Kustom SMA
  return [
    {
      elemen: `Pemahaman Konsep ${subject}`,
      namaBab: `Bab 1: Konsep Inti & Karakteristik ${subject} (${
        phase === 'E' ? 'Fase E' : 'Fase F'
      })`,
      lingkupMateri: `Penguasaan konsep fundamental, nilai kearifan lokal dan materi pokok ${subject} jenjang SMA`,
      capaianPembelajaran: `Memahami konsep dasar dan prinsip inti ${subject} secara mendalam sesuai standar SMA ${
        phase === 'E' ? 'Fase E (Kelas X)' : 'Fase F (Kelas XI–XII)'
      }.`,
    },
    {
      elemen: `Keterampilan Proses & Aplikasi ${subject}`,
      namaBab: `Bab 2: Analisis Kasus & Praktik Kontekstual`,
      lingkupMateri: `Penerapan konsep, pemecahan masalah nyata, dan praktik terstruktur pada ${subject}`,
      capaianPembelajaran: `Menerapkan keterampilan dan prosedur ${subject} dalam menyelesaikan tantangan kontekstual secara mandiri maupun kolaboratif.`,
    },
    {
      elemen: `Refleksi, Kreativitas & Karakter`,
      namaBab: `Bab 3: Karya Bermakna, Refleksi & Kolaborasi`,
      lingkupMateri: `Evaluasi hasil karya/kinerja, refleksi pembelajaran mendalam dan penguatan karakter Profil Pelajar`,
      capaianPembelajaran: `Merefleksikan proses belajar, menghasilkan karya bermakna, dan menunjukkan karakter bernalar kritis serta gotong royong.`,
    },
  ];
}

export function analyzeCpForSubjectAndPhase(
  mataPelajaran: string,
  fase: string
): CpAnalysisResult {
  const isAgama = isAgamaBudiPekertiSubject(mataPelajaran);
  const regulationCode: CpRegulationCode = isAgama
    ? 'CP_020_2026'
    : 'CP_046_2025';
  const reg = CP_REGULATIONS[regulationCode];
  const smaPhase = normalizeSmaPhase(fase);
  const smaMeta = getSmaSubjectMeta(mataPelajaran);
  const phaseDisplay =
    smaPhase === 'E' ? 'Fase E (Kelas X SMA)' : 'Fase F (Kelas XI–XII SMA)';

  const elements = isAgama
    ? getAgamaSmaElements(mataPelajaran, smaPhase)
    : getGeneralOrElectiveSmaElements(mataPelajaran, smaPhase);

  return {
    regulationCode,
    regulationShort: reg.short,
    regulationFull: reg.full,
    kategoriMapel: isAgama
      ? 'Pendidikan Agama dan Budi Pekerti'
      : 'Mata Pelajaran Umum',
    smaGroup: smaMeta.group,
    smaKind: smaMeta.kind,
    summary: isAgama
      ? `Mata pelajaran ${mataPelajaran} (${smaMeta.group}) mengacu pada ${reg.full} untuk ${phaseDisplay} dengan penguatan nilai keagamaan kontekstual dan akhlak mulia.`
      : `Mata pelajaran ${mataPelajaran} (${smaMeta.group}) mengacu pada ${reg.full} untuk ${phaseDisplay} sebagai dasar pemetaan elemen, bab, lingkup materi, dan indikator asesmen SMA.`,
    elements,
  };
}

function splitLingkupSubtopics(lingkupMateri: string, fallback: string): string[] {
  const parts = lingkupMateri
    .split(/[,;&/]+|\bdan\b/i)
    .map((p) => p.trim())
    .filter((p) => p.length > 2);
  if (parts.length > 0) return parts;
  return [fallback];
}

export function buildDefaultTpsForBab(
  namaBab: string,
  lingkupMateri: string,
  mataPelajaran: string,
  fase: string,
  capaianPembelajaran?: string
): string[] {
  const trimmedBab = (namaBab || '').trim();
  const trimmedScope = (lingkupMateri || '').trim();
  if (!trimmedBab && !trimmedScope) {
    return [];
  }

  const displayBab = trimmedBab || trimmedScope;
  const cleanBab = displayBab.replace(/^Bab\s*\d+\s*:\s*/i, '').trim() || displayBab;
  const cleanScope = trimmedScope || cleanBab;
  const subtopics = splitLingkupSubtopics(cleanScope, cleanBab);
  const firstTopic = subtopics[0] || cleanScope;
  const secondTopic = subtopics[1] || cleanScope;

  const isAgama = isAgamaBudiPekertiSubject(mataPelajaran);
  const regShort = isAgama
    ? CP_REGULATIONS.CP_020_2026.short
    : CP_REGULATIONS.CP_046_2025.short;
  const faseLabel = fase === 'Fase E' || fase === 'E' ? 'Fase E' : 'Fase F';
  const scopeClause = trimmedScope ? ` (lingkup materi ${cleanScope})` : '';

  const tp1 = isAgama
    ? `Pada ${displayBab}${scopeClause}, peserta didik mampu memahami, menelaah, dan merefleksikan nilai ajaran mengenai ${firstTopic} sesuai ${regShort} ${faseLabel}.`
    : `Pada ${displayBab}${scopeClause}, peserta didik mampu memahami dan menjelaskan konsep inti ${firstTopic} dalam mata pelajaran ${mataPelajaran} (${faseLabel} · ${regShort}) secara bermakna.`;

  const tp2 = capaianPembelajaran
    ? `Melalui pembelajaran ${displayBab} pada lingkup materi ${secondTopic}, peserta didik mampu menerapkan dan menganalisis permasalahan kontekstual untuk mencapai capaian: ${capaianPembelajaran.replace(/\.$/, '')}.`
    : `Melalui pembelajaran ${displayBab} pada lingkup materi ${secondTopic}, peserta didik mampu menerapkan, menganalisis, dan mengevaluasi pemecahan masalah nyata secara kritis dan kreatif.`;

  if (subtopics.length >= 3) {
    const thirdTopic = subtopics[2];
    const tp3 = `Pada ${displayBab} (lingkup materi ${thirdTopic}), peserta didik mampu mengevaluasi dan menyimpulkan keterkaitan antarkonsep ${cleanScope} dalam konteks kehidupan sehari-hari.`;
    return [tp1, tp2, tp3];
  }

  return [tp1, tp2];
}

export function buildBabListFromCpAnalysis(
  analysis: CpAnalysisResult,
  currentBabList: BabMateriConfig[],
  mataPelajaran = '',
  fase = 'Fase E'
): BabMateriConfig[] {
  const totalExistingSoal = currentBabList.reduce(
    (sum, b) => sum + Math.max(0, Number(b.jumlahSoal) || 0),
    0
  );
  const targetTotal = totalExistingSoal > 0 ? totalExistingSoal : 10;

  const elements = analysis.elements;
  const count = elements.length || 1;
  const base = Math.floor(targetTotal / count);
  let remainder = targetTotal % count;

  return elements.map((el, idx) => {
    const soalForThisBab = base + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder--;
    const effectiveSubject = mataPelajaran || analysis.smaGroup || 'Mata Pelajaran SMA';
    return {
      id: `bab_${idx + 1}`,
      namaBab: el.namaBab,
      lingkupMateri: el.lingkupMateri,
      tujuanPembelajaranList: buildDefaultTpsForBab(
        el.namaBab,
        el.lingkupMateri,
        effectiveSubject,
        fase,
        el.capaianPembelajaran
      ),
      elemenCp: el.elemen,
      capaianPembelajaran: el.capaianPembelajaran,
      jumlahSoal: soalForThisBab,
    };
  });
}
