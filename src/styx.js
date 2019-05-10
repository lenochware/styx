
/**
- prepsat level.get set na praci s pos - ne x,y (nebo kombinovane? [x,y] or pos?)
- level.get vracet perma_wall kdyz je mimo level, game.load.done(...)
x render renderovat spravne @ atd.
- pouzivat string.format a ne `${sss}`
x zalozit directory styx/actors, styx/items (a kam triggery, trapy atd.?)
- zalozit spolecneho predka pro vsechny objekty dungeonu? entity -> actor -> creature -> (monster, item, player)
*/

var game = new Styx.Game();

async function init()
{
	await game.load('basic-types');


	game.get('dungeon-base');
	builder = game.get('level-builder');

	level = builder.build({ size: new Styx.Rectangle(0,0,50,20) });

	player = game.get('player', {name: 'Conan'});
	
	level.set(5, 5, 'actor', player);

	input = game.get('input-manager');
	input.on('keypress', gameLoop);

	renderer = game.get('renderer');
	renderer.render(level, 'level-map', {view: new Styx.Rectangle(0,0,50,20)});

	wm = game.get('window-manager');
	wm.render('messages', {container: "messages"});
	wm.render('side-bar', {container: "side-bar"});
	
};

init();

function gameLoop(event)
{
	var command = input.getCommand(event); //keybindings file

	if (command.category == 'wm-command') {
		wm.execute(command);
		return;
	}

	if (command.category != 'player-command') return;

	player.execute(command);

	level.update();
	renderer.render(level, 'level-map', {view: new Styx.Rectangle(0,0,50,20)});
	wm.render('messages', {container: "messages"});
	wm.render('side-bar', {container: "side-bar"});
	
}