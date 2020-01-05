<?php 	

class Saves extends BaseController
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

	function create()
	{
	}

	function update($id)
	{
	}

	function delete($id)
	{
	}
	
}

 ?>