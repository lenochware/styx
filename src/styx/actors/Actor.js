var Styx = Styx || {};
Styx.actors = Styx.actors || {};

Styx.actors.Actor = class extends Styx.Entity
{
	constructor(params)
	{
		super('actors', params.id, params);
		this.health = this.getAttrib('health', 10);
		this.tick = 1;
		this.target = null;
		this.time = 0;
	}

	walk(dx, dy)
	{
		if (dx == 0 && dy == 0) return;

		var tile = this.level.getXY(this.pos.x + dx, this.pos.y + dy, 'tile');
		if (tile.is('wall')) return;

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

		if (this.is('player')) {
			this.game.message("You hit {0}.", "msg-info", this.target.name());
		}
		else {
			this.game.message("{0} hits {1}.", "msg-info", this.name(), this.target.name());
		}

		this.target.damage({actor: this, strength: this.getAttrib('attack')});
		this.spendTime();
		//this.game.flashMsg(this.target.pos.px, this.target.pos.py, '-1', "msg-danger");

		if (this.target.isDestroyed()) this.target = null;
	}

	damage(attack)
	{
		this.health -= attack.strength;
		this.target = attack.actor;
		if (this.health <= 0) this.die();
	}

	die()
	{
		if (this.is('player')) {
			this.game.message("You die.", "msg-danger");
		}
		else {
			this.game.message("You defeated {0}.", "msg-hilite", this.name());
		}

		this.health = 0;
		this.level.remove(this);
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