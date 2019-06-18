
/* Styx */

var game = new Styx.Game();

game.load('world:first').then(function() 
{
	builder = game.get('level-builder');

	level = builder.build({ type: 'regular-level', size: new Styx.Rectangle(0,0,80,30) });
	
	player = game.get('player');
	player.params.name = 'Conan';

	//player.conditions.add('Poisoned', 5);

	//level.find('door').each(pos => level.set(pos, 'id', 'open_door'));
	//level.set(level.find('floor').sample().value(), 'actor', player);
	level.setXY(5, 5, 'actor', player);

	input = game.get('input-manager');
	input.init();

	wm = game.get('window-manager');
	wm.setPanel({id: "messages", container: "messages"});
	wm.setPanel({id: "sidebar", container: "sidebar"});
	wm.setPanel({id: "level-map", container: "level-map", level: level, view: new Styx.Rectangle(0,0,50,20)});

	wm.on('render', updateView);

	wm.render();
});


function updateView()
{
	var view = wm.getPanel('level-map').view;
	view.center(player.pos.x, player.pos.y).align(level.size);
}