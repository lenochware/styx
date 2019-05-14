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
		return this.game.get("dungeon-base").getAttrib(this.category, this.id, attrib) || defaultValue;
	}

	is(tag)
	{
		return (this.getAttrib("tags").indexOf(tag) != -1);
	}

	name()
	{
		return this.getAttrib("name");
	}

	shortDesc()
	{
		return this.getAttrib("desc");
	}

	distance(entity)
	{
		if (!this.pos || !entity.pos) return 999999;
		return Math.max(Math.abs(this.pos.x - entity.pos.x), Math.abs(this.pos.y - entity.pos.y));
	}

	getTile()
	{
		if (!this.level || !this.pos) return null;
		return this.level.get(this.pos.x, this.pos.y, 'tile');
	}


	update() {}
}