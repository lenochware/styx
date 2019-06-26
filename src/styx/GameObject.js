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
		if (this.params[attrib] !== undefined) return this.params[attrib];
		var value = this.game.db.getAttrib(this.category, this.id, attrib);
		return (value !== undefined)? value : defaultValue;
	}

	setAttrib(attrib, value)
	{
		this.params[attrib] = value;
	}

	addTag(tag)	{}

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