<?php

require_once './connection.php';

$type = $_POST['fileType'];
$filename = $_POST['fileName'];
$idUser = $_POST['id'];

$id = mysqli_fetch_assoc(mysqli_query($link, "SELECT `id` FROM `files` ORDER BY `id` DESC LIMIT 1"));
$newId = $id['id']+1;

$insert = mysqli_query($link, 
"INSERT INTO `files`
    (`id`, `type`, `filename`, `file_msg`) 
VALUES 
    ($newId, $type, '$filename', NULL)");

$insert1 = mysqli_query($link, 
"INSERT INTO `user-file`
    (`id_user`, `id_file`) 
VALUES 
    ($idUser, $newId)");

if ($insert && $insert1)
{
    echo json_encode('Файл создан', JSON_UNESCAPED_UNICODE);
} else 
{
    echo json_encode(mysqli_error($link), JSON_UNESCAPED_UNICODE);
}
?>