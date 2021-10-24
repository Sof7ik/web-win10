<?php

require './connection.php';

$idUserToFindConfig = $_GET['id'];

try {
    $configQuery = mysqli_query($link, "SELECT * FROM  `config` WHERE `config`.`id_user` = $idUserToFindConfig");
    $config = mysqli_fetch_assoc($configQuery);
    echo json_encode($config, JSON_UNESCAPED_UNICODE);
} catch (\Throwable $th) {
    echo json_encode(mysqli_error($link), JSON_UNESCAPED_UNICODE);
}

?>