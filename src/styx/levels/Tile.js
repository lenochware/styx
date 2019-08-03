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

	toString()
	{
		return this.name();
	}

	enter(actor) {};
	leave(actor) {};

	applyEffect(actor)
	{
		var attack = this.pickAttack();

		if (attack) {
			attack = actor.defense(attack);
		  if (attack.points) {
				if (actor.isNear()) actor.game.message('attack-' + attack.type, "msg-info", actor);
				actor.damage(this, attack.type, attack.points);
			}
		}
	}

	isDangerous(actor)
	{
		var attack = this.pickAttack();
		if (!attack) return false;
		attack = actor.defense(attack);
		return (attack.points > 0);
	}

	touch(actor)
	{
		if (this.id == 'door') {
			this.id = 'open_door';
			actor.spendTime();
		}

		if (!actor.isPlayer()) return;

		if (this.is('diggable')) {
			actor.game.message("You dig into {0}", "msg-info", this);
			if (Styx.Random.bet(.2)) {
				actor.game.message("You destroyed {0}", "msg-info", this);
				this.id = 'floor';
				if (this.actor || this.item) {
					if (this.actor) this.actor.params.insideWall = false;
					actor.game.message("You found something!", "msg-info");
				}
			}
		}
	}

	pickAttackId()
	{
		var attacks = this.getAttrib('attacks');
		return attacks? attacks[0] : null;
	}

	getAction(id)
	{
		var a = game.db.getObject('actions', id);
		return {'id': a.id, 'points': a.points, 'tags': a.tags};
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
		
		if (this.actor && !this.actor.isPlayer() && !this.actor.params.insideWall) obj = this.actor;
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