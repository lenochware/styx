var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.RegularLevelBuilder = class
{
	constructor(params)
	{
		this.game = game;
		this.params = params;
		this.level = new Styx.levels.Level;
		this.level.size = this.params.size;
		this.rooms = [];

		this.roomBuilder = new Styx.levels.RoomBuilder();
	}

	build()
	{
		//game.dbgBuild = this;

		this.level.map = this.fillMap(this.level.size, 'wall');

		var first = new Styx.levels.Room('room13x5');

		var c = this.level.size.getPoint('center');
		var room = this.add(first.center(c.x, c.y), null);

		var maxRooms = 40;

		while(maxRooms--)
		{
			var nextRoom = this.chooseNextRoom();
			var added = this.addNextRoom(room, nextRoom);
			if (added) room = nextRoom;
		};

		this.populate();

		this.drawAll();

		return this.level;
	}

	populate()
	{

	}

	addNextRoom(room, nextRoom)
	{
		for(let en of room.getFreeEntrances()) {

			if (!nextRoom.getEntranceBySide(en.oppositeSide())) continue;

			en.alignRoom(nextRoom);

			if (this.hasFreeSpace(nextRoom)) {
				this.add(nextRoom, en);
				return true;
			}
		}

		return false;
	}

	chooseNextRoom()
	{
		var rnd = this.game.random;
		var id = rnd.bet(.5)? 'corridor' : this.roomBuilder.find('room').sample().value();
		return this.roomBuilder.make(id);
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

	add(room, exit)
	{
		if (exit) {
			exit.connect(room);
		}

		this.rooms.push(room);
		return room;
	}

	fillMap(size, fillId)
	{
		var map = [];

		for (var i = 0; i < size.width * size.height; i++) {
			map[i] = new Styx.levels.Tile(i % size.width, Math.floor(i / size.width), fillId);
		}

		return map;
	}

	drawRoom(room)
	{
		room.draw(this.level);
	}

	drawAll()
	{
		for(let room of this.rooms) {
			this.drawRoom(room);
		}
	}	

}