
/**
- lepsi door management (potrebne tile.pos?) devices, use?
- string.format colors, a/an?
- wm: nahr. prime odkazy: #game-container atd.
- Tile: zvazit podedeni z Entity
- null.pos err in attack - multiple targets?
- initTileInfo, initCommands nejak do inputu?
*/

var game = new Styx.Game();

game.load('basic-types').then(function() 
{
	game.get('dungeon-base');
	builder = game.get('level-builder');

	level = builder.build({ type: 'regular-level', size: new Styx.Rectangle(0,0,50,20) });
	
	player = game.get('player', {name: 'Conan'});
	
	level.setXY(5, 5, 'actor', player);

	input = game.get('input-manager');
	input.init();

	wm = game.get('window-manager');
	wm.setPanel({id: "messages", container: "messages"});
	wm.setPanel({id: "sidebar", container: "sidebar"});
	wm.setPanel({id: "level-map", container: "level-map", level: level, view: new Styx.Rectangle(0,0,50,20)});
	wm.render();
});