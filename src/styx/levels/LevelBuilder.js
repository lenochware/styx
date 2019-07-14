var Styx = Styx || {};
Styx.levels = Styx.levels || {};


Styx.levels.LevelBuilder = class
{
	constructor()
	{
		this.game = game;
		this.level = null;
		this.rooms = [];
	}

	createLevel()
	{
		throw new Error('Not implemented.');
	}

	populate() 
	{
		throw new Error('Not implemented.');		
	}

	chooseNextRoom()
	{
		throw new Error('Not implemented.');
	}

	findRoom(tag)
	{
		return _.chain(this.rooms).filter(obj => obj.is(tag));
	}


	add(room, exit)
	{
		if (exit) {
			exit.connect(room);
		}

		this.rooms.push(room);
		return room;
	}

	addToRandomPlace(room)
	{
		var tests = 10;
		while (tests--) {

			room.assign(
				Styx.Random.int(this.level.size.width - room.width), 
				Styx.Random.int(this.level.size.height - room.height)
			);

			if (!this.isOccupied(room)) {
				this.add(room, null);
				return true;
			}
		}
		
		return false;
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
				var test = this.digCorridor(en);
				this.makeConnection(en, occupied);
			}
		}

		return false;
	}

	addExit(pos, exit)
	{
		this.level.set(pos, 'id', exit.tile);
		this.level.exits[pos.x + ',' + pos.y] = {id: exit.id, pos: pos};
	}

	makeConnection(en, room)
	{
		var en2 = room.getEntranceBySide(en.oppositeSide());
		if (!en2 || en2.connected) return;
		var con = new Styx.levels.Connector(en, en2);
		if (con.isValid()) this.add(con, en);
	}

	digCorridor(en, maxLen = 5)
	{
		var pos = en.getPos();
		if (en.isVertical()) {
			var cor = new Styx.levels.Corridor(3, maxLen);
		}
		else {
			var cor = new Styx.levels.Corridor(maxLen, 3);
		}

		en.alignRoom(cor);
		var rooms = this.findIntersecting(cor);
		console.log(cor, rooms);
	}

	isOccupied(newRoom)
	{
		for(let room of this.rooms)
		{
			if (newRoom.intersect(room)) return room;
		}

		return false;
	}

	findIntersecting(testRoom)
	{
		var list = [];

		for(let room of this.rooms)
		{
			if (testRoom.intersect(room)) list.push(room);
		}

		return list;
	}

	createTiles(size, tileId)
	{
		var tiles = [];

		for (var i = 0; i < size.width * size.height; i++) {
			tiles[i] = new Styx.levels.Tile(i % size.width, Math.floor(i / size.width), tileId);
		}

		return tiles;
	}

	drawXY(room, x, y, attrib, value)
	{
		throw new Error('Not implemented.');
	}

	drawAll()
	{
		for(let room of this.rooms) {
			room.draw(this.drawXY.bind(this));
		}
	}

}