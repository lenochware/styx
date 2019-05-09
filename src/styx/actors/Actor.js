var Styx = Styx || {};
Styx.actors = Styx.actors || {};

Styx.actors.Actor = class extends Styx.Entity
{
	constructor(params)
	{
		super('actors', params.id, params);
		this.health = this.getAttrib('health', 10);
		this.target = null;
	}

	walk(dx, dy)
	{
		if (dx == 0 && dy == 0) return;

		var tile = this.level.get(this.pos.x + dx, this.pos.y + dy, 'tile');
		if (tile.is('wall')) return;

		if (tile.actor) {
			this.attack(tile.actor);
			return;
		}

		this.level.set(this.pos.x + dx, this.pos.y + dy, 'actor', this);
	}


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
			this.game.message(`You hit ${this.target.name()}.`);
		}
		else {
			this.game.message(this.name() + " hits " + this.target.name() + ".");
		}

		this.target.damage({actor: this, strength: this.getAttrib('attack')});
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
			this.game.message("You die.", "msg msg-danger");
		}
		else {
			this.game.message(`You defeated ${this.name()}.`, "msg msg-hilite");
		}

		this.health = 0;
		this.level.remove(this);
	}

	search()
	{
		this.game.message('Searching...');
	}


	isDestroyed()
	{
		return (this.health <= 0);
	}	
}