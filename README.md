# Soal Digital Sekolah

Aplikasi web authoring naskah ujian dan asesmen berbasis web (React + Vite + Tailwind CSS + TypeScript) yang dirancang khusus untuk tingkat **SMA (Fase E & F)** dengan mengimplementasikan **Kurikulum Deep Learning**, acuan **CP Terbaru (CP 046 Tahun 2025 & CP 020 Tahun 2026 untuk Mata Pelajaran Agama & Budi Pekerti)**, pembobotan otomatis (LOTS 30% / MOTS 40% / HOTS 30%), pilihan ganda opsi **A–E**, serta dukungan penuh terhadap simbol, rumus berhitung, pangkat superskrip, dan gambar stimulus soal.

Dibuat di bawah bimbingan Admin Master: **Aspian La Ode Madimu, S.Pd .Gr** (SMAN 30 Maluku Tengah).

---

## 🚀 Fitur Utama

1. **Sistem Login Multi-Peran & Isolasi Kerja**:
   - **Admin**: Username `admin` | Password: `Guru`
   - **Guru / Pengguna**: Username `Guru` | Password: `SMAN30MALTENG`
   - Setiap pengguna memiliki ruang kerja dan penyimpanan data (`localStorage`) yang terpisah secara independen.
2. **Menu Utama Profil Guru & Identitas Pengajaran**:
   - Pengaturan Nama Guru, NIP, Sekolah, Mata Pelajaran, Kelas, dan Fase yang tersinkronisasi otomatis ke seluruh aplikasi dan dokumen ekspor.
3. **4 Modul Utama Terpadu**:
   - **01. Data Soal**: Pengaturan bab, lingkup materi, Tujuan Pembelajaran (TP), dan komposisi jenis soal (Pilihan Ganda A–E, Esai, Jawaban Singkat, Menjodohkan).
   - **02. Kisi-Kisi Soal**: Tabel kisi-kisi dan fitur unggah format acuan eksternal dengan pengisian cerdas otomatis.
   - **03. Kartu Soal**: Kartu butir soal lengkap dengan editor rumusan, kunci jawaban, pembahasan, dan kontrol gambar stimulus.
   - **04. Kumpulan Soal**: Naskah ujian siap cetak dan unduh dalam format **PDF, Word (.doc), dan Excel (.xlsx)** beserta kunci jawaban.
4. **Blok Tanda Tangan & Pengesahan Dokumen**:
   - Dilengkapi tanda tangan resmi di bagian bawah dokumen: **Mengetahui Wakasek Kurikulum**, **Ketua Tim Penyusun**, dan **Menyetujui Kepala Sekolah**.
5. **Dukungan Simbol & Gambar**:
   - Dilengkapi baris tombol simbol matematika, fisika, kimia, biologi, logika, dan Arab (`MathSymbolBar`), serta fitur unggah/tempel gambar stimulus (*clipboard paste*).

---

## 🛠️ Instalasi & Menjalankan Secara Lokal

1. Clone repository ini:
   ```bash
   git clone https://github.com/USERNAME/soal-digital-sekolah.git
   cd soal-digital-sekolah
   ```

2. Instal dependensi:
   ```bash
   npm install
   ```

3. Jalankan server pengembangan lokal (Development Server):
   ```bash
   npm run dev
   ```

4. Bangun untuk produksi (Production Build):
   ```bash
   npm run build
   ```

---

## 🌐 Deploy ke GitHub Pages (`github.io`)

Proyek ini telah dikonfigurasi dengan **GitHub Actions** (`.github/workflows/deploy.yml`) dan konfigurasi relatif (`base: './'` pada `vite.config.ts`).

1. Buat repository baru di GitHub.
2. Push kode ke repository Anda:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Soal Digital Sekolah"
   git branch -M main
   git remote add origin https://github.com/USERNAME/nama-repo.git
   git push -u origin main
   ```
3. Di repository GitHub Anda, buka **Settings** → **Pages** → pilih **Source** sebagai **GitHub Actions**.
4. Aplikasi Anda akan otomatis online di:
   `https://USERNAME.github.io/nama-repo/`

---

## 👥 Hak Cipta & Pengembang

- **Aplikasi**: Soal Digital Sekolah
- **Admin Master**: Aspian La Ode Madimu, S.Pd .Gr
- **Instansi**: SMAN 30 Maluku Tengah
