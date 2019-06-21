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
		this.rnd = this.game.random;

		this.roomBuilder = new Styx.levels.RoomBuilder();
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

			if (this.hasFreeSpace(room)) {
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

			if (this.hasFreeSpace(nextRoom)) {
				this.add(nextRoom, en);
				return true;
			}
		}

		return false;
	}

	chooseNextRoom()
	{
		if (this.rnd.bet(.5)) {
			return this.roomBuilder.make('corridor');
		}
		else {
			return  this.roomBuilder.make(null, {tag: 'room'});
		}
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