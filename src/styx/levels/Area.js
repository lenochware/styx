var Styx = Styx || {};
Styx.levels = Styx.levels || {};

/**
 * Create area with rooms - level can contain multiple areas.
 */
Styx.levels.Area = class
{
	constructor(builder, id)
	{
		this.id = id;
		this.builder = builder;
		this.game = game;
		this.rooms = [];
		//this.size = new Styx.Rectangle(0,0,0,0);
	}

	addRoom(room, exit)
	{
		if (exit) {
			exit.alignRoom(room);
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
		else if (id.startsWith('room-')) {
			var size = id.substring(5).split('x');
			room = new Styx.levels.Room(parseInt(size[0]), parseInt(size[1]));
		}
		else {
			if (!id) id = this.game.db.findKey('rooms', params.tag).sample().value();
			if (!id) throw Error('Room id not found.');
			room = new Styx.levels.FixedRoom(id);
		}

		return room;
	}

	addArea(area)
	{
		this.rooms.push(...area.rooms);
	}

	addLine(first, rooms, side)
	{
		var exit = first.getDoorBySide(side);

		for(let id of rooms) {
			var room = this.newRoom(id);
			this.addRoom(room, exit);
			exit = room.getDoorBySide(side);
		}

		return this;
	}

	addStream(first, rooms)
	{
		var exit = first.getFreeDoors()[0];

		for(let id of rooms) {
			if (!exit) break;
			var room = this.newRoom(id);
			this.addRoom(room, exit);
			exit = room.getFreeDoors()[0];
		}

		return this;		
	}

	addRandom(rooms)
	{
		var doors = Styx.Random.shuffle(this.getFreeDoors());

		for(let id of rooms) {
			var room = this.newRoom(id);
			var door = doors.pop();
			if (!door) break;
			this.addRoom(room, door);
		}

		return this;
	}

	getFreeDoors(side = null)
	{
		var list = [];
		for(let room of this.rooms) {
			if (side) {
				var door = room.getDoorBySide(side);
				if (door && !door.connected) list.push(door);
			}
			else {
				list.push(room.getFreeDoors());
			}
		}

		return _.flatten(list);
	}

	getOutsideDoor(side)
	{
		var doors = Styx.Random.shuffle(this.getFreeDoors(side));
		if (!doors) return null;
		for (let door of doors) {
			var ray = door.getRay(6);
			if (!this.collides(ray)) return door;
		}
		return null;
	}

	collides(rect)
	{
		for(let room of this.rooms)
		{
			if (rect.intersect(room)) return room;
		}

		return false;
	}

	getRooms()
	{
		return this.rooms;
	}

	//vrati pocet prekryvajicich se tiles?
	getCollisions(level) {}

	draw(level)
	{
		for(let room of this.rooms) {
			room.draw(level);
		}
	}

}