// Menampilkan input tambahan dinamis
document.getElementById("jenisSurat").addEventListener("change", function () {
  const jenis = this.value;
  const inputTambahan = document.getElementById("inputTambahan");
  inputTambahan.innerHTML = "";

  const addInput = (label, id) => {
    inputTambahan.innerHTML += `
      <div class="input-group">
        <label for="${id}">${label}</label>
        <input type="text" id="${id}" required />
      </div>
    `;
  };

  switch (jenis) {
    case "Surat Pengunduran Diri":
      addInput("Jabatan Saat Ini", "jabatan");
      addInput("Alasan Mengundurkan Diri", "alasan");
      break;
    case "Surat Lamaran Kerja":
      addInput("Posisi yang Dilamar", "posisi");
      addInput("Pengalaman atau Latar Belakang", "pengalaman");
      addInput("Motivasi Melamar", "motivasi");
      break;
    case "Surat Permohonan Beasiswa":
      addInput("Nama Sekolah/Universitas", "kampus");
      addInput("Program Studi", "prodi");
      addInput("Alasan Memohon Beasiswa", "alasan");
      break;
    case "Surat Permohonan Magang":
      addInput("Asal Sekolah/Universitas", "sekolah");
      addInput("Jurusan", "jurusan");
      addInput("Tujuan Magang dan Periode", "tujuan");
      break;
    case "Surat Izin Sekolah":
      addInput("Nama Sekolah", "sekolah");
      addInput("Kelas", "kelas");
      addInput("Alasan Izin", "alasan");
      break;
    case "Surat Izin Sekolah":
      addInput("Nama Sekolah", "sekolah");
      addInput("Kelas", "kelas");
      addInput("Nomor Induk Siswa", "nomorinduk"); // 🟢 Tambahkan baris ini
      addInput("Alasan Izin", "alasan");
      break;

    case "Surat Kuasa":
      addInput("Nama Pemberi Kuasa", "pemberi");
      addInput("Nama Penerima Kuasa", "penerima");
      addInput("Alamat Pemberi", "alamat1");
      addInput("Alamat Penerima", "alamat2");
      addInput("Tujuan Kuasa", "tujuan");
      break;
    case "Surat Pernyataan":
      addInput("Isi Pernyataan", "isi");
      break;
    case "Surat Penawaran Kerja Sama":
      addInput("Nama Pengirim", "pengirim");
      addInput("Nama Penerima", "penerima");
      addInput("Jenis Kerja Sama", "jenis");
      addInput("Tujuan Kerja Sama", "tujuan");
      break;
    case "Surat Pemesanan Barang":
      addInput("Nama Pemesan", "pemesan");
      addInput("Nama Toko", "toko");
      addInput("Daftar Barang", "barang");
      addInput("Jumlah & Spesifikasi", "jumlah");
      addInput("Metode Pengiriman & Pembayaran", "metode");
      break;
    case "Surat Perjanjian Kerja":
      addInput("Pihak Pertama", "pihak1");
      addInput("Pihak Kedua", "pihak2");
      addInput("Jabatan", "jabatan");
      addInput("Hak dan Kewajiban", "hak");
      addInput("Lama Kontrak", "lama");
      break;
    case "Surat Keterangan":
      addInput("Jenis Keterangan", "jenis");
      addInput("Instansi Pemberi Keterangan", "instansi");
      break;
    case "Surat Pengantar":
      addInput("Jenis Dokumen yang Diantar", "dokumen");
      break;
    case "Surat Pernyataan Orang Tua":
      addInput("Nama Orang Tua", "ortu");
      addInput("Nama Anak", "anak");
      addInput("Konteks Pernyataan", "konteks");
      addInput("Tujuan", "tujuan");
      break;
  }
});

// Submit form
document.getElementById("suratForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const jenis = document.getElementById("jenisSurat").value;
  const nama = document.getElementById("nama").value;
  const tanggal = document.getElementById("tanggal").value;
  const kepada = document.getElementById("kepada").value;
  const ukuran = document.getElementById("ukuran").value;
  const hasilSurat = document.getElementById("hasilSurat");
  const btnCetak = document.getElementById("btnCetak");
  const btnDownload = document.getElementById("btnDownloadPDF");

  // Tampilkan loading
  document.getElementById("loading").style.display = "flex";
  hasilSurat.innerHTML = "";
  document.getElementById("hasilWrapper").style.display = "none";
  btnCetak.style.display = "none";
  btnDownload.style.display = "none";

  // Ambil input tambahan
  const inputTambahan = document.querySelectorAll("#inputTambahan input");
  const tambahan = {};
  inputTambahan.forEach(input => {
    tambahan[input.id] = input.value;
  });

  const versi = document.getElementById("versiSurat").value;
const data = {
  jenis,
  nama,
  tanggal,
  kepada,
  ukuran,
  versi,
  ...tambahan
};


  try {
    const response = await fetch("https://218e17ac-609c-4948-b316-f0d1e36ca716-00-2ohyvxmmhfw66.pike.replit.dev/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      hasilSurat.innerHTML = result.hasil.replace(/\n/g, "<br/>");
      document.getElementById("hasilWrapper").style.display = "block";
      btnCetak.style.display = "inline-block";
      btnDownload.style.display = "inline-block";
    } else {
      hasilSurat.textContent = "❌ Gagal membuat surat.";
    }
  } catch (err) {
    hasilSurat.textContent = "⚠️ Server tidak merespons.";
    console.error(err);
  }

  // Sembunyikan loading
  document.getElementById("loading").style.display = "none";
});
function getUkuranKertas(format) {
  switch (format) {
    case "A4":
      return { width: "21cm", height: "29.7cm", jsPDF: "a4" };
    case "F4":
      return { width: "21cm", height: "33cm", jsPDF: [21, 33] }; // custom ukuran cm
    case "Legal":
      return { width: "21.6cm", height: "35.6cm", jsPDF: [21.6, 35.6] };
    default:
      return { width: "21cm", height: "29.7cm", jsPDF: "a4" };
  }
}


// Cetak surat
document.getElementById("btnCetak").addEventListener("click", () => {
  const isiSurat = document.getElementById("hasilSurat").innerHTML;
  const ukuran = document.getElementById("ukuran").value;
  const winCetak = window.open("", "PrintWindow", "width=800,height=600");

  winCetak.document.write(`
    <html>
      <head>
        <title>Surat AI</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            font-size: 12pt;
            margin: 40px;
            white-space: pre-wrap;
          }

          @page {
            size: ${ukuran};
            margin: 2cm;
          }
        </style>
      </head>
      <body>
        ${isiSurat}
      </body>
    </html>
  `);

  winCetak.document.close();
  winCetak.focus();
  winCetak.print();
  winCetak.close();
});

// Download PDF
document.getElementById("btnDownloadPDF").addEventListener("click", () => {
  const isi = document.getElementById("hasilSurat").innerHTML;
  const ukuran = document.getElementById("ukuran").value;
  const dimensi = getUkuranKertas(ukuran);

  const clone = document.createElement("div");
  clone.innerHTML = isi;
  clone.style.fontFamily = "Arial, sans-serif";
  clone.style.fontSize = "12pt";
  clone.style.padding = "2cm";
  clone.style.width = dimensi.width + "cm";
  clone.style.minHeight = dimensi.height + "cm";
  clone.style.background = "white";
  clone.style.color = "#000";
  clone.style.lineHeight = "1.8";
  clone.style.position = "absolute";
  clone.style.top = "-9999px";

  document.body.appendChild(clone);

  const opt = {
    margin: 0,
    filename: `Surat_AI_${new Date().toISOString().slice(0, 10)}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'cm', format: [dimensi.width, dimensi.height], orientation: 'portrait' }
  };

  html2pdf().set(opt).from(clone).save().then(() => {
    document.body.removeChild(clone);
  });
});
// Download Word document
document.getElementById("btnDownloadWord").addEventListener("click", () => {
  const isi = document.getElementById("hasilSurat").innerHTML;
  const ukuran = document.getElementById("ukuran").value;

  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'>
      <style>
        @page {
          size: ${ukuran};
          margin: 2cm;
        }
        body {
          font-family: Arial, sans-serif;
          font-size: 12pt;
          line-height: 1.6;
          margin: 0;
          color: #000;
        }
        p {
          margin: 0 0 10px;
        }
      </style>
    </head>
    <body>${isi}</body>
    </html>`;

  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword'
  });

  const filename = `Surat_AI_${new Date().toISOString().slice(0, 10)}.doc`;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});




