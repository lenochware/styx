var Styx = Styx || {};
Styx.actors = Styx.actors || {};

/**
 * Any monster is instance of this class.
 * In update() it can do various monster activities - attack(), walk(), dropStuff()...
 */
Styx.actors.Monster = class extends Styx.actors.Actor
{

	constructor(params)
	{
		super(params);

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

			if (this.isDestroyed()) return; //hack: skip dead by environment
			
			this.walk() || this.attack() || this.wait();
		}

		super.update();
	}

	damage(src, type, points)
	{
		if (this.conditions.is('Asleep')) {
			this.conditions.remove('Asleep');
		}

		if (
			src && src.is('actor') 
			&& this.health < this.maxHealth / 3 
			&& !this.is('fearless')
			&& !this.conditions.is('Afraid')
		) {
			this.conditions.add('Afraid', 15);
		}

		super.damage(src, type, points);
	}

	attack(target = null)
	{
		if (!this.target && !this.is('neutral')) {
			this.target = this.game.player;
		}

		super.attack(target);
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

	canOccupy(tile)
	{
		if (!super.canOccupy(tile)) return false;
		if (this.is('smart') && tile.isDangerous(this)) return false;
		return true;
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

		var obj = this.level.spawn(this.pos, id);
		if (!obj /* pos occupied */) return;

		if (id == 'corpse') {
			var corpse = this.getAttrib('corpse');
			obj.params.name = _.isArray(corpse)? _.sample(corpse) : corpse;
		}
	}

	die(src)
	{
		this.dropStuff();
		super.die(src);
	}

}