<?php

require './connection.php';

$username = $_POST['username'];
$pass = $_POST['password'];


if ($pass === '')
{
    // echo json_encode(
    //     $username . $pass . '; SELECT `users`.`id` AS "userId" FROM `users` WHERE `users`.`login` = \''. $username . '\' AND `users`.`password` = IS NULL');
    
    try {
        $user = mysqli_query($link, 
            "SELECT
            `users`.`id` AS 'userId'
            FROM
                `users`
            WHERE
                `users`.`login` = '$username' AND 
                `users`.`password` IS NULL
        ");
    } catch (\Throwable $error) {
        echo json_encode(mysqli_error($link), JSON_UNESCAPED_UNICODE);
    }
}
else {
    // echo json_encode(
    //     $username . $pass . '; SELECT `users`.`id` AS "userId" FROM `users` WHERE `users`.`login` = \''. $username . '\' AND `users`.`password` = \'' . $pass . '\'');
    try {
        $user = mysqli_query($link, 
            "SELECT
            `users`.`id` AS 'userId'
            FROM
                `users`
            WHERE
                `users`.`login` = '$username' AND 
                `users`.`password` = '$pass'
        ");
    } catch (\Throwable $error) {
        echo json_encode(mysqli_error($link), JSON_UNESCAPED_UNICODE);
    }
}

if ($user)
{
    $result = mysqli_fetch_assoc($user);
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
} 

?>