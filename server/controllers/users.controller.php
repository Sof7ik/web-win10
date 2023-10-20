<?php
require_once $_SERVER["DOCUMENT_ROOT"]."/server/services/users.service.php";
require_once $_SERVER["DOCUMENT_ROOT"]."/server/classes/Response.php";

function route($method, $urlData, $data, $dbh):void {
	$usersService = new UsersService($dbh);
	$response = new Response();
	
	// GET запрос
	if (mb_strtolower($method) === "post") {
		if (in_array("login", $urlData)) {
			// авторизация пользователя
			try {
				$userInfo = $usersService->getUserByLoginAndPassword($data["login"], $data["password"]);
				$response->setStatus(200)->send($userInfo);
			}
			catch (Throwable $e) {
				$response
					->setStatus(500)
					->send("Ошибка при получении информации о пользователе: {$e->getMessage()}");
			}
		}
	}
}