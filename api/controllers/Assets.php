<?php 	

class Assets extends BaseController
{
	protected $baseDir = "../";
	protected $parts = ['tiles', 'items', 'actors', 'texts', 'actions', 'levels'];

	function index()
	{
		$this->restApi->outputJson([1,2]);
	}

	function get($id)
	{
	}
	
}

 ?>