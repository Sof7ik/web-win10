<?php

require_once './connection.php';

$bg = $_POST['bg'];
$userId = $_POST['idUser'];

try {
    $updateQuery = mysqli_query($link, 
    "UPDATE 
        `config` 
    SET 
       `bg`= '$bg' 
    WHERE `id_user` = $userId");
    echo json_encode('ага');
} catch (\Throwable $th) {
    echo json_encode(mysqli_error($link), JSON_UNESCAPED_UNICODE);
    throw $th;
}

?>