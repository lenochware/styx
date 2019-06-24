var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.ArenaLevelBuilder = class
{
	constructor()
	{
		this.game = game;
		this.level = null;
		this.rooms = [];

		this.roomBuilder = new Styx.levels.RoomBuilder();
	}

	build()
	{
		//game.dbgBuild = this;

		this.level.map = this.fillMap(this.level.size, 'floor');

		var first = new Styx.levels.Room('room13x5');

		var c = this.level.size.getPoint('center');
		this.add(first.center(c.x, c.y), null);

		var maxRooms = 20;

		while(maxRooms--)
		{
			var nextRoom = this.chooseNextRoom();
			var added = this.addNextRoom(nextRoom);
		};

		this.populate();

		this.drawAll();

		return this.level;
	}

	populate()
	{

	}

	add(room)
	{
		this.rooms.push(room);
		return room;
	}

	addNextRoom(nextRoom)
	{
		var rndInt = this.game.random.int;
		nextRoom.move(rndInt(this.level.size.width), rndInt(this.level.size.height));
		nextRoom.align(this.level.size);
		this.rooms.push(nextRoom);
	}

	chooseNextRoom(room)
	{
		return this.roomBuilder.make(null, {tag: 'room'});
	}

	hasFreeSpace(newRoom)
	{
		if (!newRoom.inside(this.level.size)) {
			return false;
		}

		for(let room of this.rooms)
		{
			if (newRoom.intersect(room)) return false;
		}

		return true;
	}


	fillMap(size, fillId)
	{
		var map = [];

		for (var i = 0; i < size.width * size.height; i++) {
			map[i] = new Styx.levels.Tile(i % size.width, Math.floor(i / size.width), fillId);
		}

		return map;
	}

	drawXY(room, x, y, attrib, value)
	{
		this.level.setXY(x, y, attrib, value);
		//this.roomCells[y * this.level.size.width + x] = room;
	}

	drawRoom(room)
	{
		room.draw(this.drawXY.bind(this));
	}

	drawAll()
	{
		for(let room of this.rooms) {
			this.drawRoom(room);
		}
	}	

}