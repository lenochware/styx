
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

	level = builder.build({ size: new Styx.Rectangle(0,0,50,20) });

	player = game.get('player', {name: 'Conan'});
	
	level.setXY(5, 5, 'actor', player);

	input = game.get('input-manager');
	input.on('keypress', gameLoop);

	renderer = game.get('renderer');
	renderer.render(level, 'level-map', {view: new Styx.Rectangle(0,0,50,20)});

	wm = game.get('window-manager');
	wm.add({id: "messages", container: "messages"});
	wm.add({id: "sidebar", container: "sidebar"});

})

function gameLoop(event)
{
	var command = input.getCommand(event); //keybindings file

	input.handle(command);

	level.update();
	renderer.render(level, 'level-map', {view: new Styx.Rectangle(0,0,50,20)});
	wm.render();	
}