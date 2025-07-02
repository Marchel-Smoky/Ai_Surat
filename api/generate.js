const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ganti dengan kunci aslimu
});

router.post("/", async (req, res) => {
  const { jenis, nama, tanggal, kepada, ukuran, versi, ...tambahan } = req.body;

  // Susun informasi tambahan
  let tambahanText = Object.entries(tambahan)
    .map(([key, value]) => `${key.replace(/([A-Z])/g, " $1")}: ${value}`)
    .join(", ");

  // === 💡 Prompt berdasarkan versi surat ===
  let prompt;
  switch (versi) {
    case "pro":
      prompt = `Buatkan surat ${jenis} menggunakan gaya bahasa profesional dan kompleks, struktur formal, dan penyusunan kata yang elegan. Sertakan nama: ${nama}, tanggal: ${tanggal}, ditujukan kepada: ${kepada}. Tambahan: ${tambahanText}.`;
      break;
    case "menengah":
      prompt = `Buatkan surat ${jenis} menggunakan bahasa formal ringan dan mudah dimengerti. Sertakan nama: ${nama}, tanggal: ${tanggal}, kepada: ${kepada}, dan rincian: ${tambahanText}.`;
      break;
    default:
      prompt = `Tolong buatkan surat ${jenis} dengan bahasa sederhana. Nama: ${nama}, Tanggal: ${tanggal}, Kepada: ${kepada}, Info tambahan: ${tambahanText}.`;
      break;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 800,
    });

    const hasil = response.choices[0].message.content;

    return res.json({ success: true, hasil });
  } catch (err) {
    console.error("❌ Error AI:", err);
    return res.status(500).json({ success: false, message: "Gagal memproses surat AI" });
  }
});

module.exports = router;
