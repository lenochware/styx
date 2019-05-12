<?php

$id = $_GET['id'];

switch ($id) {
	case 'dungeon-base':
		die(file_get_contents('worlds/first/test.js'));
		break;

	case 'templates':
		$templates = [];
		foreach(glob('game/templates/*.html') as $path) {
			$templates[basename($path, ".html")] = file_get_contents($path);
		}
 
		die(json_encode($templates));
		break;
	
	default:
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		die("{error: \"Invalid loader id '$id'\"}");
		break;
}

?>