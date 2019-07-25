<?php

$id = $_GET['id'];
$action = $_GET['action'];


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
		$jsonString = removeComments(file_get_contents("worlds/$name/$part.js"));
		$world[$part] = json_decode($jsonString);

		if (json_last_error() != JSON_ERROR_NONE) {
			die("worlds/$name/$part.js: " . json_last_error_msg());
		}
	}
	outputJson($world);
}
elseif($id == 'templates')
{
	$templates = [];
	foreach(glob('game/templates/*.html') as $path) {
		$templates[basename($path, ".html")] = file_get_contents($path);
	}

	outputJson($templates);
}
else {
	header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
	die("{error: \"Invalid loader id '$id'\"}");	
}


function outputJson(array $data)
{
  header('Content-Type: application/json; charset=utf-8');
  die(json_encode($data, JSON_UNESCAPED_UNICODE/*|JSON_PRETTY_PRINT*/));
}

function removeComments($s)
{
	return preg_replace('/\/\/.*/', '', $s);
}

?>