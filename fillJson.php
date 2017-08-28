<?php
  $data = $_POST["sendData"];
  file_put_contents("humans.json", json_encode($data));
 ?>
