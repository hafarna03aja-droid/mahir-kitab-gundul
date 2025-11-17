# 🔄 Workflow Update Aplikasi dengan Pull Request

Panduan lengkap untuk melakukan update aplikasi menggunakan Git Flow dan Pull Request.

---

## 📚 Table of Contents
- [Setup Awal](#setup-awal)
- [Workflow Development](#workflow-development)
- [Membuat Pull Request](#membuat-pull-request)
- [Review dan Merge](#review-dan-merge)
- [Best Practices](#best-practices)

---

## 🚀 Setup Awal

### 1. Clone Repository (Jika Belum)
```bash
git clone https://github.com/hafarna03aja-droid/mahir-kitab-gundul.git
cd mahir-kitab-gundul
npm install
```

### 2. Configure Git
```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### 3. Pastikan Main Branch Up-to-Date
```bash
git checkout main
git pull origin main
```

---

## 💻 Workflow Development

### 1. Buat Branch Baru untuk Fitur/Fix
```bash
# Format: feature/nama-fitur atau fix/nama-bug
git checkout -b feature/tambah-fitur-bookmark
# atau
git checkout -b fix/perbaiki-audio-tutor
```

**Naming Convention:**
- `feature/` - Untuk fitur baru
- `fix/` - Untuk bug fix
- `refactor/` - Untuk refactoring code
- `docs/` - Untuk update dokumentasi
- `style/` - Untuk perubahan UI/styling

### 2. Mulai Development
```bash
# Jalankan development server
npm run dev

# Edit file yang diperlukan
# Test perubahan Anda
```

### 3. Commit Perubahan
```bash
# Lihat file yang berubah
git status

# Add file yang akan di-commit
git add .
# atau spesifik file
git add src/components/NewComponent.tsx

# Commit dengan pesan yang jelas
git commit -m "✨ feat: tambah fitur bookmark di kitab digital"
```

**Commit Message Convention:**
- `✨ feat:` - Fitur baru
- `🐛 fix:` - Bug fix
- `📝 docs:` - Update dokumentasi
- `💄 style:` - Perubahan styling/UI
- `♻️ refactor:` - Refactoring code
- `⚡ perf:` - Performance improvement
- `🔧 chore:` - Maintenance tasks

### 4. Push Branch ke GitHub
```bash
git push origin feature/tambah-fitur-bookmark
```

---

## 🔀 Membuat Pull Request

### Via GitHub Website:
1. Buka https://github.com/hafarna03aja-droid/mahir-kitab-gundul
2. Klik **"Compare & pull request"** (muncul setelah push)
3. Atau klik tab **"Pull requests"** → **"New pull request"**
4. Pilih:
   - Base: `main`
   - Compare: `feature/tambah-fitur-bookmark`
5. Isi form PR:
   - **Title**: Judul yang jelas dan deskriptif
   - **Description**: Ikuti template yang sudah ada
   - Centang checklist yang sesuai
6. Klik **"Create pull request"**

### Via GitHub CLI (Opsional):
```bash
gh pr create --title "Tambah fitur bookmark" --body "Menambahkan fitur bookmark untuk kitab digital"
```

---

## 👀 Review dan Merge

### Self-Review Checklist:
✅ Pastikan sebelum create PR:
- [ ] `npm run build` berhasil tanpa error
- [ ] Tidak ada TypeScript error
- [ ] Test manual di browser (desktop & mobile)
- [ ] Dark mode berfungsi normal
- [ ] Tidak ada console error
- [ ] Code sudah clean dan readable

### CI/CD Checks:
Setelah create PR, GitHub Actions akan otomatis:
- ✅ TypeScript type checking
- ✅ Build verification
- ✅ Code quality check

### Merge PR:
Jika semua check pass:
1. Klik **"Merge pull request"**
2. Pilih merge method:
   - **Squash and merge** (recommended) - Gabung semua commit jadi 1
   - **Rebase and merge** - Linear history
   - **Create merge commit** - Keep semua commit history
3. Confirm merge
4. **Delete branch** setelah merge (optional tapi recommended)

### Vercel Auto-Deploy:
Setelah merge ke main, Vercel akan otomatis:
- 🔄 Detect perubahan
- 🏗️ Build aplikasi
- 🚀 Deploy ke production (~1-2 menit)

---

## ✨ Best Practices

### 1. Keep Branches Small and Focused
- Satu branch untuk satu fitur/fix
- Jangan campurkan multiple unrelated changes

### 2. Commit Often
```bash
# Good
git commit -m "feat: tambah UI bookmark button"
git commit -m "feat: implement bookmark logic"
git commit -m "style: improve bookmark icon"

# Avoid
git commit -m "update everything"
```

### 3. Update Branch Secara Berkala
```bash
# Update branch Anda dengan perubahan terbaru dari main
git checkout main
git pull origin main
git checkout feature/your-branch
git merge main
# atau
git rebase main
```

### 4. Test Before Push
```bash
# Selalu test sebelum push
npm run build
npm run preview  # Test production build
```

### 5. Write Descriptive PR Descriptions
- Jelaskan **apa** yang diubah
- Jelaskan **mengapa** perubahan diperlukan
- Sertakan screenshot untuk perubahan UI
- Link ke issue terkait jika ada

---

## 🆘 Troubleshooting

### Merge Conflict
```bash
# Update dari main
git checkout main
git pull origin main
git checkout your-branch
git merge main

# Resolve conflicts di file editor
# Setelah resolve:
git add .
git commit -m "resolve merge conflicts"
git push
```

### Salah Commit ke Main
```bash
# Pindahkan commit terakhir ke branch baru
git branch feature/new-branch
git reset --hard HEAD~1
git checkout feature/new-branch
git push origin feature/new-branch
```

### Undo Last Commit (belum push)
```bash
git reset --soft HEAD~1  # Keep changes
# atau
git reset --hard HEAD~1  # Discard changes
```

---

## 📞 Butuh Bantuan?

- 📖 Baca [CONTRIBUTING.md](CONTRIBUTING.md)
- 🐛 Report bug di [GitHub Issues](https://github.com/hafarna03aja-droid/mahir-kitab-gundul/issues)
- 💬 Diskusi di [GitHub Discussions](https://github.com/hafarna03aja-droid/mahir-kitab-gundul/discussions)

---

## 📝 Quick Reference Commands

```bash
# Setup & Update
git pull origin main              # Update dari remote
git checkout -b feature/xyz       # Buat branch baru

# Development
npm run dev                       # Start dev server
npm run build                     # Test production build

# Commit & Push
git add .                         # Stage all changes
git commit -m "feat: xyz"         # Commit dengan pesan
git push origin feature/xyz       # Push ke GitHub

# Branch Management
git branch                        # Lihat semua branch
git branch -d feature/xyz         # Delete branch (setelah merge)
git checkout main                 # Pindah ke main branch

# Sync dengan Main
git fetch origin                  # Fetch updates
git merge origin/main             # Merge main ke branch
```

---

**Happy Coding! 🚀**
