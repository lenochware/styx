<?php

$id = $_GET['id'];

switch ($id) {
	case 'dungeon-base':
		die(file_get_contents('worlds/first/test.js'));
		break;

	case 'templates':
		die(json_encode(['inventory' => file_get_contents('game/templates/inventory.html')]));
		break;
	
	default:
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		die("{error: \"Invalid loader id '$id'\"}");
		break;
}

?>