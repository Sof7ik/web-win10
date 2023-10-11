<?php

class BasicService
{
	private MongoDB\Collection $db_collection;
	public function __construct($mongoDbHandler, $DB_name, $collectionName)
	{
		$this->db_collection = $mongoDbHandler->selectCollection($DB_name, $collectionName);
	}
	
	/**
	 * @return mixed
	 */
	public function getDbCollection():MongoDB\Collection
	{
		return $this->db_collection;
	}
}