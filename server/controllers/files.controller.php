<?php
require_once $_SERVER["DOCUMENT_ROOT"]."/server/services/files.service.php";
require_once $_SERVER["DOCUMENT_ROOT"]."/server/classes/Response.php";

function route ($method, $urlData, $data, $dbh):void {
	$fileService = new FilesService($dbh);
	$response = new Response();
	
	// GET запрос
	if (mb_strtolower($method) === "get") {
		if (empty($data)) {
			// получаем все файлы
			try {
				$files = $fileService->getAllFiles();
				$response->setStatus(200)->send($files);
			}
			catch (Exception $e) {
				$response->setStatus(500)->send($e->getMessage());
			}
		}
		else if ($data["id"]) {
			// получаем файл по ID
			echo json_encode("получаем файл по ID", 256);
			$response->setStatus(200)->send();
		}
	}
	
	// POST запрос
	if (mb_strtolower($method) === "post") {
		if (empty($data)) {
			$response->setStatus(400)->send("Нет данных в запросе");
		}
		
		// добавляем файл
		if (!empty($data["name"]) && !empty($data["type"])) {
			// txt файл
			if ($data["type"] === "txt") {
				// если у Txt файла нет внутренного содержимого, то добавляем пустую строку
				if (empty($data["content"])) {
					$data["content"] = "";
				}
				
				try {
					// добавляем файл в БД
					$insertRes = $fileService->addFile($data);
					// отправляем ответ клиенту с указанием ID созданного элемента
					$response->setStatus(201)->send($insertRes->getInsertedId());
				} catch (Exception $e) {
					$response->setStatus(500)->send($e->getMessage());
				}
			}
			// папка
			else if ($data["type"] === "folder") {
			
			}
		}
		else {
			$response->setStatus(400)->send("Не передано имя файла или тип");
		}
	}
	
	// TODO PUT запрос
	if (mb_strtolower($method) === "put") {
	
	}
	
	// TODO PATCH запрос
	if (mb_strtolower($method) === "patch") {
	
	}
	
	// TODO DELETE запрос
	if (mb_strtolower($method) === "delete") {
	
	}
}