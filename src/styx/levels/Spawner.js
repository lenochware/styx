var Styx = Styx || {};
Styx.levels = Styx.levels || {};

/**
 * Spawner.spawn() will populate level with monsters, items and stuff.
 * It is used by LevelBuilder.
 */
Styx.levels.Spawner = class
{
	constructor(builder, area)
	{
		this.game = game;
		this.builder = builder;
		this.level = builder.level;
		this.area = area;
		this.floorCache = this.getFloors();
		this.bindings = null;
		this._bindLevel = 0;
		this.game.get('player');
	}

	createObject(type, id)
	{
		var obj = null;

		switch (type) {
			case 'actor': obj = new Styx.actors.Monster({id: id}); break;
			case 'item': obj = new Styx.items.Item({id: id}); break;
			default: throw `Unknown entity ${type}`;
		}

		if (id == 'corpse') {
			var mon = _.sample(this.level.actors);
			if (mon) {
				var corpse = mon.getAttrib('corpse');
				if (corpse) {
					obj.params.name = _.isArray(corpse)? _.sample(corpse) : corpse;
				}
			}
		}

		return obj;
	}

	/*
		Pick object with obj.lvl near to lvl.
		Probability based on level diff: (1, 0.5, 0.2, 0.1, ...)
	*/
	pickObjectByLvl(category, lvl, tag)
	{
		if (tag) {
			var list = this.game.db.find(category, tag).value();
		}
		else {
			var list = _.values(this.game.db.getCategory(category));
		}

		var chances = _.map(list, obj => obj.lvl? 1 / (Math.pow(obj.lvl - lvl, 2) + 1) : 1);
		return Styx.Random.pick(list, chances);
	}

	pickPos(type)
	{
		var num = 20;
		while (num--) {
			var pos = _.sample(this.floorCache);
			if (type == 'tile' || !this.level.get(pos, type)) { return pos; }
		}

		throw new Error('Cannot find free pos.');
	}

	getFloors()
	{
		var floors = [];
		for(let pos of this.area.coords()) {
			if (this.level.get(pos, 'id') == 'floor') floors.push(pos);
		}

		return floors;
	}

	getGroup(id)
	{
		return this.game.db.getObject('groups', id);
	}

	setArea(x, y, w, h)
	{
		this.area = new Styx.Rectangle(x, y, w, h);
		this.floorCache = this.getFloors();
	}

	setBindings(id)
	{
		this.bindings = this.getGroup(id);
	}

	spawnObjects(type, list, density)
	{
		if (!list) return;

		var num = Styx.Random.int(1, Math.floor(this.floorCache.length * density / 100) + 1);
		while (num--) {
			var id = _.sample(list);
			var pos = this.pickPos(type);
			this.spawnObj(type, id, pos);
		}
	}

	spawnObj(type, id, pos)
	{
		if (type == 'tile') {
			this.level.set(pos, 'id', id);
		}
		else {
			var obj = this.createObject(type, id);
			this.level.set(pos, type, obj);
		}

		if (this.bindings && this.bindings[id]) {
			this.spawnBindings(this.bindings[id], pos);
		}
	}

	spawnBindings(group, pos)
	{
		if (this._bindLevel > 2) return;
		this._bindLevel++;

		if (group.groups) {
			group = this.bindings[_.sample(group.groups)];
		}

		let rarity = 1;
		if (group.tags.includes("common")) rarity = 0;
		if (group.tags.includes("rare")) rarity = 2;
		let d = [1, 0.5, 0.2][rarity];

		if (group.tags.includes("anywhere")) {
			this.spawnObjects('actor', group.actor, d);
			this.spawnObjects('item', group.item, d);
			this.spawnObjects('tile', group.tile, d);
		}
		else if(group.tags.includes("in-place")) {
			
			for(let type of ['actor', 'item', 'tile']) {
				if (!group[type] || !Styx.Random.bet(d*d)) continue;
				let id = _.sample(group[type]);
				this.spawnObj(type, id, pos);
			}
		}
		else if(group.tags.includes("around")) {
			
			for(let type of ['actor', 'item', 'tile']) {
				if (!group[type] || !Styx.Random.bet(d*d)) continue;
				let id = _.sample(group[type]);
				let tpos = {x: pos.x + Styx.Random.int(-1,1), y: pos.y + Styx.Random.int(-1,1)};
				this.spawnObj(type, id, tpos);
			}
		}

		this._bindLevel--;
	}

	transform(list)
	{
		for(let pos of this.area.coords()) {
			let id = this.level.get(pos, 'id');
			if (id in list) {
				var newId = _.isArray(list[id])? _.sample(list[id]) : list[id];
				this.level.set(pos, 'id', newId);
			}
		}
	}

	spawn(id)
	{
		var group = this.getGroup(id);

		this.spawnObjects('actor', group['common-monsters'], 2);
		this.spawnObjects('actor', group['rare-monsters'], 0.5);
		this.spawnObjects('item', group['common-items'], 2);
		this.spawnObjects('item', group['rare-items'], 0.5);
		this.spawnObjects('tile', group['common-tiles'], 2);
		this.spawnObjects('tile', group['rare-tiles'], 0.5);

		if (group.transform) {
			this.transform(group.transform);
		}
	}

}
