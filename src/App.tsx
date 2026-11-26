import React, { useEffect, useState } from 'react';
import {
  Check,
  Menu,
  Printer,
  Save,
  ShieldCheck,
  LogOut,
  User as UserIcon,
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
import { LoginModal } from './components/LoginModal';

interface UserSession {
  username: string;
  role: 'admin' | 'guru';
  nama: string;
}

const MODULE_TITLES: Record<ActiveModule, string> = {
  data_soal: 'Data Soal',
  kisi_kisi: 'Kisi-Kisi Soal',
  kartu_soal: 'Kartu Soal',
  kumpulan_soal: 'Kumpulan Soal',
};

function getStorageKey(username: string): string {
  return `naskahuji_paket_soal_v1_${username.toLowerCase()}`;
}

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

function loadStateForUser(username: string): ExamProjectState {
  try {
    const raw = localStorage.getItem(getStorageKey(username));
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
          : bab.namaBab.trim() || bab.lingkupMateri.trim()
          ? buildDefaultTpsForBab(
              bab.namaBab,
              bab.lingkupMateri,
              subjectName,
              smaGrade.fase,
              bab.capaianPembelajaran
            )
          : [],
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
      [...kisiCols, ...kartuCols],
      {
        ...(parsed.kisiKisiAcuan?.detectedSampleValues || {}),
        ...(parsed.kartuSoalAcuan?.detectedSampleValues || {}),
      },
      { refreshMetadataFields: true }
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
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const savedUser = sessionStorage.getItem('naskahuji_current_user');
      if (savedUser) {
        return JSON.parse(savedUser) as UserSession;
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [project, setProject] = useState<ExamProjectState>(() => {
    try {
      const savedUser = sessionStorage.getItem('naskahuji_current_user');
      if (savedUser) {
        const u = JSON.parse(savedUser) as UserSession;
        return loadStateForUser(u.username);
      }
    } catch {
      // ignore
    }
    return INITIAL_PROJECT_STATE;
  });

  const [activeModule, setActiveModule] = useState<ActiveModule>('data_soal');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(false);
  const [smartFillNotice, setSmartFillNotice] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const handleLoginSuccess = (user: UserSession) => {
    setCurrentUser(user);
    try {
      sessionStorage.setItem('naskahuji_current_user', JSON.stringify(user));
    } catch {
      // ignore
    }
    const userState = loadStateForUser(user.username);
    setProject(userState);
    setActiveModule('data_soal');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      sessionStorage.removeItem('naskahuji_current_user');
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    try {
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
      localStorage.setItem(getStorageKey(currentUser.username), JSON.stringify(compactState));
    } catch {
      // ignore quota limits
    }
  }, [project, currentUser]);

  const handleManualSave = () => {
    setProject((prev) => ({
      ...prev,
      lastSavedAt: new Date().toISOString(),
    }));
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2000);
  };

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
        },
        { refreshMetadataFields: true }
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
        [...prev.kisiKisiColumns, ...prev.kartuSoalFields],
        {
          ...(prev.kisiKisiAcuan?.detectedSampleValues || {}),
          ...(prev.kartuSoalAcuan?.detectedSampleValues || {}),
        },
        { refreshMetadataFields: true }
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
      const normalized = normalizeQuestions(questions, prev.metadata.tingkatanPersentase);
      const populated = autoPopulateQuestionsForColumns(
        normalized,
        prev.metadata,
        [...prev.kisiKisiColumns, ...prev.kartuSoalFields]
      );
      return {
        ...prev,
        questions: populated,
      };
    });
  };

  const handleApplyKisiAcuan = (acuan: UploadedFormatAcuan | null, nextColumns: ReferenceColumnDef[]) => {
    setProject((prev) => {
      const populated = autoPopulateQuestionsForColumns(
        prev.questions,
        prev.metadata,
        [...nextColumns, ...prev.kartuSoalFields],
        acuan?.detectedSampleValues
      );
      return {
        ...prev,
        kisiKisiAcuan: acuan,
        kisiKisiColumns: nextColumns,
        questions: populated,
      };
    });
  };

  const handleApplyKartuAcuan = (acuan: UploadedFormatAcuan | null, nextFields: ReferenceColumnDef[]) => {
    setProject((prev) => {
      const populated = autoPopulateQuestionsForColumns(
        prev.questions,
        prev.metadata,
        [...prev.kisiKisiColumns, ...nextFields],
        acuan?.detectedSampleValues
      );
      return {
        ...prev,
        kartuSoalAcuan: acuan,
        kartuSoalFields: nextFields,
        questions: populated,
      };
    });
  };

  const handleUpdateKisiColumns = (columns: ReferenceColumnDef[]) => {
    setProject((prev) => ({
      ...prev,
      kisiKisiColumns: columns,
    }));
  };

  const handleUpdateKartuFields = (fields: ReferenceColumnDef[]) => {
    setProject((prev) => ({
      ...prev,
      kartuSoalFields: fields,
    }));
  };

  const handleSmartFillAll = () => {
    if (!project.kisiKisiAcuan && !project.kartuSoalAcuan) {
      setSmartFillNotice('Upload file format acuan terlebih dahulu pada menu Kisi-Kisi atau Kartu Soal.');
      setTimeout(() => setSmartFillNotice(null), 4000);
      return;
    }
    const acuan = project.kisiKisiAcuan || project.kartuSoalAcuan;
    if (!acuan) return;

    setProject((prev) => {
      const acuan = prev.kisiKisiAcuan || prev.kartuSoalAcuan;
      if (!acuan) return prev;
      const res = smartFillWorkFromAcuan(
        prev.questions,
        prev.metadata,
        [...prev.kisiKisiColumns, ...prev.kartuSoalFields],
        acuan.detectedSampleValues
      );
      const normalized = normalizeQuestions(res.questions, prev.metadata.tingkatanPersentase);
      return {
        ...prev,
        questions: normalized,
      };
    });
    setSmartFillNotice('Aplikasi berhasil mengisi otomatis seluruh instrumen soal & metadata sesuai format acuan.');
    setTimeout(() => setSmartFillNotice(null), 4000);
  };

  const handleImportJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const imported = JSON.parse(text) as ExamProjectState;
        if (!imported.metadata || !Array.isArray(imported.questions)) {
          throw new Error('Format file JSON tidak valid.');
        }
        const normalized = normalizeQuestions(imported.questions, imported.metadata.tingkatanPersentase);
        const populated = autoPopulateQuestionsForColumns(
          normalized,
          imported.metadata,
          [...(imported.kisiKisiColumns || INITIAL_PROJECT_STATE.kisiKisiColumns), ...(imported.kartuSoalFields || INITIAL_PROJECT_STATE.kartuSoalFields)]
        );
        setProject({
          ...imported,
          questions: populated,
          lastSavedAt: new Date().toISOString(),
        });
        setImportError(null);
        setSaveFeedback(true);
        setTimeout(() => setSaveFeedback(false), 2000);
      } catch (err: any) {
        setImportError(err?.message || 'Gagal mengimpor file JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefault = () => {
    setImportError(null);
    if (currentUser) {
      localStorage.removeItem(getStorageKey(currentUser.username));
    }
    setProject({
      ...INITIAL_PROJECT_STATE,
      lastSavedAt: new Date().toISOString(),
    });
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2000);
  };

  // If user is not logged in, render LoginModal
  if (!currentUser) {
    return <LoginModal onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100/90 via-sky-50/20 to-indigo-50/25 text-slate-900">
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
        {/* Top Bar (Contextual Breadcrumb + Actions + User / Admin Master) */}
        <header className="no-print sticky top-0 z-30 flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-slate-200/90 bg-white/95 backdrop-blur-md px-4 py-2 sm:flex-nowrap sm:px-6 lg:px-8 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Buka menu navigasi"
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>

            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-sm min-w-0"
            >
              <span className="hidden md:inline font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 whitespace-nowrap">
                Soal Digital Sekolah
              </span>
              <span className="hidden md:inline text-slate-300" aria-hidden="true">
                /
              </span>
              <span className="font-semibold text-slate-800 truncate max-w-[140px] sm:max-w-[200px]">
                {project.metadata.mataPelajaran}
              </span>
              <span className="text-slate-300" aria-hidden="true">
                /
              </span>
              <span className="font-bold text-blue-700 whitespace-nowrap">
                {MODULE_TITLES[activeModule]}
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 ml-auto">
            <button
              type="button"
              onClick={handleManualSave}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap shrink-0 shadow-xs ${
                saveFeedback
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-blue-50/80 hover:text-blue-700 hover:border-blue-300'
              }`}
            >
              {saveFeedback ? (
                <>
                  <Check className="h-3.5 w-3.5 text-white" />
                  Tersimpan!
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
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0"
            >
              <Printer className="h-3.5 w-3.5" />
              {activeModule === 'data_soal' ? 'Lihat Kumpulan Soal' : 'Cetak Halaman'}
            </button>

            {/* User Session Badge & Admin Master / Logout */}
            <div className="flex items-center gap-2.5 rounded-xl border border-amber-200/90 bg-gradient-to-r from-amber-50/80 via-white to-blue-50/60 px-3 py-1.5 text-left shrink-0 shadow-xs">
              {currentUser.role === 'admin' ? (
                <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0" />
              ) : (
                <UserIcon className="h-4 w-4 text-indigo-600 shrink-0" />
              )}
              <div className="leading-tight">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  {currentUser.role === 'admin' ? 'Admin Master' : 'Pengguna / Guru'}
                </span>
                <span className="block text-xs font-bold text-slate-900 whitespace-nowrap">
                  {currentUser.role === 'admin' ? 'Aspian La Ode Madimu, S.Pd .Gr' : currentUser.username}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                title="Keluar / Ganti Akun"
                className="ml-1 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
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

        <footer className="no-print border-t border-slate-200/80 bg-white px-4 py-3 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">
              Soal Digital Sekolah ({currentUser.role === 'admin' ? 'Mode Admin' : 'Mode Guru: ' + currentUser.username})
            </span>
            <span>
              Admin Master:{' '}
              <strong className="font-semibold text-slate-900">
                Aspian La Ode Madimu, S.Pd .Gr
              </strong>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
