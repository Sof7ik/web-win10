<?php
require ('connection.php');

$userId = $_GET['id'];

$query = mysqli_query($link, 
"SELECT 
    `files`.`id` AS 'fileId', 
    `files`.`filename`, 
    `types`.`type_name`, 
    `files`.`file_msg`
FROM 
    `users`,
    `files`, 
    `types`, 
    `user-file` 
WHERE 
    `files`.`type` = `types`.`id` AND
    `files`.`id` = `user-file`.`id_file` AND
    `user-file`.`id_user` = `users`.`id` AND
    `users`.`id` = $userId
");

$query_result = mysqli_fetch_all($query, MYSQLI_ASSOC);

echo json_encode($query_result, JSON_UNESCAPED_UNICODE);
?>