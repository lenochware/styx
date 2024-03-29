
/* Styx */

//Styx.Random.setSeed(123);
var view = new Styx.Rectangle(0,0,80,30);
//var view = new Styx.Rectangle(0,0,40,20);

var game = new Styx.Game();

game.load().then(function() 
{
	
	const level = game.createLevelJson(game.data.level);
	
	const player = new Styx.actors.Player;
	player.params.name = 'Conan';

	//player.conditions.add('Poisoned', 5);
	//level.find('door').each(pos => level.set(pos, 'id', 'open_door'));

	let pos = game.data.level['player-pos'] || _.sample(level.find('floor'));

	game.setLevel(level, pos);

	// var c = level.size.getPoint('center');
	// level.set(c, 'actor', player);

	input = game.get('input-manager');
	input.init();

	wm = game.get('window-manager');
	wm.setPanel({id: "messages", container: "messages"});
	wm.setPanel({id: "sidebar", container: "sidebar"});
	wm.setPanel({id: "level-map", container: "level-map", level: level, view: view});

	game.on('render', updateView);

	wm.render();

	game.data.level = null;
});


function updateView()
{
	const player = game.player;
	const view = wm.getPanel('level-map').view;
	view.center(player.pos.x, player.pos.y).align(player.level.size);
}