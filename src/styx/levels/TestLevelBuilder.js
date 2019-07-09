var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.TestLevelBuilder = class extends Styx.levels.ArenaLevelBuilder
{
	createLevel()
	{
		// if (this.params.type == 'test-level')	this.buildTestMap();
		// else this.buildRandomMap();

		super.createLevel();

		this.spawn(16,6, 'monster', {id: "snake"});
		this.spawn(6,7, 'item', {id: "rusty_dagger"});
		this.spawn(7,7, 'item', {id: "short_sword"});
		this.spawn(8,7, 'item', {id: "wooden_club"});
		this.spawn(10,7, 'item', {id: "small_shield"});
		this.spawn(12,7, 'item', {id: "copper_coins"});
		this.spawn(14,7, 'item', {id: "bread"});
		this.spawn(16,7, 'item', {id: "bones"});
		this.spawn(16,8, 'item', {id: "soft_leather_armor"});

		var m = this.spawn(16,16, 'monster', {id: "ghost"});
		m.conditions.add('Bleeding', 10);

		this.level.setXY(5,4, 'id', 'door');

		var pool = new Styx.Rectangle(8,10,5,4);
		_.each(pool.coords(), (pos) => this.level.set(pos, 'id', 'shallow_water'));
		_.each(pool.move(1,0).coords(), (pos) => this.level.set(pos, 'id', 'water'));

		pool.assign(14,5);
		_.each(pool.coords(), (pos) => this.level.set(pos, 'id', 'high_grass'));

		var water = this.level.find('shallow_water');
		//this.level.set(water.sample().value(), 'item', this.make('item', {id: 'copper_coins'}));
		this.level.set(water.sample().value(), 'item', this.make('item', {id: 'fish_food'}));
		this.level.set(water.sample().value(), 'item', this.make('item', {id: 'rusty_dagger'}));

		return this.level;
	}

	buildTestMap()
	{
		 var r = new Styx.Rectangle(5,5,6,5);
		 for (let pos of r.coords()) {
		 		this.level.set(pos, 'id', 'floor');
		 }
	}

	make(className, options)
	{
		switch (className) {
			case 'monster': return new Styx.actors.Monster(options);
			case 'item': return new Styx.items.Item(options);
			default: throw `Unknown entity ${className}`;
		}		
	}

	spawn(x, y, className, options)
	{
		var obj = this.make(className, options);
		if (obj.is('actor')) var type = 'actor';
		else if (obj.is('item')) var type = 'item';
		else throw `Cannot spawn ${className} (unknown type)`;

		this.level.setXY(x, y, type, obj);
		return obj;
	}

	buildRandomMap()
	{
		for (var i = 0; i < this.level.size.width * this.level.size.height; i++) {
			this.level.tiles[i].id = (Styx.Random.float() > 0.05)? 'floor' : 'wall';
		}
	}
}