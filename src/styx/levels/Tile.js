var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.Tile = class extends Styx.Entity
{
	constructor(x, y, params)
	{
		super('tiles', params.id, {pos: {x: x, y: y}});
		//this.level = 
		this.actor = params.actor;
		this.item = params.item;
	}

}