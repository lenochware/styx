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

		this.roomsIndex = _.keys(this.game.db.getCategory('rooms'));
	}

	build()
	{
		this.level.map = this.fillMap(this.level.size, 'wall');

		var first = new Styx.levels.Room('room13x5');

		this.add(first.move(16,8));

		var attempts = 5;

		while (attempts)
		{
			var room = this.pickRoom();
			if (!room) {
				console.log('not free room.');
				break;
			}

			//console.log('pick', room);

			var nextRoom = this.chooseNextRoom(room);

			var added = this.addNextRoom(room, nextRoom);

			if (added) {
				//console.log('add', nextRoom);
				attempts = 5;
			}
			else attempts--;
		}

		this.populate();

		return this.level;
	}

	populate()
	{

	}

	addNextRoom(room, nextRoom)
	{
		for(let en of room.freeEntrances()) {

			if (!nextRoom.entrances[en.oppositeSide()]) continue;

			en.alignRoom(nextRoom);

			if (this.hasFreeSpace(nextRoom)) {
				this.add(nextRoom, en);
				return true;
			}
			else {
				delete room.entrances[en.id];
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

		if(Math.random() < 0.5) r.rotate();

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
		var room = _.chain(this.rooms).filter(r => r.freeEntrances().length > 0).sample().value();
		return room;
	}

	pickEntrance()
	{
		var room = this.pickRoom();
		var en = _.sample(room.freeEntrances());
		return en;
	}

	add(room, exit = null)
	{
		if (exit) {
			exit.connect(room);
		}

		this.rooms.push(room);
		this.drawRoom(room);
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
		this.clear();
		for(let room of this.rooms) {
			this.drawRoom(room);
		}
	}	

}