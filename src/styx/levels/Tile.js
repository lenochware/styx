var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.Tile = class
{
	constructor(id, actor = null, item = null)
	{
		this.id = id;
		this.actor = actor;
		this.item = item;
	}

	getAttrib(attrib, defaultValue = null)
	{
		return game.get("dungeon-base").getAttrib('tiles', this.id, attrib) || defaultValue;
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

	enter(actor)
	{
		if (this.is('water')) {
			var dmg = this.getDamage(actor, 'drowning');
			actor.damage(this, dmg);
		}
	};
	
	leave(actor) {};

	getDamage(target, type)
	{
		if (!this.is('water')) return null;

		var dmg = {
			actor: this,
			type: type,
			points: 1, 
			message: "{1} [is] drowning!"
		};

		return dmg;
	}

}