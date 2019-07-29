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

	storeInBundle(bundle) {
		super.storeInBundle(bundle);
		bundle.put('_className_', 'Styx.actors.Monster');
		bundle.put('_args_', [this.params]);
	}

	restoreFromBundle(bundle) {
		super.restoreFromBundle(bundle);
	}	

	update()
	{
		if (this.isDestroyed()) return;

		if (this.params.insideWall) {
			this.wait();
			return;
		}
		
		while (this.time + this.tick < this.game.time)
		{
			if (this.conditions.is('Asleep')) {
				this.wait();

				if (this.distance(this.game.player) < 5 && Styx.Random.percent(20))	{
					this.conditions.remove('Asleep');
				}

				continue;
			}
			else if (this.conditions.is('Stunned')) {
				this.wait();
				continue;
			}

			this.walk() || this.attack() || this.wait();
		}

		super.update();
	}

	damage(src, type, points)
	{
		if (this.conditions.is('Asleep')) {
			this.conditions.remove('Asleep');
		}

		if (src && src.is('actor') && this.health < this.maxHealth / 3 && !this.conditions.is('Afraid')) {
			this.conditions.add('Afraid', 15);
		}

		super.damage(src, type, points);
	}

	walk()
	{
		if (this.is('unmovable')) return false;

		if (this.is('moving-random') && Styx.Random.percent(20)) {
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
		return this.move(Styx.Random.int(-1,1), Styx.Random.int(-1,1));
	}

	drop(item)
	{
		this.level.set(this.pos, 'item', item);
	}

	dropStuff()
	{
		var stuff = this.getAttrib('drop');
		if (!stuff) return;
		var chances = this.getAttrib('drop-chances');
		
		var id = Styx.Random.pick(stuff, chances);

		if (id == 'none') return;

		var categ = this.game.db.categoryOf(id);
		if (categ == 'tiles') {
			this.level.set(this.pos, 'id', id);
		}
		else if (categ == 'actors') {
			this.level.set(this.pos, 'actor', new Styx.actors.Monster({id: id}));
		}
		else if (categ == 'items') {
			var item = new Styx.items.Item({id: id});
			if (id == 'corpse') item.params.name = this.getAttrib('corpse');
			this.level.set(this.pos, 'item', item);
		}
	}

	die(src)
	{
		this.dropStuff();
		super.die(src);
	}

	wait()
	{
		this.spendTime();
	}

}