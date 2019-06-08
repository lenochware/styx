
/**
- lepsi door management (potrebne tile.pos?) devices, use?
- string.format colors, a/an?
- wm: nahr. prime odkazy: #game-container atd.
- GameObject, DungeonObject
- null.pos err in attack - multiple targets?
- rozdelit test.js na rooms.js, tiles.js atd.
- prejmenovat .map na .tiles (.cells?)
- odstranit width,height z rooms defs
- RoomBuilder, map meta (roominfo, first etc.)
*/

var game = new Styx.Game();

game.load('basic-types').then(function() 
{
	game.get('dungeon-base');
	builder = game.get('level-builder');

	level = builder.build({ type: 'regular-level', size: new Styx.Rectangle(0,0,50,20) });
	
	player = game.get('player', {name: 'Conan'});

	level.find('door').each(pos => level.set(pos, 'id', 'open_door'));
	
	level.set(level.find('floor').sample().value(), 'actor', player);

	input = game.get('input-manager');
	input.init();

	wm = game.get('window-manager');
	wm.setPanel({id: "messages", container: "messages"});
	wm.setPanel({id: "sidebar", container: "sidebar"});
	wm.setPanel({id: "level-map", container: "level-map", level: level, view: new Styx.Rectangle(0,0,50,20)});
	wm.render();
});