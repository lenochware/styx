var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.TestLevelBuilder = class extends Styx.levels.LevelBuilder
{
	createLevel(id)
	{
		// if (this.params.type == 'test-level')	this.buildTestMap();
		// else this.buildRandomMap();

		super.createLevel(id);
		this.level.clear('floor');

		this.spawnAll('items', 'item', 3);
		this.spawnAll('tiles', 'tile', 6);
		this.spawnAll('actors', 'monster', 14);

		// var m = this.spawn(16,16, 'monster', {id: "ghost"});
		// m.conditions.add('Bleeding', 10);

		var pool = new Styx.Rectangle(8,10,5,4);
		_.each(pool.coords(), (pos) => this.level.set(pos, 'id', 'shallow_water'));
		_.each(pool.move(1,0).coords(), (pos) => this.level.set(pos, 'id', 'water'));

		pool.move(5,0);
		_.each(pool.coords(), (pos) => this.level.set(pos, 'id', 'high_grass'));

		pool.move(5,0);
		_.each(pool.coords(), (pos) => this.level.set(pos, 'id', 'rocks'));

		var water = this.level.find('shallow_water');
		//this.level.set(water.sample().value(), 'item', this.make('item', {id: 'copper_coins'}));
		this.level.set(water.sample().value(), 'item', this.make('item', {id: 'fish_food'}));
		this.level.set(water.sample().value(), 'item', this.make('item', {id: 'rusty_dagger'}));

		for (let pos of this.level.find('earth_wall').value()) {
			this.level.get(pos, 'tile').setAttrib('buried', 'worm');
		};

		// worm.conditions.remove('Asleep');
		// this.level.set(pos, 'actor', worm);

		var tile = this.level.getXY(10, 2, 'tile');
		tile.id = 'wall';
		//tile.setAttrib('secret', ['floor', 'rat']);
		tile.setAttrib('secret', 'door');

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

	spawnAll(category, className, row)
	{
		var objects = this.game.db.getCategory(category);
		var i = 9;

		for (let id in objects) {
			if (id == 'player') continue;
			if (className == 'tile') {
				this.level.setXY(i++, row, 'id', id);
			}
			else {
				this.spawn(i++, row, className, {id:id});
			}
		}		
	}

	buildRandomMap()
	{
		for (var i = 0; i < this.level.size.width * this.level.size.height; i++) {
			this.level.tiles[i].id = (Styx.Random.float() > 0.05)? 'floor' : 'wall';
		}
	}
}