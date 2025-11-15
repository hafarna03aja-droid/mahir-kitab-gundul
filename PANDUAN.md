# Panduan Penggunaan Mahir Arab

## 📖 Daftar Isi
1. [Instalasi dan Setup](#instalasi-dan-setup)
2. [Fitur Analisis Teks](#fitur-analisis-teks)
3. [Kitab Digital](#kitab-digital)
4. [Asisten AI](#asisten-ai)
5. [Tips Penggunaan](#tips-penggunaan)

## Instalasi dan Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Konfigurasi API Key
Aplikasi ini menggunakan Google Gemini AI. Untuk mengaktifkan fitur AI:

1. Kunjungi [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Buat API key baru (gratis)
3. Copy file `.env.example` menjadi `.env`
4. Tambahkan API key Anda:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

### 3. Jalankan Aplikasi
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

## Fitur Analisis Teks

### Cara Menggunakan

1. **Pilih Contoh Teks**
   - Klik kategori (Al-Quran, Hadits, Amtsal, Kalimat Sederhana)
   - Pilih contoh yang tersedia
   - Teks akan otomatis muncul di textarea

2. **Input Teks Manual**
   - Ketik atau paste teks Arab di textarea
   - Bisa dengan atau tanpa harakat
   - Mendukung teks dari kitab gundul

3. **Konversi dari Indonesia**
   - Ketik kalimat dalam Bahasa Indonesia
   - Klik "Konversi ke Arab Gundul"

## Kitab Digital

### 📚 Koleksi Kitab Tersedia

#### 1. Alfiyyah Ibnu Malik
- **Kategori**: Nahwu & Sharaf
- **Jumlah Bab**: 8 bab (dari 68 total)
- **Bait**: 57 bait nazham
- **Fitur Khusus**: Terjemahan lengkap + 18 catatan kaki mendalam
- **Level**: Menengah - Lanjut
- **Deskripsi**: Kitab legendaris berisi 1000 bait syair merangkum ilmu Nahwu

#### 2. Al-Ajurrumiyyah
- **Kategori**: Nahwu
- **Jumlah Bab**: 12 bab lengkap
- **Baris**: 52 baris
- **Fitur Khusus**: Terjemahan + 8 footnotes
- **Level**: Pemula - Menengah
- **Deskripsi**: Kitab dasar Nahwu paling populer untuk pemula

#### 3. Nazham Al-Imriti
- **Kategori**: Sharaf
- **Jumlah Bab**: 8 bab
- **Bait**: 34 bait
- **Level**: Menengah
- **Deskripsi**: Nazham tentang ilmu Sharaf dalam bentuk syair

#### 4. Qawaid al-Lughah al-Arabiyyah
- **Kategori**: Qawaid
- **Jumlah Bab**: 15 bab
- **Baris**: 50 baris
- **Level**: Dasar - Menengah
- **Deskripsi**: Kumpulan kaidah-kaidah bahasa Arab

### 🎯 Cara Menggunakan Kitab Digital

#### Langkah 1: Memilih Kitab
1. Buka tab **Kitab Digital**
2. Browse 4 kitab yang tersedia
3. Lihat informasi: kategori, jumlah bab, penulis
4. Klik card kitab untuk membuka

#### Langkah 2: Navigasi & Membaca
1. **Sidebar Navigasi**: 
   - Daftar semua bab di sebelah kiri
   - Klik bab untuk berpindah
   - Bab aktif ditandai warna amber
   
2. **Konten Utama**:
   - Teks Arab dalam font yang indah
   - Setiap bait/baris dalam card terpisah
   - Nomor bait di pojok kiri bawah

3. **Navigasi Bab**:
   - Tombol "Previous Chapter" di kiri bawah
   - Tombol "Next Chapter" di kanan bawah

#### Langkah 3: Mengatur Tampilan

##### 📏 Ukuran Teks
- Klik tombol **A-** untuk memperkecil (minimal 16px)
- Klik tombol **A+** untuk memperbesar (maksimal 36px)
- Default: 24px (optimal untuk membaca)

##### 🌐 Toggle Terjemahan
- Klik tombol **"Terjemahan"** di toolbar
- ✓ = Aktif (terjemahan ditampilkan)
- Tanpa ✓ = Nonaktif (hanya teks Arab)
- Terjemahan muncul dalam kotak biru di bawah teks Arab

##### 📝 Toggle Catatan Kaki
- Klik tombol **"Catatan Kaki"** di toolbar
- ✓ = Aktif (footnotes ditampilkan)
- Tanpa ✓ = Nonaktif
- Footnotes muncul dalam kotak ungu dengan penjelasan mendalam

#### Langkah 4: Menggunakan Fitur Interaktif

##### 🔖 Bookmark
**Untuk Menambah Bookmark:**
1. Hover pada bait yang ingin disimpan
2. Klik tombol **"🔖 Bookmark"** di toolbar bait
3. Bookmark tersimpan otomatis

**Untuk Melihat & Menggunakan Bookmark:**
1. Klik tombol **"🔖 Bookmark (n)"** di toolbar atas
2. Panel bookmark akan terbuka
3. Lihat daftar semua bookmark
4. Klik item untuk langsung ke lokasi
5. Klik 🗑️ untuk menghapus

**Manfaat Bookmark:**
- Simpan bait yang sulit untuk review nanti
- Tandai bait favorit untuk hafalan
- Buat daftar bacaan pribadi
- Data tersimpan (tidak hilang saat refresh)

##### 📋 Salin Teks
1. Hover pada bait yang ingin disalin
2. Klik tombol **"📋 Salin"**
3. Teks Arab ter-copy ke clipboard
4. Paste di aplikasi lain untuk analisis atau catatan

##### ✨ Highlight
1. Hover pada bait penting
2. Klik tombol **"✨ Highlight"**
3. Bait akan diberi highlight kuning
4. Klik lagi untuk menghilangkan highlight

### 💡 Tips Penggunaan Kitab Digital

#### Untuk Pemula:
1. Mulai dari **Al-Ajurrumiyyah** (paling dasar)
2. **Aktifkan** terjemahan dan catatan kaki
3. **Perbesar** ukuran teks jika perlu (26-28px)
4. Baca perlahan, pahami setiap baris
5. Bookmark baris yang belum paham untuk ditanya ustadz

#### Untuk Level Menengah:
1. Lanjut ke **Nazham Al-Imriti** (Sharaf)
2. **Toggle OFF** terjemahan untuk latihan
3. Coba terjemahkan sendiri, baru cek terjemahan
4. Gunakan footnotes untuk pemahaman lebih dalam
5. Bookmark bait-bait yang ingin dihafal

#### Untuk Level Lanjut:
1. Mulai **Alfiyyah Ibn Malik**
2. Fokus pada pemahaman struktur nazham
3. Gunakan catatan kaki untuk konteks historis
4. Copy teks untuk dianalisis di tab Analisis
5. Bandingkan dengan syarah lain

#### Untuk Hafalan:
1. Bookmark semua bait yang target hafalan
2. Matikan terjemahan saat muraja'ah
3. Gunakan ukuran teks besar (30-34px)
4. Review bookmark setiap hari
5. Hapus bookmark yang sudah hafal

#### Untuk Riset:
1. Gunakan semua kitab sebagai referensi
2. Aktifkan footnotes untuk sumber tambahan
3. Copy teks yang relevan untuk paper
4. Bookmark referensi penting
5. Export hasil analisis untuk dokumentasi

### 📊 Statistik Konten

| Fitur | Alfiyyah | Ajurrumiyyah | Imriti | Qawaid | Total |
|-------|----------|--------------|--------|--------|-------|
| Bab | 8 | 12 | 8 | 15 | **43** |
| Bait/Baris | 57 | 52 | 34 | 50 | **193** |
| Terjemahan | 18 | 8 | - | - | **26** |
| Footnotes | 18 | 8 | - | - | **26** |

### 🎨 Color Coding dalam Kitab Digital

- **🟨 Amber**: Aksen utama, highlight aktif, bab terpilih
- **🟦 Biru (Sky)**: Box terjemahan Indonesia
- **🟪 Ungu (Purple)**: Box catatan kaki/footnotes
- **🟡 Kuning**: Highlight manual dari user
- **⬜ Slate**: Background dan teks utama

### 🔍 Pencarian Kitab

1. Gunakan **search bar** di atas daftar kitab
2. Ketik nama kitab (Arab atau Indonesia)
3. Hasil filter secara real-time
4. Contoh: ketik "نحو" akan tampilkan kitab Nahwu

## Fitur Asisten AI
   - Teks Arab akan muncul di textarea utama

4. **Analisis**
   - Klik tombol "Analisis Teks"
   - Tunggu proses AI (15-30 detik)
   - Hasil akan ditampilkan lengkap dengan:
     * Teks bervokal (harakat lengkap)
     * Terjemahan Indonesia
     * Analisis gramatikal per kata

### Fitur Export

Setelah analisis selesai, Anda bisa:

- **Salin Hasil**: Copy dalam format Markdown untuk catatan
- **Export .txt**: Download sebagai file text biasa
- **Export .doc**: Download sebagai dokumen Word untuk editing

### Riwayat Analisis

- Maksimal 20 teks terakhir disimpan
- Klik teks di riwayat untuk analisis ulang
- Tombol "Bersihkan Riwayat" untuk hapus semua

## Asisten AI

### Cara Bertanya

1. Ketik pertanyaan di kolom chat
2. Contoh pertanyaan yang bisa diajukan:
   - "Apa itu I'rab?"
   - "Jelaskan tentang Fi'il Madhi"
   - "Bagaimana cara menentukan I'rab isim?"
   - "Apa perbedaan Jumlah Ismiyyah dan Fi'liyyah?"

### Format Jawaban

AI akan memberikan jawaban dengan format:
- **Bold text** untuk istilah penting
- `Teks Arab` dalam inline code
- ### Heading untuk sub-topik
- > Blockquotes untuk kutipan

## Tips Penggunaan

### Untuk Pemula

1. Mulai dari contoh "Kalimat Sederhana"
2. Pelajari struktur I'rab dari hasil analisis
3. Gunakan Asisten AI untuk bertanya detail
4. Export hasil untuk catatan belajar

### Untuk Mahasiswa Kitab

1. Baca kitab di tab Kitab Digital dengan terjemahan
2. Copy teks yang sulit ke tab Analisis untuk analisis I'rab
3. Gunakan fitur konversi untuk latihan terjemah
4. Bookmark bait penting untuk review dan hafalan
5. Perhatikan analisis Balaghah untuk pemahaman mendalam
6. Simpan hasil analisis sebagai referensi
7. Gunakan AI Assistant untuk bertanya detail tentang bait tertentu

### Untuk Pengajar

1. Pilih materi dari Kitab Digital untuk diajarkan
2. Copy teks ke Analisis untuk persiapan mengajar
3. Gunakan contoh teks untuk materi ajar
4. Export hasil sebagai handout untuk siswa
5. Manfaatkan riwayat untuk review materi sebelumnya
6. Bookmark bait-bait kunci untuk fokus pembelajaran

### Untuk Self-Learner

1. Mulai dari Ajurrumiyyah (pemula) → Imriti (menengah) → Alfiyyah (lanjut)
2. Aktifkan terjemahan & footnotes di awal pembelajaran
3. Toggle OFF terjemahan saat latihan mandiri
4. Bookmark progres harian
5. Gunakan Analisis untuk mengecek pemahaman
6. Bertanya ke AI Assistant jika ada yang tidak jelas

## Troubleshooting

### API Key Error
**Masalah**: Muncul pesan "API Key Gemini belum dikonfigurasi"

**Solusi**:
1. Pastikan file `.env` sudah dibuat
2. Cek API key sudah benar
3. Restart development server (`Ctrl+C` lalu `npm run dev`)

### Hasil Analisis Lambat
**Masalah**: AI membutuhkan waktu lama

**Solusi**:
- Normal untuk teks panjang (30-60 detik)
- Untuk teks pendek seharusnya 15-30 detik
- Cek koneksi internet Anda

### Export Tidak Berfungsi
**Masalah**: Tombol export tidak download file

**Solusi**:
- Cek browser mendukung download
- Pastikan tidak ada popup blocker
- Coba browser berbeda (Chrome/Firefox recommended)

## Dukungan

Untuk pertanyaan atau masalah, silakan buat issue di repository GitHub.

---

**© 2025 Mahir Arab** - Platform Pembelajaran Bahasa Arab dengan AI
