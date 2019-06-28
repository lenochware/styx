var Styx = Styx || {};
Styx.levels = Styx.levels || {};


Styx.levels.LevelBuilder = class
{
	constructor()
	{
		this.game = game;
		this.level = null;
		this.rooms = [];
		this.rnd = this.game.random;
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
		this.add(con, en);
	}

	isOccupied(newRoom)
	{
		for(let room of this.rooms)
		{
			if (newRoom.intersect(room)) return room;
		}

		return false;
	}

	fillLevel(size, fillId)
	{
		var tiles = [];

		for (var i = 0; i < size.width * size.height; i++) {
			tiles[i] = new Styx.levels.Tile(i % size.width, Math.floor(i / size.width), fillId);
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