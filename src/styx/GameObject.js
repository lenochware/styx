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
	
	/**
	 * Create object category.id from dungeonBase. For example: actors.rat, items.bread, tiles.wall.
	 * Params are parameters for this object instance.
	 */	
	constructor(category, id, params)
	{
		/** @param {Styx.Game} Link to global game object. */
		this.game = game;

		this.category = category;
		this.id = id;

		/** @param {struct} */
		this.params = params;
	}

	/** Save game object into persistent storage. */
	storeInBundle(bundle) {
		bundle.put('_className_', 'Styx.GameObject');
		bundle.put('_args_', [this.category, this.id, this.params]);
	}

	/** Load game object from persistent storage. */
	restoreFromBundle(bundle) {
	}	

	/** Get attribute (such as 'name', 'health', 'armor') */
	getAttrib(attrib, defaultValue = null)
	{
		if (this.params[attrib] !== undefined) return this.params[attrib];
		var value = this.game.db.getAttrib(this.category, this.id, attrib);
		return (value !== undefined)? value : defaultValue;
	}

	/** Set attribute of current object. */
	setAttrib(attrib, value)
	{
		this.params[attrib] = value;
	}

	/** Add tag. @see is() */
	addTag(tag)
	{
		if (!this.params['tags']) this.params['tags'] = [];
		if (this.params['tags'].includes(tag)) return;
		this.params['tags'].push(tag);
	}

	/** Remove tag. @see is() */
	removeTag(tag)
	{
		if (!this.params['tags']) return;
		this.params['tags'] = _.without(this.params['tags'], tag);
	}

	/** 
	 * Check if object has tag "tag".
	 * Any object can have set of tags such as "flying", "smart", "wearable" etc.
	 * @param {string} tag
	 * @return {bool} yes/no
	 */
	is(tag)
	{
    return (this.id == tag || this.getAttrib("tags").includes(tag));
	}

	toString()
	{
		return this.name();
	}

	/** Return name of the object. */
	name()
	{
		return this.getAttrib("name");
	}

	/** Return short description. */
	shortDesc()
	{
		return this.getAttrib("name");
	}

	/** Return complete info about object. */
	longDesc()
	{
		return this.getAttrib("desc");
	}

	/** Update object state. Called on each game loop. */
	update() {}
}