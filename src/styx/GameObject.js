var Styx = Styx || {};

Styx.GameObject = class
{
	constructor(category, id, params)
	{
		this.game = game;
		this.category = category;
		this.id = id;
		this.params = params;
	}

	getAttrib(attrib, defaultValue = null)
	{
		if (this.params[attrib]) return this.params[attrib];
		return this.game.db.getAttrib(this.category, this.id, attrib) || defaultValue;
	}

	is(tag)
	{
    return (this.id == tag || this.getAttrib("tags").includes(tag));
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

	update() {}
}