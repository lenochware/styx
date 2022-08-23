var Styx = Styx || {};

/**
 * Top level game object.
 * Almost any other object has link this.game.
 * It contains top level methods, such as load/save/create game and link to current player.
 * It is service container.
 * It contains proxy methods for messaging and game event management.
 */
Styx.Game = class
{
	constructor()
	{
		this.services = {};
		this.data = {};
		this.time = 0;
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
		return $.getJSON('api/?id=' + (serverId || id))
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
			this.loadJson('dungeon-base', id),
			this.loadJson('level'),
		]).then(() => this.db = this.get('dungeon-base'));
	}

	getLevelBuilder(type)
	{
		switch (type) {
			case 'regular': return new Styx.levels.RegularLevelBuilder();
			case 'test': return new Styx.levels.TestLevelBuilder();
			default: throw new Error("Unknown level type.");
		}
	}

	createLevel(id)
	{
		var type = this.db.getAttrib('levels', id, 'type');
		var builder = this.getLevelBuilder(type);
		return builder.createLevel(id);
	}

  createLevelJson(id)
  {
    let json = game.data.level;
    let level = new Styx.levels.Level(id);
    level.size.assign(0 , 0, json.width, json.height);
    level.clear('floor');

    for (let i = 0; i < level.size.width * level.size.height; i++) {
      let tile = json.tiles[i];
      if (tile[0]) level.set(i, 'id', tile[0]);
      if (tile[1]) level.set(i, 'item', new Styx.items.Item({id: tile[1]}));
      if (tile[2]) level.set(i, 'actor', new Styx.actors.Monster({id: tile[2]}));
    }

    return level;
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

		currentLevel.remove(this.player);
		level.set(exitFound.pos, 'actor', this.player);
		wm.getPanel('level-map').level = level;
		
		console.log('changeLevel');
	}

	saveLevel(level)
	{
		var bundle = new Styx.Bundle();
		bundle.put('level', level);

		return $.post("api/?action=saveLevel&id=" + level.id, { 
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