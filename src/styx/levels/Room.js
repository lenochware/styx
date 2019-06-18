var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.Entrance = class
{
	constructor(room, id, pos)
	{
		this.room = room;
		this.id = id;
		this.side = id;
		this.pos = pos;
		this.connected = null;
	}

	oppositeSide()
	{
		switch (this.side) {
			case 'south': return 'north';
			case 'north': return 'south';
			case 'west': return 'east';
			case 'east': return 'west';
			default: return 'unknown';
		}
	}

	getPos()
	{
		return {x: this.pos.x + this.room.x, y: this.pos.y + this.room.y};
	}

	connect(room)
	{
		var en = this.alignRoom(room);
		this.connected = room;
		en.connected = this.room;		
	}

	alignRoom(room)
	{
		var en = room.entrances[this.oppositeSide()];
		if (!en) {
			throw new Error("Entrance does not exists.");
		}
		if ((en.connected && en.connected != this) || this.connected && this.connected != room) {
			throw new Error("Entrance is already connected.");
		}

		room.move(this.getPos().x - en.getPos().x, this.getPos().y - en.getPos().y); //nastavi prekryvajici mistnost

		switch(this.side) {
			case 'north': room.move(0,-1);  break;
			case 'south': room.move(0, 1);  break;
			case 'east':  room.move(1, 0);  break;
			case 'west':  room.move(-1, 0); break;
		}

		return en;
	}
}

Styx.levels.Room = class extends Styx.Rectangle
{
	constructor(name)
	{
		super(0,0,0,0,{});

		this.game = game;
		this.name = name;
		this.cells = this.getCells();
		this.assign(0, 0, this.cells[0].length, this.cells.length);
		this.entrances = this._getEntrances();
	}

	getAttrib(attrib)
	{
		return this.game.db.getAttrib('rooms', this.name, attrib);
	}

	getCells()
	{
		var cells = [];
		var rows = this.getAttrib('cells');
		for(let row of rows) {
			cells.push(row.split(""));
		}

		return cells;
	}

	is(tag)
	{
		return (this.getAttrib("tags").indexOf(tag) != -1);
	}

	/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
  rotate()
  {
		this.cells = _.zip(...this.cells.reverse());

		[this.width, this.height] = [this.height, this.width];

		this.entrances = this._getEntrances();
		return this;
	}

	getCell(x,y)
	{
		return this.cells[y][x];
	}

	findChar(char)
	{
		var pos = [];
		
		for (var y = 0; y < this.height; y++) {
			for (var x = 0; x < this.width; x++) {
				if (this.cells[y][x] == char) pos.push({x:x, y:y});
			}
		}

		return pos;
	}

	_getSide(pos)
	{
		if (pos.x == 0) return 'west';
		if (pos.y == 0) return 'north';
		if (pos.y == this.height - 1) return 'south';
		if (pos.x == this.width - 1) return 'east';
		return false;
	}

	_getEntrances()
	{
		var listEnt = {};
		var listPos = this.findChar('+');
		for (let pos of listPos) {
			var side = this._getSide(pos);
			if (!side) {
				console.log(this, listPos);
				throw new Error("Wrong entrance.");
			}

			listEnt[side] = new Styx.levels.Entrance(this, side, pos);
		}

		return listEnt;
	}

	draw(level)
	{
		var cor = this.is('corridor');

		for (var y = 0; y < this.height; y++) {
			for (var x = 0; x < this.width; x++) {
				var cell = this.cells[y][x];
				if (cell == ' ') continue;
				if (cor && cell == '+') cell = '.';
				//nevykreslovat neconnected doors v mistnostech

				var id = '';

				switch(cell) {
					case '#': case 'O': id = 'wall'; break;
					case '+': id = 'door'; break;
					case '.': id = 'floor'; break;
				}

				level.setXY(this.x + x, this.y + y, 'id', id);
			}
		}
	}

	freeEntrances()
	{
		var list = [];
		_.each(this.entrances, (en, key) => {if(!en.connected) list.push(en)});
		return list;
	}

}