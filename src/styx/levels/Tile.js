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
			var attack = this.pickAttack();
			if (attack) actor.damage(this, attack.type, attack.points);
		}
		
		if (this.id == 'door') {
			this.id = 'open_door';
			actor.spendTime(); //TODO: It does two turns at once (walk+open door).
		}
	};
	
	leave(actor) {};

	pickAttackId()
	{
		var attacks = this.getAttrib('attacks');
		return attacks? attacks[0] : null;
	}

	getAction(id)
	{
		return game.db.getObject('actions', id);
	}

	pickAttack()
	{
		var id = this.pickAttackId();
		if (!id) return null;
		var a = this.getAction(id);
		a.type = id;
		return a;
	}

	getVisible()
	{
		var obj = null;
		
		if (this.actor && !this.actor.isPlayer()) obj = this.actor;
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