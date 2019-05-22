var Styx = Styx || {};
Styx.actors = Styx.actors || {};

Styx.actors.Actor = class extends Styx.Entity
{
	constructor(params)
	{
		super('actors', params.id, params);
		this.health = this.getAttrib('health', 10);
		this.maxHealth = this.health;
		this.tick = 1;
		this.target = null;
		this.conditions = {};
		this.time = 0;
	}

	condition(id, duration = null)
	{
		if (!this.conditions[id]) {
			this.conditions[id] = 0;
		}

		if (duration !== null) {
			this.conditions[id] = this.game.time + duration;
		}

		return (this.conditions[id] > this.game.time);
	}

	walk(dx, dy)
	{
		if (dx == 0 && dy == 0) return;

		var tile = this.level.getXY(this.pos.x + dx, this.pos.y + dy, 'tile');

		if (!this.canOccupy(tile)) return;

		if (tile.actor) {
			this.attack(tile.actor);
			return;
		}

		this.spendTime();

		this.leave(this.pos);
		this.level.setXY(this.pos.x + dx, this.pos.y + dy, 'actor', this);
		this.enter(this.pos);
	}

	enter(pos)
	{
		this.level.get(pos, 'tile').enter(this);
	};

	leave(pos)
	{
		this.level.get(pos, 'tile').leave(this);		
	};

	attack(target = null)
	{
		if (target) {
			this.target = target;
		}

		if (!this.target || !this.distance(this.target) > 1) {
			console.log('Cannot reach target.');
			return;
		}

		var dmg = this.getDamage(this.target, 'hit');
		this.target.damage(this, dmg);
	
		this.spendTime();
		//this.game.flashMsg(this.target.pos.px, this.target.pos.py, '-1', "msg-danger");

		if (this.target.isDestroyed()) this.target = null;
	}

	damage(attacker, dmg)
	{
		if (!dmg) return;

		if (attacker.is('actor')) {
			this.target = attacker;
		}

		this.health -= dmg.points;

		this.game.message(dmg.message, "msg-info", attacker.name(), this.name());

		if (this.health <= 0) this.die(attacker);
	}

	getDamage(target, type)
	{
		var dmg = {
			actor: this,
			type: type,
			points: this.getAttrib('attack'), 
			message: "{0} hit[s] {1}."
		};

		return dmg;
	}

	canOccupy(tile)
	{
		if (this.is('ghost') && !tile.is('inpenetrable')) return true;
		if (tile.is('wall')) return false;
		return true;
	}

	die(attacker)
	{
		if (this.is('player')) {
			this.game.message("You die.", "msg-danger");
		}
		else if (attacker.is('player')) {
			this.game.message("You defeated {0}.", "msg-hilite", this.name());
		}
		else {
			this.game.message("{0} dies.", "msg-info", this.name());			
		}

		this.health = 0;
		this.level.remove(this);
	}

	shortDesc()
	{
		var info = "";

		// var hltPerc = this.health / this.maxHealth;
		// if (hltPerc < 0.2) info = " (badly wounded)";
		// else if (hltPerc < 0.8) info = " (somewhat wounded)";
		// else info = "";

		if (this.condition('afraid')) info = "(afraid)";

		return super.name()+info;
	}

	isDestroyed()
	{
		return (this.health <= 0);
	}

	spendTime()
	{
		this.time += this.tick;
	}
}