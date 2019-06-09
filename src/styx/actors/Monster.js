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

		if (!this.is('awake')) {
			this.condition('asleep', Infinity);
		}
	}

	update()
	{
		while (this.time + this.tick < this.game.time)
		{
			if (this.condition('asleep')) {
				this.wait();

				if (this.distance(this.game.get('player')) < 5 && this.game.random.percent(20)) {
					this.game.message("{0} wake up!", "msg-info", this.name());
					this.condition('asleep', 0);	
				}

				continue;
			}

			this.walk() || this.attack() || this.wait();
		}
	}

	damage(attacker, dmg)
	{
		super.damage(attacker, dmg);

		if (this.health < this.maxHealth / 3) {
			this.condition('afraid', 50);
		}
	}

	walk()
	{
		if (this.is('unmovable')) return false;

		if (this.is('moving-random') && this.game.random.percent(20)) {
			return this.randomWalk();
		}
		else {
			return this.simpleWalk() || this.randomWalk();
		}		
	}

	simpleWalk()
	{
		if (!this.target) return;

		var pos = this.pos;
		var afraid = this.condition('afraid');

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