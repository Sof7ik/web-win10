<?php

require_once './connection.php';

try {
    echo json_encode($users = mysqli_fetch_all(mysqli_query($link, "SELECT `login` AS `name` FROM `users`")), JSON_UNESCAPED_UNICODE);
} catch (\Throwable $th) {
    echo json_encode(mysqli_error($link), JSON_UNESCAPED_UNICODE);
    throw $th;
}
?>