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

		if (!this.canOccupy(tile)) {
			if (tile.is('blocking')) tile.touch(this);
			return false;
		}

		if (tile.actor) {
			if (this.isPlayer() || this.target == tile.actor || this.is('aggresive')) {
				return this.attack(tile.actor);
			}
			else {
				return false;
			}
		}

		this.leave(this.pos);
		this.level.setXY(this.pos.x + dx, this.pos.y + dy, 'actor', this);
		this.enter(this.pos);

		this.spendTime();
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
	
		if (this.isNear()) {
			if (a.failed) {
				//this.game.message('failed-' + a.failed, "msg-info", this, target);
			}
			else {
				this.game.message('attack-' + a.type, "msg-info", this, this.target);
				if (a.special == 'multiple') {
					this.game.message('attack-' + a.type, "msg-info", this, this.target); //hack
				}
			};
		}

		if (a.points) {
			this.target.damage(this, a.type, a.points);
		}
		
		this.spendTime();

		return true;
	}

	canAttack(target)
	{
		return (target && this.distance(target) <= 1);
	}

	defense(attack)
	{
		if (attack.id == 'drowning') {
			if (this.is("flying") || this.is("swimmer")) attack.points = 0;
			return attack;
		}

		attack.points = Math.ceil(1/(1 + this.armor/50) * attack.points);
		return attack;
	}

	damage(src, type, points)
	{
		this.health -= points;

		if (src && src.is('actor')) {
			this.target = src;
		}

		var action = this.getAction(type);

		if (action.tags.includes('poison')) {
			this.conditions.add('Poisoned', 10);
		}
		else if (action.tags.includes('stun')) {
			this.conditions.add('Stunned', 4);			
		}

		if (this.health <= 0) this.die(src);
	}

	canOccupy(tile)
	{
		if (this.is('ghost') && !tile.is('inpenetrable')) return true;
		return !tile.is('blocking');
	}

	isVisible()
	{
		if (this.params.insideWall) return false;
		if (this.isPlayer() || this.distance(this.game.player) == 1) return true;
		if (this.conditions.is('Invisible')) return false;
		var tile = this.level.get(this.pos, 'tile');
		if (tile.is('hiding_mon') && Styx.Random.bet(0.7)) return false;
		return true;
	}

	findPath(pos)
	{
		if (!this.pos) return [];
		if (!this._isPassable(pos.x, pos.y)) return [];

		var path = [];
		var astar = new ROT.Path.AStar(pos.x, pos.y, (x,y) => this._isPassable(x,y));
		astar.compute(this.pos.x, this.pos.y, (x, y) => path.push({x:x, y:y}));
		return path;
	}

	_isPassable(x, y) {
		var tile = this.level.getXY(x, y, 'tile');
		if (tile.actor && tile.actor != this) return false;
		return (this.canOccupy(tile) || tile.is('door'));
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
		this.conditions.removeAll();

		for (let a of this.level.actors) {
			if (a && a.target === this) a.target = null;
		}

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

	spendTime(time = null)
	{
		this.tileEffect();
		this.time += time || this.tick;
	}

	update()
	{
		this.conditions.update();
	}

	tileEffect()
	{
		this.level.get(this.pos, 'tile').applyEffect(this);		
	}

	wait()
	{
		this.spendTime();
	}
	
}