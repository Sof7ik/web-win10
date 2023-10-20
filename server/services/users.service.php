<?php

class UsersService {
	private MongoDB\Collection $db_collection;
	public function __construct($mongoDbHandler)
	{
		$this->db_collection = $mongoDbHandler->selectCollection("windows", "users");
	}
	
	private function getDbCollection():MongoDB\Collection
	{
		return $this->db_collection;
	}
	
	public function getUserByID(MongoDB\BSON\ObjectId $userId):object {
		return $this->getDbCollection()->findOne([
			"_id" => $userId,
		],);
	}
	
	public function getUserByLoginAndPassword(string $login, string $password):object {
		return $this->getDbCollection()->findOne(
			[
				"login" => $login,
				"password" => $password,
			],
			[
				"projection" => [
					"login" => 0,
					"password" => 0
				]
			]
		);
	}
}