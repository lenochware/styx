var Styx = Styx || {};
Styx.levels = Styx.levels || {};

/**
 * Tile (grid) of the level map - any level has (width * height) tiles.
 * It can contain one item and actor (monster).
 * It represent terrain such as floor or wall.
 * It can be dangerous or has special features.
 */
Styx.levels.Tile = class extends Styx.GameObject
{
	constructor(x, y, id)
	{
		super('tiles', id, {});
		this.pos = {x:x, y:y};
		this.actor = null;
		this.item = null;
	}

	applyEffect(actor)
	{
		var attack = this.pickAttack();

		if (attack) {
			attack = actor.defense(attack);
		  if (attack.points) {
				if (actor.isNear()) this.game.message('attack-' + attack.type, "msg-info", actor);
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

	isSticking(actor)
	{
		if (!this.is('sticky')) return false;
		return Styx.Random.bet(.6);
	}

	touch(actor)
	{
		if (this.id == 'door') {
			this.id = 'open_door';
			actor.spendTime();
		}

		if (!actor.isPlayer()) return;

		if (this.is('diggable')) {
			this.game.message("You dig into {0}", "msg-info", this);
			if (Styx.Random.bet(.2)) {
				this.game.message("You destroyed {0}", "msg-info", this);
				this.id = 'floor';
				var buried = this.getAttrib('buried');
				if (buried) {
					if (!_.isArray(buried)) buried = [buried];
					_.each(buried, id => actor.level.spawn(this.pos, id));
					this.game.message("You found something!", "msg-info");
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

	surroundings()
	{
		return [
			{x: this.pos.x - 1, y: this.pos.y - 1},
			{x: this.pos.x    , y: this.pos.y - 1},
			{x: this.pos.x + 1, y: this.pos.y - 1},
			{x: this.pos.x - 1, y: this.pos.y},
			{x: this.pos.x + 1, y: this.pos.y},
			{x: this.pos.x - 1, y: this.pos.y + 1},
			{x: this.pos.x    , y: this.pos.y + 1},
			{x: this.pos.x + 1, y: this.pos.y + 1}
		];
	}
}