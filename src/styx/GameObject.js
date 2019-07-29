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

	storeInBundle(bundle) {
		bundle.put('_className_', 'Styx.GameObject');
		bundle.put('_args_', [this.category, this.id, this.params]);
	}

	restoreFromBundle(bundle) {
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

	addTag(tag)
	{
		if (!this.params['tags']) this.params['tags'] = [];
		if (this.params['tags'].includes(tag)) return;
		this.params['tags'].push(tag);
	}

	removeTag(tag)
	{
		if (!this.params['tags']) return;
		this.params['tags'] = _.without(this.params['tags'], tag);
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