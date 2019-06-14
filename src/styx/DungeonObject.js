var Styx = Styx || {};

Styx.DungeonObject = class extends Styx.GameObject
{
	constructor(category, id, params)
	{
		super(category, id, params);

		this.level = null;
		this.pos = params.pos || null;
	}

	distance(entity)
	{
		if (!this.pos || !entity.pos) {
			console.warn("Missing pos - cannot calculate distance.");
			return 999999;
		}

		return Math.max(Math.abs(this.pos.x - entity.pos.x), Math.abs(this.pos.y - entity.pos.y));
	}

	surroundings()
	{
		return [
			{x: this.pos.x - 1, y: this.pos.y - 1},
			{x: this.pos.x    , y: this.pos.y - 1},
			{x: this.pos.x + 1, y: this.pos.y - 1},
			{x: this.pos.x - 1, y: this.pos.y},
			{x: this.pos.x + 1, y: this.pos.y},
			{x: this.pos.x - 1, y: this.pos.y + 1},
			{x: this.pos.x    , y: this.pos.y + 1},
			{x: this.pos.x + 1, y: this.pos.y + 1}
		];
	}

	getTile()
	{
		if (!this.level || !this.pos) return null;
		return this.level.get(this.pos, 'tile');
	}

	damage(src, type, points) {}

	die()	{}

	isDestroyed()	{}	
}