<?php

/** @var $mongoDbHandler MongoDB\Client  */

class FilesService {
	private MongoDB\Collection $db_collection;
	public function __construct($mongoDbHandler)
	{
		$this->db_collection = $mongoDbHandler->selectCollection("windows", "files");
	}
	
	public function getDbCollection():MongoDB\Collection
	{
		return $this->db_collection;
	}
	
	public function addFile($data):MongoDB\InsertOneResult {
		return $this->getDbCollection()->insertOne($data);
	}
	
	public function getAllFiles():array {
		return $this->getDbCollection()->find()->toArray();
	}
	
	public function getFileByID(MongoDB\BSON\ObjectId $fileId):object {
		return $this->getDbCollection()->findOne(["_id" => $fileId]);
	}
}