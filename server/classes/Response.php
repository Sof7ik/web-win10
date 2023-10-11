<?php

class Response
{
	private int $status;
	
	public function __construct()
	{
		$this->setStatus(200);;
	}
	
	public function getStatus(): int
	{
		return $this->status;
	}
	
	public function setStatus(int $status): Response
	{
		$this->status = $status;
		return $this;
	}
	
	public function send($data = []):void {
		echo json_encode($data,256);
		http_response_code($this->getStatus());
	}
}