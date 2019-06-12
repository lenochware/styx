var Styx = Styx || {};
Styx.actors = Styx.actors || {};

Styx.actors.Actor = class extends Styx.Entity
{
	constructor(params)
	{
		super('actors', params.id, params);
		this.health = this.getAttrib('health', 10);
		this.maxHealth = this.health;
		this.tick = 10;
		this.target = null;
		this.conditions = new Styx.actors.ConditionGroup(this);
		this.time = 0;
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
			//console.log('Cannot reach target.');
			return false;
		}

		var id = this.getAttack();
		this.target.damage(this, id, 1);
	
		this.spendTime();

		if (this.target.isDestroyed()) this.target = null;
		return true;
	}

	canAttack(target)
	{
		return (target && this.distance(target) <= 1);
	}

	getAttack()
	{
		return _.sample(this.getAttrib('attacks'));
	}

	getAction(id)
	{
		return this.game.db.getObject('actions', id);
	}

	damage(src, type, points)
	{
		if (!type) return;

		this.health -= points;

		if (this.getAction(type).tags.includes('poison')) {
			this.conditions.add('Poisoned', 10);
		}

		if (src) {
			if (src.is('actor')) this.target = src;
			this.game.message('attack-' + type, "msg-info", src, this);
		}

		this.game.get('window-manager').warMessage(src, type, points);

		if (this.health <= 0) this.die(src);
	}

	canOccupy(tile)
	{
		if (this.is('ghost') && !tile.is('inpenetrable')) return true;
		if (tile.is('wall')) return false;
		return true;
	}

	die(src)
	{
		if (this.is('player')) {
			this.game.message("You die.", "msg-danger");
		}
		else if (src && src.is('player')) {
			this.game.message("You defeated {0}.", "msg-hilite", this.name());
		}
		else {
			this.game.message("{0} dies.", "msg-info", this.name());			
		}

		var tile = this.getTile();
		if (tile.is('floor')) {
			this.level.set(tile.pos, 'id', 'blood_floor');
		}

		this.health = 0;

		if (!this.is('player')) {
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

	spendTime()
	{
		this.conditions.update();
		this.time += this.tick;
	}
}