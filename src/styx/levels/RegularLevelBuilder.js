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
		this.entrances = [];
		this.deadEnds = [];

		this.roomsIndex = _.keys(this.game.db.getCategory('rooms'));
	}

	build()
	{
		//game.dbgBuild = this;

		this.level.map = this.fillMap(this.level.size, 'wall');

		var first = new Styx.levels.Room('room13x5');

		this.add(first.move(16,8), null);

		while(this.entrances.length)
		{
			var en = this.entrances.pop();

			for (let i = 0; i < 3; i++) {
				var nextRoom = this.chooseNextRoom(en.room);
				var added = this.addNextRoom(en.room, nextRoom);
				if (added) break;
			}

			if (!en.connected && en.room.is('corridor')) this.deadEnds.push(en);
		};

		this.populate();

		this.drawAll();

		console.log('dead ends:' + this.deadEnds.length);

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

	chooseNextRoom(room)
	{
		var r = null;

		if (room.is('room')) {
			while(true) {
				r = new Styx.levels.Room(_.sample(this.roomsIndex));
				if (r.is('corridor')) break;
			}
		}
		else {
			r = new Styx.levels.Room(_.sample(this.roomsIndex));
		}

		if(!r.is('no-rotate') && Math.random() < 0.5) r.rotate();

		return r;
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

	pickRoom()
	{
		var room = _.chain(this.rooms).filter(r => r.getFreeEntrances().length > 0).sample().value();
		return room;
	}

	pickEntrance()
	{
		var room = this.pickRoom();
		var en = _.sample(room.getFreeEntrances());
		return en;
	}

	add(room, exit)
	{
		if (exit) {
			exit.connect(room);
		}

		this.rooms.push(room);
		this.entrances = this.entrances.concat(room.entrances);
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