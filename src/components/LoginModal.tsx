import React, { useState } from 'react';
import { Lock, User, Shield, BookOpen, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  onLoginSuccess: (user: { username: string; role: 'admin' | 'guru'; nama: string }) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLoginSuccess }) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const u = usernameInput.trim();
    const p = passwordInput.trim();

    if (u === 'admin' && p === 'Guru') {
      onLoginSuccess({
        username: 'admin',
        role: 'admin',
        nama: 'Aspian La Ode Madimu, S.Pd .Gr (Admin Master)',
      });
      return;
    }

    if (u === 'Guru' && p === 'SMAN30MALTENG') {
      onLoginSuccess({
        username: 'Guru',
        role: 'guru',
        nama: 'Guru Mata Pelajaran (SMAN 30 Maluku Tengah)',
      });
      return;
    }

    setErrorMsg('Username atau Password tidak valid. Periksa kembali kredensial Anda.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header gradient banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 px-6 py-8 text-white text-center relative">
          <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-blue-100 flex items-center gap-1.5 border border-white/20">
            <Shield className="w-3.5 h-3.5 text-amber-300" />
            <span>SMA Fase E & F</span>
          </div>
          <div className="w-16 h-16 bg-white/15 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center mb-3 border border-white/25 shadow-inner">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Soal Digital Sekolah</h1>
          <p className="text-blue-100 text-sm mt-1">
            Kurikulum Deep Learning & CP Terbaru · SMAN 30 Maluku Tengah
          </p>
        </div>

        {/* Login Form Body */}
        <div className="p-6 sm:p-8">
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2.5 shadow-sm">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Username / Pengguna
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
            >
              <span>Masuk ke Aplikasi</span>
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 text-center text-xs text-slate-500">
          Admin Master: <span className="font-medium text-slate-700">Aspian La Ode Madimu, S.Pd .Gr</span>
        </div>
      </div>
    </div>
  );
};
