var Styx = Styx || {};

/**
 * Base class for any game entity, which appears in the dungeon.
 * It has position and link to level, its update() method is called on each level update.
 * It can be damaged and destroyed or create damage.
 * It can check distance from other objects or surroundings.
 */
Styx.DungeonObject = class extends Styx.GameObject
{
	constructor(category, id, params)
	{
		super(category, id, params);

		/** Link to {Styx.levels.Level} where object resides. */
		this.level = null;

		/** Position {x,y} in the level. */
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

	/** Distance from another entity which has position (pos). */
	distance(entity)
	{
		if (!this.pos || !entity.pos) {
			console.warn("Missing pos - cannot calculate distance.");
			return 999999;
		}

		return Math.max(Math.abs(this.pos.x - entity.pos.x), Math.abs(this.pos.y - entity.pos.y));
	}

	/** 
	 * Is object near the player?
	 * For example nearby monsters activity will be reported.
	 */
	isNear()
	{
		return this.game.player? (this.distance(this.game.player) < 6) : false;
	}

	/** 
	 * Return positions of surrounding tiles.
	 * @return {array} pos
	 */
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

	/** 
	 * Return tile where object is standing/placed or null.
	 * @return {Styx.levels.Tile} tile
	 */
	getTile()
	{
		if (!this.level || !this.pos) return null;
		return this.level.get(this.pos, 'tile');
	}

	/** 
	 * Return action (id) from list of actions which object can perform.
	 * @return {struct} action
	 */
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

	/** 
	 * Choose attack type, if object can attack or damage something.
	 * @return {struct} action
	 */
	pickAttack()
	{
		var id = this.pickAttackId();
		var a = this.getAction(id)
		a.type = id;
		return a;
	}

	/** 
	 * Perform defense on (attack) and return resulting (attack).
	 * @abstract
	 * @return {struct} action
	 */
	defense(attack)
	{
		return attack;
	}

	/** 
	 * Damage this object with strenght (points) and damage type (type).
	 * @abstract
	 */
	damage(src, type, points) {}

	/** @abstract */
	die()	{}

	/** @abstract */
	isDestroyed()	{}	
}