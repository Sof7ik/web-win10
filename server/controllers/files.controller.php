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
			try {
				$fileId = new MongoDB\BSON\ObjectId($data["id"]);
				$file = $fileService->getFileByID($fileId);
				$response->setStatus(200)->send($file);
			}
			catch (Exception $e) {
				$response->setStatus(500)->send("Неверный ID файла: {$data["id"]}, {$e->getMessage()}");
			}
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
				$data["created"] = new MongoDB\BSON\UTCDateTime(time() * 1000);
				
				try {
					// добавляем файл в БД
					$insertRes = $fileService->addFile($data);
					$insertedId = $insertRes->getInsertedId();
					
					$insertedFile = $fileService->getFileByID($insertedId);
					// отправляем ответ клиенту с указанием ID созданного элемента
					$response->setStatus(201)->send($insertedFile);
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