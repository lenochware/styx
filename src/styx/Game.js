var Styx = Styx || {};

Styx.Game = class
{
	constructor()
	{
		this.dbase = this.get('dungeon-base');
	}

	get(className, options)
	{
		switch (className) {
			case 'level-builder': return new Styx.levels.LevelBuilder;
			case 'input-manager': return new Styx.ui.InputManager;
			case 'renderer': return new Styx.ui.Renderer;
			case 'player': return new Styx.actors.Player(options);
			case 'monster': return new Styx.actors.Monster(options);
			case 'dungeon-base': return new Styx.DungeonBase;
		}

		return null;
	}

	message(msg, type = null)
	{
		console.log(msg);
	}

	load(path)
	{
		return this.dbase.load(path);
	}
}