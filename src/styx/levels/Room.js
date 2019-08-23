var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.Door = class
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

	distance(door)
	{
		var p1 = this.getPos();
		var p2 = door.getPos();
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
		var door = this.getMatchingDoor(room);
		this.connected = door;
		door.connected = this;
	}

	getMatchingDoor(room)
	{
		var door = room.getDoorBySide(this.oppositeSide());
		if (!door) {
			throw new Error("Door does not exists.");
		}
		if ((door.connected && door.connected.room != this) || this.connected && this.connected.room != room) {
			throw new Error("Door is already connected.");
		}

		return door;
	}

	alignRoom(room)
	{
		var door = this.getMatchingDoor(room);

		room.move(this.getPos().x - door.getPos().x, this.getPos().y - door.getPos().y); //nastavi prekryvajici mistnost

		switch(this.side) {
			case 'north': room.move(0,-1);  break;
			case 'south': room.move(0, 1);  break;
			case 'east':  room.move(1, 0);  break;
			case 'west':  room.move(-1, 0); break;
		}

		return door;
	}
}

Styx.levels.Room = class extends Styx.Rectangle
{
	constructor(width, height)
	{
		super(0, 0, width, height, {});
		this.game = game;
		this.doors = this.createDoors();
	}

	createDoors()
	{
		var list = [];
		list.push(new Styx.levels.Door(this, 'north', this.getPoint('center-1')));
		list.push(new Styx.levels.Door(this, 'east', this.getPoint('center-2')));
		list.push(new Styx.levels.Door(this, 'south', this.getPoint('center-3')));
		list.push(new Styx.levels.Door(this, 'west', this.getPoint('center-4')));

		return list;
	}

	is(tag)
	{
		return false;
	}

	getDoor(x, y)
	{
		return _.find(this.doors, door => door.pos.x == x && door.pos.y == y);
	}

	getDoorBySide(side)
	{
		return _.find(this.doors, door => door.side == side);
	}

	getFreeDoors()
	{
		var list = [];
		_.each(this.doors, door => {if(!door.connected) list.push(door)});
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

	draw(level)
	{
		for (let pos of this.coords()) {
			if (this.isBorderPoint(pos.x, pos.y)) continue;
			level.setXY(pos.x, pos.y , 'id', 'floor');
		}
	
		for (let door of this.doors) {
			if (!door.connected) continue;
			let pos = door.getPos();
			level.setXY(pos.x, pos.y , 'id', 'door');
		}
	}

}

Styx.levels.FixedRoom = class extends Styx.levels.Room
{
	constructor(name)
	{
		super(0,0);
		this.name = name;
		this.cells = this.getCells();
		this.assign(0, 0, this.cells[0].length, this.cells.length);		
		this.doors = this.createDoors();
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

		this.doors = this.createDoors();
		return this;
	}

	getCell(x,y)
	{
		return this.cells[y][x];
	}

	getCellAbs(x,y)
	{
		if (!this.isInsidePoint(x,y)) return null;
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

	createDoors()
	{
		if (!this.name) return;

		var list = [];
		var listPos = this.findChar('+');
		for (let pos of listPos) {
			var side = this._getSide(pos);
			if (!side) continue;

			list.push(new Styx.levels.Door(this, side, pos));
		}

		return list;
	}

	draw(level)
	{
		var features = this.getAttrib('features');

		for (var y = 0; y < this.height; y++) {
			for (var x = 0; x < this.width; x++) {
				var cell = this.cells[y][x];
				if (cell == ' ') continue;

				if (cell == '+') {
					var door = this.getDoor(x, y);
						if (door) {
						if (!door.connected) continue;

						if (this.is('corridor')) {
							cell = '.';
						}

						// //prevent double door
						// if (!door.connected.room.is('corridor') && (door.room.x > door.connected.room.x 
						// 	|| (door.room.x == door.connected.room.x && door.room.y > door.connected.room.y))
						// ) {
						// 	cell = '.';
						// }
					}
				}

				//skip drawing border walls - better merge
				if (cell == '#' && this.isBorderPoint(this.x + x, this.y + y)) continue;
				
				var id = features[cell].id;
				level.setXY(this.x + x, this.y + y, 'id', id);
			}
		}

	}
}


//Corridor

Styx.levels.Corridor = class extends Styx.levels.Room
{
	is(tag)
	{
		return (tag == 'corridor');
	}


	coords()
	{
		var pos = [];
		var center = this.getPoint('center');

		_.each(this.doors, 
			door => { if (door.connected) pos = pos.concat(this.line(door.getPos(), center)); }
		);

		return pos;
	}

	draw(level)
	{
		for (let pos of this.coords()) {
			level.setXY(pos.x, pos.y , 'id', 'floor');
		}
	}

	createDoors()
	{
		var list = [];
		list.push(new Styx.levels.Door(this, 'north', this.getPoint('center-1')));
		list.push(new Styx.levels.Door(this, 'east', this.getPoint('center-2')));
		list.push(new Styx.levels.Door(this, 'south', this.getPoint('center-3')));
		list.push(new Styx.levels.Door(this, 'west', this.getPoint('center-4')));

		return list;
	}
}

Styx.levels.Connector = class extends Styx.levels.Room
{
	constructor(d1, d2)
	{
		super(0,0);
		this.doors.push(d1, d2);
	}

	createDoors()
	{
		return [];
	}

	is(tag)
	{
		return (tag == 'corridor');
	}

	isValid()
	{
		var p1 = this.doors[0].getPos();
		var p2 = this.doors[1].getPos();

		if (this.doors[0].isVertical()) {
			return (Math.abs(p1.y - p2.y) > 1);
		}
		else {
			return (Math.abs(p1.x - p2.x) > 1);
		}
	}

	coords()
	{
		var pos = [];

		var p1 = this.doors[0].getPos();
		var p2 = this.doors[1].getPos();

		var xm = p1.x + Math.floor((p2.x - p1.x) / 2);
		var ym = p1.y + Math.floor((p2.y - p1.y) / 2);

		if (this.doors[0].isVertical()) {
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

		//var pos = pos.concat(this.line(this.doors[0].getPos(), this.doors[1].getPos()));

		pos = _.reject(pos, (p) => _.isEqual(p, p1) || _.isEqual(p, p2));

		return pos;
	}

	draw(level)
	{
		for (let pos of this.coords()) {
			level.setXY(pos.x, pos.y , 'id', 'floor');
		}
	}


}