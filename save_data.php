<?php
// Ambil data dari ESP32
$suhu = $_GET['suhu'] ?? '';
$kelembapan = $_GET['kelembapan'] ?? '';
$tanah = $_GET['tanah'] ?? '';

// Susun sebagai array
$data = array(
  "suhu" => $suhu,
  "kelembapan" => $kelembapan,
  "tanah" => $tanah
);

// Ubah ke format JSON dan simpan ke file
file_put_contents("data.json", json_encode($data));

echo "Data berhasil disimpan!";
?>
