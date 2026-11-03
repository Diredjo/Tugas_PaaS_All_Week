# Praktikum PaaS Minggu 4: Deploy Website Statis ke Cloudflare

Proyek praktikum Platform as a Service (PaaS) untuk mengonfigurasi dan mendeploy website statis interaktif ke jaringan global edge menggunakan Cloudflare Workers dengan Static Assets.

## Identitas Praktikum
- **Nama**: Saqa Pandega Adha Dananjaya
- **Kelas**: XII SIJA 1
- **Minggu**: 4 (Deploy Website Statis ke Cloudflare)

---

## Tujuan Praktikum
1. Memahami konsep platform Platform as a Service (PaaS) dan Edge Computing menggunakan Cloudflare Workers.
2. Mengonfigurasi file `wrangler.jsonc` untuk deployment website statis menggunakan fitur Cloudflare Workers Static Assets.
3. Melakukan verifikasi dan pengujian website secara lokal sebelum proses deployment.
4. Mempublikasikan website statis ke jaringan Cloudflare agar dapat diakses secara publik dan cepat dari seluruh dunia.

---

## Struktur Proyek

```text
Minggu 4 - Deploy website statis ke Cloudflare/
├── public/
│   ├── index.html        # Struktur markup halaman web statis
│   ├── style.css         # Styling antarmuka dan animasi responsif
│   └── script.js         # Logika interaktif dan audio synthesizer
├── wrangler.jsonc        # Konfigurasi Cloudflare Workers & Static Assets
└── README.md             # Dokumentasi proyek, struktur, dan panduan deployment
```

### Penjelasan File
- **`public/`**: Direktori root aset web statis yang akan disajikan langsung oleh Cloudflare.
  - `index.html`: File HTML utama aplikasi web "Super Slots Sultan 777".
  - `style.css`: File styling CSS modern (tampilan 100vh tanpa scroll, efek neon bling-bling).
  - `script.js`: File JavaScript yang menangani interaksi clicker, mekanika 3-reel slot, dan efek suara via Web Audio API.
- **`wrangler.jsonc`**: File konfigurasi utama Wrangler (CLI Cloudflare) untuk mendefinisikan nama worker, tanggal kompatibilitas, serta memetakan folder aset statis (`assets.directory`).
- **`README.md`**: Dokumentasi lengkap mengenai struktur, tujuan, dan prosedur deployment.

---

## Konfigurasi Cloudflare (`wrangler.jsonc`)

Konfigurasi `wrangler.jsonc` yang digunakan:

```jsonc
{
  "name": "paas-static-saqa-pandega",
  "compatibility_date": "2026-11-03",
  "assets": {
    "directory": "./public"
  }
}
```

- **`name`**: Menentukan nama aplikasi/worker pada dashboard Cloudflare (`paas-static-saqa-pandega`).
- **`compatibility_date`**: Menetapkan tanggal kompatibilitas runtime Cloudflare Workers (`2026-11-03`).
- **`assets.directory`**: Menunjuk folder `./public` sebagai sumber file statis yang disajikan langsung tanpa perlu server tambahan.

---

## Cara Pengujian Lokal

Website dapat diuji secara lokal menggunakan salah satu metode berikut:

### Opsi 1: Menggunakan Python HTTP Server (Rekomendasi Cepat)
Buka terminal pada direktori `Minggu 4 - Deploy website statis ke Cloudflare` lalu jalankan:

```bash
python -m http.server 8000 -d public
```
Buka browser dan akses [http://localhost:8000](http://localhost:8000).

### Opsi 2: Menggunakan Wrangler Dev
Jalankan simulasi lokal runtime Cloudflare:

```bash
npx wrangler dev
```
Wrangler akan menjalankan server lokal (biasanya di `http://localhost:8787`).

### Opsi 3: Membuka File Langsung
Anda juga dapat langsung membuka file `public/index.html` di web browser modern (Google Chrome, Firefox, Edge).

---

## Panduan Deployment ke Cloudflare Workers

Ikuti langkah-langkah berikut untuk mempublikasikan website ke Cloudflare:

1. **Buka Terminal**  
   Arahkan ke folder praktikum Minggu 4:
   ```bash
   cd "Minggu 4 - Deploy website statis ke Cloudflare"
   ```

2. **Login ke Akun Cloudflare**  
   Autentikasi akun Cloudflare melalui CLI:
   ```bash
   npx wrangler login
   ```
   Halaman browser akan terbuka untuk memberikan otorisasi kepada Wrangler.

3. **Deploy Website**  
   Lakukan publikasi proyek ke Cloudflare Workers:
   ```bash
   npx wrangler deploy
   ```

4. **Akses Website**  
   Setelah proses deploy selesai, terminal akan menampilkan URL publik Cloudflare Workers, contoh:
   ```text
   https://paas-static-saqa-pandega.<subdomain-anda>.workers.dev
   ```
   Website kini aktif dan dapat diakses publik.

