var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.Level = class
{
	constructor()
	{
		this.map = [];
		this.size = new Styx.Rectangle(0,0,0,0);
		this.actors = [];
	}

	get(x, y, attrib)
	{
		if (x < 0 || x >= this.size.width || y < 0 || y >= this.size.height) {
			var tileParams = { id: 'null', actor: null, item: null };
		}
		else {
			var tileParams = this.map[y * this.size.width + x];
		}


		switch (attrib) {
			case 'id':
			case 'actor':
			case 'item': 
				return tileParams[attrib];
			case 'tile-params': return tileParams;
			case 'tile': 
				return new Styx.levels.Tile(x, y, tileParams);

			default: throw `Invalid attribute'${attrib}'.`;
		}
	}

	set(x, y, attrib, value)
	{
		var pos = y * this.size.width + x;
		if (pos < 0 || pos >= this.map.length) {
			throw "Tile position out of bounds.";
		}

		switch (attrib) {
			case 'id': this.map[pos].tile = value; break;
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

				if (value.is('alive') && !value.level) {
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

		if (entity.is('alive')) {
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