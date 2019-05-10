var Styx = Styx || {};
Styx.levels = Styx.levels || {};


Styx.levels.LevelBuilder = class
{
	build(param)
	{
		var level = new Styx.levels.Level;
		level.size = param.size;
		level.map = this.getRandomMap(param.size);

		var m = this.spawn('monster', {id: "kobold"});
		level.set(6, 6, 'actor', m);

		return level;
	}

	spawn(id, options)
	{
		switch (id) {
			case 'monster': return new Styx.actors.Monster(options);
			default: throw `Unknown entity ${className}`;
		}		
	}

	getRandomMap(size)
	{
		var map = [];
		for (var i = 0; i < size.width * size.height; i++) {
			map[i] = { id: null, actor: null, item: null }
			map[i].id = (Math.random() > 0.2)? 'floor' : 'wall';
		}
		return map;
	}
}