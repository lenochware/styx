<?php

$id = $_GET['id'];
$action = $_GET['action'];

$loader = new Loader;


if ($action == 'saveLevel') {
	file_put_contents("worlds/first/save/$id.json", $_POST['data']);
	return;
}


//worlds/first/test.js

if (strpos($id, 'world:') === 0) {
	list($temp, $name) = explode(":", $id);
	$worldParts = ['tiles', 'items', 'actors', 'rooms', 'texts', 'actions', 'levels', 'groups'];

	$world = [];

	foreach ($worldParts as $part) {
		$world[$part] = $loader->loadJsonFile("worlds/$name/$part.js");

		if (json_last_error() != JSON_ERROR_NONE) {
			die("worlds/$name/$part.js: " . json_last_error_msg());
		}
	}
	$loader->outputJson($world);
}
elseif($id == 'templates')
{
	$templates = [];
	foreach(glob('game/templates/*.html') as $path) {
		$templates[basename($path, ".html")] = file_get_contents($path);
	}

	$loader->outputJson($templates);
}
else {
	header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
	die("{error: \"Invalid loader id '$id'\"}");	
}


class Loader {

	protected $json;


	function outputJson(array $data)
	{
	  header('Content-Type: application/json; charset=utf-8');
	  die(json_encode($data, JSON_UNESCAPED_UNICODE/*|JSON_PRETTY_PRINT*/));
	}

	function removeComments($s)
	{
		return preg_replace('/\/\/.*/', '', $s);
	}

	function getLookup(array $list)
	{
		$tags = [];
		foreach ($list as $id) {
			$tags[$id] = true;
		}

		return $tags;
	}

	function loadJsonFile($path)
	{
		$s = $this->removeComments(file_get_contents($path));
		$this->json = json_decode($s, true);

		foreach ($this->json as $k => $obj) {
			if (!is_array($obj) or !$obj['extends']) continue;
			$this->extendObject($k, $obj['extends']);
		}

		foreach ($this->json as $k => $obj) {
			if (!is_array($obj)) continue;
			$this->json[$k]['id'] = $k;
			
			// if ($this->json[$k]['tags']) {
			// 	$this->json[$k]['tags_lookup'] = $this->getLookup($this->json[$k]['tags']);
			// }

		}

		return $this->json;
	}

	function extendObject($id, $parentId, $level = 1)
	{
		if ($this->json[$parentId]['extends'] and $level < 50) {
			$this->extendObject($parentId, $this->json[$parentId]['extends'], ++$level);
		}

		$this->json[$id] = $this->json[$id] + $this->json[$parentId];
	}

}


?>