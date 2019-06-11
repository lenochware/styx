var Styx = Styx || {};

Styx.Entity = class
{
	constructor(category, id, params)
	{
		this.game = game;
		this.level = null;
		this.category = category;
		this.id = id;
		this.params = params;
		this.pos = params.pos || null;
	}

	getAttrib(attrib, defaultValue = null)
	{
		if (this.params[attrib]) return this.params[attrib];
		return this.game.get("dungeon-base").getAttrib(this.category, this.id, attrib) || defaultValue;
	}

	is(tag)
	{
		return (this.getAttrib("tags").indexOf(tag) != -1);
	}

	toString()
	{
		return this.name();
	}

	name()
	{
		return this.getAttrib("name");
	}

	shortDesc()
	{
		return this.getAttrib("name");
	}

	longDesc()
	{
		return this.getAttrib("desc");
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

	damage(attack) {}

	die()	{}

	isDestroyed()	{}	

	update() {}
}