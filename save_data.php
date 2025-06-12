<?php
$suhu = $_GET['suhu'] ?? '';
$kelembapan = $_GET['kelembapan'] ?? '';
$tanah = $_GET['tanah'] ?? '';

$data = array(
  "suhu" => $suhu,
  "kelembapan" => $kelembapan,
  "tanah" => $tanah
);

file_put_contents("data.json", json_encode($data));
echo "Data berhasil disimpan!";
?>
