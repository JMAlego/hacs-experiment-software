<?php
  if(isset($_GET["data"]) && isset($_GET["code"]) && $_GET["code"] == "d9923118dd0861486b3569ba080486a4")
  $currentFile = file_get_contents("data/data.json");
  $json = json_decode($currentFile, true);
  $newData = json_decode($_GET["data"], true);
  array_push($json, $newData)
  $newFile = json_encode($json);
  file_put_contents("data/data.json", $newFile);
?>