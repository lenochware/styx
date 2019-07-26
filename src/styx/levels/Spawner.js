var Styx = Styx || {};
Styx.levels = Styx.levels || {};

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
	}

	createObject(type, id)
	{
		switch (type) {
			case 'actor': return new Styx.actors.Monster({id: id});
			case 'item': return new Styx.items.Item({id: id});
			default: throw `Unknown entity ${type}`;
		}
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

		var num = Styx.Random.int(1, Math.floor(this.builder.getFloorSize(this.area) * density / 100) + 1);
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

		if (this._bindLevel) console.log(id);
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
