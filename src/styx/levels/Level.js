var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.Level = class extends Styx.GameObject
{
	constructor(id)
	{
		super('levels', id, {});
		this.map = [];
		this.fov = {};
		this.size = this._createRect();
		this.actors = [];
		this.exits = {};
	}

	storeInBundle(bundle) {
		super.storeInBundle(bundle);
		bundle.put('_className_', 'Styx.levels.Level');
		bundle.put('_args_', [this.id]);
		bundle.put('size', this.size);
		bundle.put('exits', this.exits);

		var items = [];
		var actors = [];
		var map = [];

		for (let tile of this.map) {
			map.push(tile.id);
			if (tile.actor) actors.push(tile.actor);
			if (tile.item) items.push(tile.item);
		}

		bundle.put('items', items);
		bundle.put('actors', actors);
		bundle.put('map', map);

		//bundle.put('fov', this.fov);
	}

	restoreFromBundle(bundle) {
		super.restoreFromBundle(bundle);

		this.size = bundle.get('size');
		this.exits = bundle.get('exits');

		this.map = [];
		
		var tileIds = bundle.get('map');
		for (let i in tileIds) {
			this.map.push(
				new Styx.levels.Tile(i % this.size.width, Math.floor(i / this.size.width), tileIds[i])
			);
		}

		for (let obj of bundle.get('actors')) {
			this.set(obj.pos, 'actor', obj);
		}

		for (let obj of bundle.get('items')) {
			this.set(obj.pos, 'item', obj);
		}

		//this.fov = bundle.get('fov');
	}

	_createRect()
	{
		return new Styx.Rectangle(0,0,80,30);
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

	find(tag)
	{
		return _.chain(_.keys(this.map)).filter(i => this.map[i].is(tag));
	}

	isVisible(x, y)
	{
		return this.fov[x + ',' + y]? true : false;
	}


	getXY(x, y, attrib)
	{
		if (x < 0 || x >= this.size.width || y < 0 || y >= this.size.height) {
			return new Styx.levels.Tile(x, y, 'null');
		}
		else {
			var tile = this.map[y * this.size.width + x];
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
		if (pos < 0 || pos >= this.map.length) {
			throw "Tile position out of bounds.";
		}

		switch (attrib) {
			case 'id':
				this.map[pos].id = value;
			break;
			case 'item': 
			case 'actor':
				if (this.map[pos][attrib]) {
					console.warn('Cannot set: level position already occupied.');
					return false;
				}

				this.map[pos][attrib] = value;

				if (value.pos) {
					var oldPos = value.pos.y * this.size.width + value.pos.x;
					this.map[oldPos][attrib] = null;
				}

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

	remove(entity)
	{
		var pos = entity.pos.y * this.size.width + entity.pos.x;

		if (entity.is('actor')) {
			this.map[pos].actor = null;

			for (var i = 0; i < this.actors.length; i++) {
				if (this.actors[i] == entity) {
					this.actors[i] = null;
					break;
				}
			}
		}
		else if (entity.is('item')) {
			this.map[pos].item = null;
		}
		else {
			throw `Invalid entity type.`;
		}

		entity.level = null;
		entity.pos = null;
	}

	update()
	{
		for (var i = 0; i < this.actors.length; i++) {
			if (this.actors[i] == null) continue;
			this.actors[i].update();
		}		
	}
}