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
		if (!actor.is("flying")) {
			var a = this.getAttack();
			if (a) actor.damage(this, a.type, a.points);
		}
		
		if (this.id == 'door') {
			this.id = 'open_door';
			actor.spendTime(); //TODO: It does two turns at once (walk+open door).
		}
	};
	
	leave(actor) {};

	getAttack()
	{
		return this.getAttrib('attack');
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