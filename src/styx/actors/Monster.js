var Styx = Styx || {};
Styx.actors = Styx.actors || {};

Styx.actors.Monster = class extends Styx.actors.Actor
{

	constructor(params)
	{
		super(params);

		if (!this.is('neutral')) {
			this.target = this.game.get('player');
		}

		if (this.is('slow')) {
			this.tick = 14;
		}
		else if(this.is('fast')) {
			this.tick = 7;			
		}
	}

	update()
	{
		while (this.time + this.tick < this.game.time) {
			if (this.game.random.percent(20)) {
				this.randomWalk();
			}
			else {
				this.simpleWalk() || this.wait();
			}
		}
	}

	damage(attacker, dmg)
	{
		super.damage(attacker, dmg);

		if (this.health < this.maxHealth / 3) {
			this.condition('afraid', 50);
		}
	}

	simpleWalk()
	{
		if (!this.target) return;

		var pos = this.pos;
		var afraid = this.condition('afraid');

		//debugger;

		for (pos of this.surroundings()) {
			let tile = this.level.get(pos, 'tile');
			if (!this.canOccupy(tile)) continue;

			if (afraid) {
				if (tile.distance(this.target) > this.distance(this.target)) break;
			}
			else {
				if (tile.distance(this.target) < this.distance(this.target)) break;				
			}
		}

		return this.move(pos.x - this.pos.x, pos.y - this.pos.y);
	}

	randomWalk()
	{
		return this.move(_.random(-1,1), _.random(-1,1));
	}

	drop(item)
	{
		this.level.set(this.pos, 'item', item);
	}

	die(attacker)
	{
		var name = this.getAttrib('bones');
		if (name && this.game.random.percent(50)) {
			var bones = new Styx.items.Item({id: "bones", actor: this, name: name});
			this.drop(bones);
		}

		super.die(attacker);
	}

	wait()
	{
		this.spendTime();
	}

}