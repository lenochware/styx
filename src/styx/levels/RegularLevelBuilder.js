var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.RegularLevelBuilder = class
{
	constructor()
	{
		this.game = game;
		this.level = null;
		this.rooms = [];
		this.roomCells = [];

		this.roomBuilder = new Styx.levels.RoomBuilder();
		
		this.rnd = this.game.random;
	}

	build()
	{
		//game.dbgBuild = this;

		this.level.map = this.fillMap(this.level.size, 'wall');

		var first = new Styx.levels.Room('room13x5');
		var added = this.addToRandomPlace(first);
		if (added) this.addRoomsStream(first);

		// var first = new Styx.levels.Room('room13x5');
		// var added = this.addToRandomPlace(first);
		// if (added) this.addRoomsStream(first);

		// var first = new Styx.levels.Room('room13x5');
		// var added = this.addToRandomPlace(first);
		// if (added) this.addRoomsStream(first);

		this.populate();

		this.drawAll();

		return this.level;
	}

	addRoomsStream(room)
	{
		var maxRooms = 40;

		while(maxRooms--)
		{
			var nextRoom = this.chooseNextRoom();
			var added = this.addNextRoom(room, nextRoom);
			if (added) { 

				if (this.rnd.bet(.2)) {
					var sideRoom = this.roomBuilder.make(null, {tag: 'room'});
					this.addNextRoom(room, sideRoom);
				}

				room = nextRoom;
			}
		};
	}

	addToRandomPlace(room)
	{
		var tests = 10;
		while (tests--) {

			room.assign(
				this.rnd.int(this.level.size.width - room.width), 
				this.rnd.int(this.level.size.height - room.height)
			);

			if (!this.isOccupied(room)) {
				this.add(room, null);
				return true;
			}
		}
		
		return false;
	}

	populate()
	{

	}

	addNextRoom(room, nextRoom)
	{
		for(let en of room.getFreeEntrances()) {

			if (!nextRoom.getEntranceBySide(en.oppositeSide())) continue;

			en.alignRoom(nextRoom);

			if (!nextRoom.inside(this.level.size)) continue;
			var occupied = this.isOccupied(nextRoom);

			if (!occupied) {
				this.add(nextRoom, en);
				return true;
			}
			else {
				this.makeConnection(en, occupied);
			}
		}

		return false;
	}

	makeConnection(en, room)
	{
		var en2 = room.getEntranceBySide(en.oppositeSide());
		if (!en2 || en2.connected) return;
		var con = new Styx.levels.Connector(en, en2);
		this.add(con, en);
	}

	chooseNextRoom()
	{
		if (this.rnd.bet(.5)) {
			return this.roomBuilder.make('corridor');
		}
		else {
			return this.roomBuilder.make(null, {tag: 'room'});
		}
	}

	isOccupied(newRoom)
	{
		for(let room of this.rooms)
		{
			if (newRoom.intersect(room)) return room;
		}

		return false;
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

	drawXY(room, x, y, attrib, value)
	{
		this.level.setXY(x, y, attrib, value);
		this.roomCells[y * this.level.size.width + x] = room;
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