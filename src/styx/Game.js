var Styx = Styx || {};

Styx.Game = class
{
	constructor()
	{
		this.services = {};
		this.data = {};
		this.time = 0;
		this.random = this.get('random');
		this.db = null;
		this.player = null;
	}

	get(className, options)
	{
		if (this.services[className]) {
			return this.services[className];
		}

		this.services[className] = this.make(className, options);
		return this.services[className];
	}

	make(className, options)
	{
		switch (className) {
			case 'level-builder': return new Styx.levels.LevelBuilder;
			case 'input-manager': return new Styx.ui.InputManager;
			case 'renderer': return new Styx.ui.Renderer;
			case 'player': return new Styx.actors.Player;
			case 'dungeon-base': return new Styx.DungeonBase;
			case 'window-manager': return new Styx.ui.WindowManager;
			case 'random': return new Styx.utils.Random;
			case 'helpers': return new Styx.utils.TemplateHelpers;
			default: throw `Unknown service ${className}`;
		}
	}

	message(m, cssClass = "msg-info", ...args)
	{
		this.get('window-manager').message(m, cssClass, args);
	}

	info(m, ...args)
	{
		this.get('window-manager').info(m, args);
	}

	debugLog(msg)
	{
		console.log(msg);
	}

	loadJson(id, serverId = null)
	{
		return $.getJSON('loader.php?id=' + (serverId || id))
		.done(data => {this.data[id] = data; console.log(`'${id}' loaded.`); })
		.fail((jqxhr, textStatus, error) => { 
			console.warn(`Loading of '${id}' failed.`); 
			console.warn(error); 
		});
	}

	load(id)
	{
		return Promise.all([
			this.loadJson('templates'),
			this.loadJson('dungeon-base', id)
		]).then(() => this.db = this.get('dungeon-base'));
	}

	getLevelBuilder(type)
	{
		switch (type) {
			case 'regular': return new Styx.levels.RegularLevelBuilder();
			case 'arena': return new Styx.levels.ArenaLevelBuilder();
			case 'test': return new Styx.levels.TestLevelBuilder();
			case 'random': return new Styx.levels.TestLevelBuilder();
			default: throw new Error("Unknown level type.");
		}
	}

	createLevel(id)
	{
		var level = new Styx.levels.Level(id);
		var builder = this.getLevelBuilder(level.getAttrib('type'));
		builder.level = level;
		return builder.createLevel();
	}

	changeLevel(id)
	{
		var wm = this.get('window-manager');
		var currentLevel = this.player.level;
		var level = this.createLevel(id);
		var exitFound = null;
		
		for (let exit of _.values(level.exits)) {
			if (exit.id == currentLevel.id) {
				exitFound = exit;
				break;
			}
		}

		if (!exitFound) {
			console.warn('Missing exit in the level.');
			return;
		}

		level.set(exitFound.pos, 'actor', this.player);
		wm.getPanel('level-map').level = level;
		
		console.log('changeLevel');
	}

	saveLevel(level)
	{
		var bundle = new Styx.Bundle();
		bundle.put('level', level);

		return $.post("loader.php?action=saveLevel&id=" + level.id, { 
			data: bundle.getData()})
		.done(() => { console.log('Level saved.'); })
		.fail((jqxhr, textStatus, error) => { 
			console.warn('Save level failed.');
			console.warn(error); 
		});

	}

	loadLevel(id)
	{

	}

	on(eventName, callback, params = {})
	{
		var f = callback;

		if (params.run == 'once') {
			f = function(e) {
				document.removeEventListener(e.type, f);
				return callback(e);
			}
		}
		
		document.addEventListener(eventName, f);
	}

	trigger(eventName)
	{
		var event = new Event(eventName);
		document.dispatchEvent(event);
	}

}