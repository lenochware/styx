var Styx = Styx || {};

Styx.Game = class
{
	constructor()
	{
		this.services = {};
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
			default: throw `Unknown service ${className}`;
		}
	}

	message(m, cssClass = "msg")
	{
		this.get('window-manager').message(m, cssClass);
		console.log(m);
	}

	load(path)
	{
		return this.get('dungeon-base').load(path);
	}
}