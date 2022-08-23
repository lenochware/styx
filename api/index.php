<?php

require "libs/Loader.php";

$id = input_get('id');
$action = input_get('r');

$baseDir = "../";
$loader = new Loader($baseDir);

switch ($action)
{	
	case 'world':
		$worldParts = ['tiles', 'items', 'actors', 'texts', 'actions', 'levels'];

		$world = [];

		foreach ($worldParts as $part) {
			$world[$part] = $loader->loadJsonFile($baseDir."worlds/first/$part.js");

			if (json_last_error() != JSON_ERROR_NONE) {
				die("worlds/$name/$part.js: " . json_last_error_msg());
			}
		}
		$loader->outputJson($world);
	break;

	case 'templates':
		$templates = [];
		foreach(glob($baseDir.'game/templates/*.html') as $path) {
			$templates[basename($path, ".html")] = file_get_contents($path);
		}

		$loader->outputJson($templates);
	break;

	case 'load':
		die($loader->load($id));
	break;

	case 'save':
		$loader->save($id, $_POST['data']);
	break;

	case 'enter':
		//$json = file_get_contents('../data/lgen.json');
		$json = $loader->load($id) ?: $loader->create($id);
		header('Content-Type: application/json; charset=utf-8');
		die($json);
	break;

	default:
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		$loader->outputJson(['error' => 'Unknown api call.']);
	break;

}

function input_get($key)
{
	return preg_replace('/[^\w]+/','-', $_GET[$key] ?? '');
}

// --- END ---

?>