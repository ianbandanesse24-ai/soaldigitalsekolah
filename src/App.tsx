import React, { useEffect, useState } from 'react';
import {
  Check,
  Menu,
  Printer,
  Save,
} from 'lucide-react';
import {
  ActiveModule,
  ExamMetadata,
  ExamProjectState,
  QuestionItem,
  QuestionType,
  ReferenceColumnDef,
  UploadedFormatAcuan,
} from './types/exam';
import {
  analyzeCpForSubjectAndPhase,
  buildDefaultTpsForBab,
} from './data/cpReferences';
import {
  assignTingkatanSoal,
  DEFAULT_TINGKATAN_PERSENTASE,
  INITIAL_PROJECT_STATE,
  KURIKULUM_TETAP,
  redistributeBobotTotal100,
  tierFromCognitiveLevel,
} from './data/defaultExamData';
import {
  autoPopulateQuestionsForColumns,
  smartFillWorkFromAcuan,
} from './utils/autoFillAcuan';
import { downloadExamJson } from './utils/exportHelpers';
import { SidebarNav } from './components/SidebarNav';
import { DataSoalView } from './components/DataSoalView';
import { KisiKisiView } from './components/KisiKisiView';
import { KartuSoalView } from './components/KartuSoalView';
import { KumpulanSoalView } from './components/KumpulanSoalView';

const STORAGE_KEY = 'naskahuji_paket_soal_v1';

const MODULE_TITLES: Record<ActiveModule, string> = {
  data_soal: 'Data Soal',
  kisi_kisi: 'Kisi-Kisi Soal',
  kartu_soal: 'Kartu Soal',
  kumpulan_soal: 'Kumpulan Soal',
};

function ensureTotalBobot100(questions: QuestionItem[]): QuestionItem[] {
  const sum =
    Math.round(
      questions.reduce((acc, q) => acc + (Number(q.bobot) || 0), 0) * 100
    ) / 100;
  return sum === 100 ? questions : redistributeBobotTotal100(questions);
}

function normalizeQuestions(
  questions: QuestionItem[],
  persentase = DEFAULT_TINGKATAN_PERSENTASE
): QuestionItem[] {
  const hasAnyTier = questions.some((q) => Boolean(q.tingkatanSoal));
  const withTiers = (hasAnyTier
    ? questions.map((q) => ({
        ...q,
        tingkatanSoal: q.tingkatanSoal || tierFromCognitiveLevel(q.levelKognitif),
      }))
    : assignTingkatanSoal(questions, persentase)
  ).map((q) =>
    q.type === 'PG'
      ? {
          ...q,
          useOptionE: true,
        }
      : q
  );

  return ensureTotalBobot100(withTiers);
}

function deriveKomposisiFromQuestions(
  questions: QuestionItem[],
  prevSelected: Record<QuestionType, boolean>
): {
  komposisi: Record<QuestionType, number>;
  selectedQuestionTypes: Record<QuestionType, boolean>;
  jumlahTotalSoal: number;
} {
  const komposisi: Record<QuestionType, number> = {
    PG: questions.filter((q) => q.type === 'PG').length,
    ESAY: questions.filter((q) => q.type === 'ESAY').length,
    JAWABAN_SINGKAT: questions.filter((q) => q.type === 'JAWABAN_SINGKAT').length,
    MENJODOHKAN: questions.filter((q) => q.type === 'MENJODOHKAN').length,
  };
  const selectedQuestionTypes: Record<QuestionType, boolean> = {
    PG: komposisi.PG > 0 || prevSelected.PG,
    ESAY: komposisi.ESAY > 0 || prevSelected.ESAY,
    JAWABAN_SINGKAT: komposisi.JAWABAN_SINGKAT > 0 || prevSelected.JAWABAN_SINGKAT,
    MENJODOHKAN: komposisi.MENJODOHKAN > 0 || prevSelected.MENJODOHKAN,
  };
  return {
    komposisi,
    selectedQuestionTypes,
    jumlahTotalSoal: questions.length,
  };
}

function normalizeSmaGradeAndPhase(
  kelas?: string,
  fase?: string
): { kelas: string; fase: string; jenjang: string } {
  if (fase === 'Fase F' || kelas === 'Kelas XI (11)' || kelas === 'Kelas XII (12)') {
    return {
      kelas:
        kelas === 'Kelas XI (11)' || kelas === 'Kelas XII (12)'
          ? kelas
          : 'Kelas XI (11)',
      fase: 'Fase F',
      jenjang: 'SMA',
    };
  }
  return {
    kelas: 'Kelas X (10)',
    fase: 'Fase E',
    jenjang: 'SMA',
  };
}

function loadInitialState(): ExamProjectState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROJECT_STATE;
    const parsed = JSON.parse(raw) as Partial<ExamProjectState>;
    if (!parsed.metadata || !Array.isArray(parsed.questions)) {
      return INITIAL_PROJECT_STATE;
    }
    const tingkatanPersentase = {
      ...DEFAULT_TINGKATAN_PERSENTASE,
      ...(parsed.metadata.tingkatanPersentase || {}),
    };
    const smaGrade = normalizeSmaGradeAndPhase(
      parsed.metadata.kelas,
      parsed.metadata.fase
    );
    const cpAnalysis = analyzeCpForSubjectAndPhase(
      parsed.metadata.mataPelajaran || INITIAL_PROJECT_STATE.metadata.mataPelajaran,
      smaGrade.fase
    );
    const kisiCols =
      Array.isArray(parsed.kisiKisiColumns) && parsed.kisiKisiColumns.length > 0
        ? parsed.kisiKisiColumns
        : INITIAL_PROJECT_STATE.kisiKisiColumns;
    const kartuCols =
      Array.isArray(parsed.kartuSoalFields) && parsed.kartuSoalFields.length > 0
        ? parsed.kartuSoalFields
        : INITIAL_PROJECT_STATE.kartuSoalFields;

    const rawBabList =
      Array.isArray(parsed.metadata.babMateriList) &&
      parsed.metadata.babMateriList.length > 0
        ? parsed.metadata.babMateriList
        : INITIAL_PROJECT_STATE.metadata.babMateriList;

    const subjectName =
      parsed.metadata.mataPelajaran || INITIAL_PROJECT_STATE.metadata.mataPelajaran;

    const hydratedBabList = rawBabList.map((bab) => ({
      ...bab,
      tujuanPembelajaranList:
        Array.isArray(bab.tujuanPembelajaranList) &&
        bab.tujuanPembelajaranList.length > 0
          ? bab.tujuanPembelajaranList
          : buildDefaultTpsForBab(
              bab.namaBab,
              bab.lingkupMateri,
              subjectName,
              smaGrade.fase,
              bab.capaianPembelajaran
            ),
    }));

    const nextMeta: ExamMetadata = {
      ...INITIAL_PROJECT_STATE.metadata,
      ...parsed.metadata,
      ...smaGrade,
      kelasSemester: `${smaGrade.kelas} / ${smaGrade.fase}`,
      kurikulum: KURIKULUM_TETAP,
      cpAcuanRegulasi: parsed.metadata.cpAcuanRegulasi || cpAnalysis.regulationFull,
      cpAcuanRingkasan: parsed.metadata.cpAcuanRingkasan || cpAnalysis.summary,
      tingkatanPersentase,
      babMateriList: hydratedBabList,
      selectedQuestionTypes: {
        ...INITIAL_PROJECT_STATE.metadata.selectedQuestionTypes,
        ...(parsed.metadata.selectedQuestionTypes || {}),
      },
    };

    const normalizedQuestions = autoPopulateQuestionsForColumns(
      normalizeQuestions(parsed.questions, tingkatanPersentase),
      nextMeta,
      [...kisiCols, ...kartuCols]
    );

    return {
      ...INITIAL_PROJECT_STATE,
      ...parsed,
      questions: normalizedQuestions,
      kisiKisiColumns: kisiCols,
      kartuSoalFields: kartuCols,
      metadata: nextMeta,
    };
  } catch {
    return INITIAL_PROJECT_STATE;
  }
}

export default function App() {
  const [project, setProject] = useState<ExamProjectState>(loadInitialState);
  const [activeModule, setActiveModule] = useState<ActiveModule>('data_soal');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(false);
  const [smartFillNotice, setSmartFillNotice] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Simpan state tanpa dataUrl raksasa jika melebihi kuota storage
      const compactState: ExamProjectState = {
        ...project,
        kisiKisiAcuan: project.kisiKisiAcuan
          ? {
              ...project.kisiKisiAcuan,
              dataUrl:
                project.kisiKisiAcuan.dataUrl &&
                project.kisiKisiAcuan.dataUrl.length > 500_000
                  ? undefined
                  : project.kisiKisiAcuan.dataUrl,
            }
          : null,
        kartuSoalAcuan: project.kartuSoalAcuan
          ? {
              ...project.kartuSoalAcuan,
              dataUrl:
                project.kartuSoalAcuan.dataUrl &&
                project.kartuSoalAcuan.dataUrl.length > 500_000
                  ? undefined
                  : project.kartuSoalAcuan.dataUrl,
            }
          : null,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compactState));
    } catch {
      // Abaikan jika kuota localStorage penuh
    }
  }, [project]);

  const handleManualSave = () => {
    setProject((prev) => ({
      ...prev,
      lastSavedAt: new Date().toISOString(),
    }));
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2000);
  };

  // Sinkronisasi terpadu antara Data Soal, Kisi-Kisi, Kartu Soal, dan Kumpulan Soal
  const handleSyncMetadataAndQuestions = (
    nextMetadata: ExamMetadata,
    nextQuestions: QuestionItem[]
  ) => {
    setProject((prev) => {
      const populated = autoPopulateQuestionsForColumns(
        nextQuestions,
        nextMetadata,
        [...prev.kisiKisiColumns, ...prev.kartuSoalFields],
        {
          ...(prev.kisiKisiAcuan?.detectedSampleValues || {}),
          ...(prev.kartuSoalAcuan?.detectedSampleValues || {}),
        }
      );
      return {
        ...prev,
        metadata: nextMetadata,
        questions: populated,
      };
    });
  };

  const handleUpdateMetadata = (metadata: ExamMetadata) => {
    setProject((prev) => {
      const populated = autoPopulateQuestionsForColumns(
        prev.questions,
        metadata,
        [...prev.kisiKisiColumns, ...prev.kartuSoalFields]
      );
      return {
        ...prev,
        metadata,
        questions: populated,
      };
    });
  };

  const handleUpdateQuestions = (questions: QuestionItem[]) => {
    setProject((prev) => {
      const derived = deriveKomposisiFromQuestions(
        questions,
        prev.metadata.selectedQuestionTypes
      );
      const nextMetadata: ExamMetadata = {
        ...prev.metadata,
        ...derived,
      };
      const populated = autoPopulateQuestionsForColumns(
        questions,
        nextMetadata,
        [...prev.kisiKisiColumns, ...prev.kartuSoalFields],
        {
          ...(prev.kisiKisiAcuan?.detectedSampleValues || {}),
          ...(prev.kartuSoalAcuan?.detectedSampleValues || {}),
        }
      );
      return {
        ...prev,
        metadata: nextMetadata,
        questions: populated,
      };
    });
  };

  const triggerSmartFillNotice = (msg: string) => {
    setSmartFillNotice(msg);
    setTimeout(() => setSmartFillNotice(null), 6000);
  };

  const mergeDetectedAcuanMetadata = (
    prevMeta: ExamMetadata,
    detected?: UploadedFormatAcuan['detectedMetadata']
  ): ExamMetadata => {
    if (!detected) return prevMeta;
    const nextSubject = detected.mataPelajaran || prevMeta.mataPelajaran;
    const smaGrade = normalizeSmaGradeAndPhase(
      detected.kelas || prevMeta.kelas,
      detected.fase || prevMeta.fase
    );
    const analysis = analyzeCpForSubjectAndPhase(nextSubject, smaGrade.fase);
    return {
      ...prevMeta,
      ...detected,
      mataPelajaran: nextSubject,
      ...smaGrade,
      kelasSemester: `${smaGrade.kelas} / ${smaGrade.fase}`,
      kurikulum: KURIKULUM_TETAP,
      cpAcuanRegulasi: analysis.regulationFull,
      cpAcuanRingkasan: analysis.summary,
    };
  };

  const handleApplyKisiAcuan = (
    acuan: UploadedFormatAcuan | null,
    nextColumns: ReferenceColumnDef[]
  ) => {
    setProject((prev) => {
      const nextMetadata = mergeDetectedAcuanMetadata(
        prev.metadata,
        acuan?.detectedMetadata
      );
      const { questions: populated, filledQuestionsCount } =
        smartFillWorkFromAcuan(
          prev.questions,
          nextMetadata,
          [...nextColumns, ...prev.kartuSoalFields],
          {
            ...(prev.kartuSoalAcuan?.detectedSampleValues || {}),
            ...(acuan?.detectedSampleValues || {}),
          }
        );
      if (acuan) {
        triggerSmartFillNotice(
          `Format Acuan "${acuan.fileName}" diterapkan: ${nextColumns.length} kolom & seluruh isian (${filledQuestionsCount} soal, TP, Indikator, Kustom) terisi cerdas.`
        );
      }
      return {
        ...prev,
        metadata: nextMetadata,
        kisiKisiAcuan: acuan,
        kisiKisiColumns: nextColumns,
        questions: populated,
      };
    });
  };

  const handleApplyKartuAcuan = (
    acuan: UploadedFormatAcuan | null,
    nextFields: ReferenceColumnDef[]
  ) => {
    setProject((prev) => {
      const nextMetadata = mergeDetectedAcuanMetadata(
        prev.metadata,
        acuan?.detectedMetadata
      );
      const { questions: populated, filledQuestionsCount } =
        smartFillWorkFromAcuan(
          prev.questions,
          nextMetadata,
          [...prev.kisiKisiColumns, ...nextFields],
          {
            ...(prev.kisiKisiAcuan?.detectedSampleValues || {}),
            ...(acuan?.detectedSampleValues || {}),
          }
        );
      if (acuan) {
        triggerSmartFillNotice(
          `Format Acuan Kartu Soal "${acuan.fileName}" diterapkan: ${nextFields.length} field & seluruh isian (${filledQuestionsCount} kartu, Rumusan, Kunci, Pembahasan) terisi cerdas.`
        );
      }
      return {
        ...prev,
        metadata: nextMetadata,
        kartuSoalAcuan: acuan,
        kartuSoalFields: nextFields,
        questions: populated,
      };
    });
  };

  const handleSmartFillAll = () => {
    setProject((prev) => {
      const { questions: populated, filledQuestionsCount, customFieldsCount } =
        smartFillWorkFromAcuan(
          prev.questions,
          prev.metadata,
          [...prev.kisiKisiColumns, ...prev.kartuSoalFields],
          {
            ...(prev.kisiKisiAcuan?.detectedSampleValues || {}),
            ...(prev.kartuSoalAcuan?.detectedSampleValues || {}),
          },
          { forceSyncTpFromBab: true }
        );
      triggerSmartFillNotice(
        `Pengisian cerdas selesai: ${filledQuestionsCount} butir soal, Tujuan Pembelajaran per Bab, indikator ABCD, serta ${customFieldsCount} kolom acuan kustom diperbarui & disinkronkan.`
      );
      return {
        ...prev,
        questions: populated,
      };
    });
  };

  const handleUpdateKisiColumns = (nextColumns: ReferenceColumnDef[]) => {
    setProject((prev) => ({
      ...prev,
      kisiKisiColumns: nextColumns,
      questions: autoPopulateQuestionsForColumns(
        prev.questions,
        prev.metadata,
        [...nextColumns, ...prev.kartuSoalFields],
        prev.kisiKisiAcuan?.detectedSampleValues
      ),
    }));
  };

  const handleUpdateKartuFields = (nextFields: ReferenceColumnDef[]) => {
    setProject((prev) => ({
      ...prev,
      kartuSoalFields: nextFields,
      questions: autoPopulateQuestionsForColumns(
        prev.questions,
        prev.metadata,
        [...prev.kisiKisiColumns, ...nextFields],
        prev.kartuSoalAcuan?.detectedSampleValues
      ),
    }));
  };

  const handleImportJson = async (file: File) => {
    setImportError(null);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as ExamProjectState;
      if (!parsed.metadata || !Array.isArray(parsed.questions)) {
        throw new Error('Struktur berkas JSON paket soal tidak valid.');
      }
      const tingkatanPersentase = {
        ...DEFAULT_TINGKATAN_PERSENTASE,
        ...(parsed.metadata.tingkatanPersentase || {}),
      };
      const smaGrade = normalizeSmaGradeAndPhase(
        parsed.metadata.kelas,
        parsed.metadata.fase
      );
      const cpAnalysis = analyzeCpForSubjectAndPhase(
        parsed.metadata.mataPelajaran || INITIAL_PROJECT_STATE.metadata.mataPelajaran,
        smaGrade.fase
      );
      const kisiCols =
        Array.isArray(parsed.kisiKisiColumns) && parsed.kisiKisiColumns.length > 0
          ? parsed.kisiKisiColumns
          : INITIAL_PROJECT_STATE.kisiKisiColumns;
      const kartuCols =
        Array.isArray(parsed.kartuSoalFields) && parsed.kartuSoalFields.length > 0
          ? parsed.kartuSoalFields
          : INITIAL_PROJECT_STATE.kartuSoalFields;
      const importedBabList = (
        Array.isArray(parsed.metadata.babMateriList) &&
        parsed.metadata.babMateriList.length > 0
          ? parsed.metadata.babMateriList
          : INITIAL_PROJECT_STATE.metadata.babMateriList
      ).map((bab) => ({
        ...bab,
        tujuanPembelajaranList:
          Array.isArray(bab.tujuanPembelajaranList) &&
          bab.tujuanPembelajaranList.length > 0
            ? bab.tujuanPembelajaranList
            : buildDefaultTpsForBab(
                bab.namaBab,
                bab.lingkupMateri,
                parsed.metadata.mataPelajaran ||
                  INITIAL_PROJECT_STATE.metadata.mataPelajaran,
                smaGrade.fase,
                bab.capaianPembelajaran
              ),
      }));
      const nextMeta: ExamMetadata = {
        ...INITIAL_PROJECT_STATE.metadata,
        ...parsed.metadata,
        ...smaGrade,
        kelasSemester: `${smaGrade.kelas} / ${smaGrade.fase}`,
        kurikulum: KURIKULUM_TETAP,
        cpAcuanRegulasi: parsed.metadata.cpAcuanRegulasi || cpAnalysis.regulationFull,
        cpAcuanRingkasan: parsed.metadata.cpAcuanRingkasan || cpAnalysis.summary,
        tingkatanPersentase,
        babMateriList: importedBabList,
      };
      setProject({
        ...INITIAL_PROJECT_STATE,
        ...parsed,
        questions: autoPopulateQuestionsForColumns(
          normalizeQuestions(parsed.questions, tingkatanPersentase),
          nextMeta,
          [...kisiCols, ...kartuCols]
        ),
        kisiKisiColumns: kisiCols,
        kartuSoalFields: kartuCols,
        metadata: nextMeta,
      });
    } catch (err) {
      setImportError(
        err instanceof Error ? err.message : 'Gagal memuat berkas JSON.'
      );
    }
  };

  const handleResetDefault = () => {
    setImportError(null);
    localStorage.removeItem(STORAGE_KEY);
    setProject({
      ...INITIAL_PROJECT_STATE,
      lastSavedAt: new Date().toISOString(),
    });
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <SidebarNav
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        metadata={project.metadata}
        questions={project.questions}
        onExportJson={() => downloadExamJson(project)}
        onImportJson={handleImportJson}
        onResetDefault={handleResetDefault}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Bar (Contextual Breadcrumb + 2 Primary Actions) */}
        <header className="no-print sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Buka menu navigasi"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-sm min-w-0"
            >
              <span className="hidden sm:inline text-slate-500 whitespace-nowrap">
                Paket Soal
              </span>
              <span className="hidden sm:inline text-slate-300" aria-hidden="true">
                /
              </span>
              <span className="font-medium text-slate-700 truncate max-w-[160px] sm:max-w-[240px]">
                {project.metadata.mataPelajaran}
              </span>
              <span className="text-slate-300" aria-hidden="true">
                /
              </span>
              <span className="font-semibold text-slate-900 whitespace-nowrap">
                {MODULE_TITLES[activeModule]}
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleManualSave}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
            >
              {saveFeedback ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-700" />
                  Tersimpan
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5 text-slate-500" />
                  Simpan Paket
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                if (activeModule === 'data_soal') {
                  setActiveModule('kumpulan_soal');
                } else {
                  window.print();
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0"
            >
              <Printer className="h-3.5 w-3.5" />
              {activeModule === 'data_soal' ? 'Lihat Kumpulan Soal' : 'Cetak Halaman'}
            </button>
          </div>
        </header>

        {/* Main Workspace Viewport */}
        <main className="mx-auto w-full max-w-6xl flex-1 p-4 sm:p-6 lg:p-8 print:max-w-none print:p-0">
          {importError && (
            <div
              role="alert"
              className="no-print mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-800"
            >
              {importError}
            </div>
          )}

          {activeModule === 'data_soal' && (
            <DataSoalView
              metadata={project.metadata}
              questions={project.questions}
              onUpdateMetadata={handleUpdateMetadata}
              onUpdateQuestions={handleUpdateQuestions}
              onSyncAll={handleSyncMetadataAndQuestions}
            />
          )}

          {activeModule === 'kisi_kisi' && (
            <KisiKisiView
              metadata={project.metadata}
              questions={project.questions}
              columns={project.kisiKisiColumns}
              acuan={project.kisiKisiAcuan}
              onUpdateMetadata={handleUpdateMetadata}
              onUpdateQuestions={handleUpdateQuestions}
              onApplyAcuan={handleApplyKisiAcuan}
              onUpdateColumns={handleUpdateKisiColumns}
              onSmartFill={handleSmartFillAll}
              smartFillNotice={smartFillNotice}
            />
          )}

          {activeModule === 'kartu_soal' && (
            <KartuSoalView
              metadata={project.metadata}
              questions={project.questions}
              fields={project.kartuSoalFields}
              acuan={project.kartuSoalAcuan}
              onUpdateMetadata={handleUpdateMetadata}
              onUpdateQuestions={handleUpdateQuestions}
              onApplyAcuan={handleApplyKartuAcuan}
              onUpdateFields={handleUpdateKartuFields}
              onSmartFill={handleSmartFillAll}
              smartFillNotice={smartFillNotice}
            />
          )}

          {activeModule === 'kumpulan_soal' && (
            <KumpulanSoalView
              metadata={project.metadata}
              questions={project.questions}
              onUpdateMetadata={handleUpdateMetadata}
              onUpdateQuestions={handleUpdateQuestions}
            />
          )}
        </main>
      </div>
    </div>
  );
}
