<?php

// https://webdevkin.ru/posts/backend/restful-servis-na-nativnom-php
// https://blog-programmista.ru/post/159-primer-kak-sozdat-prostoe-rest-api-na-php.html

//require_once $_SERVER["DOCUMENT_ROOT"]."/server/classes/Database.php";

require_once "./vendor/autoload.php";
require_once $_SERVER["DOCUMENT_ROOT"]."/server/configs/mongoconfig.php";
require_once $_SERVER["DOCUMENT_ROOT"]."/server/classes/Response.php";

use MongoDB\Client;
use MongoDB\Driver\ServerApi;
$mongoConfig = getMongoConfig();
$response = new Response();

// Получение данных из тела запроса
function getFormData($method):array
{
	// GET или POST: данные возвращаем как есть
	if ($method === 'GET') {
		$getArray = $_GET;
		unset($getArray["query"]);
		return $getArray;
	}
	if ($method === 'POST') return $_POST;
	
	// PUT, PATCH или DELETE
	$data = array();
	$exploded = explode('&', file_get_contents('php://input'));
	
	foreach($exploded as $pair) {
		$item = explode('=', $pair);
		if (count($item) == 2) {
			$data[urldecode($item[0])] = urldecode($item[1]);
		}
	}
	
	return $data;
}

$method = $_SERVER['REQUEST_METHOD'];

// Получаем данные из тела запроса
$formData = getFormData($method);

// Разбираем url
$url = (isset($_GET['query'])) ? $_GET['query'] : '';
$url = rtrim($url, '/');
$urls = explode('/', $url);

// Определяем контроллер и url data
$controller = $urls[0];
$urlData = array_slice($urls, 1);

// подключаемся к БД
$uri = "mongodb+srv://{$mongoConfig['user']}:{$mongoConfig['password']}@{$mongoConfig['url']}/?retryWrites=true&w=majority";
// Specify Stable API version 1
$apiVersion = new ServerApi(ServerApi::V1);

// Create a new client and connect to the server
$DB_client = new MongoDB\Client($uri, [], ['serverApi' => $apiVersion]);
try {
	// Send a ping to confirm a successful connection
	$DB_client->selectDatabase('windows')->command(['ping' => 1]);
//	 echo "Pinged your deployment. You successfully connected to MongoDB!\n";
} catch (Exception $e) {
	printf($e->getMessage());
}

if (!$controller) {
	$response->setStatus(404)->send("Нет такого URL");
}
else {
	// Подключаем файл-роутер и запускаем главную функцию
	include_once "./controllers/$controller.controller.php";
	route($method, $urlData, $formData, $DB_client);
}

