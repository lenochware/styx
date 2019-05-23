var Styx = Styx || {};
Styx.actors = Styx.actors || {};

Styx.actors.Monster = class extends Styx.actors.Actor
{
	update()
	{
		while (this.time + this.tick < this.game.time) {
			//this.walk(_.random(-1,1), _.random(-1,1));
			this.simpleWalk() || this.wait();
		}
	}

	damage(attacker, dmg)
	{
		super.damage(attacker, dmg);

		if (this.health < this.maxHealth / 3) {
			this.condition('afraid', 10);
		}
	}

	simpleWalk()
	{
		if (!this.target) return;

		var pos = this.pos;

		//debugger;

		for (pos of this.surroundings()) {
			let tile = this.level.get(pos, 'tile');
			if (!this.canOccupy(tile)) continue;
			if (tile.distance(this.target) < this.distance(this.target)) {
				break;
			}
		}

		return this.move(pos.x - this.pos.x, pos.y - this.pos.y);
	}

	drop(item)
	{
		this.level.set(this.pos, 'item', item);
	}

	wait()
	{
		this.spendTime();
	}

}