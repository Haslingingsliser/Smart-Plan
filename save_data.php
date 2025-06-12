<?php
$dataFile = 'data.json';
date_default_timezone_set("Asia/Jakarta");

$newData = array(
  "timestamp" => date("Y-m-d H:i:s"),
  "suhu" => $_GET['suhu'],
  "kelembapan" => $_GET['kelembapan'],
  "tanah" => $_GET['tanah']
);

if (file_exists($dataFile)) {
  $json = file_get_contents($dataFile);
  $data = json_decode($json, true);
} else {
  $data = [];
}

$data[] = $newData;

if (count($data) > 20) {
  $data = array_slice($data, -20);
}

file_put_contents($dataFile, json_encode($data));
echo "Data saved";
?>
