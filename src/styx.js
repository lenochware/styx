
/**
- wm: nahr. primy odkaz na #game-container, zasilat commandy objektu, ktery ma focus, player commands pres wm?
- wm.render('ui') vykresli vsechny panely (pridat renderPanel)
- prepsat level.get set na praci s pos - ne x,y (nebo kombinovane? [x,y] or pos?)
- level.get vracet perma_wall kdyz je mimo level, game.load.done(...)
- pouzivat string.format a ne `${sss}`
*/

var game = new Styx.Game();

game.load('basic-types').then(function() 
{
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
	wm.render('sidebar', {container: "sidebar"});

})

function gameLoop(event)
{
	var command = input.getCommand(event); //keybindings file

	input.handle(command);

	level.update();
	renderer.render(level, 'level-map', {view: new Styx.Rectangle(0,0,50,20)});
	wm.render('messages', {container: "messages"});
	wm.render('sidebar', {container: "sidebar"});
	
}