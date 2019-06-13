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
		return game.db.getAttrib('tiles', this.id, attrib) || defaultValue;
	}

	is(tag)
	{
		return (this.id == tag || this.getAttrib("tags").includes(tag));
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
		if (!actor.is("flying") && !actor.is("swimmer")) {
			var id = this.getAttack();
			if (id) actor.damage(this, id, 1);
		}
		
		if (this.id == 'door') {
			this.id = 'open_door';
			actor.spendTime(); //TODO: It does two turns at once (walk+open door).
		}
	};
	
	leave(actor) {};

	getAttack()
	{
		var attacks = this.getAttrib('attacks');
		return attacks? attacks[0] : null;
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