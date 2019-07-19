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

	distance(en)
	{
		var p1 = this.getPos();
		var p2 = en.getPos();
		return Math.max(Math.abs(p1.x - p2.x), Math.abs(p1.y - p2.y));
	}

	isVertical()
	{
		return (this.side == 'north' || this.side == 'south');
	}

	getPos()
	{
		return {x: this.pos.x + this.room.x, y: this.pos.y + this.room.y};
	}

	getRay(len)
	{
		var pos = this.getPos();
		var dir = this.getDir();

		var ray = new Styx.Rectangle(pos.x, pos.y, 1, 1);

		if (dir.x) ray.width = len;
		else ray.height = len;

		if (dir.x > 0 || dir.y > 0) {
			ray.move(dir.x, dir.y);
		}
		else {
			ray.move(dir.x * len, dir.y * len);
		}

		return ray;
	}

	getDir() {
		switch(this.side) {
			case 'north': return {x: 0, y:-1};
			case 'south': return {x: 0, y: 1};
			case 'east':  return {x: 1, y: 0};
			case 'west':  return {x:-1, y: 0};
		}
	}

	connect(room)
	{
		//var en = this.alignRoom(room);
		var en = this.getMatchingEntrance(room);
		this.connected = en;
		en.connected = this;
	}

	getMatchingEntrance(room)
	{
		var en = room.getEntranceBySide(this.oppositeSide());
		if (!en) {
			throw new Error("Entrance does not exists.");
		}
		if ((en.connected && en.connected.room != this) || this.connected && this.connected.room != room) {
			throw new Error("Entrance is already connected.");
		}

		return en;
	}

	alignRoom(room)
	{
		var en = this.getMatchingEntrance(room);

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

Styx.levels.GenericRoom = class extends Styx.Rectangle
{
	constructor(width, height)
	{
		super(0, 0, width, height, {});
		this.game = game;
		this.entrances = [];
	}

	is(tag)
	{
		return false;
	}

	getEntrance(x, y)
	{
		return _.find(this.entrances, en => en.pos.x == x && en.pos.y == y);
	}

	getEntranceBySide(side)
	{
		return _.find(this.entrances, en => en.side == side);
	}

	getFreeEntrances()
	{
		var list = [];
		_.each(this.entrances, en => {if(!en.connected) list.push(en)});
		return Styx.Random.shuffle(list);
	}

	_getSide(pos)
	{
		if (pos.x == 0) return 'west';
		if (pos.y == 0) return 'north';
		if (pos.y == this.height - 1) return 'south';
		if (pos.x == this.width - 1) return 'east';
		return false;
	}

	/** Bresenham line */
	line (p1, p2) {
    var pos = [];
    // Translate coordinates
    var x1 = p1.x;
    var y1 = p1.y;
    var x2 = p2.x;
    var y2 = p2.y;

    // Define differences and error check
    var dx = Math.abs(x2 - x1);
    var dy = Math.abs(y2 - y1);
    var sx = (x1 < x2) ? 1 : -1;
    var sy = (y1 < y2) ? 1 : -1;
    var err = dx - dy;

    // Set first coordinates
    pos.push({x:x1, y: y1});

    // Main loop
    while (!((x1 == x2) && (y1 == y2))) {
        var e2 = err << 1;
        if (e2 > -dy) {
            err -= dy;
            x1 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y1 += sy;
        }
        // Set coordinates
        pos.push({x:x1, y: y1});
    }
    // Return the result
    return pos;
	}

	draw(drawCellCallback)
	{
	}

}

Styx.levels.Room = class extends Styx.levels.GenericRoom
{
	constructor(name)
	{
		super(0,0);
		this.name = name;
		this.cells = this.getCells();
		this.assign(0, 0, this.cells[0].length, this.cells.length);		
		this.entrances = this.createEntrances();
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

		this.entrances = this.createEntrances();
		return this;
	}

	getCell(x,y)
	{
		return this.cells[y][x];
	}

	getCellAbs(x,y)
	{
		if (!this.pointInside(x,y)) return null;
		return this.getCell(x - this.x, y - this.y);
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

	createEntrances()
	{
		var list = [];
		var listPos = this.findChar('+');
		for (let pos of listPos) {
			var side = this._getSide(pos);
			if (!side) continue;

			list.push(new Styx.levels.Entrance(this, side, pos));
		}

		return list;
	}

	draw(drawCellCallback)
	{
		var features = this.getAttrib('features');

		for (var y = 0; y < this.height; y++) {
			for (var x = 0; x < this.width; x++) {
				var cell = this.cells[y][x];
				if (cell == ' ') continue;

				if (cell == '+') {
					var en = this.getEntrance(x, y);
						if (en) {
						if (!en.connected) continue;

						if (this.is('corridor')) {
							cell = '.';
						}

						//prevent double door
						if (!en.connected.room.is('corridor') && (en.room.x > en.connected.room.x 
							|| (en.room.x == en.connected.room.x && en.room.y > en.connected.room.y))
						) {
							cell = '.';
						}
					}
				}
				
				var id = features[cell].id;
				drawCellCallback(this, this.x + x, this.y + y, 'id', id);
			}
		}

	}
}


//Corridor

Styx.levels.Corridor = class extends Styx.levels.GenericRoom
{
	constructor(w, h)
	{
		super(w,h);
		this.entrances = this.createEntrances();
	}

	is(tag)
	{
		return (tag == 'corridor');
	}


	coords()
	{
		var pos = [];
		var center = this.getPoint('center');

		_.each(this.entrances, 
			(en) => { if (en.connected) pos = pos.concat(this.line(en.getPos(), center)); }
		);

		return pos;
	}

	draw(drawCellCallback)
	{
		for (let pos of this.coords()) {
			drawCellCallback(this, pos.x, pos.y , 'id', 'floor');
		}
	}

	createEntrances()
	{
		var list = [];
		list.push(new Styx.levels.Entrance(this, 'north', this.getPoint('center-1')));
		list.push(new Styx.levels.Entrance(this, 'east', this.getPoint('center-2')));
		list.push(new Styx.levels.Entrance(this, 'south', this.getPoint('center-3')));
		list.push(new Styx.levels.Entrance(this, 'west', this.getPoint('center-4')));

		return list;
	}
}

Styx.levels.Connector = class extends Styx.levels.GenericRoom
{
	constructor(en1, en2)
	{
		super(0,0);
		this.entrances.push(en1, en2);
	}

	is(tag)
	{
		return (tag == 'corridor');
	}

	isValid()
	{
		var p1 = this.entrances[0].getPos();
		var p2 = this.entrances[1].getPos();

		if (this.entrances[0].isVertical()) {
			return (Math.abs(p1.y - p2.y) > 1);
		}
		else {
			return (Math.abs(p1.x - p2.x) > 1);
		}
	}

	coords()
	{
		var pos = [];

		var p1 = this.entrances[0].getPos();
		var p2 = this.entrances[1].getPos();

		var xm = p1.x + Math.floor((p2.x - p1.x) / 2);
		var ym = p1.y + Math.floor((p2.y - p1.y) / 2);

		if (this.entrances[0].isVertical()) {
			pos = pos.concat(
				this.line(p1, {x:p1.x, y:ym}),
				this.line({x:p1.x, y:ym}, {x:p2.x, y:ym}),
				this.line({x:p2.x, y:ym}, p2)
			);
		} else {
			pos = pos.concat(
				this.line(p1, {x:xm, y:p1.y}),
				this.line({x:xm, y:p1.y}, {x:xm, y:p2.y}),
				this.line({x:xm, y:p2.y}, p2)
			);
		}

		//var pos = pos.concat(this.line(this.entrances[0].getPos(), this.entrances[1].getPos()));

		pos = _.reject(pos, (p) => _.isEqual(p, p1) || _.isEqual(p, p2));

		return pos;
	}

	draw(drawCellCallback)
	{
		for (let pos of this.coords()) {
			drawCellCallback(this, pos.x, pos.y , 'id', 'floor');
		}
	}


}