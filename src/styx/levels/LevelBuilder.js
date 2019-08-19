var Styx = Styx || {};
Styx.levels = Styx.levels || {};

/**
 * Base class for any level builder.
 * Method createLevel() will create and return Level object by its definition in world/.../levels.js.
 */
Styx.levels.LevelBuilder = class
{
	constructor()
	{
		this.game = game;
		this.level = null;
		this.rooms = [];
	}

	createLevel(id)
	{
		this.level = new Styx.levels.Level(id);
		return this.level;
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

	createRoom(id, params = {})
	{
		if (id == 'corridor') {
			return new Styx.levels.Corridor(3,3);
		}

		if (params.tag) {
			id = this.game.db.findKey('rooms', params.tag).sample().value();
		}

		if (!id) {
			console.warn('Room id not found.');
			return null;
		}

		return new Styx.levels.FixedRoom(id);
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
		for(let door of room.getFreeDoors()) {

			if (!nextRoom.getDoorBySide(door.oppositeSide())) continue;

			door.alignRoom(nextRoom);

			if (!nextRoom.inside(this.level.size)) continue;
			var occupied = this.isOccupied(nextRoom);

			if (!occupied) {
				this.add(nextRoom, door);
				return true;
			}

			// else {
			// 	var r = this.findNearRoom(door);
			// 	if (r) {
			// 		if (this.makeConnection(door, r)) return false;
			// 	}
			// }
		}

		return false;
	}

	addExit(pos, exit)
	{
		this.level.set(pos, 'id', exit.tile);
		this.level.exits[pos.x + ',' + pos.y] = {id: exit.id, pos: pos};
	}

	makeConnection(door, room)
	{
		var door2 = room.getDoorBySide(door.oppositeSide());
		if (!door2 || door2.connected) return;
		var con = new Styx.levels.Connector(door, door2);

		if (con.isValid()) {
			//console.log(door.getPos(),door2.getPos(), door2);
			this.add(con, door);
			return true;
		}

		return false;
	}

	isOccupied(newRoom)
	{
		for(let room of this.rooms)
		{
			if (newRoom.intersect(room)) return room;
		}

		return false;
	}

	findNearRoom(door)
	{
		var ray = door.getRay(8);
		var rooms = this.findIntersecting(ray);
		if (rooms.length == 0) return null;

		var door2, test;

		for (let r of rooms) {
			test = r.getDoorBySide(door.oppositeSide());
			if (!test || test.connected) continue;

			if (!door2 || (test.distance(door) < door2.distance(door))) {
				door2 = test;
			}
		}

		return door2? door2.room : null;
	}

	getFreeDoors()
	{
		var list = [];
		for(let room of this.rooms) {
			list.push(room.getFreeDoors());
		}

		return _.flatten(list);
	}

	getFloorSize(rect)
	{
		var list = this.findIntersecting(rect);
		var num = 0;

		for (let room of list) {
			num += (room.width - 1) * (room.height - 1);
		}

		return num;
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


Styx.levels.Area = class
{
	constructor(id)
	{
		this.id = id;
		this.game = game;
		this.rooms = [];
		//this.size = new Styx.Rectangle(0,0,0,0);
	}

	addRoom(room, exit)
	{
		if (exit) {
			exit.connect(room);
		}

		this.rooms.push(room);
		room.params.area = this.id;
		return room;
	}

	newRoom(id, params = {})
	{
		var room = null;

		if (id == 'corridor') {
			room = new Styx.levels.Corridor(3,3);
		}
		else {
			if (!id) id = this.game.db.findKey('rooms', params.tag).sample().value();
			if (!id) throw Error('Room id not found.');
			room = new Styx.levels.FixedRoom(id);
		}

		return room;
	}

	addLine(first, rooms, side)
	{
		var exit = first.getDoorBySide(side);

		for(let id of rooms) {
			var room = this.newRoom(id);
			exit.alignRoom(room);
			this.addRoom(room, exit);
			exit = room.getDoorBySide(side);
		}

		return this;
	}

	getRooms()
	{
		return this.rooms;
	}

	//vrati pocet prekryvajicich se tiles?
	getCollisions(level) {}

	//vykresleni do levelu
	draw(level) {}

}