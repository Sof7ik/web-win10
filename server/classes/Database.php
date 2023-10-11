<?php

class DatabaseSQL
{
	private PDO $connection;
	
	public function __construct($dbname, $host, $user, $pass)
	{
		try {
			$this->connection = new PDO("mysql:dbname=$dbname;host=$host", $user, $pass);
		} catch (PDOException $e) {
			print "Error!: " . $e->getMessage();
			die();
		}
	}
	
	public function __destruct()
	{
		// TODO: Implement __destruct() method.
	}
	
	public function getConnection(): PDO
	{
		return $this->connection;
	}
	
	private function executeQuery($queryString) {
		$prepareRes = $this->connection->prepare($queryString);
		
		if ($prepareRes) {
			$prepareRes->execute();
			return $prepareRes;
		}
		else {
			print "prepare error";
			return null;
		}
	}
	
	public function select(
		string $table,
		array $fields = ["*"],
		array $conditions = [],
		string $orderBy = "",
		string $orderDirection = ""
	) :?array {
		$query = "SELECT ";
		
		// добавляем поля в запрос
		// если указано одно поле
		if (!empty($fields) && count($fields) === 1) {
			// если указан массив из одного элемента [*]
			if ($fields[0] === "*") {
				$query .= $fields[0];
			}
			// если указано одно поле, но не *
			else {
				$query .= "`$fields[0]`";
			}
			
		}
		// если не указаны поля
		else if (gettype($fields) === "array" && empty($fields)) {
			$fields = $query .= "*";
		}
		// если указано несколько полей
		else {
			foreach ($fields as $key => $field) {
				// последнее поле для выбора
				if ($key === count($fields)-1) {
					$query .= "`$field`";
				}
				// любое не последнее поле для выбора
				else {
					$query .= "`$field`,";
				}
			}
		}
		
		// добавляем таблицу в запрос
		$query .= " FROM `$table`";
		
		// добавляем условия в запрос
		if (!empty($conditions)) {
			$query .= " WHERE ";
			
			foreach ($conditions as $key => $condition) {
				$query .= "$condition";
				if ($key !== count($conditions)-1) {
					$query .= " AND ";
				}
			}
		}
		
		if (!empty($orderBy)) {
			$query .= " ORDER BY `$orderBy`";
		}
		
		if (!empty($orderDirection)) {
			$query .= " $orderDirection";
		}
		
		// конец строки
		$query .= ";";
		
		$DBresult = self::executeQuery($query);

		if ($DBresult == null) return null;

		return $DBresult->fetchAll(PDO::FETCH_ASSOC);
	}
}