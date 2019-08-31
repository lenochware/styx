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
		this.onAddCallback = null;
	}

	addRoom(room, exit)
	{
		if (exit) {
			exit.alignRoom(room);
			exit.connect(room);
		}

		if (this.onAddCallback) {
			this.onAddCallback(room, exit);
		}

		this.rooms.push(room);
		if (this.builder.debugDraw) this.debugDraw(room);
		room.params.area = this.id;
		return room;
	}

	canAddRoom(room, exit)
	{
		if (exit) exit.alignRoom(room);
		return room.inside(this.builder.level.size);
	}

	onAdd(f)
	{
		this.onAddCallback = f;
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
			if (!this.canAddRoom(room, exit)) return this;
			this.addRoom(room, exit);
			exit = room.getDoorBySide(side);
		}

		return this;
	}

	addStream(first, rooms, side)
	{
		var d = first.getFreeDoors();
		var exit = (d[0].oppositeSide() == side)? d[1] : d[0];

		for(let id of rooms) {
			if (!exit) break;
			var room = this.newRoom(id);
			if (!this.canAddRoom(room, exit)) return this;			
			this.addRoom(room, exit);

			d = room.getFreeDoors();
			exit = (d[0].oppositeSide() == side)? d[1] : d[0];
		}

		return this;		
	}

	addRandom(rooms, allowCollision = true)
	{
		var doors = Styx.Random.shuffle(this.getFreeDoors());

		for(let id of rooms) {
			var room = this.newRoom(id);
			var door = doors.pop();
			
			if (!allowCollision) {
				while (door) {
					door.alignRoom(room);
					if (!this.collides(room)) break;
					door = doors.pop();
				}
			}

			if (!door) break;

			if (!this.canAddRoom(room, door)) return this;
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

	debugDraw(room)
	{
		var level = this.builder.level;
		room.draw(level);
		this.game.get('renderer').render(level, "level-map", {view: level.size});
	}

	draw()
	{
		for(let room of this.rooms) {
			room.draw(this.builder.level);
		}
	}

}