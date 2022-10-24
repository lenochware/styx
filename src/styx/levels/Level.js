var Styx = Styx || {};
Styx.levels = Styx.levels || {};

/**
 * Game level - it contains map tiles with items nad actors (monsters).
 * level.update() is called on each game turn.
 */
Styx.levels.Level = class extends Styx.GameObject
{
	constructor(id)
	{
		super('levels', id, {});
		this.tiles = [];
		this.fov = {};
		this.visited = {};
		this.size = this._createRect();
		this.actors = [];
		this.exits = {};
		this.updated = false;
	}

	storeInBundle(bundle) {
		super.storeInBundle(bundle);
		bundle.put('_className_', 'Styx.levels.Level');
		bundle.put('_args_', [this.id]);
		bundle.put('size', this.size);
		bundle.put('exits', this.exits);

		var items = [];
		var actors = [];
		var tiles = [];

		for (let tile of this.tiles) {
			tiles.push(tile.id);
			if (tile.actor && !tile.actor.isPlayer()) actors.push(tile.actor);
			if (tile.item) items.push(tile.item);
		}

		bundle.put('items', items);
		bundle.put('actors', actors);
		bundle.put('tiles', tiles);
		bundle.put('visited', this.visited);
	}

	restoreFromBundle(bundle) {
		super.restoreFromBundle(bundle);

		this.size = bundle.get('size');
		this.exits = bundle.get('exits');

		this.tiles = [];
		
		var tileIds = bundle.get('tiles');
		for (let i in tileIds) {
			this.tiles.push(
				new Styx.levels.Tile(i % this.size.width, Math.floor(i / this.size.width), tileIds[i])
			);
		}

		for (let obj of bundle.get('actors')) {
			this.set(obj.pos, 'actor', obj);
		}

		for (let obj of bundle.get('items')) {
			this.set(obj.pos, 'item', obj);
		}

		this.visited = bundle.get('visited');
	}

	_createRect()
	{
		return new Styx.Rectangle(0,0,80,30);
	}

	clear(tileId)
	{
		this.tiles = [];

		for (let i = 0; i < this.size.width * this.size.height; i++) {
			this.tiles[i] = new Styx.levels.Tile(i % this.size.width, Math.floor(i / this.size.width), tileId);
		}
	}

	get(pos, attrib)
	{
		if (_.isObject(pos)) {
			return this.getXY(pos.x, pos.y, attrib);
		}
		else {
			return this.getXY(pos % this.size.width, Math.floor(pos / this.size.width), attrib);
		}
	}

	set(pos, attrib, value)
	{
		if (_.isObject(pos)) {
			return this.setXY(pos.x, pos.y, attrib, value);
		}
		else {
			return this.setXY(pos % this.size.width, Math.floor(pos / this.size.width), attrib, value);
		}
	}

	getXY(x, y, attrib)
	{
		if (x < 0 || x >= this.size.width || y < 0 || y >= this.size.height) {
			return new Styx.levels.Tile(x, y, 'null');
		}
		else {
			var tile = this.tiles[y * this.size.width + x];
		}

		switch (attrib) {
			case 'id':
			case 'actor':
			case 'item': 
				return tile[attrib];
			case 'tile': 
				return tile;
			default: 
				throw `Invalid attribute '${attrib}'.`;
		}
	}

	setXY(x, y, attrib, value)
	{
		var pos = y * this.size.width + x;
		if (pos < 0 || pos >= this.tiles.length) {
			console.warn("Tile position out of bounds.");
			return;
		}

		switch (attrib) {
			case 'id':
				this.tiles[pos].id = value;
			break;
			case 'item': 
			case 'actor':
				if (this.tiles[pos][attrib]) {
					console.warn('Cannot set: level position already occupied.');
					return false;
				}

				if (value.pos) {
					var oldPos = value.pos.y * this.size.width + value.pos.x;
					this.tiles[oldPos][attrib] = null;
				}

				this.tiles[pos][attrib] = value;

				if (value.is('actor') && !value.level) {
					this.actors.push(value);
				}

				value.level = this;
				value.pos = {x: x, y: y};
			break;
			default: throw `Invalid attribute '${attrib}'.`;
		}

		return true;
	}

	spawn(pos, id, params = {}, replace = false)
	{
		return this.spawnXY(pos.x, pos.y, id, params, replace);
	}

	spawnXY(x, y, id, params = {}, replace = false)
	{
		const categ = this.game.db.categoryOf(id);
		const tile = this.getXY(x, y, 'tile');

		if (categ == 'tiles') {
			tile.id = id;
			if (params) tile.params = params;
			return id;
		}
		else if (categ == 'actors') {
			params.id = id;
			if (replace && tile.actor) this.remove(tile.actor);

			const obj = new Styx.actors.Monster(params);
			let ok = this.setXY(x, y, 'actor', obj);
			return ok? obj : null;
		}
		else if (categ == 'items') {
			params.id = id;
			if (replace && tile.item) this.remove(tile.item);

			const obj = new Styx.items.Item(params);
			let ok = this.setXY(x, y, 'item', obj);
			return ok? obj : null;
		}

		throw new Error(`Unknown entity ${id}.`);
	}

	find(tag, source)
	{
		var coords = [];

		if (!source) source = this.size;

		if (source instanceof Styx.Rectangle)
		{
			for (var y = source.y; y < source.y + source.height; y++) {
				for (var x = source.x; x < source.x + source.width; x++) {
					if (x < 0 || y < 0 || x >= this.size.width || y >= this.size.height) {
						continue;
					}
					var tile = this.getXY(x, y, 'tile');
					if (tile.contains(tag)) coords.push(tile.pos);
				}
			}
		}
		else {
			for (pos of source) {
				var tile = this.get(pos, 'tile');
				if (tile.contains(tag)) coords.push(tile.pos);
			}
		}

		return coords;
	}

	isVisible(x, y)
	{
		return this.fov[x + ',' + y]? true : false;
	}

	isVisited(x, y)
	{
		return this.visited[x + ',' + y]? true : false;
	}	

	remove(entity)
	{
		if (!entity) return;
		var pos = entity.pos.y * this.size.width + entity.pos.x;

		if (entity.is('actor')) {
			this.tiles[pos].actor = null;

			for (var i = 0; i < this.actors.length; i++) {
				if (this.actors[i] == entity) {
					this.actors[i] = null;
					break;
				}
			}
		}
		else if (entity.is('item')) {
			this.tiles[pos].item = null;
		}
		else {
			throw `Invalid entity type.`;
		}

		entity.level = null;
		entity.pos = null;
	}

	update()
	{
		if (this.updated) return;

		for (var i = 0; i < this.actors.length; i++) {
			if (this.actors[i] == null) continue;
			this.actors[i].update();
		}

		this.updated = true;		
	}
}