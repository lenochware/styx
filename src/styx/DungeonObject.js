var Styx = Styx || {};

Styx.DungeonObject = class extends Styx.GameObject
{
	constructor(category, id, params)
	{
		super(category, id, params);

		this.level = null;
		this.pos = params.pos || null;
	}

	storeInBundle(bundle) {
		super.storeInBundle(bundle);
		bundle.put('_className_', 'Styx.DungeonObject');
		bundle.put('_args_', [this.category, this.id, this.params]);
		bundle.put('pos', this.pos);
	}

	restoreFromBundle(bundle) {
		super.restoreFromBundle(bundle);
		this.pos = bundle.get('pos');
	}	

	distance(entity)
	{
		if (!this.pos || !entity.pos) {
			console.warn("Missing pos - cannot calculate distance.");
			return 999999;
		}

		return Math.max(Math.abs(this.pos.x - entity.pos.x), Math.abs(this.pos.y - entity.pos.y));
	}

	isNear()
	{
		return this.game.player? (this.distance(this.game.player) < 6) : false;
	}

	surroundings()
	{
		return [
			{x: this.pos.x - 1, y: this.pos.y - 1},
			{x: this.pos.x    , y: this.pos.y - 1},
			{x: this.pos.x + 1, y: this.pos.y - 1},
			{x: this.pos.x - 1, y: this.pos.y},
			{x: this.pos.x + 1, y: this.pos.y},
			{x: this.pos.x - 1, y: this.pos.y + 1},
			{x: this.pos.x    , y: this.pos.y + 1},
			{x: this.pos.x + 1, y: this.pos.y + 1}
		];
	}

	getTile()
	{
		if (!this.level || !this.pos) return null;
		return this.level.get(this.pos, 'tile');
	}

	getAction(id)
	{
		var a = this.game.db.getObject('actions', id);
		return {'id': a.id, 'points': a.points, 'tags': a.tags};		
	}

	pickAttackId()
	{
		var attacks = this.getAttrib('attacks');
		var chances = this.getAttrib('attack-chances');
		if (!attacks)	return 'hit';
		return Styx.Random.pick(attacks, chances);
	}

	pickAttack()
	{
		var id = this.pickAttackId();
		var a = this.getAction(id)
		a.type = id;
		return a;
	}

	defense(attack)
	{
		return attack;
	}

	damage(src, type, points) {}

	die()	{}

	isDestroyed()	{}	
}