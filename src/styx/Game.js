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
		this.API_URL = '../../lgen/?r=api/';
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
			case 'input-manager': return new Styx.ui.InputManager;
			case 'renderer': return new Styx.ui.Renderer;
			//case 'player': return new Styx.actors.Player;
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

	loadJson(action, id = '')
	{
		return $.getJSON(this.API_URL + `${action}&id=${id}`)
		.done(data => {
			if (action == 'objects') action = 'dungeon-base';
			this.data[action] = data; console.log(`'${action} ${id}' loaded.`); 
		})
		.fail((jqxhr, textStatus, error) => { 
			console.warn(`Loading of '${action} ${id}' failed.`); 
			console.warn(error);
		});
	}

	load()
	{
		return Promise.all([
			this.loadJson('templates'),
			this.loadJson('objects'),
			this.loadJson('level', 'debug'),
		]).then(() => this.db = this.get('dungeon-base'));
	}

  createLevelJson(json)
  {
    let level = new Styx.levels.Level(json.id);
    level.size.assign(0 , 0, json.width, json.height);
    level.exits = json.exits;
    level.clear('floor');

    for (let i = 0; i < level.size.width * level.size.height; i++)
	{  
      const tile = json.tiles[i];

      if (tile[0]) {
		const t = level.get(i, 'tile');
		t.id = tile[0];

		if (tile[3]) {
			t.params = {...this._getParams(level, json, i, 3), ...this._getParams(level, json, i, 0)};
		}
		else {
			t.params = this._getParams(level, json, i, 0);
		}
	  }

      if (tile[1]) level.set(i, 'item', new Styx.items.Item(this._getParams(level, json, i, 1)));
      if (tile[2]) level.set(i, 'actor', new Styx.actors.Monster(this._getParams(level, json, i, 2)));
    }

    return level;
  }

  _getParams(level, json, i, attrib)
  {
	const id = json.tiles[i][attrib];
	let pos = [i % level.size.width, Math.floor(i / level.size.width)].join(',');
	if (!json.objects[pos]) return {id};
	let params = json.objects[pos][attrib] || {};
	params.id = id;
	return params;
  }

  changeLevel(id)
  {
	var wm = this.get('window-manager');
	var input = this.get('input-manager');
	var currentLevel = this.player.level;
	
	input.paused = true;
	this.loadJson('level', id).then(() => {
	  const level = this.createLevelJson(this.data.level);
	  this.data.level = null;

      var exitFound = null;
      
      for (let exit of _.values(level.exits)) {
        if (exit.levelId == currentLevel.id) {
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
      wm.render();
      
      input.paused = false;
      
      console.log('changeLevel');
    });
  }

	saveLevel(id)
	{
		var bundle = new Styx.Bundle();
		bundle.put('level', this.player.level);
		bundle.put('player', this.player);

		return $.post(this.API_URL + "save&id=" + id, { 
			data: bundle.getData()})
		.done(() => { console.log('Level saved.'); })
		.fail((jqxhr, textStatus, error) => { 
			console.warn('Save level failed.');
			console.warn(error); 
		});

	}

	loadLevel(id)
	{
		$.getJSON(this.API_URL + `load&id=${id}`)
		.done(data => {

			const wm = this.get('window-manager');
			const input = this.get('input-manager');

			input.paused = true;

			const bundle = new Styx.Bundle(data);
			const level = bundle.get('level');

			this.player = bundle.get('player');

			level.set(this.player.pos, 'actor', this.player);
			wm.getPanel('level-map').level = level;
			wm.render();
			
			input.paused = false;	  
			
			console.log('Level loaded.');
		})
		.fail((jqxhr, textStatus, error) => { 
			console.warn(`Load level failed.`); 
		});	
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