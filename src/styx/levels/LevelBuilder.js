var Styx = Styx || {};
Styx.levels = Styx.levels || {};


Styx.levels.LevelBuilder = class
{
	constructor()
	{
		this.game = game;
		this.level = null;
	}

	build(param)
	{
		this.level = new Styx.levels.Level;
		this.level.size = param.size;
		this.level.map = this.getRandomMap(param.size);

		this.spawn(6,6, 'monster', {id: "kobold"});
		this.spawn(7,7, 'item', {id: "short_sword"});
		this.spawn(10,7, 'item', {id: "small_shield"});
		this.spawn(12,7, 'item', {id: "copper_coins"});
		this.spawn(14,7, 'item', {id: "bread"});
		this.spawn(16,7, 'item', {id: "bones"});

		this.spawn(16,16, 'monster', {id: "ghost"});

		this.level.setXY(5,4, 'id', 'door');

		var pool = new Styx.Rectangle(8,10,5,4);
		_.each(pool.coords(), (pos) => this.level.set(pos, 'id', 'water'));

		return this.level;
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
		if (obj.is('alive')) var type = 'actor';
		else if (obj.is('item')) var type = 'item';
		else throw `Cannot spawn ${className} (unknown type)`;

		this.level.setXY(x, y, type, obj);
		return obj;
	}

	getRandomMap(size)
	{
		var map = [];
		for (var i = 0; i < size.width * size.height; i++) {
			map[i] = new Styx.levels.Tile((Math.random() > 0.05)? 'floor' : 'wall');
		}
		return map;
	}
}