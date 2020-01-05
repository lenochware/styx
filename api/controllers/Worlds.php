<?php 	

class Worlds extends BaseController
{
	protected $dir = "../data/worlds";
	protected $parts = ['tiles', 'items', 'actors', 'texts', 'actions', 'levels'];

	function index()
	{
		$this->restApi->outputJson($this->getSubDirs($this->dir));
	}

	function get($id)
	{
		$world = [];

		foreach ($this->parts as $part) {
			$world[$part] = $this->loader->loadJsonFile($this->dir."/$id/$part.js");
		}

		$this->restApi->outputJson($world);
	}


	protected function getSubDirs($dir)
	{
		return array_map('basename', glob($dir.'/*', GLOB_ONLYDIR));
	}

}

 ?>