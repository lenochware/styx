var Styx = Styx || {};

/**
 * Base class for game objects.
 * - It has link to game (class Game)
 * - It can save and restore itself in bundle
 * - It can get and set its attributes from/to dungeon database (class DungeonBase)
 * - It has name and description
 */
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

	addNum(attrib, num)
	{
		const attribMax = attrib+'Max';
		this[attrib] += num;
		if (attribMax in this && this[attrib] > this[attribMax]) {
			this[attrib] = this[attribMax];
		}
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
		if (this.id == tag) return true;
		const tags = this.params["tags"] || [];
		if (tags.includes(tag)) return true;
		return this.game.db.getAttrib(this.category, this.id, "tags").includes(tag);
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