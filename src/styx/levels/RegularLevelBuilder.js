var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.RegularLevelBuilder = class
{
	constructor(params)
	{
		this.game = game;
		this.level = null;
		this.params = params;
	}

	build()
	{
		this.level = new Styx.levels.Level;
		this.level.size = this.params.size;
		//this.level.map = this.createMap(this.params.size, 'wall');
		return this.level;
	}

}