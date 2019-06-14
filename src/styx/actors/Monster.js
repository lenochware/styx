var Styx = Styx || {};
Styx.actors = Styx.actors || {};

Styx.actors.Monster = class extends Styx.actors.Actor
{

	constructor(params)
	{
		super(params);

		if (!this.is('neutral')) {
			this.target = this.game.player;
		}

		if (this.is('slow')) {
			this.tick = 14;
		}
		else if(this.is('fast')) {
			this.tick = 7;			
		}

		if (!this.is('awake')) {
			this.conditions.add('Asleep', Infinity);
		}
	}

	update()
	{
		while (this.time + this.tick < this.game.time)
		{
			if (this.conditions.is('Asleep')) {
				this.wait();

				if (this.distance(this.game.player) < 5 && this.game.random.percent(20))	{
					this.conditions.remove('Asleep');
				}

				continue;
			}

			this.walk() || this.attack() || this.wait();
		}
	}

	damage(src, type, points)
	{
		super.damage(src, type, points);

		if (src && src.is('actor') && this.health < this.maxHealth / 3) {
			this.conditions.add('Afraid', 15);
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
		var afraid = this.conditions.is('Afraid');

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

	die(src)
	{
		var name = this.getAttrib('bones');
		if (name && this.game.random.percent(50)) {
			var bones = new Styx.items.Item({id: "bones", actor: this, name: name});
			this.drop(bones);
		}

		super.die(src);
	}

	wait()
	{
		this.spendTime();
	}

}