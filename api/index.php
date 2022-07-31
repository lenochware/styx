<?php

require "libs/Loader.php";

$id = $_GET['id'] ?? '';
$action = $_GET['r'] ?? '';

$baseDir = "../";

$loader = new Loader;


if ($action == 'saveLevel') {
	file_put_contents($baseDir."worlds/first/save/$id.json", $_POST['data']);
	return;
}


//worlds/first/test.js

if (strpos($id, 'world:') === 0) {
	list($temp, $name) = explode(":", $id);
	$worldParts = ['tiles', 'items', 'actors', 'texts', 'actions', 'levels'];

	$world = [];

	foreach ($worldParts as $part) {
		$world[$part] = $loader->loadJsonFile($baseDir."worlds/$name/$part.js");

		if (json_last_error() != JSON_ERROR_NONE) {
			die("worlds/$name/$part.js: " . json_last_error_msg());
		}
	}
	$loader->outputJson($world);
}
elseif($id == 'templates')
{
	$templates = [];
	foreach(glob($baseDir.'game/templates/*.html') as $path) {
		$templates[basename($path, ".html")] = file_get_contents($path);
	}

	$loader->outputJson($templates);
}
else {
	header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
	die("{error: \"Invalid loader id '$id'\"}");	
}

?>