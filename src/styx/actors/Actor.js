var Styx = Styx || {};
Styx.actors = Styx.actors || {};

Styx.actors.Actor = class extends Styx.DungeonObject
{
	constructor(params)
	{
		super('actors', params.id, params);
		this.health = this.getAttrib('health', 10);
		this.armor = this.getAttrib('armor', 0);
		this.maxHealth = this.health;
		this.tick = 10;
		this.target = null;
		this.conditions = new Styx.actors.ConditionGroup(this);
		this.time = 0;
	}

	storeInBundle(bundle) {
		super.storeInBundle(bundle);
		bundle.put('_className_', 'Styx.actors.Actor');
		bundle.put('_args_', [this.params]);
		bundle.put('health', this.health);
		//target?
		//conditions?
		//time?
	}

	restoreFromBundle(bundle) {
		super.restoreFromBundle(bundle);
		this.health = bundle.get('health');
	}	

	getConditions()
	{
		return this.conditions.list();
	}

	move(dx, dy)
	{
		if (dx == 0 && dy == 0) return false;

		var tile = this.level.getXY(this.pos.x + dx, this.pos.y + dy, 'tile');

		if (!this.canOccupy(tile)) return false;

		if (tile.actor) {
			return this.attack(tile.actor);
		}

		this.spendTime();

		this.leave(this.pos);
		this.level.setXY(this.pos.x + dx, this.pos.y + dy, 'actor', this);
		this.enter(this.pos);
		return true;
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

		if (!this.canAttack(this.target)) {
			return false;
		}

		var a = this.pickAttack();
		a = this.target.defense(a);
	
		this.target.damage(this, a.type, a.points);
		this.spendTime();

		if (!a.points) {
			this.game.message("{0} shrug[s] off attack.", "msg-info", this.target);
		}

		if (this.target.isDestroyed()) this.target = null;
		return true;
	}

	canAttack(target)
	{
		return (target && this.distance(target) <= 1);
	}

	defense(attack)
	{
		attack.points = Math.ceil(1/(1 + this.armor/50) * attack.points);
		return attack;
	}

	damage(src, type, points)
	{
		if (!type) return;

		this.health -= points;

		var isNear = (this.distance(this.game.player) < 6);

		if (src) {
			if (src.is('actor')) this.target = src;
			if (isNear) this.game.message('attack-' + type, "msg-info", src, this);
		}

		if (points && this.getAction(type).tags.includes('poison')) {
			this.conditions.add('Poisoned', 10);
		}

		if (this.health <= 0) this.die(src);
	}

	canOccupy(tile)
	{
		if (this.is('ghost') && !tile.is('inpenetrable')) return true;
		if (tile.is('blocking')) return false;
		return true;
	}

	isVisible()
	{
		if (this.isPlayer() || this.distance(this.game.player) == 1) return true;
		if (this.conditions.is('Invisible')) return false;
		var tile = this.level.get(this.pos, 'tile');
		if (tile.is('hiding_mon') && this.game.random.bet(0.7)) return false;
		return true;
	}

	die(src)
	{
		if (this.isPlayer()) {
			this.game.message("You die.", "msg-danger");
		}
		else if (src && src.is('player')) {
			this.game.message(this.getAttrib("death-message", "You defeated {0}."), "msg-hilite", this);
			src.addExperience(this);
		}
		else {
			this.game.message("{0} dies.", "msg-info", this);
		}

		var tile = this.getTile();
		if (tile.is('floor')) {
			this.level.set(tile.pos, 'id', 'blood_floor');
		}

		this.health = 0;

		if (!this.isPlayer()) {
			this.level.remove(this);
		}

	}

	shortDesc()
	{
		var info = "";

		// var hltPerc = this.health / this.maxHealth;
		// if (hltPerc < 0.2) info = " (badly wounded)";
		// else if (hltPerc < 0.8) info = " (somewhat wounded)";
		// else info = "";

		if (this.conditions.is('Afraid')) info = " (afraid)";

		return super.name()+info;
	}

	isDestroyed()
	{
		return (this.health <= 0);
	}

	isPlayer()
	{
		return false;
	}

	spendTime()
	{
		this.conditions.update();
		this.time += this.tick;
	}
}