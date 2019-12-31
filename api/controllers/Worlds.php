<?php 	

class Worlds extends BaseController
{
	protected $baseDir = "../";
	protected $parts = ['tiles', 'items', 'actors', 'texts', 'actions', 'levels'];

	function index()
	{
		$this->restApi->outputJson([1,2]);
	}

	function show($name)
	{
		$world = [];

		foreach ($this->parts as $part) {
			$world[$part] = $this->loader->loadJsonFile($this->baseDir."worlds/$name/$part.js");
		}

		$this->restApi->outputJson($world);
	}

}

 ?>