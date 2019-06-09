var Styx = Styx || {};

Styx.Game = class
{
	constructor()
	{
		this.services = {};
		this.data = {};
		this.time = 0;
		this.random = this.get('random');
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
			case 'player': return new Styx.actors.Player(options);
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

	hint(m, ...args)
	{
		if (args) {
			m = m.format(args);
		}

		this.get('window-manager').txtQuickMessage = m;
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
		]);
	}
}