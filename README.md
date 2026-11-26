# CleanGo

Website layanan laundry online dengan antar-jemput di Kota Madiun, Jawa Timur.

## Struktur
- `index.html`: halaman utama (HTML)
- `css/style.css`: seluruh gaya (CSS)
- `js/app.js`: seluruh logika aplikasi (JavaScript)
- `privasi.html`, `syarat.html`: halaman kebijakan privasi dan syarat ketentuan
- `assets/`: gambar website
- `robots.txt`, `sitemap.xml`, `llms.txt`: file untuk mesin pencari dan AI
- `_headers`: header keamanan untuk Netlify (Content-Security-Policy, HSTS, dan lainnya)

## Catatan
- Ganti `KODE_GSC` di `index.html` dengan kode verifikasi Google Search Console.
- Data pesanan disimpan di penyimpanan browser (localStorage), sehingga ini masih versi demo.
