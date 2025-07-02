import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();
const PORT = 3000;

console.log("🔍 API Key:", process.env.OPENROUTER_API_KEY?.slice(0, 10) + "...");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Fungsi menentukan gaya berdasarkan versi surat
function gayaBahasa(versi) {
  switch (versi) {
    case "pro":
      return "Gunakan bahasa formal tingkat tinggi, struktur kalimat kompleks dan meyakinkan.";
    case "menengah":
      return "Gunakan bahasa formal ringan dan tetap mudah dimengerti.";
    default:
      return "Gunakan bahasa yang sederhana dan langsung ke inti.";
  }
}

// Fungsi membuat prompt berdasarkan jenis surat + versi
function generatePrompt(jenis, data, versi = "standar") {
  const gaya = gayaBahasa(versi);

  switch (jenis) {
    case "pengunduran":
      return `${gaya}
Buatkan Surat Pengunduran Diri resmi.
Data:
- Nama: ${data.nama}
- Tanggal: ${data.tanggal}
- Kepada: ${data.kepada}
- Jabatan: ${data.jabatan}
- Alasan: ${data.alasan}
Ukuran kertas: ${data.ukuran}`;

    case "lamaran":
      return `${gaya}
Buatkan Surat Lamaran Kerja profesional.
Data:
- Nama: ${data.nama}
- Tanggal: ${data.tanggal}
- Kepada (HRD): ${data.kepada}
- Posisi Dilamar: ${data.posisi}
- Pengalaman Singkat: ${data.pengalaman}
- Motivasi Melamar: ${data.motivasi}
Ukuran kertas: ${data.ukuran}`;

    case "beasiswa":
      return `${gaya}
Buatkan Surat Permohonan Beasiswa.
Data:
- Nama: ${data.nama}
- Tanggal: ${data.tanggal}
- Kepada: ${data.kepada}
- Universitas: ${data.kampus}
- Prodi: ${data.prodi}
- Alasan: ${data.alasan}
Ukuran kertas: ${data.ukuran}`;

    case "magang":
      return `${gaya}
Buatkan Surat Permohonan Magang.
Data:
- Nama: ${data.nama}
- Tanggal: ${data.tanggal}
- Kepada: ${data.kepada}
- Sekolah/Universitas: ${data.sekolah}
- Jurusan: ${data.jurusan}
- Tujuan & Periode Magang: ${data.tujuan}
Ukuran kertas: ${data.ukuran}`;

    case "izin":
      return `${gaya}
Buatkan Surat Izin Sekolah.
Data:
- Nama Siswa: ${data.nama}
- Tanggal Izin: ${data.tanggal}
- Sekolah: ${data.sekolah}
- Kelas: ${data.kelas}
- Alasan Izin: ${data.alasan}
Ukuran kertas: ${data.ukuran}`;

    case "undangan":
      return `${gaya}
Buatkan Surat Undangan Resmi.
Data:
- Penyelenggara: ${data.penyelenggara}
- Tanggal Surat: ${data.tanggal}
- Tanggal/Waktu Acara: ${data.waktu}
- Tempat: ${data.tempat}
- Tujuan Acara: ${data.tujuan}
- Kepada: ${data.kepada}
Ukuran kertas: ${data.ukuran}`;

    case "kuasa":
      return `${gaya}
Buatkan Surat Kuasa Resmi.
Data:
- Pemberi Kuasa: ${data.pemberi}
- Penerima Kuasa: ${data.penerima}
- Alamat Pemberi: ${data.alamat1}
- Alamat Penerima: ${data.alamat2}
- Tanggal: ${data.tanggal}
- Tujuan Kuasa: ${data.tujuan}
Ukuran kertas: ${data.ukuran}`;

    case "pernyataan":
      return `${gaya}
Buatkan Surat Pernyataan.
Data:
- Nama: ${data.nama}
- Isi: ${data.isi}
- Tanggal: ${data.tanggal}
- Dituju Kepada: ${data.kepada}
Ukuran kertas: ${data.ukuran}`;

    case "kerjasama":
      return `${gaya}
Buatkan Surat Penawaran Kerja Sama.
Data:
- Pengirim: ${data.pengirim}
- Penerima: ${data.penerima}
- Tanggal: ${data.tanggal}
- Jenis Kerja Sama: ${data.jenis}
- Tujuan: ${data.tujuan}
Ukuran kertas: ${data.ukuran}`;

    case "pemesanan":
      return `${gaya}
Buatkan Surat Pemesanan Barang.
Data:
- Pemesan: ${data.pemesan}
- Toko Tujuan: ${data.toko}
- Tanggal: ${data.tanggal}
- Daftar Barang: ${data.barang}
- Spesifikasi & Jumlah: ${data.jumlah}
- Metode Kirim & Bayar: ${data.metode}
Ukuran kertas: ${data.ukuran}`;

    case "perjanjian":
      return `${gaya}
Buatkan Surat Perjanjian Kerja.
Data:
- Pihak Pertama: ${data.pihak1}
- Pihak Kedua: ${data.pihak2}
- Tanggal: ${data.tanggal}
- Jabatan: ${data.jabatan}
- Hak/Kewajiban: ${data.hak}
- Lama Kontrak: ${data.lama}
Ukuran kertas: ${data.ukuran}`;

    case "keterangan":
      return `${gaya}
Buatkan Surat Keterangan.
Data:
- Nama: ${data.nama}
- Tanggal: ${data.tanggal}
- Jenis Keterangan: ${data.jenis}
- Instansi Pemberi: ${data.instansi}
Ukuran kertas: ${data.ukuran}`;

    case "pengantar":
      return `${gaya}
Buatkan Surat Pengantar.
Data:
- Pengirim: ${data.nama}
- Tanggal: ${data.tanggal}
- Dokumen Diantar: ${data.dokumen}
- Dituju Kepada: ${data.kepada}
Ukuran kertas: ${data.ukuran}`;

    case "ortu":
      return `${gaya}
Buatkan Surat Pernyataan Orang Tua.
Data:
- Nama Orang Tua: ${data.ortu}
- Nama Anak: ${data.anak}
- Konteks Pernyataan: ${data.konteks}
- Tanggal: ${data.tanggal}
- Tujuan: ${data.tujuan}
Ukuran kertas: ${data.ukuran}`;

    default:
      return `${gaya}
Buatkan surat jenis ${jenis} secara profesional. Data: ${JSON.stringify(data)}.`;
  }
}

// Endpoint utama
app.post("/api/generate", async (req, res) => {
  const { jenis, versi = "standar", ...data } = req.body;
  const prompt = generatePrompt(jenis, data, versi);

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:3000",
          "Content-Type": "application/json"
        }
      }
    );

    const hasil = response.data.choices[0].message.content;
    res.json({ success: true, hasil });

  } catch (error) {
    console.error("❌ ERROR OpenRouter:", error.response?.status, error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Gagal membuat surat dengan AI (OpenRouter)",
      error: error.response?.data || error.message
    });
  }
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
