var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.Tile = class
{
	constructor(x, y, id)
	{
		this.id = id;
		this.pos = {x:x, y:y};
		this.actor = null;
		this.item = null;
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
		return this.getAttrib("name");
	}

	longDesc()
	{
		return this.getAttrib("desc");
	}

	enter(actor)
	{
		if (this.is('water') && !actor.is("flying")) {
			var dmg = this.getDamage(actor, 'drowning');
			actor.damage(this, dmg);
		}
		else if (this.id == 'door') {
			this.id = 'open_door';
			actor.spendTime(); //TODO: It does two turns at once (walk+open door).
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

	getVisible()
	{
		var obj = null;
		
		if (this.actor && !this.actor.is('player')) obj = this.actor;
		else if (this.is("hiding")) obj = this;
		else if (this.item) obj = this.item;
		else obj = this;

		return obj;
	}

	distance(entity)
	{
		if (!this.pos || !entity.pos) {
			console.warn("Missing pos - cannot calculate distance.");
			return 999999;
		}

		return Math.max(Math.abs(this.pos.x - entity.pos.x), Math.abs(this.pos.y - entity.pos.y));
	}	

}